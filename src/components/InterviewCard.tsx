import React from 'react';
import { Box, Typography, AvatarGroup, Avatar, Grid, Chip } from '@mui/material';

interface InterviewCardProps {
  date: string;
  time: string;
  duration: string;
  location: string;
  participants: string[];
}

const InterviewCard: React.FC<InterviewCardProps> = ({ date, time, duration, location, participants }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        marginBottom: '16px',
        borderRadius: '8px',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="body1" color="primary" gutterBottom>
            {date}
          </Typography>
          <Typography variant="body2">
            {time} | {duration}
          </Typography>
        </Grid>
        <Grid item>
          <Chip label={location} size="small" />
        </Grid>
      </Grid>

      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="body2" color="textSecondary">
            {participants.join(', ')}
          </Typography>
        </Grid>
        <Grid item>
          <AvatarGroup max={3}>
            {participants.map((participant) => (
              <Avatar key={participant} alt={participant} />
            ))}
          </AvatarGroup>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InterviewCard;
