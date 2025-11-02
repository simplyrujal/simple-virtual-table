import { Table, Tbody, Td, Th, Thead, Tr } from "simple-virtual-table-react";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  status: string;
}

const colors: Record<string, string> = {
  Active: "#51cf66",
  Inactive: "#ffd43b",
  Pending: "#74c0fc",
};

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

const smallData = [
  { id: 1, name: "John", email: "john@example.com", age: 30, status: "Active" },
  {
    id: 2,
    name: "Jane",
    email: "jane@example.com",
    age: 25,
    status: "Inactive",
  },
  { id: 3, name: "Jim", email: "jim@example.com", age: 35, status: "Pending" },
  { id: 4, name: "Jill", email: "jill@example.com", age: 40, status: "Active" },
  {
    id: 5,
    name: "Jack",
    email: "jack@example.com",
    age: 45,
    status: "Inactive",
  },
  {
    id: 6,
    name: "Jill",
    email: "jill@example.com",
    age: 50,
    status: "Pending",
  },
  { id: 7, name: "Jack", email: "jack@example.com", age: 55, status: "Active" },
  {
    id: 8,
    name: "Jill",
    email: "jill@example.com",
    age: 60,
    status: "Inactive",
  },
  {
    id: 9,
    name: "Jack",
    email: "jack@example.com",
    age: 65,
    status: "Pending",
  },
  // ... more rows
];

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", color: "#213547" }}>
        Virtual Table Example
      </h1>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Showing {data.length.toLocaleString()} rows with virtual scrolling
      </p>
      <Table totalData={data.length} height={600} rowHeight={45}>
        <Thead>
          <Th width={100}>ID</Th>
          <Th width={100}>Name</Th>
          <Th width={250}>Email</Th>
          <Th width={100}>Age</Th>
          <Th width={100}>Status</Th>
        </Thead>
        <Tbody>
          {data.map((_row: User) => {
            // Pass rowIndex manually since we're mapping ourselves, not letting Tbody map
            // Tr will inject colIndex to Td children automatically
            const status = _row.status;
            return (
              <Tr key={_row.id}>
                <Td>
                  <strong>{_row.id}</strong>
                </Td>
                <Td>
                  <span style={{ color: "#646cff", fontWeight: 500 }}>
                    {_row.name}
                  </span>
                </Td>
                <Td>{_row.email}</Td>
                <Td>
                  <span
                    style={{
                      color: _row.age > 50 ? "#ff6b6b" : "#51cf66",
                    }}
                  >
                    {_row.age}
                  </span>
                </Td>
                <Td>
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
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <Table totalData={smallData.length} rowHeight={45} height={200}>
        <Thead>
          <Th width={100}>ID</Th>
          <Th width={200}>Name</Th>
          <Th width={300}>Email</Th>
          <Th width={100}>Age</Th>
          <Th width={100}>Status</Th>
        </Thead>
        <Tbody>
          {smallData.map((row) => (
            <Tr key={row.id}>
              <Td>{row.id}</Td>
              <Td>{row.name}</Td>
              <Td>{row.email}</Td>
              <Td>{row.age}</Td>
              <Td>{row.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

export default App;
