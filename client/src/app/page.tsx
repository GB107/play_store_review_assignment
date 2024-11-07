"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Slider, FormControlLabel, Checkbox, Avatar, List, ListItem, ListItemText, ListItemAvatar, MenuItem, Select, TextField, SelectChangeEvent } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { v4 as uuidv4 } from 'uuid';


interface PieData {
  label: string;
  value: number;
}

function PieAnimation({ data }: { data: PieData[] }) {
  const [radius, setRadius] = useState(50);
  const [skipAnimation, setSkipAnimation] = useState(false);

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <PieChart
      height={300}
      series={[
        {
        data,
        innerRadius: radius,
        arcLabel: (params: { label?: string }) => params.label ?? '',
        arcLabelMinAngle: 20,
        },
      ]}
      skipAnimation={skipAnimation}
      />
      <FormControlLabel
      checked={skipAnimation}
      control={
        <Checkbox onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSkipAnimation(event.target.checked)} />
      }
      label="Skip Animation"
      labelPlacement="end"
      />
      <Typography id="input-radius" gutterBottom>
      Radius
      </Typography>
      <Slider
      value={radius}
      onChange={(e: Event, value: number | number[]) => setRadius(value as number)}
      valueLabelDisplay="auto"
      min={15}
      max={100}
      aria-labelledby="input-radius"
      />
    </Box>
  );
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState('bugs');
  interface Review {
    id: number;
    avatar: string;
    date: string;
    title: string;
    rating: number;
    snippet: string;
  }

  const [data, setData] = useState<Review[]>([]);
  const [updatedData, setUpdatedData] = useState<Review[]>([]);

  useEffect(() => {
    handleGetData();
  }, [selectedDate, selectedCategory]);

  const handleGetData = async () => { 
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dailyreviews?date=${selectedDate}&category=${selectedCategory}`);
    setData(response.data);
  };



  const pieData = [
    { label: "1 Star", value: data.filter((d) => d.rating === 1).length },
    { label: "2 Stars", value: data.filter((d) => d.rating === 2).length },
    { label: "3 Stars", value: data.filter((d) => d.rating === 3).length },
    { label: "4 Stars", value: data.filter((d) => d.rating === 4).length },
    { label: "5 Stars", value: data.filter((d) => d.rating === 5).length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 flex justify-center items-center">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-lg p-8">
        <Typography variant="h4" component="h1" align="center" color='black' gutterBottom>
          Review Insights
        </Typography>
        
        <div className="space-y-4 mb-6">
          <TextField
            type="date"
            value={selectedDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
            fullWidth
            label="Select Date"
            variant="outlined"
          />
          <Select
            value={selectedCategory}
            onChange={(e: SelectChangeEvent<string>) => setSelectedCategory(e.target.value as string)}
            fullWidth
            variant="outlined"
            label="Select Category"
          >
            <MenuItem value="bugs">Bugs</MenuItem>
            <MenuItem value="crashes">Crashes</MenuItem>
            <MenuItem value="praises">Praises</MenuItem>
            <MenuItem value="complaint">Complaint</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </div>

        <PieAnimation data={pieData} />
         
        <Typography variant="h5" component="h1" align="center" color='black' gutterBottom>
          Total Reviews:{data.length}
        </Typography>
        <List>
  {data.map((review) => (
    <ListItem key={uuidv4()} alignItems="flex-start"> {/* Use uuidv4 for unique keys */}
      <ListItemAvatar>
        <Avatar src={review.avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={review.title}
        secondary={
          <React.Fragment>
            <Typography component="span" variant="body2" color="textPrimary">
              {`${review.rating} Stars`}
            </Typography>
            {` — ${review.snippet}`}
          </React.Fragment>
        }
      />
    </ListItem>
  ))}
</List>
      </div>
    </div>
  );
}
