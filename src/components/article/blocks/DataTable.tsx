// src/components/article/blocks/DataTable.tsx
// Tableau de données stylé
import React from 'react';
import { TableBlock, TableRow } from '../../../types/sanity';

interface DataTableProps {
  value: TableBlock;
}

const DataTable: React.FC<DataTableProps> = ({ value }) => {
  const { title, headers, rows, caption, striped = true, compact = false } = value;

  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3';

  return (
    <div className="my-8 rounded-xl border border-white/10 bg-gray-900/50 overflow-hidden">
      {/* Title */}
      {title && (
        <div className="px-5 py-4 border-b border-white/10 bg-black/30">
          <h3 className="font-bold text-white">{title}</h3>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Headers */}
          {headers && headers.length > 0 && (
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={`${cellPadding} text-left text-sm font-semibold text-gray-300 uppercase tracking-wider`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Body */}
          <tbody>
            {rows?.map((row, rowIndex) => (
              <tr
                key={row._key || rowIndex}
                className={`
                  border-b border-white/5 last:border-b-0
                  ${striped && rowIndex % 2 === 1 ? 'bg-black/20' : ''}
                  hover:bg-white/5 transition-colors
                `}
              >
                {row.cells?.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`${cellPadding} text-gray-300`}
                  >
                    {/* Première cellule avec style différent si c'est un label */}
                    {cellIndex === 0 ? (
                      <span className="font-medium text-white">{cell}</span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-5 py-3 border-t border-white/10 bg-black/20">
          <p className="text-xs text-gray-500">{caption}</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;
