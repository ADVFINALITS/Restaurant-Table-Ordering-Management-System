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
end