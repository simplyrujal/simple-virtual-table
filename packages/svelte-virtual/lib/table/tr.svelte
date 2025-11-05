<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { tbodyContextKey, trContextKey } from "./context";

  let { children, rowIndex, ...restProps } = $props();
  let elementRef: HTMLDivElement | null = null;

  // Ensure Tr is used within Tbody context - throws error if not wrapped
  const tbodyContext = getContext(tbodyContextKey);
  if (!tbodyContext) {
    throw new Error("Tr component must be used inside Tbody component");
  }

  const {
    contentWidth,
    rowHeight,
    columnCount,
    columnWidths,
    getNextRowIndex,
  } = tbodyContext as any;

  // Track current column index for children - reset on each render
  let colCounter = $state(0);

  // Get rowIndex from prop, or from context if not provided
  // Initialize rowIndex when component mounts
  let effectiveRowIndex = $state(rowIndex !== undefined ? rowIndex : -1);

  $effect(() => {
    if (rowIndex === undefined && effectiveRowIndex === -1) {
      effectiveRowIndex = getNextRowIndex();
    } else if (rowIndex !== undefined) {
      effectiveRowIndex = rowIndex;
    }
  });

  // Provide TrContext (similar to TrContext.Provider in React)
  setContext(trContextKey, {
    get columnCount() {
      return columnCount;
    },
    get columnWidths() {
      return columnWidths;
    },
    // Function to get and increment column index
    getNextColIndex() {
      const index = colCounter;
      colCounter++;
      return index;
    },
  });

  // Reset column counter when component initializes
  $effect(() => {
    colCounter = 0;
  });
</script>

<div
  bind:this={elementRef}
  style="display: flex; width: {contentWidth}px; height: {rowHeight}px; border-bottom: 1px solid #e0e0e0; background-color: {effectiveRowIndex %
    2 ===
  0
    ? '#ffffff'
    : '#fafafa'}; transition: background-color 0.2s; box-sizing: border-box;"
  {...restProps}
>
  {@render children()}
</div>
