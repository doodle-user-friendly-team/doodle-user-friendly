
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Container from '@mui/material/Container';
import { useState,useEffect,Component} from 'react';
import { async } from 'q';
import { log } from 'console';


/*
export function ContainerTopThree({meeting_id}:propContainerTopThree){

    const [cardData, setCardData] = useState<propTimeSlotDetails[]>([]);

    //const cardData: propTimeSlotDetails[] = [];

    
    /*const cardData = [
        { date: '2023-11-11', start: '10:00 AM', end: '12:00 PM', available: 5, maybe: 3, unavailable: 2 },
        { date: '2023-11-11', start: '10:00 AM', end: '12:00 PM', available: 5, maybe: 3, unavailable: 2 },
        { date: '2023-11-11', start: '10:00 AM', end: '12:00 PM', available: 5, maybe: 3, unavailable: 2 },
    ];
    useEffect(() => {
      const receivedData = async() => {
          try {
            const response = await fetch('http://localhost:8001/api/meeting/' + meeting_id + '/topthree/');
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            //const newData = data.map((timeSlot: propTimeSlotDetails) => timeSlot);
            console.log(data.length);
            console.log(data[0]);
            console.log(data[1]);
            console.log(data[2]);

            //cardData.push(data[0]);
            //cardData.push(data[1]);
            //cardData.push(data[2]);
            setCardData(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
      }
      cardData.length===0 && receivedData();
    }, [meeting_id]);

    //const colorCard = []
    const colorBadge = ['success', 'warning', 'error'];
    return(
      
      <Container>
            <Typography variant="h4" align="center" marginBottom={5} gutterBottom>
                I 3 migliori timeslot votati
            </Typography>
                <Typography variant="h6" align="center">
                    Nessun Time slot disponibile al momento.
                </Typography>
                <Grid2 container spacing={3} justifyContent="center">
                    {cardData.slice(0, 3).map((data, index) => (
                        <Grid2 key={index} component="div">
                            <CustomBadge 
                                badgeContent={index + 1} 
                                color={colorBadge[index] as any}
                            >
                                <TimeSlotDetails {...data} />
                            </CustomBadge>
                        </Grid2>
                    ))}
                </Grid2>
            )}
        </Container>
       


    )
                //                    

}*/


interface propContainerTopThree{
  meeting_id: number
}
interface ContainerTopThreeState {
  cardData: propTimeSlotDetails[];
}

interface state{
  propContainerTopThree: propContainerTopThree
  cardData: propTimeSlotDetails[]
}

export class ContainerTopThree extends Component<propContainerTopThree, state> {

  cardDataInput: propTimeSlotDetails[] = [];

  constructor(props: propContainerTopThree) {
    super(props);
    this.state = {
      propContainerTopThree: this.props,
      cardData: [],
    };
  }

  componentDidMount() {
    this.receivedData();
  }

  async receivedData() {
    const { meeting_id } = this.props;
    try {
      const response = await fetch(`http://localhost:8000/api/meeting/${meeting_id}/topthree/`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      this.cardDataInput = data;
      console.log(this.cardDataInput);
      console.log("->"+this.cardDataInput[0].available);
      this.setState({ cardData: this.cardDataInput });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  render() {
    const { cardData } = this.state;
    const colorBadge = ['success', 'warning', 'error'];
    console.log(this.cardDataInput);
    return (
      <Container>
            <Typography variant="h4" align="center" marginBottom={5} gutterBottom>
                I 3 migliori timeslot votati
            </Typography>
            {cardData.length === 0 ? (
                <Typography variant="h6" align="center">
                    Nessun Time slot disponibile al momento.
                </Typography>
            ) : (
                <Grid2 container spacing={3} justifyContent="center">
                    {cardData.slice(0, 3).map((data, index) => (
                        <Grid2 key={index} component="div">
                            <CustomBadge 
                                badgeContent={index + 1} 
                                color={colorBadge[index] as any}
                            >
                                <TimeSlotDetails {...data} />
                            </CustomBadge>
                        </Grid2>
                    ))}
                </Grid2>
            )}
        </Container>
    );
  }
}




const CustomBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      padding: '0 4px',
      fontSize: '1.2rem',
      height: '2.5rem',
      width: '2.5rem',
      borderRadius: '50%',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      left: 2,  
    },
  }));

interface propTimeSlotDetails{
    time_slot_id: number;
    start_time: string|null
    end_time: string|null
    //date: string
    available: number
    unavailable: number
    maybe_available: number
}

export function TimeSlotDetails({time_slot_id,start_time, end_time, available, unavailable, maybe_available}:propTimeSlotDetails){

  return(
    <Card sx={{ width: 250 }}>
    <CardContent sx={{textAlign: 'center'}}>
      {
        //<Typography variant="h5" component="div">
        //{date}
      //</Typography>
      }
      <Typography variant="subtitle1" color="text.secondary">
        {start_time} - {end_time}
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center',justifyContent: 'center', marginTop: 10 }}>
        <IconButton color="success" aria-label="Ci sono">
          <DoneIcon />
        </IconButton>
        <Typography variant="body1" color="text.secondary">
          {available}
        </Typography>

        <IconButton color="warning" aria-label="Forse ci sono">
          <QuestionMarkIcon />
        </IconButton>
        <Typography variant="body1" color="text.secondary">
          {maybe_available}
        </Typography>

        <IconButton color="error" aria-label="Non ci sono">
          <CloseIcon />
        </IconButton>
        <Typography variant="body1" color="text.secondary">
          {unavailable}
        </Typography>
      </div>
    </CardContent>
  </Card>
  );
}

/*<Badge badgeContent={4} color="primary">
        <DoneIcon color="success" />
        </Badge>
*/
