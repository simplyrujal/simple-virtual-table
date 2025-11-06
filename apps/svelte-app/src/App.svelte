<script lang="ts">
  import { Table, Tbody, Td, Th, Thead, Tr } from "simple-virtual-table-svelte";

  interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    status: string;
    width?: number;
    phone?: string;
    department?: string;
    salary?: number;
    location?: string;
    joinDate?: string;
    manager?: string;
  }

  // const colors: Record<string, string> = {
  //     Active: "#51cf66",
  //     Inactive: "#ffd43b",
  //     Pending: "#74c0fc",
  // };

  // const generateData = (count: number): User[] => {
  //     return Array.from({ length: count }, (_, i) => ({
  //         id: i + 1,
  //         name: `User ${i + 1}`,
  //         email: `user${i + 1}@example.com`,
  //         age: 20 + (i % 50),
  //         status:
  //             i % 3 === 0 ? "Active" : i % 3 === 1 ? "Inactive" : "Pending",
  //     }));
  // };

  // const data = generateData(10000); // Large dataset to showcase virtualization

  const smallData: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      status: "Active",
      width: 100,
      phone: "+1-555-0101",
      department: "Engineering",
      salary: 95000,
      location: "New York",
      joinDate: "2020-01-15",
      manager: "Alice Johnson",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      age: 25,
      status: "Inactive",
      width: 200,
      phone: "+1-555-0102",
      department: "Marketing",
      salary: 72000,
      location: "San Francisco",
      joinDate: "2021-03-22",
      manager: "Bob Williams",
    },
    {
      id: 3,
      name: "Jim Johnson",
      email: "jim@example.com",
      age: 35,
      status: "Pending",
      width: 150,
      phone: "+1-555-0103",
      department: "Sales",
      salary: 85000,
      location: "Chicago",
      joinDate: "2019-06-10",
      manager: "Carol Davis",
    },
    {
      id: 4,
      name: "Jill Williams",
      email: "jill@example.com",
      age: 40,
      status: "Active",
      width: 180,
      phone: "+1-555-0104",
      department: "HR",
      salary: 68000,
      location: "Boston",
      joinDate: "2022-02-08",
      manager: "David Brown",
    },
    {
      id: 5,
      name: "Jack Brown",
      email: "jack@example.com",
      age: 45,
      status: "Inactive",
      width: 120,
      phone: "+1-555-0105",
      department: "Engineering",
      salary: 110000,
      location: "Seattle",
      joinDate: "2018-09-12",
      manager: "Alice Johnson",
    },
    {
      id: 6,
      name: "Sarah Davis",
      email: "sarah@example.com",
      age: 28,
      status: "Pending",
      width: 160,
      phone: "+1-555-0106",
      department: "Marketing",
      salary: 75000,
      location: "Los Angeles",
      joinDate: "2021-11-05",
      manager: "Bob Williams",
    },
    {
      id: 7,
      name: "Mike Wilson",
      email: "mike@example.com",
      age: 32,
      status: "Active",
      width: 140,
      phone: "+1-555-0107",
      department: "Sales",
      salary: 88000,
      location: "Austin",
      joinDate: "2020-07-20",
      manager: "Carol Davis",
    },
    {
      id: 8,
      name: "Emily Taylor",
      email: "emily@example.com",
      age: 27,
      status: "Inactive",
      width: 170,
      phone: "+1-555-0108",
      department: "Finance",
      salary: 92000,
      location: "Denver",
      joinDate: "2022-04-14",
      manager: "Frank Miller",
    },
    {
      id: 9,
      name: "David Anderson",
      email: "david@example.com",
      age: 38,
      status: "Pending",
      width: 110,
      phone: "+1-555-0109",
      department: "Engineering",
      salary: 105000,
      location: "Portland",
      joinDate: "2019-12-03",
      manager: "Alice Johnson",
    },
    {
      id: 10,
      name: "Lisa Martinez",
      email: "lisa@example.com",
      age: 33,
      status: "Active",
      width: 190,
      phone: "+1-555-0110",
      department: "HR",
      salary: 70000,
      location: "Miami",
      joinDate: "2021-08-18",
      manager: "David Brown",
    },
    {
      id: 11,
      name: "Tom Thompson",
      email: "tom@example.com",
      age: 29,
      status: "Inactive",
      width: 130,
      phone: "+1-555-0111",
      department: "Finance",
      salary: 78000,
      location: "Phoenix",
      joinDate: "2022-01-25",
      manager: "Frank Miller",
    },
    {
      id: 12,
      name: "Anna Garcia",
      email: "anna@example.com",
      age: 36,
      status: "Pending",
      width: 145,
      phone: "+1-555-0112",
      department: "Sales",
      salary: 82000,
      location: "Nashville",
      joinDate: "2020-05-30",
      manager: "Carol Davis",
    },
  ];
