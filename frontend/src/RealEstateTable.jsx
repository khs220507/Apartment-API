import React, { useEffect, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    TablePagination,
    styled
} from '@mui/material';

function RealEstateTable() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/callApi');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                setData(jsonData.response.body.items.item);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const columns = React.useMemo(
        () => [
            { Header: '법정동', accessor: '법정동' },
            { Header: '아파트', accessor: '아파트' },
            { Header: '거래금액 (만원)', accessor: '거래금액' },
            { Header: '전용면적 (㎡)', accessor: '전용면적' },
            {
                Header: '거래 날짜',
                accessor: 'date',
                Cell: ({ row }) => `${row.original.월}월 ${row.original.일}일`
            },
        ],
        []
    );

    // Initialize the table instance with pagination hooks
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        gotoPage,
        setPageSize,
        prepareRow,
        state: {
            pageIndex,
            pageSize
        },
    } = useTable({ columns, data, initialState: { pageIndex: 0, pageSize: 10 } }, usePagination);

    return (
        <TableContainer component={Paper}>
            <Typography variant="h4" component="div" gutterBottom sx={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
                Real Estate Transactions
            </Typography>
            <Table {...getTableProps()}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableCell {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <TableCell {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[10, 20, 30]}
                component="div"
                count={data.length}
                rowsPerPage={pageSize}
                page={pageIndex}
                onPageChange={(event, newPage) => gotoPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setPageSize(Number(event.target.value));
                    gotoPage(0); // Reset to first page when page size changes
                }}
            />
        </TableContainer>
    );
}

export default RealEstateTable;
