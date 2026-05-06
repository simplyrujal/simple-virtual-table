<script lang="ts">
  import { getContext, tick } from "svelte";
  import { theadContextKey } from "./context";

  let {
    children,
    colIndex: propColIndex,
    width = 100,
    colSpan = 1,
    style = "",
    ...restProps
  } = $props();

  // Ensure Th is used within Thead context - throws error if not wrapped
  const theadContext = getContext(theadContextKey) as any;
  if (!theadContext) {
    throw new Error("Th component must be used inside Thead component");
  }
  const { columnCount, columnWidths, setColumnWidths, getNextColIndex } =
    theadContext;

  // svelte-ignore state_referenced_locally
  const colIndex =
    propColIndex !== undefined ? propColIndex : getNextColIndex(colSpan);

  $effect(() => {
    tick().then(() => {
      setColumnWidths(colIndex, width, colSpan);
    });
  });

  const effectiveWidth = $derived(
    columnWidths && columnWidths.length > 0
      ? columnWidths
          .slice(colIndex, colIndex + colSpan)
          .reduce((sum: number, w: number) => sum + w, 0)
      : width
  );

  const leftOffset = $derived(
    columnWidths && columnWidths.length > 0
      ? columnWidths.slice(0, colIndex).reduce((sum: number, w: number) => sum + w, 0)
      : 0
  );
</script>

<div
  style:position="absolute"
  style:left="{leftOffset}px"
  style:width="{effectiveWidth}px"
  style:height="100%"
  style:box-sizing="border-box"
  style:border-right={columnCount > 0 && colIndex + colSpan - 1 < columnCount - 1
    ? "1px solid #e0e0e0"
    : "none"}
  style:display="flex"
  style:align-items="center"
  style:user-select="none"
  style:flex-shrink="0"
  style:flex-grow="0"
  style:text-align="left"
  style:padding="8px 16px"
  style:font-weight="600"
  style:font-size="14px"
  style={style}
  {...restProps}
>
  {@render children()}
</div>
