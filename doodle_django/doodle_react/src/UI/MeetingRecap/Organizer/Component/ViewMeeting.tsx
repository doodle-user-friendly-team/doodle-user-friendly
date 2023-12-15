import React, { ChangeEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//aggiunto l'import di alert e alertTitle
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Alert,
    AlertTitle,
  } from '@mui/material';

import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import DoneIcon from '@mui/icons-material/Done';

// aggiunto per invio email
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import Grid from '@mui/material/Grid';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ThumbsUpDown ,ThumbDown, ThumbUp } from '@mui/icons-material';

import {   
    Description as DescriptionIcon,
    LocationOn as LocationIcon,
    Event as EventIcon,
    AccessTime as AccessTimeIcon,
    AlternateEmail as AlternateEmailIcon,} from '@mui/icons-material';
    
import {
  Card,
  CardContent,
  Badge,
  Stack
} from '@mui/material';

import '../CSS/ViewMeeting.css';
import Tooltip from '@mui/material/Tooltip';
import { SuccessSave,SuccessDelete,FailedSave,FailedDelete } from './Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import{
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  } from '@mui/material';
  import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ca } from 'date-fns/locale';



//------------------------VARIABLES------------------------
const SCREEN_680PX = '(max-width:680px)';
const SCREEN_450PX = '(max-width:450px)';

//------------------------END-VARIABLES------------------------


//------------------------PROPS------------------------

