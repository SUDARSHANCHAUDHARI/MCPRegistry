import { useState } from 'react'

interface AdvancedSearchFilterProps {
  onSearch: (filters: SearchFilters) => void
  tags?: Array<{ id: string; name: string; icon?: string }>
}

export interface SearchFilters {
  searchText: string
  category: string | null
  minStars: number | null
  minRating: number | null
  selectedTags: string[]
  maintenanceStatus: string | null
  sortBy: 'relevance' | 'stars' | 'rating' | 'newest'
}

export function AdvancedSearchFilter({ onSearch, tags = [] }: AdvancedSearchFilterProps) {
  const [expanded, setExpanded] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    searchText: '',
    category: null,
    minStars: null,
    minRating: null,
    selectedTags: [],
    maintenanceStatus: null,
    sortBy: 'relevance',
  })

  const categories = ['AI', 'DevOps', 'Database', 'Security', 'ML', 'Web', 'CLI', 'Testing', 'Monitoring', 'API']

  const handleFilterChange = (filter: Partial<SearchFilters>) => {
    const updated = { ...filters, ...filter }
    setFilters(updated)
    onSearch(updated)
  }

  const toggleTag = (tagId: string) => {
    const newTags = filters.selectedTags.includes(tagId)
      ? filters.selectedTags.filter((t) => t !== tagId)
      : [...filters.selectedTags, tagId]
    handleFilterChange({ selectedTags: newTags })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {expanded && (
        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange({ category: filters.category === cat ? null : cat })}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    filters.category === cat
                      ? 'bg-blue-600 dark:bg-blue-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Min Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Stars: {filters.minStars || 'Any'}
            </label>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={filters.minStars || 0}
              onChange={(e) => handleFilterChange({ minStars: parseInt(e.target.value) || null })}
              className="w-full"
            />
          </div>

          {/* Min Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Rating: {filters.minRating || 'Any'}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating || 0}
              onChange={(e) => handleFilterChange({ minRating: parseFloat(e.target.value) || null })}
              className="w-full"
            />
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filters.selectedTags.includes(tag.id)
                        ? 'bg-green-600 dark:bg-green-700 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag.icon} {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maintenance Status
            </label>
            <select
              value={filters.maintenanceStatus || ''}
              onChange={(e) => handleFilterChange({ maintenanceStatus: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">Any Status</option>
              <option value="active">Active</option>
              <option value="maintaining">Maintaining</option>
              <option value="stale">Stale</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as SearchFilters['sortBy'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="relevance">Relevance</option>
              <option value="stars">GitHub Stars</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
