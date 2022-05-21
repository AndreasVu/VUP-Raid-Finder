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

interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

const RaidSelectDialog = (props: SimpleDialogProps) => {
  const [raids, setRaids] = useState<Map<string, Raid[]>>(new Map());
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
    getRaids()
      .then((raids) => {
        const categories = Array.from(new Set(raids.map((r) => r.category)));
        setRaids(
          new Map(
            categories.map((c) => [c, raids.filter((r) => r.category === c)])
          )
        );
        console.log(raids);
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar("Error getting raids", { variant: "error" });
      });
  }, []);

  const { onClose, open } = props;
  return (
    <Dialog open={open} onClose={onClose}>
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
                  key={r.englishName}
                  variant="contained"
                  sx={{
                    borderColor: getBorderColor(r.element),
                    margin: 0.5,
                    borderStyle: "solid",
                    borderWidth: 2,
                  }}
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
