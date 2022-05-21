import {
  Stack,
  ThemeProvider,
  createTheme,
  PaletteMode,
  Box,
  CssBaseline,
} from "@mui/material";
import type { NextPage } from "next";
import React, { useState } from "react";
import { Raid } from "../models/raid-model";
import RaidList from "../components/raid-list";
import { SnackbarProvider } from "notistack";
import TopBar from "../components/top-bar";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});
// export const SignalRContext = React.createContext(new SignalRController());

const Home: NextPage = () => {
  const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
      mode,
    },
  });

  const [mode, setMode] = React.useState<PaletteMode>("dark");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const [openDialog, setOpenDialog] = useState(false);

  const raids: Raid[] = [
    {
      englishName: "Luci",
      category: "Impossible",
      element: "None",
      id: 1,
      japaneseName: "test",
    },
    {
      englishName: "Bahamut",
      category: "Impossible",
      element: "None",
      id: 1,
      japaneseName: "test",
    },
  ];

  const HandleOnCloseDialog = (raidName: string) => {
    setOpenDialog(false);
    console.log(raidName);
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline>
            <TopBar />
            <Box
              sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
            >
              <Stack
                direction="row"
                gap={2}
                sx={{
                  padding: 2,
                  overflowX: "scroll",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {raids.map((raid) => (
                  <RaidList key={raid.id} raid={raid} />
                ))}
              </Stack>
            </Box>
          </CssBaseline>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </SnackbarProvider>
  );
};

export default Home;
