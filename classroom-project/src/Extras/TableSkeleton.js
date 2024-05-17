function TableSkeleton({ columns, rows }) {
  return (
    <tbody>
      {Array.from({ length: rows || 4 }).map((_, index) => (
        <tr key={index}>
          {Array.from({ length: columns || 4 }).map((_, cellIndex) => (
            <td key={cellIndex} className="">
              <div className="table-skeleton"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
export default TableSkeleton;
