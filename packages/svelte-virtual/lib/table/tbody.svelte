<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { tableContextKey, tbodyContextKey } from "./context";

  let { children, offsetHeight = 45, ...props } = $props();

  const tableContext = getContext(tableContextKey) as any;
  if (!tableContext) throw new Error("<Tbody> must be used inside <Table>");

  // Access startIndex, endIndex, and totalData reactively from context (not destructured)
  const totalHeight = $derived(tableContext.totalData * offsetHeight);

  // Track current row index for children
  // We need to track the index in the user's data array, not the virtualized index
  // Since the user iterates with {#each data as row}, each Tr represents a row
  // We'll use a counter that increments for each Tr that gets rendered
  let rowCounter = $state(0);

  // Provide TbodyContext (similar to TbodyContext.Provider in React)
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
    // Function to get and increment row index
    // This returns the index in the user's data array (0, 1, 2, ...)
    getNextRowIndex() {
      const index = rowCounter;
      rowCounter++;
      return index;
    },
  });
</script>

<div
  style="position: relative; height: {totalHeight}px; width: {tableContext.contentWidth}px; box-sizing: border-box;"
  {...props}
>
  <!-- Spacer for rows before visible range -->
  <div
    style="height: {tableContext.startIndex * tableContext.rowHeight}px;"
  ></div>

  <!-- Render visible rows -->
  {@render children(tableContext.startIndex, tableContext.endIndex)}

  <!-- Spacer for rows after visible range -->
  <div
    style="height: {(tableContext.totalData - tableContext.endIndex) *
      tableContext.rowHeight}px;"
  ></div>
</div>
