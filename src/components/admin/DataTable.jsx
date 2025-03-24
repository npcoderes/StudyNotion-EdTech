import { FaSort, FaStar } from 'react-icons/fa'

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
      <table className="min-w-full bg-[#1A1A1A] rounded-lg">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-6 py-3 text-left text-base font-medium text-[#FFFFFF] uppercase tracking-wider"
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
        <tbody className="bg-[#F9F9F9] dark:bg-[#2C2C2C] divide-y divide-[#E5E5E5] dark:divide-[#3A3A3A] text-[#1A1A1A] dark:text-[#FFFFFF]">
          {sortedData.map((row, i) => (
            <tr key={i}>
              {columns.map((column, j) => (
                <td
                  key={j}
                  className="px-6 py-4 whitespace-nowrap text-[#1A1A1A] dark:text-[#FFFFFF]"
                >
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