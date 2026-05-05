<script lang="ts">
  import { getContext } from "svelte";
  import { tbodyContextKey, trContextKey } from "./context";

  let {
    children,
    colIndex: propColIndex,
    colSpan = 1,
    rowSpan = 1,
    style = "",
    ...restProps
  } = $props();

  const tbodyContext = getContext(tbodyContextKey) as any;
  if (!tbodyContext) {
    throw new Error("<Td> must be used inside <Table>");
  }

  const trContext = getContext(trContextKey) as any;
  if (!trContext) {
    throw new Error("<Td> must be used inside <Tr>");
  }

  // svelte-ignore state_referenced_locally
  const colIndex =
    propColIndex !== undefined
      ? propColIndex
      : trContext.getNextColIndex(colSpan, rowSpan);

  const effectiveWidth = $derived(
    trContext.columnWidths && trContext.columnWidths.length > 0
      ? trContext.columnWidths
          .slice(colIndex, colIndex + colSpan)
          .reduce((sum: number, w: number) => sum + w, 0)
      : 100,
  );

  const leftOffset = $derived(
    trContext.columnWidths && trContext.columnWidths.length > 0
      ? trContext.columnWidths
          .slice(0, colIndex)
          .reduce((sum: number, w: number) => sum + w, 0)
      : 0,
  );

  const height = $derived(trContext.rowHeight * rowSpan);
</script>

<div
  style="position: absolute; left: {leftOffset}px; width: {effectiveWidth}px; height: {height}px; min-width: 100px; padding: 8px 16px; font-size: 14px; border-right: {trContext.columnCount >
    0 && colIndex + colSpan - 1 < trContext.columnCount - 1
    ? '1px solid #e0e0e0'
    : 'none'}; display: flex; align-items: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-wrap: auto; flex-shrink: 0; flex-grow: 0; box-sizing: border-box; background-color: inherit; z-index: {rowSpan >
  1
    ? 1
    : 'auto'}; {style}"
  {...restProps}
>
  {@render children()}
</div>
