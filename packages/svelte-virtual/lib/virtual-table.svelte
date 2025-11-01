<script lang="ts">
  import { onMount } from "svelte";
  import type { VirtualTableProps } from "./types";
  // Props
  // No generics directly in <script>, so use `any` or define a specific type
  const {
    columns,
    data,
    rowHeight = 40,
    headerHeight = 50,
    height = 600,
    width = 100,
    overscan = 5,
    className = "",
    headerClassName = "",
    rowClassName = "",
    onRowClick,
  }: VirtualTableProps<any> = $props();

  // State
  let scrollTop = $state(0);
  let containerWidth = $state<number | null>(null);
  let scrollElementRef: HTMLDivElement;
  let containerRef: HTMLDivElement;

  // Column widths
  let columnWidths = $derived(columns.map((col: any) => col.width || 100));

  // Calculate total content width (sum of all column widths)
  let contentWidth = $derived(
    columnWidths.reduce((sum: number, w: number) => sum + w, 0)
  );

  // Calculate if we need to fill container (when content is smaller)
  let needsFill = $derived(
    width
      ? contentWidth < width - 2
      : containerWidth !== null
        ? contentWidth < containerWidth - 2
        : false
  );

  // Calculate spacer width (extra space to fill)
  // Only add spacer if there's significant space to fill (avoid sub-pixel issues)
  let _spacerCalc = $derived(() => {
    if (!needsFill) return 0;
    const calculatedSpacer = width
      ? width - 2 - contentWidth
      : containerWidth !== null
        ? containerWidth - 2 - contentWidth
        : 0;
    // Only use spacer if there's at least 0.5px to fill (avoid rounding issues)
    return calculatedSpacer > 0.5 ? Math.ceil(calculatedSpacer) : 0;
  });
  let spacerWidth = $derived(_spacerCalc());

  // Calculate total width for table content
  // Include spacer width when we need to fill the container
  let totalWidth = $derived(
    needsFill && spacerWidth > 0 ? contentWidth + spacerWidth : contentWidth
  );

  // Calculate visible range
  let _startCalc = $derived(() => {
    const visibleStart = Math.floor(scrollTop / rowHeight);
    return Math.max(0, visibleStart - overscan);
  });
  let startIndex = $derived(_startCalc());

  let _endCalc = $derived(() => {
    const visibleEnd = Math.ceil((scrollTop + height) / rowHeight);
    return Math.min(data.length, visibleEnd + overscan);
  });
  let endIndex = $derived(_endCalc());

  let totalHeight = $derived(data.length * rowHeight);

  // Visible rows
  let visibleRows = $derived(data.slice(startIndex, endIndex));

  // Determine if horizontal scroll is needed
  let _scrollCalc = $derived(() => {
    if (needsFill) return false; // If we're filling, no scroll needed
    if (width) {
      return contentWidth > width - 2;
    }
    if (containerWidth !== null) {
      return contentWidth > containerWidth - 2;
    }
    return true; // Default to allowing scroll until measured
  });
  let needsHorizontalScroll = $derived(_scrollCalc());

  // Measure container width when no explicit width is provided
  onMount(() => {
    if (!width && scrollElementRef) {
      const updateWidth = () => {
        if (scrollElementRef) {
          const rect = scrollElementRef.getBoundingClientRect();
          containerWidth = rect.width;
        }
      };

      updateWidth();
      const resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(scrollElementRef);

      return () => {
        resizeObserver.disconnect();
      };
    }
  });

  // Handle scroll
  function handleScroll(event: Event) {
    const target = event.target as HTMLDivElement;
    scrollTop = target.scrollTop;
  }

  // Get cell value
  function getCellValue(row: any, column: any): any {
    if (column.accessorKey) {
      const key = column.accessorKey as string;
      return row[key];
    }
    return null;
  }

  // Get row class name
  function getRowClassName(row: any, index: number): string {
    if (typeof rowClassName === "function") {
      return rowClassName(row, index);
    }
    return rowClassName || "";
  }

  // Handle row click
  function handleRowClick(row: any, index: number) {
    onRowClick?.(row, index);
  }

  // Handle row hover
  function handleMouseEnter(event: MouseEvent) {
    if (onRowClick) {
      const target = event.currentTarget as HTMLDivElement;
      target.style.backgroundColor = "#f0f0f0";
    }
  }

  function handleMouseLeave(event: MouseEvent, absoluteIndex: number) {
    const target = event.currentTarget as HTMLDivElement;
    target.style.backgroundColor =
      absoluteIndex % 2 === 0 ? "#ffffff" : "#fafafa";
  }
