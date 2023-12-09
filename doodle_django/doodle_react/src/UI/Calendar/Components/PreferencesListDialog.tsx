import { CircularProgress, Dialog, DialogTitle, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Preference } from "./Calendar";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiberManualRecord } from "@mui/icons-material";

interface PreferencesListDialogProps {
  open: boolean,
  tsId: number,
  onClose: () => void
}

export interface PreferenceTSUser {
  id: number;
  preference: string;
  user: User;
}

interface User {
  id: number;
  name: string;
  surname: string;
}

export function PreferencesListDialog(props: PreferencesListDialogProps) {
  const { open, tsId, onClose} = props;
  const [prefList, setPrefList] = useState<PreferenceTSUser[]>();
  const [isPrefListLoading, setIsPrefListLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/votes/timeslot/" + tsId)
      .then((response) => response.data)
      .then((p) => {
        setPrefList(p);
        console.log(p);
        setIsPrefListLoading(false);
        });
  },[]);

  return (
  isPrefListLoading ? 
    <Dialog open={open} onClose={onClose}>
        <CircularProgress />
    </Dialog>
    :  
    <Dialog open={open}>
    <DialogTitle>{tsId}</DialogTitle>
        <List>
            {prefList!.map((p) => (
                <ListItem key={p.id}>
                    <ListItemIcon>
                        <FiberManualRecord color={p.preference == "Available" ? 'success' : p.preference =="Maybe Available" ? 'warning' : 'error'} />
                    </ListItemIcon>
                    <ListItemText primary={p.user.name + ' ' + p.user.surname} />
                </ListItem>
            ))}
        </List>  
  </Dialog>);
}
