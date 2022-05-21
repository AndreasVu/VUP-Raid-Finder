import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Raid } from "../models/raid-model";
import { getRaids } from "../signalRController";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface SimpleDialogProps {
  open: boolean;
  onClose: (raid: Raid) => void;
}

const RaidSelectDialog = ({ onClose, open }: SimpleDialogProps) => {
  const [raids, setRaids] = useState<Map<string, Raid[]>>(new Map());
  const allRaids = useSelector(
    (state: RootState) => state.signalR.availableRaids
  );
  const { enqueueSnackbar } = useSnackbar();

  const getBorderColor = (element: string) => {
    switch (element) {
      case "Fire":
        return "red";
      case "Water":
        return "blue";
      case "Wind":
        return "green";
      case "Light":
        return "yellow";
      case "Dark":
        return "purple";
      case "None":
        return "gray";
    }
  };

  useEffect(() => {
    const categories = Array.from(new Set(allRaids.map((r) => r.category)));
    setRaids(
      new Map(
        categories.map((c) => [c, allRaids.filter((r) => r.category === c)])
      )
    );
  }, [allRaids]);

  const handleClicked = (raid: Raid) => {
    onClose(raid);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Select Raid</DialogTitle>
      <DialogContent>
        {Array.from(raids).map(([category, raidArray]) => (
          <Accordion key={category}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{category}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {raidArray.map((r) => (
                <Button
                  key={r.id}
                  variant="contained"
                  sx={{
                    borderColor: getBorderColor(r.element),
                    margin: 0.5,
                    borderStyle: "solid",
                    borderWidth: 2,
                  }}
                  onClick={() => handleClicked(r)}
                >
                  {r.englishName}
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default RaidSelectDialog;
