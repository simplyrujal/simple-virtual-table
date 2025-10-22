import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useMemo, useState } from 'react';
// import useSimpleInfiniteQuery from '../hooks/use-simple-infinite-query';

interface IProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  ref: React.RefObject<HTMLDivElement | null>;
}

const totalDBRowCount = 1000;
const totalFetched = 0;

const DataTable = <T,>({ data, columns, ref }: IProps<T>) => {
  const [columnSizing, setColumnSizing] = useState({});

  const { fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: [],
    queryFn: () => {
      return fetch('https://api.example.com/data').then((res) => res.json());
    },
    getNextPageParam: (lastPage, pages) => {
      return undefined;
    },
    initialPageParam: 0,
    placeholderData: keepPreviousData,
  });

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    onColumnSizingChange: setColumnSizing,
    state: {
      //   globalFilter: filtering,
      columnSizing,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // onGlobalFilterChange: setFiltering,
    enableColumnResizing: true,
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowCount() || 1,
    estimateSize: () => 40, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => ref?.current ?? null,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  // const { rows } = table.getRowModel();

  const visibleColumns = table.getVisibleLeafColumns();

  //we are using a slightly different virtualization strategy for columns (compared to virtual rows) in order to support dynamic row heights
  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(), //estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => ref?.current ?? null,
    horizontal: true,
    overscan: 3, //how many columns to render on each side off screen each way (adjust this for performance)
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();

  //different virtualization strategy for columns - instead of absolute and translateY, we add empty columns to the left and right
  //   { virtualPaddingLeft, virtualPaddingRight }
  const { virtualPaddingLeft, virtualPaddingRight } = useMemo(() => {
    let paddingLeft: number | undefined;
    let paddingRight: number | undefined;

    if (columnVirtualizer && virtualColumns?.length) {
      paddingLeft = virtualColumns[0]?.start ?? 0;
      paddingRight =
        columnVirtualizer.getTotalSize() -
        (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
    }

    return {
      virtualPaddingLeft: paddingLeft,
      virtualPaddingRight: paddingRight,
    };
  }, [columnVirtualizer, virtualColumns]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const containerRefElement = e.currentTarget;
      if (containerRefElement && data) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },

    [fetchNextPage]
  );
  return (
    <div ref={ref} className="tableContainer" onScroll={handleScroll}>
      <table className="table">
        <thead className="thead">
          {table.getHeaderGroups().map((headergroup) => (
            <tr key={headergroup.id} className="headerRow">
              {virtualPaddingLeft ? (
                //fake empty column to the left for virtualization scroll padding
                <th
                  className="paddingColumn"
                  style={{ width: virtualPaddingLeft }}
                />
              ) : null}

              {virtualColumns.map((virtualColumn) => {
                const header = headergroup.headers[virtualColumn.index];
                return (
                  <th
                    key={header.id}
                    className="headerCell"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className="resizeHandle"
                    />
                  </th>
                );
              })}

              {virtualPaddingRight ? (
                //fake empty column to the right for virtualization scroll padding
                <th
                  className="paddingColumn"
                  style={{ width: virtualPaddingRight }}
                />
              ) : null}
            </tr>
          ))}
        </thead>
        <tbody
          className="tbody"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = table.getRowModel().rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                className="virtualRow"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {virtualPaddingLeft ? (
                  <td
                    className="paddingColumn"
                    style={{ width: virtualPaddingLeft }}
                  />
                ) : null}

                {virtualColumns.map((virtualColumn) => {
                  const cell = row.getVisibleCells()[virtualColumn.index];
                  return (
                    <td
                      key={cell.id}
                      className="cell"
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}

                {virtualPaddingRight ? (
                  <td
                    className="paddingColumn"
                    style={{ width: virtualPaddingRight }}
                  />
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
