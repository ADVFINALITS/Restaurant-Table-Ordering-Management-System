class MenuCategory < ApplicationRecord
  has_many :menu_items, -> { order(:position, :id) }, dependent: :destroy

  validates :slug, presence: true, uniqueness: true,
                    format: { with: /\A[a-z0-9]+(-[a-z0-9]+)*\z/, message: "must be lowercase letters, numbers and hyphens only" }
  validates :name, presence: true

  scope :ordered, -> { order(:position, :id) }

  # Shape consumed directly by the frontend's GET /api/menu:
  # { id, name, items: [MenuItem#as_menu_json, ...] }
  #
  # Uses Array#select (not .where) so this works against an
  # already-preloaded `menu_items` association without re-querying -
  # see Api::MenuController#index, which calls .includes(:menu_items).
  def as_menu_json
    {
      id: slug,
      name: name,
      items: menu_items.select(&:available).map(&:as_menu_json),
    }
  end
end
