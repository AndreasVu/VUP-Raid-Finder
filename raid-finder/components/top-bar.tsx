import { AddCircleRounded } from "@mui/icons-material";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import {
  AppBar,
  Container,
  Typography,
  Stack,
  Button,
  IconButton,
  Toolbar,
  PaletteMode,
  useTheme,
  Hidden,
  Box,
} from "@mui/material";
import React from "react";
import { ColorModeContext } from "../pages/index";
import RaidSelectDialog from "./raid-select-dialog";
import { Raid } from "../models/raid-model";

export interface TopBarParameters {
  onRaidSelected: (raid: Raid) => void;
}

const TopBar = ({ onRaidSelected }: TopBarParameters) => {
  const colorMode = React.useContext(ColorModeContext);
  const theme = useTheme();
  const [openDialog, setOpenDialog] = React.useState(false);

  const HandleOnCloseDialog = (raid: Raid | null) => {
    setOpenDialog(false);
    if (raid !== null) onRaidSelected(raid);
  };

  return (
    <>
      <AppBar position="static" color="inherit">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" component="div" sx={{ mr: 5 }}>
                  LOGO
                </Typography>

                <Hidden smDown>
                  <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                    <Button
                      color="primary"
                      variant="contained"
                      href="https://gbf.wiki/Main_Page"
                      target="_blank"
                    >
                      Wiki
                    </Button>

                    <Button color="primary" variant="contained">
                      Calculator
                    </Button>
                  </Stack>
                </Hidden>
              </Box>
              <Box>
                <IconButton color="primary" onClick={() => setOpenDialog(true)}>
                  <AddCircleRounded fontSize="large" />
                </IconButton>
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={colorMode.toggleColorMode}
                  color="inherit"
                >
                  {theme.palette.mode === "dark" ? (
                    <Brightness7Icon />
                  ) : (
                    <Brightness4Icon />
                  )}
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <RaidSelectDialog open={openDialog} onClose={HandleOnCloseDialog} />
    </>
  );
};

export default TopBar;
