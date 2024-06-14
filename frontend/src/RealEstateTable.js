import React, { useEffect, useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    TableSortLabel,
    Slider,
    Button, TextField,
    Alert, FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import { addMonths, subMonths } from 'date-fns';

const districts = [
    { name: '종로구', code: '11110' },
    { name: '중구', code: '11140' },
    { name: '용산구', code: '11170' },
    { name: '성동구', code: '11200' },
    { name: '광진구', code: '11215' },
    { name: '동대문구', code: '11230' },
    { name: '중랑구', code: '11260' },
    { name: '성북구', code: '11290' },
    { name: '강북구', code: '11305' },
    { name: '도봉구', code: '11320' },
    { name: '노원구', code: '11350' },
    { name: '은평구', code: '11380' },
    { name: '서대문구', code: '11410' },
    { name: '마포구', code: '11440' },
    { name: '양천구', code: '11470' },
    { name: '강서구', code: '11500' },
    { name: '구로구', code: '11530' },
    { name: '금천구', code: '11545' },
    { name: '영등포구', code: '11560' },
    { name: '동작구', code: '11590' },
    { name: '관악구', code: '11620' },
    { name: '서초구', code: '11650' },
    { name: '강남구', code: '11680' },
    { name: '송파구', code: '11710' },
    { name: '강동구', code: '11740' }
];

function RealEstateTable() {
    const [data, setData] = useState([]);
    const [selectedDistrictCodes, setSelectedDistrictCodes] = useState([]); // Default to no districts selected
    const [priceRange, setPriceRange] = useState([0, 500000]); // Default price range from 0 to 500 million
    const [areaRange, setAreaRange] = useState([0, 200]); // Default area range from 0 to 200 square meters
    const [dateRange, setDateRange] = useState({ startDate: subMonths(new Date(), 1), endDate: new Date() });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/callApi');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                console.log('Raw JSON data:', jsonData);

                // Check for API limit exceeded error
                if (jsonData.some(item => JSON.parse(item).response.header.resultCode === '99')) {
                    throw new Error('API service request limit exceeded. Please try again later.');
                }

                const parsedData = jsonData.flatMap((item) => JSON.parse(item).response.body.items.item);
                console.log('Parsed data:', parsedData);
                setData(parsedData);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleAreaChange = (event, newValue) => {
        setAreaRange(newValue);
    };

    const handleDateRangeChange = (months) => {
        setDateRange({ startDate: subMonths(new Date(), months), endDate: new Date() });
    };

    const formatPrice = (value) => {
        if (value >= 10000) {
            return `${Math.floor(value / 10000)}억 ${value % 10000}만원`;
        }
        return `${value}만원`;
    };

        const handleDistrictChange = (event) => {
            const selectedCode = event.target.name;
            setSelectedDistrictCodes(prevState =>
                event.target.checked
                    ? [...prevState, selectedCode]
                    : prevState.filter(code => code !== selectedCode)
            );
        };

    const formatArea = (value) => `${value.toFixed(2)}㎡`;

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day);
    };

    const isWithinDateRange = (dateString) => {
        const date = new Date(dateString);
        return date >= dateRange[0].startDate && date <= dateRange[0].endDate;
    };

    // Filter the data based on the selected district code and the specified price/area ranges
    const filteredData = data.filter(item => {
        const price = parseInt(item.거래금액.replace(/,/g, ''), 10); // in 만원
        const area = parseFloat(item.전용면적);
        const dateString = `${item.년}-${item.월}-${item.일}`;

        const matchesDistrict = selectedDistrictCodes.includes(item.지역코드.toString());
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
        const matchesArea = area >= areaRange[0] && area <= areaRange[1];
        const matchesDate = isWithinDateRange(dateString);

        return matchesDistrict && matchesPrice && matchesArea && matchesDate;
    });

    console.log('Filtered data:', filteredData);

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Real Estate Transactions
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ marginBottom: 2 }}>
                <Typography gutterBottom>Districts:</Typography>
                <FormGroup row>
                    {districts.map((district) => (
                        <FormControlLabel
                            key={district.code}
                            control={
                                <Checkbox
                                    checked={selectedDistrictCodes.includes(district.code)}
                                    onChange={handleDistrictChange}
                                    name={district.code}
                                />
                            }
                            label={district.name}
                        />
                    ))}
                </FormGroup>
            </Box>
            <Box sx={{ marginBottom: 2 }}>
                <Typography gutterBottom>Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</Typography>
                <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={500000} // 0 to 50 billion won in 만원 units
                    step={1000} // 1000만원 steps
                    valueLabelFormat={formatPrice}
                />
            </Box>
            <Box sx={{ marginBottom: 2 }}>
                <Typography gutterBottom>Area Range: {formatArea(areaRange[0])} - {formatArea(areaRange[1])}</Typography>
                <Slider
                    value={areaRange}
                    onChange={handleAreaChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={200} // 200 square meters
                    step={1} // 1 square meter
                    valueLabelFormat={formatArea}
                />
            </Box>
            <Box sx={{ marginBottom: 2 }}>
                <Typography gutterBottom>Date Range:</Typography>
                <Box sx={{ display: 'flex', gap: '10px', marginBottom: 2 }}>
                    <Button variant="contained" onClick={() => handleDateRangeChange(1)}>1 Month</Button>
                    <Button variant="contained" onClick={() => handleDateRangeChange(3)}>3 Months</Button>
                    <Button variant="contained" onClick={() => handleDateRangeChange(6)}>6 Months</Button>
                </Box>
            </Box>
            <TransactionTable data={filteredData} />
        </Box>
    );
}

function TransactionTable({ data }) {
    const columns = React.useMemo(
        () => [
            {
                Header: '법정동',
                accessor: '법정동', // accessor is the "key" in the data
            },
            {
                Header: '아파트명',
                accessor: '아파트',
            },
            {
                Header: '매매가격',
                accessor: '거래금액',
                Cell: ({ value }) => parseInt(value.replace(/,/g, ''), 10).toLocaleString(), // Format price with commas
                sortType: (a, b) => {
                    const priceA = parseInt(a.original.거래금액.replace(/,/g, ''), 10);
                    const priceB = parseInt(b.original.거래금액.replace(/,/g, ''), 10);
                    return priceA > priceB ? 1 : -1;
                }
            },

            {
                Header: '전용면적',
                accessor: '전용면적',
            },
            {
                Header: '날짜',
                accessor: d => `${d.년}-${d.월}-${d.일}`, // Custom accessor for date
            },
        ],
        []
    );

    const tableInstance = useTable({ columns, data }, useSortBy);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        toggleSortBy,
        state: { sortBy }
    } = tableInstance;

    const handleSortClick = (columnId) => {
        const currentSort = sortBy.find(sort => sort.id === columnId);
        if (currentSort) {
            // Toggle between ascending and descending
            toggleSortBy(columnId, !currentSort.desc, false);
        } else {
            // Set ascending as the default sort order
            toggleSortBy(columnId, false, false);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table {...getTableProps()}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableCell {...column.getHeaderProps()}>
                                    <TableSortLabel
                                        active={column.isSorted}
                                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                                        onClick={() => handleSortClick(column.id)}
                                    >
                                        {column.render('Header')}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    const { key, ...cellProps } = cell.getCellProps();
                                    return (
                                        <TableCell {...cellProps}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default RealEstateTable;