interface InfoMeeting {
    id: number; //meeting_id
    title: string;
    description: string; 
    location: string;
    date: string; //data decisa dal creatore, default: "In fase di votazione"
    duration: number; //durata meeting
    period_start_date: string; //data inizio periodo 
    period_end_date: string; //data fine periodo 
    voting_deadline: string; //data fine votazione
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


//aggiunto per invio email
// PROP per SendEmailDialog
interface SendEmailDialog {
  onClose: () => void;
  isOpen: boolean;
  meetingId: number | null;
}


// PROP per FinalTimeSlotDialog
interface FinalTimeSlotDialog {
  details: InfoMeeting;
  onClose: () => void;
  onSaveChanges: (newData:InfoMeeting|null) => void;
  isOpen: boolean;
}



// Per PUT al backend dek meeting
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

// Per PATCH al backend del schedule pool
interface SchedulePoolData{
  pool_link: string;
  final_date: string;
}

// Per timeslot migliri
interface User{
  name: string;
  surname: string;
}
interface TimeSlotResponse{
  id: number;
  start_time: string;
  end_time: string;
  user: User; // nome della persona
  count_available: number;
  count_unavailable: number;
  count_maybe: number;
  score: number;
}


// Altri tipi
interface TimeSlot{
  id: number;
  start_time: string;
  end_time: string;
  user: string; // nome della persona
  available: number;
  unavailable: number;
  maybe_available: number;
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


function convertTimeSlotResponseToTimeSlot(timeSlot:TimeSlotResponse):TimeSlot{
  const user:string=timeSlot.user.name+" "+timeSlot.user.surname;
  const timeSlotData:TimeSlot={
    id: timeSlot.id,
    start_time: timeSlot.start_time,
    end_time: timeSlot.end_time,
    user: user,
    available: timeSlot.count_available,
    unavailable: timeSlot.count_unavailable,
    maybe_available: timeSlot.count_maybe,
  }
  return timeSlotData;
}

// Funzione per convertire l'oggetto InfoMeeting in SchedulePoolData
function convertInfoMeetingToSchedulePoolData(info:InfoMeeting):SchedulePoolData{
  const schedulePoolData:SchedulePoolData={
      pool_link: info.link,
      final_date: info.date,
  }
  return schedulePoolData;
}

// Funzione per formattare le date per la visualizzazione
function formatDates(date1: string, date2: string): string {
  const date1Obj = new Date(date1);
  const date2Obj = new Date(date2);

  const padStart = (value: number): string => value.toString().padStart(2, '0');

  const formattedDate1 = `${padStart(date1Obj.getDate())}/${padStart(date1Obj.getMonth() + 1)}/${date1Obj.getFullYear()}`;
  const formattedTime1 = `${padStart(date1Obj.getHours())}:${padStart(date1Obj.getMinutes())}`;

  const formattedDate2 = `${padStart(date2Obj.getDate())}/${padStart(date2Obj.getMonth() + 1)}/${date2Obj.getFullYear()}`;
  const formattedTime2 = `${padStart(date2Obj.getHours())}:${padStart(date2Obj.getMinutes())}`;

  if (date1Obj.toDateString() === date2Obj.toDateString()) {
    return `${formattedDate1}, ${formattedTime1} - ${formattedTime2}`;
  } else {
    return `${formattedDate1}, ${formattedTime1} - ${formattedDate2}, ${formattedTime2}`;
  }
}

function formatDate(date: string): string {
  const dateObj = new Date(date);

  const padStart = (value: number): string => value.toString().padStart(2, '0');

  const formattedDate = `${padStart(dateObj.getDate())}/${padStart(dateObj.getMonth() + 1)}/${dateObj.getFullYear()}`;
  const formattedTime = `${padStart(dateObj.getHours())}:${padStart(dateObj.getMinutes())}`;

  return `${formattedDate}, ${formattedTime}`;

}

//------------------------END-FUNCTION------------------------



// ------------------------DIALOG------------------------
// Dialog per visualizzare le informazioni del meeting
function ViewInfoDialog({ details, onClose, isOpen }: InfoDialog) {
    const TEXT = "In fase di votazione"
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
              <Typography variant="body1">{
                details.date ? formatDate(details.date) : TEXT
              }</Typography>
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
      if (editedDetails.title === details.title &&
          editedDetails.description === details.description &&
          editedDetails.location === details.location) {
        onSaveChanges(details);
        return;
      }

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



//aggiunto per invio email
// Dialog per inviare il link del meeting tramite email
function EmailDialog({ onClose, isOpen, meetingId }: SendEmailDialog) {

  const [inputValue, setInputValue] = useState<string>('');
  const [inputEmailArray, setInputEmailArray] = useState<string[]>([]);
  const [showSendAlert, setShowSendAlert] = useState(false)
  const [errorAlert, setErrorAlert] = useState(false);
 

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorAlert(false)
    // Aggiorna lo stato del text field con il nuovo valore dell'input
    setInputValue(event.target.value);
    console.log("Il valore di setInputValue è: " + inputValue)
  };

  const onAddInputArray = () => {
    // Verifica che l'input non sia vuoto prima di aggiungerlo all'array
    if (inputValue.trim() !== '') {
      setInputEmailArray((prevArray) => [...prevArray, inputValue]);
      setInputValue(''); // Resetta il valore dell'input dopo l'aggiunta
    }
    console.log("Le email nell'array sono: " + [...inputEmailArray, inputValue]);
  };


  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleSendEmail = async () => {

    onAddInputArray()

    console.log("L'id del meeting è: " + meetingId);

    try {

      let arraySplitEmails: string[] = [];

      await new Promise<void>((resolve) => {
        setInputEmailArray((prevArray) => {
          // Divide ogni stringa nell'array in sottostringhe separate ogni volta che viene trovata una virgola, così prendo le email singolarmente
          // La combinazione di map e trim rimuove gli spazi prima e dopo le virgole a ciascuna sottostringa
          arraySplitEmails = prevArray.flatMap((email) => email.split(',').map(subEmail => subEmail.trim()));
          console.log("Array di email separate da virgola: " + arraySplitEmails);
          resolve(); // Risolve la Promise quando lo stato è stato aggiornato
          return [];
        });
      });

      if (arraySplitEmails.length === 0) {
        console.error('Nessuna email inserita.');
        setErrorAlert(true);
        return;
      }
      
      // Validazione delle email
      const areEmailsValid = arraySplitEmails.every(validateEmail);

      if (!areEmailsValid) {
        console.error('Una o più email non sono valide.');
        setErrorAlert(true);
        return;
      }

      console.log("Dati inviati:", JSON.stringify({ emails: arraySplitEmails }));

      const response = await fetch(`http://localhost:8000/send_link_by_email/${meetingId}/`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: arraySplitEmails,
        }),
      });
  
      if (response.ok) {
        console.log('Richiesta POST riuscita!');
        setShowSendAlert(true)
        setTimeout(() => {
          setShowSendAlert(false);
          onClose()
        }, 3000); // Chiudi l'alert dopo 3 secondi
      } else {
        console.error('Errore nella richiesta POST:', response.statusText);
      }
    } catch (error: any) {
      console.error('Errore nella richiesta POST:', error.message || 'Errore sconosciuto');
    }
    
  };


  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm" >
      <DialogTitle>
        <Typography variant='h5' align="center" style={{fontWeight:"bold" }}>
          Send the meeting link by email
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box className="box">
          <Typography>
            <p className='p'>Enter emails:</p>
          </Typography>
          <Grid container alignItems="left" spacing={2}>
            <Grid item>
              <AlternateEmailIcon fontSize="small" className='icon' />
            </Grid>
            <Grid item>
              <TextField
                multiline
                maxRows={4}
                onChange={onChangeInput}
                fullWidth
                style={{ width: '500px' }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="button-cancel">
          Close
        </Button>
        <Button onClick= {handleSendEmail} className='button-save'>
          Send
        </Button>
      </DialogActions>
      {showSendAlert && (
        <Alert severity="success" className='successAlert' style={{ width: '560px' }}>
            <AlertTitle>Success</AlertTitle>
            Successful e-mailing
        </Alert>
      )}
      {errorAlert && (
        <Alert severity="error" className='errorAlert' style={{ width: '560px' }}>
          <AlertTitle>Error</AlertTitle>
          One or more emails are invalid.
        </Alert>
      )}
    </Dialog>
    
  );
}





