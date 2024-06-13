import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import RealEstateTable from './RealEstateTable';

function Home() {
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
        <Box sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
                Welcome to the Real Estate Dashboard
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/dashboard">
                Go to Dashboard
            </Button>
            <Typography variant="h5" gutterBottom>
                Data from API:
            </Typography>
            <RealEstateTable data={data} />
        </Box>
    );
}

export default Home;
