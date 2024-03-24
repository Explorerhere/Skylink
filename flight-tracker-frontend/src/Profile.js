import React, { useState } from 'react';
import { useAuth ,setAuthInfo} from './AuthContext';
import { TextField, Button, Box } from '@mui/material';

function Profile() {
    const { user, setAuthInfo } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState({
        name: user?.name || '',
        email: user?.email || '', // Assuming email is part of the user object
        // Add more fields as needed
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };
    

    const handleSaveChanges = () => {
        // Implement the save changes functionality here
        // This might involve making an API request to update the user information
        // and then updating the context with the new user information
        console.log('Save changes not implemented.');
        // After updating, you could call something like:
        // setAuthInfo({ ...authState, user: updatedUser });
        setEditMode(false);
    };

    // Toggle edit mode without making changes
    const handleCancel = () => {
        setEditMode(false);
        setEditedUser({ name: user?.name || '', email: user?.email || '' });
    };

    if (!user) {
        return <Box>Loading...</Box>;
    }

    return (
        <Box sx={{ mt: 4 }}>
            <h2>Profile</h2>
            {editMode ? (
                <Box component="form" autoComplete="off">
                    <TextField
                        label="Name"
                        variant="outlined"
                        name="name"
                        value={editedUser.name}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        name="email"
                        value={editedUser.email}
                        onChange={handleChange}
                        margin="normal"
                        // Consider making email read-only if users can't change it
                    />
                    {/* Add more fields as needed */}
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                        <Button variant="outlined" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>phoneNumber:{user.phonenumber}</p>
                    {/* Display other user information */}
                    <Button variant="contained" onClick={() => setEditMode(true)}>
                        Edit Profile
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default Profile;