//Dialog per decidere il time slot finale
function FinalTimeSlot({ details, onClose, isOpen, onSaveChanges }: FinalTimeSlotDialog) {

  const getTimeSlots = async () => {
    try{
      const response = await axios.get<TimeSlotResponse[]>(`http://localhost:8000/api/v1/top_timeslots/${details.link}`);
      const transformedTimeSlots = response.data.map(convertTimeSlotResponseToTimeSlot);
      setTimeslots(transformedTimeSlots);
    }catch(err){
      console.error(err);
    }
  }

  useEffect(() => {
    getTimeSlots();
  }, []);
  
  const [timeslots, setTimeslots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot|null>(null);

  // Funzione per gestire la selezione del timeslot
  const handleSelectTimeSlot = (timeSlot:any) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Funzione per gestire la conferma
  const handleConfirm = () => {
    if (!selectedTimeSlot) {
      return;
    }
    saveDecision();
    onClose();
  };



  const saveDecision = async () => {
    try{

      // converte l'oggetto InfoMeeting in MeetinData
      if(!selectedTimeSlot) return;
      const updatedDetails = { ...details, date: selectedTimeSlot.start_time };

      const schedule_pool:SchedulePoolData=convertInfoMeetingToSchedulePoolData(updatedDetails);

      const response = await fetch(`http://localhost:8000/api/v1/schedule_pool/${schedule_pool.pool_link}`, {
          method: 'PATCH',
          headers: {
          'Content-Type': 'application/json',
          },
            body: JSON.stringify(
              {["final_date"]:schedule_pool.final_date}
            ),
          });

      if (response.ok) {
        onSaveChanges(updatedDetails);
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
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h4" align="center" style={{ fontWeight: 'bold' }}>
          Final timetable decision
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph style={{marginBottom:"10px"}}>
        {timeslots.length === 0
          ? 'There are no timeslots available.'
          : timeslots.length === 1
            ? 'You have only one timeslot available. Confirm it to finalize the decision.'
            : 'You have multiple timeslots available. Choose the one with the highest availability and confirm your decision.'}
        </Typography>
        <Box className="card-container">
          {timeslots&&timeslots.map((timeSlot, index) => (
            <Box key={index} mb={2} className={"card"}>
              <Card className={`card-not-selected ${selectedTimeSlot === timeSlot ? 'card-selected' : ''}`} >
                <CardContent className="card-content">
                  <Typography variant="h6" gutterBottom>
                    {timeSlot.user}
                  </Typography>
                  <Typography variant="h5" align="center" gutterBottom>
                    {formatDates(timeSlot.start_time, timeSlot.end_time)}
                  </Typography>
                  <Box display="flex" justifyContent="space-around" marginBottom={2}>
                    <Stack direction="row" alignItems="center">
                      <ThumbUp color="primary" style={{ marginRight: '7px' }} />
                      <Typography variant="body2" >
                        {timeSlot.available}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                      <ThumbsUpDown color="disabled" style={{ marginRight: '7px' }} />
                      <Typography variant="body2" >
                        {timeSlot.maybe_available}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                      <ThumbDown color="error" style={{ marginRight: '7px' }} />
                      <Typography variant="body2" >
                        {timeSlot.unavailable}
                      </Typography>
                    </Stack>
                  </Box>
                  <Button
                    className={selectedTimeSlot === timeSlot ? "selected-button" : "not-selected-button"}
                    disabled={selectedTimeSlot === timeSlot}
                    onClick={() => handleSelectTimeSlot(timeSlot)}
                  >
                    {selectedTimeSlot === timeSlot ? 'Selected' : 'Select'}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="button-exit">
          Close
        </Button>
        {/* Abilita il pulsante di conferma solo se è stato selezionato un timeslot */}
        <Button onClick={handleConfirm} className='button-save' disabled={!selectedTimeSlot}>
          Confirm
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

    //aggiunto per invio email
    const [emailDialogOpen, setEmailDialogOpen] = React.useState(false);

    const [decisions, setDecisions] = useState(false);


    const [successSave, setSuccessSave] = useState(false);
    const [failedSave, setFailedSave] = useState(false);

    const endVoting = () => {
      const today = new Date();
      const votingDeadline = new Date(info.voting_deadline);
      if (today > votingDeadline) 
        return true;
      else 
        return false;
    }
    const [endOfVoting, setEndOfVoting] = useState(endVoting());
    
    const checkDateDecided = () => {
      if (info.date != null) 
        return true;
      else 
        return false;
    }
    const [dateDecided, setDateDecided] = useState(checkDateDecided());


    const [isMenuOpen, setMenuOpen] = useState(false);
    const checkScreenSize = () => {
      if (endOfVoting || dateDecided)
        return SCREEN_680PX;
      else
        return SCREEN_450PX;
    }
    let isMobile=useMediaQuery(checkScreenSize());


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
        {isMobile ? (
        <IconButton
          onClick={() => setMenuOpen((prev) => !prev)}
          className='icon-button-more'
        >
          <MoreVertIcon style={{ color: '#FFFFFF' }} />
        </IconButton>
      ) : (
        <Box display="flex" alignItems="center">
          {
            endOfVoting&&
            <Tooltip title="End of voting">
             <Button variant="contained" className='icon-button-finish' onClick={()=>setDecisions(true)}>
              <Box display="flex" alignItems="center">
                <CheckCircleOutlineIcon className='icon-button-color-white'/>
                  <Typography variant="body2" className='icon-text-finish'>
                    Decide final date
                  </Typography>
              </Box>
              </Button>
            </Tooltip>
          }
          <Tooltip title="Info">
            <IconButton
              onClick={() => setInfoDialogOpen(true)}
              className='icon-button-info'
            >
              <InfoIcon style={{ color: '#FFFFFF' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => setEditDialogOpen(true)}
              className='icon-button-modify'
            >
              <EditIcon style={{ color: '#FFFFFF' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => setDeleteDialogOpen(true)}
              className='icon-button-delete'
            >
              <DeleteIcon style={{ color: '#FFFFFF' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy Link">
            <IconButton onClick={handleCopyLink} className='icon-button-link'>
              {linkCopied ? (
                <DoneIcon className='icon-button-color-white' />
              ) : (
                <LinkIcon className='icon-button-color-white' />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Send Link By Email">

            {/* aggiunto per invio email */}
            <IconButton onClick={() => setEmailDialogOpen(true)} style={{ borderRadius: '8px', backgroundColor: '#8e44ad', width: '40px', height: '40px',marginRight:'8px' }}>
                <AttachEmailIcon style={{ color: '#FFFFFF' }} />
            </IconButton>
          </Tooltip>
          
          {successSave && <SuccessSave onClose={()=>setSuccessSave(false)}/>}
          {failedSave && <FailedSave onClose={()=>setFailedSave(false)}/>}

        </Box>
      )}
      {/* Menu a tendina per le finestre più piccole */}
      {isMobile && (
          <Menu
            keepMounted
            open={isMenuOpen}
            onClose={() => setMenuOpen(false)}
          >
            {
              endOfVoting&&
              <MenuItem onClick={()=>setDecisions(true)}>
                <ListItemIcon>
                  <CheckCircleOutlineIcon style={{ color: '#FF9800' }} />
                </ListItemIcon>
                <ListItemText style={{fontWeight:"bold"}} primary="Decide final date" />
              </MenuItem>
            }
            <MenuItem onClick={() => {setMenuOpen(false);setInfoDialogOpen(true)}}>
              <ListItemIcon>
                <InfoIcon style={{ color: '#2196F3' }} />
              </ListItemIcon>
              <ListItemText primary="Info" />
            </MenuItem>
            <MenuItem onClick={() => {setMenuOpen(false);setEditDialogOpen(true)}}>
              <ListItemIcon>
                <EditIcon style={{ color: '#4CAF50' }} />
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </MenuItem>
            <MenuItem onClick={() => {setMenuOpen(false);setDeleteDialogOpen(true)}}>
              <ListItemIcon>
                <DeleteIcon style={{ color: '#F44336' }} />
              </ListItemIcon>
              <ListItemText primary="Delete" />
            </MenuItem>
            <MenuItem onClick={handleCopyLink}>
              <ListItemIcon>
                {linkCopied ? (
                <DoneIcon style={{ color: '#FF9800' }} />
                ) : (
                <LinkIcon style={{ color: '#FF9800' }} />
                )}
              </ListItemIcon>
              <ListItemText primary="Copy Link" />
            </MenuItem>
          </Menu>

      )}
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

        {/* aggiunto per invio email */}
        {emailDialogOpen && data && (
            <EmailDialog
                onClose={() => setEmailDialogOpen(false)}
                isOpen={emailDialogOpen}
                meetingId={data.id}
            />
        )}

        {decisions && data && (
          <FinalTimeSlot
              details={data!}
              onClose={() => setDecisions(false)}
              isOpen={decisions}
              onSaveChanges={handleSaveChanges}
          />
        )}
    </Box>
    );
}