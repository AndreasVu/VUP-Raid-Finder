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
} from "@mui/material";
import React from "react";
import { ColorModeContext } from "../pages/index";
import RaidSelectDialog from "./raid-select-dialog";

const TopBar = () => {
  const colorMode = React.useContext(ColorModeContext);
  const theme = useTheme();
  const [openDialog, setOpenDialog] = React.useState(false);

  const HandleOnCloseDialog = (raidName: string) => {
    setOpenDialog(false);
    console.log(raidName);
  };

  return (
    <>
      <AppBar position="static" color="inherit">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography variant="h6" component="div" sx={{ mr: 5 }}>
              LOGO
            </Typography>

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
          </Toolbar>
        </Container>
      </AppBar>

      <RaidSelectDialog open={openDialog} onClose={HandleOnCloseDialog} />
    </>
  );
};

export default TopBar;
