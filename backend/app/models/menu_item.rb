class MenuItem < ApplicationRecord
  belongs_to :menu_category
  has_many :order_items, dependent: :nullify

  validates :slug, presence: true, uniqueness: true,
                    format: { with: /\A[a-z0-9]+(-[a-z0-9]+)*\z/, message: "must be lowercase letters, numbers and hyphens only" }
  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :ordered, -> { order(:position, :id) }

  # { id, name, description, price, veg, spicy, available } - see
  # restaurant-frontend/README.md "Data shapes" -> MenuItem.
  def as_menu_json
    {
      id: slug,
      name: name,
      description: description,
      price: price.to_f,
      veg: veg,
      spicy: spicy,
      available: available,
    }
  end

  # Fuller shape for the admin menu-management screen, which also
  # needs to know which category an item belongs to and its raw
  # database id (slugs are immutable once created; the numeric id is
  # what the admin UI uses to PATCH/DELETE a specific row).
  def as_admin_json
    as_menu_json.merge(
      db_id: id,
      category_id: menu_category.slug
    )
  end
end
