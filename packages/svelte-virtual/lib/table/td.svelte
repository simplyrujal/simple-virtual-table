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
  style:position="absolute"
  style:left="{leftOffset}px"
  style:width="{effectiveWidth}px"
  style:height="{height}px"
  style:min-width="100px"
  style:padding="8px 16px"
  style:font-size="14px"
  style:border-right={trContext.columnCount > 0 &&
  colIndex + colSpan - 1 < trContext.columnCount - 1
    ? "1px solid #e0e0e0"
    : "none"}
  style:display="flex"
  style:align-items="center"
  style:overflow="hidden"
  style:text-overflow="ellipsis"
  style:white-space="nowrap"
  style:text-wrap="auto"
  style:flex-shrink="0"
  style:flex-grow="0"
  style:box-sizing="border-box"
  style:background-color="inherit"
  style:z-index={rowSpan > 1 ? 1 : "auto"}
  style={style}
  {...restProps}
>
  {@render children()}
</div>