</script>

<main style="padding: 20px;">
  <h1 style="margin-bottom: 20px; color: #213547;">Virtual Table Example</h1>
  <p style="margin-bottom: 20px; color: #666;">
    <!-- Showing {data.length.toLocaleString()} rows with virtual scrolling -->
  </p>
  <!-- <Table totalData={data.length} height={600} rowHeight={45}>
    <Thead>
      <Th width={100}>ID</Th>
      <Th width={100}>Name</Th>
      <Th width={250}>Email</Th>
      <Th width={100}>Age</Th>
      <Th width={100}>Status</Th>
    </Thead>
    <Tbody>
      {#each data as row (row.id)}
        {@const status = row.status}
        <Tr>
          <Td>
            <strong>{row.id}</strong>
          </Td>
          <Td>
            <span style="color: #646cff; font-weight: 500;">
              {row.name}
            </span>
          </Td>
          <Td>{row.email}</Td>
          <Td>
            <span style="color: {row.age > 50 ? '#ff6b6b' : '#51cf66'};">
              {row.age}
            </span>
          </Td>
          <Td>
            <span
              style="padding: 4px 8px; border-radius: 4px; background-color: {colors[
                status
              ]}20; color: {colors[status]}; font-size: 12px; font-weight: 500;"
            >
              {status}
            </span>
          </Td>
        </Tr>
      {/each}
    </Tbody>
  </Table> -->
  <br />
  <Table totalData={smallData.length} rowHeight={45} height={400}>
    <Thead>
      <Th colIndex={0} width={100}>ID</Th>
      <Th colIndex={1} width={500}>Name</Th>
      <Th colIndex={2} width={300}>Email</Th>
      <Th colIndex={3} width={100}>Age</Th>
      <Th colIndex={4} width={100}>Status</Th>
      <Th colIndex={5} width={150}>Phone</Th>
      <Th colIndex={6} width={150}>Department</Th>
      <Th colIndex={7} width={120}>Salary</Th>
      <Th colIndex={8} width={150}>Location</Th>
      <Th colIndex={9} width={120}>Join Date</Th>
      <Th colIndex={10} width={180}>Manager</Th>
    </Thead>
    <Tbody>
      {#each smallData as row (row.id)}
        <Tr>
          <Td colIndex={0}>{row.id}</Td>
          <Td colIndex={1}>{row.name}</Td>
          <Td colIndex={2}>{row.email}</Td>
          <Td colIndex={3}>{row.age}</Td>
          <Td colIndex={4}>{row.status}</Td>
          <Td colIndex={5}>{row.phone || "-"}</Td>
          <Td colIndex={6}>{row.department || "-"}</Td>
          <Td colIndex={7}
            >{row.salary ? `$${row.salary.toLocaleString()}` : "-"}</Td
          >
          <Td colIndex={8}>{row.location || "-"}</Td>
          <Td colIndex={9}>{row.joinDate || "-"}</Td>
          <Td colIndex={10}>{row.manager || "-"}</Td>
        </Tr>
      {/each}
    </Tbody>
  </Table>
</main>

<style>
  main {
    text-align: left;
  }
</style>
