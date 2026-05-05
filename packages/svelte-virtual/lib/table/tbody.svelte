<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { tableContextKey, tbodyContextKey } from "./context";

  let { children, offsetHeight = 45, ...props } = $props();

  const tableContext = getContext(tableContextKey) as any;
  if (!tableContext) throw new Error("<Tbody> must be used inside <Table>");

  const totalHeight = $derived(tableContext.totalData * offsetHeight);

  // Spanning map to track occupied cells: row index -> Set of occupied column indices
  let spanningMap: Record<number, Set<number>> = {};

  let rowCounter = 0;

  setContext(tbodyContextKey, {
    get contentWidth() {
      return tableContext.contentWidth;
    },
    get rowHeight() {
      return tableContext.rowHeight;
    },
    get columnWidths() {
      return tableContext.columnWidths;
    },
    get columnCount() {
      return tableContext.columnCount;
    },
    get startIndex() {
      return tableContext.startIndex;
    },
    registerSpan(row: number, col: number, rowSpan: number, colSpan: number) {
      if (rowSpan <= 1 && colSpan <= 1) return;
      
      for (let r = row; r < row + rowSpan; r++) {
        if (!spanningMap[r]) spanningMap[r] = new Set();
        for (let c = col; c < col + colSpan; c++) {
          // Don't mark the origin cell as occupied for itself
          if (r === row && c === col) continue;
          spanningMap[r].add(c);
        }
      }
    },
    isOccupied(row: number, col: number) {
      return spanningMap[row]?.has(col) || false;
    },
    getNextRowIndex() {
      return rowCounter++;
    }
  });
</script>

<div
  style="position: relative; height: {totalHeight}px; width: {tableContext.contentWidth}px; box-sizing: border-box;"
  {...props}
>
  <div style="height: {tableContext.startIndex * tableContext.rowHeight}px;"></div>

  <!-- Reset counters at the start of every render -->
  <!-- svelte-ignore state_referenced_locally -->
  { (rowCounter = 0, spanningMap = {}, "") }
  {@render children(tableContext.startIndex, tableContext.endIndex)}

  <div style="height: {(tableContext.totalData - tableContext.endIndex) * tableContext.rowHeight}px;"></div>
</div>
