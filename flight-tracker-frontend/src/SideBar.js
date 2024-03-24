// In src/Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

const Sidebar = ({ open, toggleDrawer }) => {
    return (
        <React.Fragment>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2, display: { sm: 'none' } }}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
            >
                <List>
                    {/* List of navigation items */}
                    <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
                        <ListItemText primary="Home" />
                    </ListItem>
                    {/* Add more items here */}
                </List>
            </Drawer>
        </React.Fragment>
    );
};

export default Sidebar;
