import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useState } from 'react';
// import useSimpleInfiniteQuery from '../hooks/use-simple-infinite-query';

interface IProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  ref: React.RefObject<HTMLDivElement> | null;
  fetchMoreOnBottomReached: (target: HTMLDivElement) => void;
}

const DataTable = <T,>({
  data,
  columns,
  ref,
}: // fetchMoreOnBottomReached,
IProps<T>) => {
  const [columnSizing, setColumnSizing] = useState({});

  // const query = useSimpleInfiniteQuery();
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

  // const handleScroll = useCallback(
  //   (e: React.UIEvent<HTMLDivElement>) => {
  //     fetchMoreOnBottomReached(e.currentTarget);
  //   },
  //   [fetchMoreOnBottomReached]
  // );
  return (
    <div
      ref={ref}
      style={{
        height: `500px`,
        width: `100%`,
        overflow: 'auto',
      }}
    >
      <table>
        <thead>
          {table.getHeaderGroups().map((headergroup) => (
            <tr key={headergroup.id}>
              {virtualPaddingLeft ? (
                //fake empty column to the left for virtualization scroll padding
                <th style={{ display: 'flex', width: virtualPaddingLeft }} />
              ) : null}

              {virtualColumns.map((virtualColumn) => {
                const header = headergroup.headers[virtualColumn.index];
                return (
                  <th
                    key={header.id}
                    style={{
                      display: 'flex',
                      flex: '1',
                      minWidth: header.getSize(),
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      style={{
                        cursor: 'col-resize',
                        userSelect: 'none',
                        zIndex: 1,
                        position: 'absolute',
                        opacity: 0,
                        right: '-1px',
                        top: '6%',
                        height: '100%',
                        width: '12px',
                        background: 'grey',
                      }}
                    />
                  </th>
                );
              })}

              {virtualPaddingRight ? (
                //fake empty column to the right for virtualization scroll padding
                <th style={{ display: 'flex', width: virtualPaddingRight }} />
              ) : null}
            </tr>
          ))}
        </thead>
        <tbody
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            display: 'grid',
            position: 'relative',
          }}
        ></tbody>
      </table>
    </div>
  );
};

export default DataTable;
