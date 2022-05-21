import {
  Stack,
  ThemeProvider,
  createTheme,
  PaletteMode,
  CssBaseline,
} from "@mui/material";
import type { NextPage } from "next";
import React, { useMemo, useState } from "react";
import { Raid } from "../models/raid-model";
import RaidList from "../components/raid-list";
import { SnackbarProvider } from "notistack";
import TopBar from "../components/top-bar";
import { useDispatch, useSelector } from "react-redux";
import { subscribe } from "../store/raidCodeSlice";
import { RootState } from "../store/store";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const Home: NextPage = () => {
  const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
      mode,
    },
  });

  const [mode, setMode] = useState<PaletteMode>("dark");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const selectedRaids = useSelector(
    (state: RootState) => state.signalR.subscribedRaids
  );
  const dispatch = useDispatch();

  const handleSelectedRaid = (raid: Raid) => {
    if (selectedRaids.find((r) => r.id === raid.id) === undefined) {
      dispatch(subscribe(raid));
    }
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TopBar onRaidSelected={handleSelectedRaid} />
          <Stack
            direction="row"
            gap={2}
            sx={{
              padding: 2,
              overflowX: "auto",
              display: "flex",
              flexDirection: "row",
            }}
          >
            {selectedRaids.map((raid) => (
              <RaidList
                key={raid.id}
                raid={raid}
                sx={{
                  flexShrink: 0,
                }}
              />
            ))}
          </Stack>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </SnackbarProvider>
  );
};

export default Home;
