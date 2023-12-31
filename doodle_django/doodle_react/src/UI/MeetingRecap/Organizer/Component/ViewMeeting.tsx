import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
  } from '@mui/material';

import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import DoneIcon from '@mui/icons-material/Done';
import {   
    Description as DescriptionIcon,
    LocationOn as LocationIcon,
    Event as EventIcon,
    AccessTime as AccessTimeIcon, } from '@mui/icons-material';
import '../CSS/ViewMeeting.css';
import { SuccessSave,SuccessDelete,FailedSave,FailedDelete } from './Alert';




//------------------------PROPS------------------------

interface InfoMeeting {
    id: number; //meeting_id
    title: string;
    description: string; 
    location: string;
    date: string; //data decisa dal creatore, default: "In fase di votazione"
    duration: number; //durata meeting
    period_start_date: string; //data inizio periodo votazione
    period_end_date: string; //data fine periodo votazione
    organizer_link: string; // link per l'organizzatore
    link: string; //link per i partecipanti
    user: number; //user_id
}


// PROP per InfoDialog
interface InfoDialog {
    details: InfoMeeting;
    onClose: () => void;
    isOpen: boolean;
}

// PROP per EditDialog
interface EditDialog {
    details: InfoMeeting;
    onClose: () => void;
    onSaveChanges: (newData:InfoMeeting|null) => void;
    isOpen: boolean;
}

// PROP per DeleteDialog
interface DeleteDialog {
    link: string;
    onClose: () => void;
    isOpen: boolean;
}


// Per PUT al backend
interface MeetingData{
    name: string;
    description: string; 
    location: string;
    period_start_date: string; 
    period_end_date: string;
    duration: number;
    organizer_link: string;
    user: number;
}

//------------------------END-PROPS-----------------------

// ------------------------FUNCTION------------------------

// Funzione per convertire l'oggetto InfoMeeting in MeetinData
function convertInfoMeetingToMeetingData(info:InfoMeeting):MeetingData{
    const meetingData:MeetingData={
        name: info.title,
        description: info.description, 
        location: info.location,
        period_start_date: info.period_start_date, 
        period_end_date: info.period_end_date,
        duration: info.duration,
        organizer_link: info.organizer_link,
        user: info.user,
    }
    return meetingData;
}

//------------------------END-FUNCTION------------------------

// ------------------------DIALOG------------------------
// Dialog per visualizzare le informazioni del meeting
function ViewInfoDialog({ details, onClose, isOpen }: InfoDialog) {
    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm" >
          <DialogTitle>
            <Typography variant='h4' align="center" style={{fontWeight:"bold" }}>
              {details.title}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box className="dataBox">
              <Typography variant="h6">
                <DescriptionIcon fontSize="small" className='icon'/> <p className='p'>Description:</p>
              </Typography>
              <Typography variant="body1">{details.description}</Typography>
            </Box>
            <Box className="dataBox">
              <Typography variant="h6">
                <LocationIcon fontSize="small" className='icon'/> <p className='p'>Location:</p>
              </Typography>
              <Typography variant="body1">{details.location}</Typography>
            </Box>
            <Box className="dataBox">
              <Typography variant="h6">
                <EventIcon fontSize="small" className='icon' /> <p className='p'>Date:</p>
              </Typography>
              <Typography variant="body1">{details.date}</Typography>
            </Box>
            <Box className="dataBox">
              <Typography variant="h6">
                <AccessTimeIcon fontSize="small" /> <p className='p'>Duration:</p>
              </Typography>
              <Typography variant="body1">{details.duration>1 ?`${details.duration} minute` : `${details.duration} minutes`}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} className="button-exit">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      );
}
  


