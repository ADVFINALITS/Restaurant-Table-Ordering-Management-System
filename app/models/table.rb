class Table < ApplicationRecord
  validates :table_number,
            presence: true,
            uniqueness: true

  validates :capacity,
            presence: true,
            numericality: { greater_than: 0 }

  validates :status,
            presence: true,
            inclusion: {
              in: %w[available occupied reserved maintenance]
            }

  def generate_qr_code
    url = "http://localhost:3000/tables/#{id}/menu"
    qr = RQRCode::QRCode.new(url)
    svg = qr.as_svg(
      color: "000",
      shape_rendering: "crispEdges",
      module_size: 6,
      standalone: true,
      use_path: true
    )
    update(qr_url: url, qr_svg: svg)
  end
end