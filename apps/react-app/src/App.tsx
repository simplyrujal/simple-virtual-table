import type { ColumnDef } from "simple-virtual-table-react";
import { VirtualTable } from "simple-virtual-table-react";

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
    cell: ({
      getValue,
    }: {
      getValue: () => unknown;
      row: User;
      column: ColumnDef<User>;
    }) => <strong>{getValue() as number}</strong>,
  },
  {
    accessorKey: "name",
    header: "Name",
    width: 100,
    cell: ({
      getValue,
    }: {
      getValue: () => unknown;
      row: User;
      column: ColumnDef<User>;
    }) => (
      <span style={{ color: "#646cff", fontWeight: 500 }}>
        {getValue() as string}
      </span>
    ),
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
    cell: ({
      getValue,
    }: {
      getValue: () => unknown;
      row: User;
      column: ColumnDef<User>;
    }) => {
      const age = getValue() as number;
      return (
        <span style={{ color: age > 50 ? "#ff6b6b" : "#51cf66" }}>{age}</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    width: 100,
    cell: ({
      getValue,
    }: {
      getValue: () => unknown;
      row: User;
      column: ColumnDef<User>;
    }) => {
      const status = getValue() as string;
      const colors: Record<string, string> = {
        Active: "#51cf66",
        Inactive: "#ffd43b",
        Pending: "#74c0fc",
      };
      return (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: colors[status] + "20",
            color: colors[status],
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          {status}
        </span>
      );
    },
  },
];

function App() {
  // Generate sample data

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#213547" }}>
        Virtual Table Example
      </h1>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Showing {data.length.toLocaleString()} rows with virtual scrolling
      </p>
      <VirtualTable
        columns={columns}
        data={data}
        height={600}
        width={900}
        rowHeight={45}
        headerHeight={50}
        onRowClick={(row: User, index: number) => {
          console.log("Clicked row:", row, "at index:", index);
        }}
      />
    </div>
  );
}

export default App;
