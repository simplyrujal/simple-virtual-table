import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

export interface TableState {
  totalData: number;
  rowHeight: number;
  height: number;
  scrollTop: number;
  contentWidth: number;
  columnWidths: number[];
  overscan: number;
  startIndex: number;
  endIndex: number;
  columnCount: number;
}

export interface TableStore {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => TableState;
  setState: (
    patch: Partial<TableState> | ((state: TableState) => Partial<TableState>)
  ) => void;
  setColumnWidths: (widths: number[]) => void;
}

const TableContext = createContext<TableStore | null>(null);

export const useTableStore = <T,>(selector: (state: TableState) => T): T => {
  const store = useContext(TableContext);
  if (!store) {
    throw new Error("Table components must be used within a Table provider");
  }
  return useSyncExternalStore(store.subscribe, () => selector(store.getSnapshot()));
};

export const useTableActions = (): Pick<TableStore, "setColumnWidths"> => {
  const store = useContext(TableContext);
  if (!store) {
    throw new Error("Table components must be used within a Table provider");
  }
  return { setColumnWidths: store.setColumnWidths };
};

// Deprecated: Use useTableStore for better performance
export const useTableContext = (): TableState & {
  setColumnWidths: (widths: number[]) => void;
} => {
  const store = useContext(TableContext);
  if (!store) {
    throw new Error("Table components must be used within a Table provider");
  }
  return { ...store.getSnapshot(), setColumnWidths: store.setColumnWidths };
};

export interface TableProps {
  totalData: number;
  rowHeight?: number;
  height?: number;
  containerStyle?: Omit<
    React.CSSProperties,
    "width" | "height" | "position" | "overflow"
  >;
  overscan?: number;
  children: ReactNode;
  containerClassName?: string;
}

const Table = ({
  totalData,
  rowHeight = 40,
  children,
  height = 200,
  overscan = 5,
  containerStyle,
  containerClassName,
}: TableProps) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Initialize store in a ref to keep it stable
  const storeRef = useRef<TableStore | null>(null);

  if (!storeRef.current) {
    let state: TableState = {
      totalData,
      rowHeight,
      height,
      overscan,
      scrollTop: 0,
      contentWidth: 0,
      columnWidths: [],
      startIndex: 0,
      endIndex: 0,
      columnCount: 0,
    };

    const listeners = new Set<() => void>();

    const calculateIndices = (s: TableState) => {
      const visibleStart = Math.floor(s.scrollTop / s.rowHeight);
      const visibleEnd = Math.ceil((s.scrollTop + s.height) / s.rowHeight);
      const startIndex = Math.max(0, visibleStart - s.overscan);
      const endIndex = Math.min(s.totalData, visibleEnd + s.overscan);
      return { startIndex, endIndex };
    };

    const { startIndex, endIndex } = calculateIndices(state);
    state = { ...state, startIndex, endIndex };

    storeRef.current = {
      subscribe: (l) => {
        listeners.add(l);
        return () => listeners.delete(l);
      },
      getSnapshot: () => state,
      setState: (patch) => {
        const nextPartial = typeof patch === "function" ? patch(state) : patch;
        const nextState = { ...state, ...nextPartial };

        // Recalculate derived values if necessary
        if (
          nextPartial.scrollTop !== undefined ||
          nextPartial.height !== undefined ||
          nextPartial.rowHeight !== undefined ||
          nextPartial.totalData !== undefined ||
          nextPartial.overscan !== undefined
        ) {
          const { startIndex, endIndex } = calculateIndices(nextState);
          nextState.startIndex = startIndex;
          nextState.endIndex = endIndex;
        }

        if (nextPartial.columnWidths !== undefined) {
          nextState.contentWidth = nextState.columnWidths.reduce(
            (sum, w) => sum + w,
            0
          );
          nextState.columnCount = nextState.columnWidths.length;
        }

        if (JSON.stringify(state) !== JSON.stringify(nextState)) {
          state = nextState;
          listeners.forEach((l) => l());
        }
      },
      setColumnWidths: (widths) => {
        storeRef.current?.setState({ columnWidths: widths });
      },
    };
  }

  const store = storeRef.current!;

  // Keep props in sync with store
  useEffect(() => {
    store.setState({ totalData, rowHeight, height, overscan });
  }, [totalData, rowHeight, height, overscan, store]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      store.setState({ scrollTop: e.currentTarget.scrollTop });
    },
    [store]
  );

  const contentWidth = useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().contentWidth
  );

  // Update container width based on content width comparison
  useEffect(() => {
    const updateWidth = () => {
      if (scrollElementRef.current && contentWidth > 0) {
        const container = scrollElementRef.current;
        container.style.width = "100%";
        requestAnimationFrame(() => {
          if (scrollElementRef.current) {
            const containerWidth = scrollElementRef.current.clientWidth;
            if (contentWidth > containerWidth) {
              scrollElementRef.current.style.width = "100%";
            } else {
              scrollElementRef.current.style.width = "fit-content";
            }
          }
        });
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [contentWidth]);

  return (
    <TableContext.Provider value={store}>
      <div
        style={{
          height,
          width: "100%",
          overflow: "auto",
          position: "relative",
          ...containerStyle,
          border: "1px solid",
          borderRadius: "4px",
        }}
        {...(containerClassName && { className: containerClassName })}
        ref={scrollElementRef}
        onScroll={handleScroll}
      >
        {children}
      </div>
    </TableContext.Provider>
  );
};

export default Table;
