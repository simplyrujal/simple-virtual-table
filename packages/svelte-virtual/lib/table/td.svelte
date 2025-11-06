<script lang="ts">
  import { getContext } from "svelte";
  import { tbodyContextKey } from "./context";

  let { children, colIndex, ...restProps } = $props();

  const tbodyContext = getContext(tbodyContextKey) as any;
  if (!tbodyContext) {
    throw new Error("<Td> must be used inside <Table>");
  }
</script>

<div
  style="width: {tbodyContext.columnWidths[
    colIndex
  ]}px; min-width: 100px; padding: 8px 16px; font-size: 14px; border-right: {tbodyContext.columnCount >
    0 && colIndex < tbodyContext.columnCount - 1
    ? '1px solid #e0e0e0'
    : 'none'}; display: flex; align-items: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-shrink: 0; flex-grow: 0; box-sizing: border-box;"
  {...restProps}
>
  {@render children()}
</div>
