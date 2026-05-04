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
    Showing {data.length.toLocaleString()} rows with virtual scrolling
  </p>
  <Table totalData={data.length} height={600} rowHeight={45}>
    <Thead>
      <Th colIndex={0} width={100}>ID</Th>
      <Th colIndex={1} width={100}>Name</Th>
      <Th colIndex={2} width={250}>Email</Th>
      <Th colIndex={3} width={100}>Age</Th>
      <Th colIndex={4} width={100}>Status</Th>
    </Thead>
    <Tbody>
      {#snippet children(startIndex: number, endIndex: number)}
        {#each data.slice(startIndex, endIndex) as row, index (row.id)}
          {@const status = row.status}
          <Tr rowIndex={startIndex + index}>
            <Td colIndex={0}>
              <strong>{row.id}</strong>
            </Td>
            <Td colIndex={1}>
              <span style="color: #646cff; font-weight: 500;">
                {row.name}
              </span>
            </Td>
            <Td colIndex={2}>{row.email}</Td>
            <Td colIndex={3}>
              <span style="color: {row.age > 50 ? '#ff6b6b' : '#51cf66'};">
                {row.age}
              </span>
            </Td>
            <Td colIndex={4}>
              <span
                style="padding: 4px 8px; border-radius: 4px; background-color: {colors[
                  status
                ]}20; color: {colors[
                  status
                ]}; font-size: 12px; font-weight: 500;"
              >
                {status}
              </span>
            </Td>
          </Tr>
        {/each}
      {/snippet}
    </Tbody>
  </Table>
  <br />
  <Table totalData={smallData.length} rowHeight={45} height={400}>
    <Thead>
      <Th colIndex={0} width={100}>ID</Th>
      <Th colIndex={1} width={200}>Name</Th>
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
      {#snippet children(startIndex: number, endIndex: number)}
        {#each smallData.slice(startIndex, endIndex) as row, index (row.id)}
          <Tr rowIndex={startIndex + index}>
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
      {/snippet}
    </Tbody>
  </Table>
  <br />
  <h2 style="margin-bottom: 20px; color: #213547;">Advanced Spanning Example</h2>
  <div style="margin-bottom: 10px; font-size: 14px; color: #666;">
    Demonstrating complex grid layouts with column and row spanning.
  </div>
  <Table totalData={8} rowHeight={60} height={500}>
    <Thead>
      <Th width={100}>ID</Th>
      <Th width={300} colSpan={3} style="background-color: #e7f5ff;">
        Merged Header (Spans 3 Columns)
      </Th>
      <Th width={150}>Actions</Th>
    </Thead>
    <Tbody>
      {#snippet children(startIndex: number, endIndex: number)}
        <!-- Row 1 -->
        {#if startIndex <= 0 && endIndex > 0}
          <Tr rowIndex={0}>
            <Td>#101</Td>
            <Td rowSpan={2} style="background-color: #fff4e6; font-weight: bold;">
              Category A<br />(RowSpan 2)
            </Td>
            <Td>Sub-item 1.1</Td>
            <Td>Details 1.1</Td>
            <Td><button style="padding: 4px 8px; cursor: pointer;">Edit</button></Td>
          </Tr>
        {/if}
        <!-- Row 2 -->
        {#if startIndex <= 1 && endIndex > 1}
          <Tr rowIndex={1}>
            <Td>#102</Td>
            <!-- Col 1 is occupied by Category A, so we skip it -->
            <Td colIndex={2}>Sub-item 1.2</Td>
            <Td>Details 1.2</Td>
            <Td><button style="padding: 4px 8px; cursor: pointer;">Edit</button></Td>
          </Tr>
        {/if}
        <!-- Row 3 -->
        {#if startIndex <= 2 && endIndex > 2}
          <Tr rowIndex={2}>
            <Td>#103</Td>
            <Td colSpan={2} style="background-color: #f3f0ff; text-align: center;">
              Featured Item (ColSpan 2)
            </Td>
            <Td>Details 1.3</Td>
            <Td><button style="padding: 4px 8px; cursor: pointer;">Edit</button></Td>
          </Tr>
        {/if}
        <!-- Row 4 -->
        {#if startIndex <= 3 && endIndex > 3}
          <Tr rowIndex={3}>
            <Td>#104</Td>
            <Td>Standard</Td>
            <Td>Normal</Td>
            <Td>Regular</Td>
            <Td><button style="padding: 4px 8px; cursor: pointer;">Edit</button></Td>
          </Tr>
        {/if}
        <!-- Row 5 -->
        {#if startIndex <= 4 && endIndex > 4}
          <Tr rowIndex={4}>
            <Td>#105</Td>
            <Td rowSpan={3} style="background-color: #ebfbee; vertical-align: top;">
              Project Omega<br />(RowSpan 3)
            </Td>
            <Td>Phase 1</Td>
            <Td>Completed</Td>
            <Td><button style="padding: 4px 8px; cursor: pointer;">View</button></Td>
          </Tr>
        {/if}
        <!-- Row 6 -->
        {#if startIndex <= 5 && endIndex > 5}
          <Tr rowIndex={5}>
            <Td>#106</Td>
            <!-- Col 1 is occupied by Project Omega -->
            <Td colIndex={2}>Phase 2</Td>
            <Td>In Progress</Td>
            <Td><button style="padding: 4px 8px; cursor: pointer;">View</button></Td>
          </Tr>
        {/if}
        <!-- Row 7 -->
        {#if startIndex <= 6 && endIndex > 6}
          <Tr rowIndex={6}>
            <Td>#107</Td>
            <!-- Col 1 is occupied by Project Omega -->
            <Td colIndex={2}>Phase 3</Td>
            <Td>Planned</Td>
            <Td><button style="padding: 4px 8px; cursor: pointer;">View</button></Td>
          </Tr>
        {/if}
        <!-- Row 8 -->
        {#if startIndex <= 7 && endIndex > 7}
          <Tr rowIndex={7}>
            <Td>#108</Td>
            <Td colSpan={3} style="background-color: #fff5f5; color: #fa5252; font-weight: 600;">
              Warning: System Maintenance Scheduled (ColSpan 3)
            </Td>
            <Td><button style="padding: 4px 8px; cursor: pointer;">Dismiss</button></Td>
          </Tr>
        {/if}
      {/snippet}
    </Tbody>
  </Table>
</main>

<style>
  main {
    text-align: left;
  }
</style>
