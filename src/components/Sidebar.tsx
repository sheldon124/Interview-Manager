import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '10px',  // Reduced padding to make the logo closer to the list
        boxSizing: 'border-box',
      }}
    >
      {/* Adjust logo size and position */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>  {/* Decreased bottom margin */}
        <img src="/logo.png" alt="Interview Manager Logo" style={{ width: '150px', height: 'auto' }} /> {/* Larger logo */}
      </Box>

      <List>
        <ListItem component={Link} to="/schedule-interview">
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Schedule Interview" />
        </ListItem>

        <ListItem component={Link} to="/upcoming-interviews">
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary="Upcoming Interviews" />
        </ListItem>

        <ListItem component={Link} to="/past-interviews">
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="Past Interviews" />
        </ListItem>

        <ListItem component={Link} to="/interviewees">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Interviewees" />
        </ListItem>

        <ListItem component={Link} to="/interviewers">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Interviewers" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
