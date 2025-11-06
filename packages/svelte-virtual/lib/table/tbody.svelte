<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { tableContextKey, tbodyContextKey } from "./context";

  let { children, offsetHeight = 45, ...props } = $props();

  const tableContext = getContext(tableContextKey);
  if (!tableContext) throw new Error("<Tbody> must be used inside <Table>");

  const {
    rowHeight,
    totalData,
    startIndex,
    endIndex,
    contentWidth,
    columnWidths,
    columnCount,
  } = tableContext as any;

  const totalHeight = totalData * offsetHeight;

  // Track current row index for children
  // We need to track the index in the user's data array, not the virtualized index
  // Since the user iterates with {#each data as row}, each Tr represents a row
  // We'll use a counter that increments for each Tr that gets rendered
  let rowCounter = $state(0);

  // Reset counter at the start of each render cycle
  // Using a derived value that resets the counter when dependencies change
  $effect(() => {
    // Reset when startIndex or endIndex changes (which happens on scroll)
    startIndex;
    endIndex;
    rowCounter = 0;
  });

  // Provide TbodyContext (similar to TbodyContext.Provider in React)
  setContext(tbodyContextKey, {
    get contentWidth() {
      return contentWidth;
    },
    get rowHeight() {
      return rowHeight;
    },
    get columnWidths() {
      return columnWidths;
    },
    get columnCount() {
      return columnCount;
    },
    get startIndex() {
      return startIndex;
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
  style="position: relative; height: {totalHeight}px; width: {contentWidth}px; box-sizing: border-box;"
  {...props}
>
  <!-- Spacer for rows before visible range -->
  <div style="height: {startIndex * rowHeight}px;"></div>

  <!-- Render visible rows -->
  {@render children(startIndex, endIndex)}

  <!-- Spacer for rows after visible range -->
  <div style="height: {(totalData - endIndex) * rowHeight}px;"></div>
</div>
