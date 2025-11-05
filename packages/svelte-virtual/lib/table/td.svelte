<script lang="ts">
  import { getContext } from "svelte";
  import { tableContextKey, trContextKey } from "./context";

  let { children, colIndex, ...restProps } = $props();
  let elementRef: HTMLDivElement | null = null;

  const tableContext = getContext(tableContextKey);
  if (!tableContext) {
    throw new Error("<Td> must be used inside <Table>");
  }

  const { columnWidths, columnCount } = tableContext as any;

  // Get trContext to access column index counter
  const trContext = getContext(trContextKey);
  if (!trContext) {
    throw new Error("<Td> must be used inside <Tr>");
  }

  const { getNextColIndex } = trContext as any;

  // Get colIndex from prop, or from context if not provided
  // Initialize colIndex when component mounts
  let effectiveColIndex = $state(colIndex !== undefined ? colIndex : -1);

  $effect(() => {
    if (colIndex === undefined && effectiveColIndex === -1) {
      effectiveColIndex = getNextColIndex();
    } else if (colIndex !== undefined) {
      effectiveColIndex = colIndex;
    }
  });

  const width = $derived(columnWidths[effectiveColIndex] ?? 100);
</script>

<div
  bind:this={elementRef}
  style="width: {width}px; min-width: 100px; padding: 8px 16px; font-size: 14px; border-right: {columnCount >
    0 && effectiveColIndex < columnCount - 1
    ? '1px solid #e0e0e0'
    : 'none'}; display: flex; align-items: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-shrink: 0; flex-grow: 0; box-sizing: border-box;"
  {...restProps}
>
  {@render children()}
</div>
