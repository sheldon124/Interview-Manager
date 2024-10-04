import React from 'react';
import { Box, Typography } from '@mui/material';
import InterviewCard from './InterviewCard';

const InterviewList: React.FC = () => {
  const interviews = [
    {
      date: 'Wed 28',
      time: '09:00 - 09:30',
      duration: '30min',
      location: 'Online',
      participants: ['Peer', 'Leslie'],
    },
    {
      date: 'Thu 29',
      time: '11:15 - 11:45',
      duration: '30min',
      location: 'Online',
      participants: ['Olivia', 'Liam', 'Alban'],
    },
    {
      date: 'Fri 30',
      time: '15:20 - 16:20',
      duration: '1hr',
      location: 'WeWork Paris',
      participants: ['Product Demo Team'],
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: '20px' }}>
        Upcoming Interviews
      </Typography>

      {interviews.map((interview, index) => (
        <InterviewCard key={index} {...interview} />
      ))}
    </Box>
  );
};

export default InterviewList;
