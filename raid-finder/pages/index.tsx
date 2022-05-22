import {
  Stack,
  ThemeProvider,
  createTheme,
  PaletteMode,
  CssBaseline,
  Box,
} from "@mui/material";
import type { NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";
import { Raid } from "../models/raid-model";
import RaidList from "../components/raid-list";
import { SnackbarProvider } from "notistack";
import TopBar from "../components/top-bar";
import { useDispatch, useSelector } from "react-redux";
import { populateSelectedRaids, subscribe } from "../store/raidCodeSlice";
import { RootState } from "../store/store";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState<PaletteMode>("dark");

  const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
      mode,
    },
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  useEffect(() => {
    dispatch(populateSelectedRaids());
  }, []);

  const selectedRaids = useSelector(
    (state: RootState) => state.signalR.subscribedRaids
  );

  const handleSelectedRaid = (raid: Raid) => {
    if (selectedRaids.find((r) => r.id === raid.id) === undefined) {
      dispatch(subscribe(raid));
    }
  };

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TopBar onRaidSelected={handleSelectedRaid} />

            <Stack
              direction="row"
              gap={2}
              sx={{
                padding: 2,
                overflowX: "auto",
                display: "flex",
                flexDirection: "row",
                flexGrow: 1,
              }}
            >
              {selectedRaids.map((raid) => (
                <RaidList
                  key={raid.id}
                  raid={raid}
                  sx={{
                    paddingTop: 2,
                    width: "20em",
                    height: "100%",
                    flexDirection: "row",
                  }}
                />
              ))}
            </Stack>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </SnackbarProvider>
  );
};

export default Home;
