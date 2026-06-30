require "bigdecimal"

class Order < ApplicationRecord
  # Keep these in sync with restaurant-frontend/lib/orderStatus.js -
  # the frontend and backend must always agree on these exact strings.
  STATUSES = %w[placed preparing ready served billed paid cancelled].freeze

  # What a normal ticket moves through, in order. "served" is special:
  # the moment it's reached, #advance_to! immediately computes the bill
  # and moves the order straight on to "billed" in the same request -
  # see restaurant-frontend/README.md, "Order lifecycle".
  FORWARD_STATUSES = %w[placed preparing ready served billed paid].freeze

  ACTIVE_STATUSES = STATUSES - %w[paid cancelled]

  SERVICE_CHARGE_RATE = BigDecimal("0.10")
  TAX_RATE = BigDecimal("0.15")

  has_many :order_items, -> { order(:id) }, dependent: :destroy, inverse_of: :order

  validates :table_number, presence: true
  validates :status, inclusion: { in: STATUSES }

  before_validation -> { self.status ||= "placed" }, on: :create

  after_create :stamp_placed_at
  after_create :notify_chef

  scope :kitchen_queue, -> { where(status: %w[placed preparing]).order(:created_at) }
  scope :waiter_queue, -> { where(status: %w[ready served]).order(:created_at) }

  # The frontend's GET /api/orders/:id calls this with whatever string
  # it was given back from #create (e.g. "ord_42"). Anything that
  # doesn't parse cleanly just won't be found, which is fine - the
  # controller turns "not found" into a 404 either way.
  def self.find_by_public_id(public_id)
    id = public_id.to_s.sub(/\Aord_/, "")
    find_by(id: id)
  end

  def self.active_for_table(table_number)
    where(table_number: table_number.to_s, status: ACTIVE_STATUSES)
      .order(created_at: :desc)
      .first
  end

  def public_id
    "ord_#{id}"
  end

  # Moves the ticket forward by one step. Only ever called with the
  # status the frontend just asked for (PATCH /api/orders/:id/status),
  # so this intentionally does not support skipping steps or moving
  # backwards - see lib/orderStatus.js's ORDER_STATUS_SEQUENCE.
  def advance_to!(new_status)
    new_status = new_status.to_s

    unless STATUSES.include?(new_status)
      raise ArgumentError, "unknown status #{new_status.inspect}"
    end

    if new_status == "served"
      transaction do
        touch_status!("served")
        bill = compute_bill
        update!(
          status: "billed",
          billed_at: Time.current,
          subtotal: bill[:subtotal],
          service_charge_rate: bill[:service_charge_rate],
          service_charge: bill[:service_charge],
          tax_rate: bill[:tax_rate],
          tax: bill[:tax],
          total: bill[:total]
        )
      end
    else
      touch_status!(new_status)
    end

    notify_waiter_and_customer if new_status == "ready"

    self
  end

  def mark_paid!(payment_method)
    update!(status: "paid", payment_method: payment_method, paid_at: Time.current)
    self
  end

  # { subtotal, service_charge_rate, service_charge, tax_rate, tax,
  #   total, currency } - all numbers, see README.md "Data shapes".
  def compute_bill
    subtotal = order_items.to_a.sum { |item| item.price * item.quantity }
    service_charge = (subtotal * SERVICE_CHARGE_RATE).round
    tax = ((subtotal + service_charge) * TAX_RATE).round
    total = subtotal + service_charge + tax

    {
      subtotal: subtotal,
      service_charge_rate: SERVICE_CHARGE_RATE,
      service_charge: service_charge,
      tax_rate: TAX_RATE,
      tax: tax,
      total: total,
    }
  end

  def bill_json
    return nil unless billed_at.present?

    {
      subtotal: subtotal.to_f,
      service_charge_rate: service_charge_rate.to_f,
      service_charge: service_charge.to_f,
      tax_rate: tax_rate.to_f,
      tax: tax.to_f,
      total: total.to_f,
      currency: currency,
    }
  end

  # Full Order JSON exactly as documented in
  # restaurant-frontend/README.md, "Data shapes" -> Order.
  def as_order_json
    {
      id: public_id,
      table_number: table_number,
      status: status,
      items: order_items.map(&:as_order_json),
      note: note,
      timestamps: {
        placed: placed_at&.iso8601,
        preparing: preparing_at&.iso8601,
        ready: ready_at&.iso8601,
        served: served_at&.iso8601,
        billed: billed_at&.iso8601,
        paid: paid_at&.iso8601,
      },
      bill: bill_json,
      payment_method: payment_method,
    }
  end

  private

  def touch_status!(status)
    column = "#{status}_at"
    attrs = { status: status }
    attrs[column] = Time.current if has_attribute?(column)
    update!(attrs)
  end

  def stamp_placed_at
    update_column(:placed_at, created_at) # rubocop:disable Rails/SkipsModelValidations
  end

  def notify_chef
    NotificationService.notify_chef(self)
  end

  def notify_waiter_and_customer
    NotificationService.notify_waiter(self)
    NotificationService.notify_customer(self)
  end
end
