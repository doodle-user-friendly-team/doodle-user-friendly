// import * as React from 'react';
// import {CssBaseline, Box, Typography, Container, ButtonGroup } from '@mui/material';
// import '../CSS/style.css';
// import { createTheme, styled, Theme, ThemeProvider } from '@mui/material/styles';
// import DescriptionIcon from '@mui/icons-material/Description';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import Place from '@mui/icons-material/Place';
// import AlertDialog from './DeleteComponent';
// import ModifyDialog from './ModifyComponent';


// const customTheme = createTheme({
//   typography: {
//     fontFamily: 'Poppins, sans-serif',
//   },
// });

// const CustomTableCell = styled('div')(({ theme }: { theme: Theme }) => ({
//   borderBottom: 'none',
//   color: theme.palette.text.secondary,
//   fontSize: '20px',
//   float: 'left',
// }));

// const CustomIcon = styled('div')(({ theme }: { theme: Theme }) => ({
//   color: theme.palette.text.secondary,
//   fontSize: '24px',
//   float: 'left',
//   marginRight: '8px',
// }));

// interface MeetingState {
//   meetingTitle: string;
//   meetingDescription: string;
//   meetingPlace: string;
//   timeValue: string;
//   isDeleteDialogOpen: boolean;
// }

// export class MeetingRecap extends React.Component<{}, MeetingState> {

//   constructor(props: {}) {
//     super(props);

//     this.state = {
//       meetingTitle: '',
//       meetingDescription: '',
//       meetingPlace: '',
//       timeValue: '',
//       isDeleteDialogOpen: false,
    
//     };
//   } 

//   handleModify(event: React.MouseEvent<HTMLButtonElement>) {
//     event.preventDefault(); 
//     console.log('modify');
//   }
  

//   alertRef = React.createRef<HTMLDivElement>();

//   render() {
//     return (
//       <ThemeProvider theme={customTheme}>
//         <Box className="background-image" />
//         <Container component="main" maxWidth="xs">
//           <CssBaseline />

//           <Box className="container">
//             <Typography component="h1" variant="h4" className="title" gutterBottom>
//               Recap Meeting
//             </Typography>

//             <Box component="form" noValidate className="form">
//             <div className="info">
//                 {/* questo titolo deve essere preso dal db */}
//                 <h2 className="titleMeeting">Title </h2>

//                 <CustomTableCell>
//                   <CustomIcon>
//                     <DescriptionIcon />
//                   </CustomIcon>

//                     {/* questa descrizione deve essere preso dal db */}
//                   Descrizione
//                 </CustomTableCell>
//               <br/>
//                 <CustomTableCell>
//                   <CustomIcon>
//                     <CalendarMonthIcon />
//                   </CustomIcon>
//                      {/* questa data deve essere preso dal db */}
//                   Data
//                 </CustomTableCell>
//                 <br/>

//                 <CustomTableCell>
//                   <CustomIcon>
//                     <AccessTimeIcon />
//                   </CustomIcon>
//                          {/* questa durata deve essere preso dal db */}
//                   Durata
//                 </CustomTableCell>
//                 <br/>

//                 <CustomTableCell>
//                   <CustomIcon>
//                     <Place />
//                   </CustomIcon>
//                    {/* questo luogo deve essere preso dal db */}
//                   Luogo
//                 </CustomTableCell>
//               </div>

//               <ButtonGroup className='buttonGroup'  >
//                 <ModifyDialog/>
//                 <AlertDialog/>                      
//               </ButtonGroup>
//             </Box>
//           </Box>
//         </Container>
//       </ThemeProvider>
//     );
//   }

// }
export {}