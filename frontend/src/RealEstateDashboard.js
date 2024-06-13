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
    Grid,
    Box,
    styled
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


// Styled component for table
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: theme.spacing(4),
}));

function AveragePriceChart({ data }) {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (!data || data.length === 0) {
            console.warn('No data provided');
            return;
        }

        // Calculate average transaction price by area
        const areaPriceMap = {};
        data.forEach(item => {
            const area = parseFloat(item.전용면적); // Convert to float for numerical sorting
            const price = parseInt(item.거래금액.replace(/,/g, ''), 10);
            if (!areaPriceMap[area]) {
                areaPriceMap[area] = { total: 0, count: 0 };
            }
            areaPriceMap[area].total += price;
            areaPriceMap[area].count += 1;
        });

        // Extract labels and average prices, then sort by area
        let combinedData = Object.keys(areaPriceMap).map(area => ({
            area: parseFloat(area),
            price: (areaPriceMap[area].total / areaPriceMap[area].count).toFixed(2)
        }));

        combinedData.sort((a, b) => a.area - b.area);

        const areaLabels = combinedData.map(item => item.area.toString());
        const avgPrices = combinedData.map(item => item.price);

        setChartData({
            labels: areaLabels,
            datasets: [
                {
                    label: 'Average Transaction Price',
                    data: avgPrices,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        });
    }, [data]);

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: '면적 (㎡)',  // x축 라벨
                },
            },
            y: {
                title: {
                    display: true,
                    text: '만원',  // y축 라벨
                },
            },
        },
    };

    return (
        chartData && (
            <div style={{ marginTop: '20px' }}>
                <Typography variant="h5" component="div" gutterBottom sx={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
                    Average Transaction Price by Area
                </Typography>
                <Bar data={chartData} options={options} />
            </div>
        )
    );
}

function RealEstateDashboard() {
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

    return (
        <Box sx={{ padding: '20px' }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>

                </Grid>
                <Grid item xs={12}>
                    <AveragePriceChart data={data} />
                </Grid>
            </Grid>
        </Box>
    );
}

export default RealEstateDashboard;