// Dialog per modificare le informazioni del meeting
function ModifyDialog({ details, onClose, isOpen ,onSaveChanges}: EditDialog) {
  const [editedDetails, setEditedDetails] = useState<InfoMeeting>({ ...details });

  const handleInputChange = (field: keyof InfoMeeting, value: string) => {
    // controlla che il campo sia valido
    if (!['title', 'description', 'location'].includes(field)) {
      return;
    }
    // controlla se stiamo modificando il title non deve essere vuoto e non deve superare i 50 caratteri
    if (field === 'title' && (value === '' || value.length > 50)) {
      return;
    }
    // controlla se stiamo modificando la description non deve superare i 500 caratteri
    if (field === 'description' && value.length > 500) {
      return;
    }
    // controlla se stiamo modificando la location non deve superare i 50 caratteri
    if (field === 'location' && value.length > 50) {
      return;
    }

    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };


  const handleSaveChanges = async () => {
    try{
      // controlla se effettivamente è cambiato qualcosa
      /*if (editedDetails.title === details.title &&
          editedDetails.description === details.description &&
          editedDetails.location === details.location) {
        onSaveChanges(details);
        return;
      }*/

      // converte l'oggetto InfoMeeting in MeetinData
      const meetingData:MeetingData=convertInfoMeetingToMeetingData(editedDetails);

      const response = await fetch(`http://localhost:8000/api/v1/meetings/details/${meetingData.organizer_link}`, {
          method: 'PUT',
          headers: {
          'Content-Type': 'application/json',
          },
            body: JSON.stringify(meetingData),
          });

      if (response.ok) {
        onSaveChanges(editedDetails);
      } else {
        console.error('Error '+response.status+'\nImpossibile salvare i dati nel database: '+response.statusText);
        onSaveChanges(null);
      }

    }catch(err){
      console.error(err);
      onSaveChanges(null);
      return;
    }
  };

  return (
    <>
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant='h4' align="center" style={{fontWeight:"bold", marginBottom:"10px" }}>
          Edit Meeting Details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TextField
            label="Title"
            fullWidth
            value={editedDetails.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Description"
            fullWidth
            value={editedDetails.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Location"
            fullWidth
            value={editedDetails.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className='button-cancel'>Cancel</Button>
        <Button onClick={handleSaveChanges} className='button-save'>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

    
//Dialog per eliminare il meeting          
function DeleteDialog({ link, isOpen, onClose }: DeleteDialog) {
    const navigate = useNavigate();


    const handleDelete = async () => {
      //todo: implementa alert conferma eliminazione
        try{
            const response = await fetch(`http://localhost:8000/api/v1/meetings/details/${link}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Meeting eliminato con successo');
                navigate('/');
            } else {
                console.error('Error '+response.status+'\nImpossibile eliminare i dati nel database: '+response.statusText);
            }
        }catch(err){
            console.error(err);
        }
    }

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            <Typography variant='h4' align="center" style={{fontWeight:"bold" }}>
              Delete Meeting
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" align="center">
              Are you sure you want to delete this meeting?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} className="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleDelete}  className="button-delete">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      );
}


// ------------------------END-DIALOG------------------------










export function ContainerTitle(info:InfoMeeting) {
    const [data, setData] = useState<InfoMeeting>(info);
    const [infoDialogOpen, setInfoDialogOpen] = React.useState(false);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [linkCopied, setLinkCopied] = React.useState(false);

    const [successSave, setSuccessSave] = useState(false);
    const [failedSave, setFailedSave] = useState(false);


    const handleCopyLink = () => {
        // Copia il link nella clipboard
        const linkToCopy = 'https://localhost:3000/meeting/'+data.link;
        navigator.clipboard.writeText(linkToCopy);
        setLinkCopied(true);
        setTimeout(() => {setLinkCopied(false);}, 2500);
      };

    const handleSaveChanges = (newData:InfoMeeting|null) => {
      setEditDialogOpen(false);

      // Se da errore mostra un alert di mancato salvataggio
      if (!newData) {
          setFailedSave(true);
          return;
      }

      //console.log('Arrivate al componente principale:', newData);
      
      setData(newData);
      setSuccessSave(true);
    }



    return (
    <Box display="flex" justifyContent="space-between" >
        <Box marginLeft="2%" display="flex" alignItems="center">
            <Typography variant="h5" style={{fontWeight:"bold" }}>
                {data.title}
            </Typography>
        </Box>
        <Box display="flex" alignItems="center">
            <IconButton onClick={() => setInfoDialogOpen(true)} style={{ borderRadius: '8px', backgroundColor: '#4CAF50', width: '40px', height: '40px', marginRight:'8px' }}>
                <InfoIcon style={{ color: '#FFFFFF' }} />
            </IconButton>
            <IconButton onClick={() => setEditDialogOpen(true)} style={{ borderRadius: '8px', backgroundColor: '#2196F3', width: '40px', height: '40px', marginRight:'8px' }}>
                <EditIcon style={{ color: '#FFFFFF' }} />
            </IconButton>
            <IconButton onClick={() => setDeleteDialogOpen(true)} style={{ borderRadius: '8px', backgroundColor: '#F44336', width: '40px', height: '40px',marginRight:'8px' }}>
                <DeleteIcon style={{ color: '#FFFFFF' }} />
            </IconButton>
            <IconButton onClick={handleCopyLink} style={{ borderRadius: '8px', backgroundColor: '#DAA520', width: '40px', height: '40px', marginRight:'8px' }}>
              {linkCopied ? (
                <DoneIcon style={{ color: '#FFFFFF' }} />
              ) : (
                <LinkIcon style={{ color: '#FFFFFF' }} />
              )}
            </IconButton>
            {successSave && <SuccessSave onClose={()=>setSuccessSave(false)}/>}
            {failedSave && <FailedSave onClose={()=>setFailedSave(false)}/>}
        </Box>
        {infoDialogOpen && data && (
            <ViewInfoDialog
                details={data!}
                onClose={() => setInfoDialogOpen(false)}
                isOpen={infoDialogOpen}
            />
        )}
        {editDialogOpen && data && (
            <ModifyDialog
                details={data!}
                onClose={() => setEditDialogOpen(false)}
                isOpen={editDialogOpen}
                onSaveChanges={handleSaveChanges}
            />
        )}
        {deleteDialogOpen && data.id &&(
            <DeleteDialog
                link={data.organizer_link}
                onClose={() => setDeleteDialogOpen(false)}
                isOpen={deleteDialogOpen}
            />
        )}
    </Box>
    );
}