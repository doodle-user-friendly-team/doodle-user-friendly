// import React, { useState } from 'react';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogTitle from '@mui/material/DialogTitle';
// import '../CSS/style.css';
// import { TextField } from '@mui/material';

// const ModifyDialog: React.FC = () => {
//   const [open, setOpen] = useState(false);
//   const [place, setPlace] = useState("place"); //questo valore lo devo prendere dal db
//   const [description, setDescription] = useState("description"); //questo valore lo devo prendere dal db
//   const [title, setTitle] = useState("title"); //questo valore lo prende dal db
//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     console.log("NON SALVA NUOVI DATI DB")
//     setOpen(false);
//   };

//   const handleYes= () => {
    
//     console.log("SALVA NUOVI DATI DB")
//     setOpen(false);
//   };

//   const handlePlaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPlace(event.target.value);
//   };

//   const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setDescription(event.target.value);
//   };

//   const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setTitle(event.target.value);
//   };

//   return (
//     <>
//       <Button
//         variant="contained"
//         onClick={handleClickOpen}
//         className="submitButton"
//       >
//        Modify
//       </Button>
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
     
       
//       >
//         <DialogTitle id="alert-dialog-title">{"Edit Meeting"}</DialogTitle>
        
//         <TextField
//              id="outlined-read-only-input"
//              label="Title"
//              value={title}
//              onChange={handleTitleChange}
//              style={{ width: '80%', marginBottom: '8px' ,margin: 'auto' }}
//           />
//            <br />
//         <TextField
//             id="outlined-read-only-input"
//             label="Description"
//             value={description}
//             onChange={handleDescriptionChange}
//             style={{ width: '80%', marginBottom: '8px' ,margin: 'auto' }}
//           />
//           <br />

//         <TextField
//             id="outlined-read-only-input"
//             label="Place"
//             value={place}
//             onChange={handlePlaceChange}
//             style={{ width: '80%', marginBottom: '8px' ,margin: 'auto' }}
//             />
//     <br/>
//         <DialogActions>
//           <Button  color="error" variant="contained" onClick={handleClose}>No</Button>
//           <Button   variant="contained" onClick={handleYes} autoFocus>
//             Save
//           </Button>
//         </DialogActions>


       
//       </Dialog>
//     </>
//   );
// };

// export default ModifyDialog;
export {}