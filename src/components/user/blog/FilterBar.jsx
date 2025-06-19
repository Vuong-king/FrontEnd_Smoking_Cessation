
import { Search, Filter, X, Plus, FileText } from "lucide-react"
import { useState } from "react"
import ColourfulText from "../../ui/ColourfulText"

const FilterBar = ({ onNavigate, onFilterChange, onToggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (value) => {
    setSearchTerm(value)
    if (onFilterChange) {
      onFilterChange({ searchTerm: value })
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    if (onFilterChange) {
      onFilterChange({ searchTerm: "" })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4"><ColourfulText text="Blog"/></h2>

        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("create")}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Viết bài
          </button>
          <button
            onClick={() => onNavigate("myPosts")}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            Bài của tôi
          </button>
        </div>
      </div>

      {/* Search Bar and Filter Toggle */}
      <div className="flex gap-4 items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors md:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          Bộ lọc
        </button>
      </div>

      {/* Active Search Display */}
      {searchTerm && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Đang tìm kiếm:</span>
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
              "{searchTerm}"
              <button onClick={clearSearch} className="ml-2 text-green-500 hover:text-green-700">
                <X className="h-3 w-3" />
              </button>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterBar