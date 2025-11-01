<script lang="ts">
  import type { ColumnDef } from "simple-virtual-table-svelte";
  import { VirtualTable } from "simple-virtual-table-svelte";

  interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    status: string;
  }

  const generateData = (count: number): User[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + (i % 50),
      status: i % 3 === 0 ? "Active" : i % 3 === 1 ? "Inactive" : "Pending",
    }));
  };

  const data = generateData(10000); // Large dataset to showcase virtualization

  // Define columns similar to TanStack Table or AG Grid
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
      width: 100,
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return `<strong>${value}</strong>`;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      width: 100,
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return `<span style="color: #646cff; font-weight: 500;">${value}</span>`;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      width: 250,
    },
    {
      accessorKey: "age",
      header: "Age",
      width: 100,
      cell: ({ getValue }) => {
        const age = getValue() as number;
        const color = age > 50 ? "#ff6b6b" : "#51cf66";
        return `<span style="color: ${color};">${age}</span>`;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      width: 100,
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const colors: Record<string, string> = {
          Active: "#51cf66",
          Inactive: "#ffd43b",
          Pending: "#74c0fc",
        };
        const color = colors[status] || "#666";
        return `<span style="padding: 4px 8px; border-radius: 4px; background-color: ${color}20; color: ${color}; font-size: 12px; font-weight: 500;">${status}</span>`;
      },
    },
  ];

  function onRowClick(row: User, index: number) {
    console.log("Clicked row:", row, "at index:", index);
  }
</script>

<main style="padding: 20px;">
  <h1 style="margin-bottom: 20px; color: #213547;">Virtual Table Example</h1>
  <p style="margin-bottom: 20px; color: #666;">
    Showing {data.length.toLocaleString()} rows with virtual scrolling
  </p>
  <VirtualTable
    {columns}
    {data}
    height={600}
    width={900}
    rowHeight={45}
    headerHeight={50}
    {onRowClick}
  />
</main>

<style>
  main {
    text-align: left;
  }
</style>