</script>

<div
  bind:this={scrollElementRef}
  class="virtual-table-container {className}"
  onscroll={handleScroll}
  style="width: {width ||
    '100%'}; height: {height}px; overflow-x: {needsHorizontalScroll
    ? 'auto'
    : 'hidden'}; overflow-y: auto;"
>
  <!-- Fixed Header -->
  <div
    class="virtual-table-header {headerClassName}"
    style="height: {headerHeight}px; width: {totalWidth}px;"
  >
    {#each columns as column, colIndex}
      <div
        class="header-cell"
        style="width: {columnWidths[colIndex]}px; min-width: {column.minWidth ||
          100}px; max-width: {column.maxWidth}px;"
      >
        {column.header}
      </div>
    {/each}
    <!-- Spacer to fill remaining space when content is smaller than container -->
    {#if needsFill && spacerWidth > 0}
      <div
        style="width: {spacerWidth}px; min-width: {spacerWidth}px; max-width: {spacerWidth}px; flex-shrink: 0; flex-grow: 0;"
      ></div>
    {/if}
  </div>

  <!-- Virtualized Body -->
  <div
    bind:this={containerRef}
    class="virtual-table-body"
    style="height: {totalHeight}px; width: {totalWidth}px;"
  >
    <!-- Spacer before visible rows -->
    <div style="height: {startIndex * rowHeight}px"></div>

    <!-- Visible rows -->
    {#each visibleRows as row, relativeIndex}
      {@const absoluteIndex = startIndex + relativeIndex}
      <div
        class="virtual-table-row {getRowClassName(row, absoluteIndex)}"
        onclick={() => handleRowClick(row, absoluteIndex)}
        onmouseenter={handleMouseEnter}
        onmouseleave={(e) => handleMouseLeave(e, absoluteIndex)}
        style="height: {rowHeight}px; background-color: {absoluteIndex % 2 === 0
          ? '#ffffff'
          : '#fafafa'}; cursor: {onRowClick
          ? 'pointer'
          : 'default'}; width: {totalWidth}px;"
      >
        {#each columns as column, colIndex}
          <div
            class="cell"
            style="width: {columnWidths[
              colIndex
            ]}px; min-width: {column.minWidth ||
              100}px; max-width: {column.maxWidth}px;"
          >
            {#if column.cell}
              {@const cellResult = column.cell({
                getValue: () => getCellValue(row, column),
                row,
                column,
              })}
              {#if typeof cellResult === 'string'}
                {@html cellResult}
              {:else}
                {@render cellResult}
              {/if}
            {:else}
              <span>{getCellValue(row, column)?.toString() || ""}</span>
            {/if}
          </div>
        {/each}
        <!-- Spacer to fill remaining space when content is smaller than container -->
        {#if needsFill && spacerWidth > 0}
          <div
            style="width: {spacerWidth}px; min-width: {spacerWidth}px; max-width: {spacerWidth}px; flex-shrink: 0; flex-grow: 0;"
          ></div>
        {/if}
      </div>
    {/each}

    <!-- Spacer after visible rows -->
    <div style="height: {(data.length - endIndex) * rowHeight}px"></div>
  </div>
</div>

<style>
  .virtual-table-container {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    position: relative;
    box-sizing: border-box;
  }

  .virtual-table-header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    background-color: #f5f5f5;
    border-bottom: 2px solid #ddd;
    box-sizing: border-box;
  }

  .header-cell {
    padding: 8px 16px;
    font-weight: 600;
    font-size: 14px;
    border-right: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    text-align: left;
    user-select: none;
    flex-shrink: 0;
    flex-grow: 0;
    box-sizing: border-box;
  }

  .virtual-table-body {
    position: relative;
    box-sizing: border-box;
  }

  .virtual-table-row {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    transition: background-color 0.2s;
    box-sizing: border-box;
  }

  .cell {
    padding: 8px 16px;
    font-size: 14px;
    border-right: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 0;
    flex-grow: 0;
    box-sizing: border-box;
  }
</style>
