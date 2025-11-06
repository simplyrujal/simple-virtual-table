<script lang="ts">
  import { getContext } from "svelte";
  import { tableContextKey } from "./context";

  let { children, colIndex, ...restProps } = $props();

  const tableContext = getContext(tableContextKey);
  if (!tableContext) {
    throw new Error("<Td> must be used inside <Table>");
  }

  const { columnCount, columnWidths } = tableContext as any;
</script>

<div
  style="width: {columnWidths[
    colIndex
  ]}px; min-width: 100px; padding: 8px 16px; font-size: 14px; border-right: {columnCount >
    0 && colIndex < columnCount - 1
    ? '1px solid #e0e0e0'
    : 'none'}; display: flex; align-items: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-shrink: 0; flex-grow: 0; box-sizing: border-box;"
  {...restProps}
>
  {@render children()}
</div>
