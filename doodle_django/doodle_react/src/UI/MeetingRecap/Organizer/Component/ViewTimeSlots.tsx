
import {useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Paper} from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { format } from 'date-fns';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ThumbsUpDown ,ThumbDown, ThumbUp , AccessTime} from '@mui/icons-material';
//import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import '../CSS/ViewTimeSlots.css';
import {
  Scheduler,
  MonthView,
  Appointments,
  Toolbar,
  DateNavigator,
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';
// provate: npm install @devexpress/dx-react-core @devexpress/dx-react-scheduler @devexpress/dx-react-scheduler-material-ui



//--------------------------VARIABILI GLOBALI--------------------------------
var START_MEETING=new Date();
var END_MEETING=new Date();
const UNAVAILABLE = "Unavailable";
const MAYBE_AVAILABLE = "Maybe available";
const AVAILABLE = "Available";
//--------------------------FINE VARIABILI GLOBALI--------------------------------


//--------------------------FUNZIONI UTILI--------------------------------

// funzione che gli passi un giorno, lei ti restituisce i timeslot di quel giorno
function getTimeslotsByDay(timeslots: MyTimeSlot[], date: Date) {
  const timeslotsByDay: MyTimeSlot[] = [];
  timeslots.forEach((timeslot) => {
    const start = new Date(timeslot.startDate);
    if(start.getDate() === date.getDate() && start.getMonth() === date.getMonth() && start.getFullYear() === date.getFullYear()){
      timeslotsByDay.push(timeslot);
    }
  });
  return timeslotsByDay;
}


const formatDate = (thisDate: Date|null|"", formato:boolean) => {
  if (thisDate==null || thisDate=="") return '';

  if(formato){
    return format(thisDate, 'HH:mm');
  }else{
    return format(thisDate, 'dd/MM/yyyy');
  }
};


const preferenceIcons :{[key:string]:any }={
  'Available': <ThumbUp color="primary" />,
  'Unavailable': <ThumbDown color="error" />,
  'Maybe available': <ThumbsUpDown color="disabled" />,
};

export const getPreferenceIcon = (preference: string) => {
  return preferenceIcons[preference] || <ThumbsUpDown color="disabled" />;
};

// funzione che gli passi i timeslot e ti restituisce un oggetto con le preferenze divise per giorno
const countPreferencesByDay = (timeslots: MyTimeSlot[], type: string) => {
  const preferencesByDay: { [key: string]: number } = {};

  timeslots.forEach((timeslot) => {
    const dateKey = timeslot.startDate.toISOString().split('T')[0];

    if (preferencesByDay.hasOwnProperty(dateKey)) {
      if (type === AVAILABLE) {
        preferencesByDay[dateKey] += timeslot.count_available;
      }
      if (type === UNAVAILABLE) {
        preferencesByDay[dateKey] += timeslot.count_unavailable;
      }
      if (type === MAYBE_AVAILABLE) {
        preferencesByDay[dateKey] += timeslot.count_maybe;
      }
    }else{
      if (type === AVAILABLE) {
        preferencesByDay[dateKey] = timeslot.count_available;
      }
      if (type === UNAVAILABLE) {
        preferencesByDay[dateKey] = timeslot.count_unavailable;
      }
      if (type === MAYBE_AVAILABLE) {
        preferencesByDay[dateKey] = timeslot.count_maybe;
      }
    }
  });
  return preferencesByDay;
};


const countTimeslotsByDay = (timeslots:any) => {
  const timeslotsByDay: { [key: string]: number } = {};

  const availableByDay: { [key: string]: number } = countPreferencesByDay(timeslots, AVAILABLE);
  const unavailableByDay: { [key: string]: number } = countPreferencesByDay(timeslots, UNAVAILABLE);
  const maybeByDay: { [key: string]: number } = countPreferencesByDay(timeslots, MAYBE_AVAILABLE);

  timeslots.forEach((timeslot:MyTimeSlot) => {
    const dateKey = timeslot.startDate.toISOString().split('T')[0];

    if (timeslotsByDay.hasOwnProperty(dateKey)) {
      timeslotsByDay[dateKey]++;
    } else {
      timeslotsByDay[dateKey] = 1;
    }

  });
  const result = Object.entries(timeslotsByDay).map(([dateKey, count]) => ({
    title: count.toString(),
    startDate: new Date(dateKey),
    endDate: new Date(dateKey + 'T23:59:59'),
    id: dateKey,
    count_available: availableByDay[dateKey],
    count_unavailable: unavailableByDay[dateKey],
    count_maybe: maybeByDay[dateKey],
  }));
  return result;
};




const countPreferences = (listPreferences: MyPreference[] | undefined, type: string): number => {
  if (!listPreferences) {
    return 0;
  }
  return listPreferences.filter(pref => pref.preference === type).length;
};



const convertMeetingToMyMeetingTimeSlots = (meeting: Meeting): MyMeetingTimeSlots => {
  // Funzione di conversione per un singolo timeslot
  const convertTimeSlot = (timeSlot: TimeSlot): MyTimeSlot => ({
    id: timeSlot.id,
    startDate: new Date(timeSlot.start_time),
    endDate: new Date(timeSlot.end_time),
    title: timeSlot.user, 
    count_available: timeSlot.count_available,
    count_unavailable: timeSlot.count_unavailable,
    count_maybe: timeSlot.count_maybe,
  });

  // Converte le date di inizio e fine del meeting
  const startMeeting = new Date(meeting.start_meeting);
  const endMeeting = new Date(meeting.end_meeting);

  // Mappa i timeslots utilizzando la funzione di conversione
  const myTimeSlots = meeting.timeslots.map(convertTimeSlot);

  // Restituisce l'oggetto convertito
  return {
    start_meeting: startMeeting,
    end_meeting: endMeeting,
    timeslots: myTimeSlots,
  };
};

function convertPreferencesToMyTimeSlot(preferences: Preference[]): MyTimeSlotWithPreferences | null {
  if (preferences.length === 0) {
    return null;
  }

  const timeSlotId = preferences[0].time_slot; // Assuming all preferences have the same time_slot
  const myPreferences: MyPreference[] = preferences.map(pref => ({
    id: pref.id,
    preference: pref.preference,
    name_user: `${pref.user.name} ${pref.user.surname}`,
  }));

  return {
    id: timeSlotId,
    preferences: myPreferences,
  };
}


const convertTimeSlotWithPreferencesToMyTimeSlotWithPreferences = (
  timeSlotWithPreferences: TimeSlotWithPreferences | undefined): MyTimeSlotWithPreferences | undefined => {
  // Verifica se timeSlotWithPreferences è undefined o null
  if (!timeSlotWithPreferences) {
    return undefined;
  }

  // Assicurati che preferences sia definito e sia un array prima di chiamare map
  const myPreferences = Array.isArray(timeSlotWithPreferences.preferences)
    ? timeSlotWithPreferences.preferences.map((preference) => ({
        id: preference.id,
        preference: preference.preference,
        name_user: `${preference.user?.name} ${preference.user?.surname}`,
      }))
    : [];

  // Restituisci l'oggetto convertito solo se preferences è un array definito
  return {
    id: timeSlotWithPreferences.id,
    preferences: myPreferences,
  };
};


//--------------------------FINE FUNZIONI UTILI--------------------------------

//--------------------------PROPRIETA'--------------------------------

// MIE Interfacce
interface MyTimeSlot{
  id: number;
  startDate: Date;
  endDate: Date;
  title: string //nome della persona
  count_available: number;
  count_unavailable: number;
  count_maybe: number;
}
interface MyTimeSlotWithPreferences{
  id: number; // id del timeslot
  preferences: MyPreference[];
}
interface MyPreference{
  id: number;
  preference: string;
  name_user: string;
}
interface MyMeetingTimeSlots{
  start_meeting:Date;
  end_meeting: Date;
  timeslots: MyTimeSlot[]
}


// INPUT componente principale
interface TimeSlot{
  id: number;
  start_time: string;
  end_time: string;
  user: string; // nome della persona
  count_available: number;
  count_unavailable: number;
  count_maybe: number;
}
interface Meeting{
  start_meeting:string;
  end_meeting: string
  timeslots: TimeSlot[]
}

// Richiesta HTTP per Preferences
interface TimeSlotWithPreferences{
  id: number;
  start_time: string;
  end_time: string;
  schedule_pool: number;
  user: User;
  preferences: Preference[];
}

interface Preference{
  id: number;
  preference: string;
  time_slot: number
  user: User;
}
interface User{
  id: number;
  name: string;
  surname: string;
  email: string;
}


// PROPS PER COMPONENTI CUSTOM

interface PropAppointment{
  onClick: (data: any) => void;
  data: any;
}
interface PropDialogPreferences{
  isOpen: boolean;
  handleClose: () => void;
  timeslot: MyTimeSlot;
  preferences: MyPreference[];
}
interface PropDialog{
  isOpen: boolean;
  handleClose: () => void;
  timeslots: MyTimeSlot[];
}
interface PropCustomAppointments{
  timeslots: MyTimeSlot[];
}
//--------------------------FINE PROPRIETA'--------------------------------

//--------------------------COMPONENTI-CONST--------------------------------
const CustomAppointment = ({onClick, data }:PropAppointment) => {
  
  return (
    <Paper
      elevation={3}
      onClick={() => onClick(data)}
      className='paper-app'
    >
      <div className='first-block'>
        <Avatar className='avatar-app'>
          <AccessTime style={{ color: '#7AC3C0', fontSize: '22px' }} />
        </Avatar>
        <Typography className='title-text'>
          {data.title}
        </Typography>
      </div>
      <div className='second-block'>
        <div className='count-block'>
          <ThumbUp color='primary' style={{fontSize: '16px' }} />
          <Typography className='count-text'>
            {data.count_available}
          </Typography>
        </div>
        <div className='count-block'>
          <ThumbsUpDown color='disabled' style={{ fontSize: '16px' }} />
          <Typography className='count-text'>
            {data.count_maybe}
          </Typography>
        </div>
        <div className='count-block'>
          <ThumbDown color='error' style={{fontSize: '16px' }} />
          <Typography className='count-text'>
            {data.count_unavailable}
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

// componente che mi permette di colorare i giorni in cui si può fare la riunione  
const RangeMeeting = (props:any) => {
  const cellDate = props.startDate;
  const isInRange = (
    cellDate.getFullYear() >= START_MEETING.getFullYear() && cellDate.getFullYear() <= END_MEETING.getFullYear() &&
    cellDate.getMonth() >= START_MEETING.getMonth() && cellDate.getMonth() <= END_MEETING.getMonth() &&
    cellDate.getDate() >= START_MEETING.getDate() && cellDate.getDate() <= END_MEETING.getDate() 
  ); 
  return ( 
    <>
    <MonthView.TimeTableCell 
      {...props} 
      style={{  backgroundColor: isInRange ? '#C5EBE9' : 'inherit' }}
    />
    </>
  );
  //borderColor:"#4C5E5D"
};

//--------------------------FINE COMPONENTI-CONST--------------------------------



//--------------------------COMPONENTI--------------------------------

//---CUSTOM DIALOG PREFERENCES---
function CustomDialogPreferences({ isOpen, handleClose, timeslot, preferences }:PropDialogPreferences) {


  return (
    <>
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle style={{ textAlign: 'center' }}>
        <Typography variant="h4" style={{ marginBottom: 4 }}>
          {`Time: ${formatDate(timeslot.startDate, true)} - ${formatDate(timeslot.endDate, true)}`}
        </Typography>
        <Typography variant="caption" align="center">
          {timeslot.title}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
          <Button color="primary" variant="contained">
            <ThumbUp style={{ marginRight: 5 }} />
            {countPreferences(preferences,AVAILABLE)}
          </Button>
          <Button style={{ backgroundColor: '#a0a0a0' }} variant="contained">
            <ThumbsUpDown style={{ marginRight: 5 }} />
            {countPreferences(preferences,MAYBE_AVAILABLE)}
          </Button>
          <Button color="error" variant="contained">
            <ThumbDown style={{ marginRight: 5 }} />
            {countPreferences(preferences,UNAVAILABLE)}
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent style={{ paddingBottom: 16, paddingLeft: 16, paddingRight: 16, paddingTop: 0, overflowY: 'auto', maxHeight: 400 }}>
      <List>
        {preferences&&preferences.map((preference: MyPreference) => (
          <ListItem
            key={preference.id}
            className='list-item-pref'
          >
            <Icon color="primary" style={{ marginRight: 8 }}>
              {getPreferenceIcon(preference.preference)}
            </Icon>
            <ListItemText
              primary={preference.name_user}
              secondary={`${preference.preference}`}
            />
          </ListItem>
        ))}
      </List>
    </DialogContent>
    </Dialog>
    </>

  );
}


//---CUSTOM DIALOG TIMESLOTS---
function CustomDialogTimeSlots ({ isOpen, handleClose, timeslots }:PropDialog) {
  const [selectedTimeslot, setSelectedTimeslot] = useState<MyTimeSlot | null>(null);
  const [preferences, setPreferences] = useState<{ [id: number]: MyPreference[] }>({});
  

  //Chiamata al server per farmi dare le preferenze dei vari timeslot
  useEffect(() => {
    const fetchData = async () => {
      try {
        for (const timeslot of timeslots) {
          const response = await axios.get<Preference[]>(`http://localhost:8000/api/v1/votes/timeslot/${timeslot.id}`);

          const responseData: Preference[] = response.data;
          // Converte il timeslot con le preferenze in un oggetto di tipo MyTimeSlotWithPreferences
          const timeslotPreferences = convertPreferencesToMyTimeSlot(responseData);
  
          if (!timeslotPreferences) {
            console.log(`Il timeslot ${timeslot.id} non ha preferenze`);
            continue;
          }
  
          // Aggiorna l'array di preferenze associato all'id del timeslot
          setPreferences((prevArray) => {
            return { ...prevArray, [timeslot.id]: timeslotPreferences.preferences };
          });
        }
      } catch (error) {
        console.error('Errore nella richiesta HTTP:', error);
      }
    };
  
    fetchData();

  }, [timeslots]); // Si include timeslots nell'array delle dipendenze di useEffect 



  


  const handleItemClick = (timeslot: MyTimeSlot) => {
    setSelectedTimeslot(timeslot);
  };
  const handleCloseDialog = () => {
    setSelectedTimeslot(null);
  };
  



  // Calcolo data
  const getDate = () => {
    if (timeslots.length === 0) {
      return "";
    }
    const firstTimeslot = timeslots[0];
    return firstTimeslot.startDate;
  }
  // Calcolo nome giorno
  const getDayName = (date: Date|"") => {
    if (date=="") return '';
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const dayIndex = date.getDay();
    return days[dayIndex];
  };




  const date = getDate();

  return (
    <>
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle style={{ textAlign: 'center' }}>
        <Typography variant="h4" style={{ marginBottom: 8 }}>
          {getDayName(date)}
        </Typography>
        <Typography variant="caption" align="center">
          {formatDate(date, false)}
        </Typography>
      </DialogTitle>
      <DialogContent style={{ padding: 16, overflowY: 'auto', maxHeight: 400 }}>
        <List>
          {timeslots&&timeslots.map((timeslot: MyTimeSlot) => (
            <ListItem
              key={timeslot.id}
              onClick={() => handleItemClick(timeslot)}
              className='list-item-timeslot'
            >
              <ListItemText
                primary={timeslot.title}
                secondary={`${formatDate(timeslot.startDate, true)} - ${formatDate(timeslot.endDate, true)}`}
              />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 16 }}>
                  <ListItemIcon>
                    {getPreferenceIcon(AVAILABLE)}
                  </ListItemIcon>
                  <Typography variant="caption">
                    {countPreferences(preferences[timeslot.id],AVAILABLE)}
                  </Typography>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 16 }}>
                  <ListItemIcon>
                    {getPreferenceIcon(MAYBE_AVAILABLE)}
                  </ListItemIcon>
                  <Typography variant="caption">
                    {countPreferences(preferences[timeslot.id],MAYBE_AVAILABLE)}
                  </Typography>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ListItemIcon>
                    {getPreferenceIcon(UNAVAILABLE)}
                  </ListItemIcon>
                  <Typography variant="caption">
                    {countPreferences(preferences[timeslot.id],UNAVAILABLE)}
                  </Typography>
                </div>
              </div>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
    {// controllo se devo aprire il dialog
      selectedTimeslot!=null &&
      <CustomDialogPreferences isOpen={selectedTimeslot!=null} handleClose={handleCloseDialog} timeslot={selectedTimeslot} preferences={preferences[selectedTimeslot.id]}/>}
    </>
    
  );
};


// CUSTOM APPOINTMENTS
function CustomAppointments ({ timeslots }:PropCustomAppointments) {

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeslots, setSelectedTimeslots] = useState<MyTimeSlot[]>([]);

  const handleAppointmentClick = (data: any) => {
    setDialogOpen(true);
    setSelectedDate(data);
    const dayTimeslots = getTimeslotsByDay(timeslots, data.startDate);
    setSelectedTimeslots(dayTimeslots);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Appointments
        appointmentComponent={(props:any) => <CustomAppointment {...props} onClick={handleAppointmentClick} />}
      />
      {// controllo se devo aprire il dialog
        selectedDate!=null &&
        <CustomDialogTimeSlots isOpen={isDialogOpen} handleClose={handleCloseDialog} timeslots={selectedTimeslots}/>}
    </>
  );

  };

//--------------------------FINE COMPONENTI--------------------------------








// INPUT questo componente:
// Un oggetto Meeting, che contiene:
//  - start_meeting: STRING, data di inizio della riunione
//  - end_meeting: STRING, data di fine della riunione
//  - timeslots: ARRAY di oggetti TimeSlot, che contiene:
//    - id: INT, id del timeslot
//    - start_time: STRING, data di inizio del timeslot
//    - end_time: STRING, data di fine del timeslot
//    - user: STRING, nome della persona
//    - count_available: INT, numero di persone che hanno votato disponibile
//    - count_unavailable: INT, numero di persone che hanno votato non disponibile
//    - count_maybe: INT, numero di persone che hanno votato forse disponibile

// RISPETTARE QUESTO FORMATO PER PASSARE I DATI A QUESTO COMPONENTE*
export function ContainerTimeSlots(meeting: Meeting) {

  const myMeetingTimeSlots = convertMeetingToMyMeetingTimeSlots(meeting);
  
  START_MEETING=myMeetingTimeSlots.start_meeting;
  END_MEETING=myMeetingTimeSlots.end_meeting;
  const countTimeSlots=countTimeslotsByDay(myMeetingTimeSlots.timeslots);
  
  return (
    <Scheduler data={countTimeSlots}>
      <ViewState/>
      <Toolbar />
      <DateNavigator/>
      <MonthView timeTableCellComponent={RangeMeeting}/>
      <CustomAppointments  timeslots={myMeetingTimeSlots.timeslots}/>
    </Scheduler>
  );
};
//todo: ottimizzare il css, creando un file apposito
//todo: ottimizzare il calcolo del numero di tipi di preferenze poichè viene fatto più volte



