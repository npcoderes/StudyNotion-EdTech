import { FaSort,FaStar } from 'react-icons/fa'

const DataTable = ({ data, columns, sortField, sortOrder, onSort }) => {
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }
    const sortedData = [...data].sort((a, b) => {
      const aVal = getNestedValue(a, sortField)
      const bVal = getNestedValue(b, sortField)
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    })
  

  
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-richblack-800 rounded-lg">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.accessor}
                  className="px-6 py-3 text-left text-xs font-medium text-richblack-50 uppercase tracking-wider"
                  onClick={() => column.accessor && onSort(column.accessor)}
                >
                  {column.header}
                  {column.accessor === sortField && (
                    <FaSort className="inline ml-1" />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-richblack-700 divide-y divide-richblack-600 text-richblack-50">
            {sortedData.map((row, i) => (
              <tr key={i}>
                {columns.map((column, j) => (
                  <td key={j} className="px-6 py-4 whitespace-nowrap text-white">
                    {column.cell ? column.cell(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

export default DataTable