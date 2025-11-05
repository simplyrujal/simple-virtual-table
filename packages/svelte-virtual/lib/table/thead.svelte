<script lang="ts">
    import { getContext, setContext } from "svelte";
    import { tableContextKey, theadContextKey } from "./context";

    const tableContext = getContext(tableContextKey);
    if (!tableContext) throw new Error("<Thead> must be used inside <Table>");

    let { children, headerHeight = 50, ...props } = $props();

    const { columnCount, setColumnWidths } = tableContext as any;

    // Provide TheadContext (similar to TheadContext.Provider in React)
    setContext(theadContextKey, {
        get columnCount() {
            return columnCount;
        },
        setColumnWidths,
    });
</script>

<div
    data-thead-container
    style="position: sticky; top: 0; z-index: 10; display: flex; height: {headerHeight}px; box-sizing: border-box; background-color: #f5f5f5; border-bottom: 2px solid #ddd;"
    {...props}
>
    {@render children()}
</div>
