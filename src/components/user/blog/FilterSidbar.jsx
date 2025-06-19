
import { Filter, X } from "lucide-react";

const FilterSidebar = ({
  tags = [],
  selectedTags = [], // Thêm giá trị mặc định
  onTagToggle,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-full md:h-auto w-80 md:w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Bộ lọc
            </h3>
            <button onClick={onClose} className="md:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tags Section */}
          <div className="mb-6">
            <h4 className="font-medium text-black mb-3">Tags</h4>
            <div className="space-y-2">
              {Array.isArray(tags) &&
                tags.map((tag) => (
                  <label
                    key={tag._id || tag.id} 
                    className="flex items-center hover:text-purple-600 cursor-pointer text-gray-900"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag._id || tag.id)}
                      onChange={() => onTagToggle(tag._id || tag.id)}
                      className="mr-2"
                    />
                    <span>{tag.title}</span>
                  </label>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;