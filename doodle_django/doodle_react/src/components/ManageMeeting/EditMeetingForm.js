import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(grey[600]),
  backgroundColor: grey[600],
  "&:hover": {
    backgroundColor: grey[700],
  },
}));

const EditFormDialog = ({ open, onClose, data, onSubmit }) => {
  const [editedData, setEditedData] = useState({ ...data });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleFormSubmit = () => {
    onSubmit(editedData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Meeting</DialogTitle>
      <DialogContent>
        <TextField
          label="Meeting Title"
          name="title"
          value={editedData.title}
          onChange={handleInputChange}
          fullWidth
        />
        {/* Add more fields as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <ColorButton onClick={handleFormSubmit}>Save</ColorButton>
      </DialogActions>
    </Dialog>
  );
};

const Manage = ({ news, data }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleEditFormSubmit = (editedData) => {
    // Perform axios request to update the meeting data
    // ...

    // Handle the updated data as needed
    console.log("Edited Data: ", editedData);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  // ... (other code)

  return (
    <div className="CreateGroup">
      {/* ... (other code) */}
      <div style={{ textAlign: "end" }}>
        <ColorButton
          style={{ margin: 20, textAlign: "end" }}
          onClick={handleEditClick}
          variant="contained"
        >
          Edit
        </ColorButton>
      </div>

      {/* Edit Form Dialog */}
      <EditFormDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        data={data}
        onSubmit={handleEditFormSubmit}
      />
    </div>
  );
};

export default Manage;
