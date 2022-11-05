import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Raid } from "../models/raid-model";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Box } from "@mui/system";
import debounce from "lodash.debounce";

interface SimpleDialogProps {
  open: boolean;
  onClose: (raid: Raid | null) => void;
}

const RaidSelectDialog = ({ onClose, open }: SimpleDialogProps) => {
  const [raids, setRaids] = useState<Map<string, Raid[]>>(new Map());
  const allRaids = useSelector(
    (state: RootState) => state.signalR.availableRaids
  );
  const [searchValue, setSearchValue] = useState("");
  const [filteredRaids, setFilteredRaids] = useState<Raid[]>([]);

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
      case "Earth":
        return "brown";
    }
  };

  const sortOrder = [
    "Impossible",
    "6 Dragons",
    "Ennead",
    "Impossible Omega II",
  ].reverse();

  useEffect(() => {
    const categories = Array.from(new Set(allRaids.map((r) => r.category)))
      .sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b))
      .reverse();
    setRaids(
      new Map(
        categories.map((c) => [c, allRaids.filter((r) => r.category === c)])
      )
    );
  }, [allRaids]);

  const handleClicked = (raid: Raid) => {
    onClose(raid);
  };

  const handleClosed = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    onClose(null);
  };

  const debouncedFilter = useMemo(
    () =>
      debounce((value: string) => {
        if (value == "") {
          setFilteredRaids([]);
        } else {
          setFilteredRaids(
            allRaids.filter(
              (r) =>
                r.englishName
                  .toLocaleLowerCase()
                  .includes(value.toLocaleLowerCase()) ||
                r.japaneseName
                  .toLocaleLowerCase()
                  .includes(value.toLocaleLowerCase())
            )
          );
        }
      }, 200),
    []
  );
  const handleValueChanged = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setSearchValue(event.target.value);
    debouncedFilter(event.target.value);
  };

  const borderColorStyle = (element: string) => ({
    borderColor: getBorderColor(element),
    margin: 0.5,
    borderStyle: "solid",
    borderWidth: 2,
  });

  const raidButton = (raid: Raid) => (
    <Button
      key={raid.id}
      sx={borderColorStyle(raid.element)}
      variant="contained"
      onClick={() => handleClicked(raid)}
    >
      {raid.englishName}
    </Button>
  );

  return (
    <Dialog open={open} onClose={handleClosed}>
      <DialogTitle>Select Raid</DialogTitle>
      <DialogContent>
        <TextField
          id="raidSearch"
          label="ex: Bennu"
          variant="standard"
          value={searchValue}
          onChange={handleValueChanged}
          sx={{ width: "100%", marginTop: "2rem", marginBottom: "2rem" }}
        />
        {filteredRaids.length > 0 && (
          <Box sx={{ paddingBottom: "1rem" }}>
            {filteredRaids.map((r) => (
              <Fade in={filteredRaids.length > 0} key={r.id}>
                <Button
                  key={r.id}
                  sx={borderColorStyle(r.element)}
                  variant="contained"
                  onClick={() => handleClicked(r)}
                >
                  {r.englishName}
                </Button>
              </Fade>
            ))}
          </Box>
        )}
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
              {raidArray.map((r) => raidButton(r))}
            </AccordionDetails>
          </Accordion>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default RaidSelectDialog;
