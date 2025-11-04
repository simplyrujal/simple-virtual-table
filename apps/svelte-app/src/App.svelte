<script lang="ts">
    import {
        Table,
        Thead,
        Tbody,
        Tr,
        Th,
        Td,
    } from "simple-virtual-table-svelte";

    const data = [];
</script>

<main style="padding: 20px;">
    <h1 style="margin-bottom: 20px; color: #213547;">Virtual Table Example</h1>
    <p style="margin-bottom: 20px; color: #666;">
        Showing {data.length.toLocaleString()} rows with virtual scrolling
    </p>
    <Table>
        <Thead>
            <Th>One</Th>
            <Th>Two</Th>
        </Thead>
        <Tbody>
            <Tr>
                <Td>1</Td>
                <Td>1</Td>
            </Tr>
            <Tr>
                <Td>2</Td>
                <Td>2</Td>
            </Tr>
        </Tbody>
    </Table>
</main>

<style>
    main {
        text-align: left;
    }
</style>
