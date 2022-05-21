import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Raid, RaidCode } from "../models/raid-model";
import RaidListEntry from "./raid-list-entry";
import { useSnackbar } from "notistack";

const RaidList = ({ raid }: { raid: Raid }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [raidCodes, setRaidCodes] = useState([
    { code: "1231245", isUsed: false, tweetedAt: "1234534" },
    { code: "1231246", isUsed: false, tweetedAt: "12356544" },
    { code: "1231247", isUsed: false, tweetedAt: "123rr4" },
    { code: "1231248", isUsed: false, tweetedAt: "123c4" },
    { code: "1231249", isUsed: false, tweetedAt: "123vv4" },
    { code: "1231240", isUsed: false, tweetedAt: "123 4" },
    { code: "1231241", isUsed: false, tweetedAt: "123hbb4" },
    { code: "1231242", isUsed: false, tweetedAt: "1dwwv23bb4" },
  ] as RaidCode[]);

  const copyAndShowSnackbar = (raidCode: string) => {
    navigator.clipboard.writeText(raidCode);
    enqueueSnackbar("Copied to clipboard", {
      variant: "default",
      autoHideDuration: 1000,
    });
  };

  const copyLatest = () => {
    const latest = raidCodes.find((c) => c.isUsed === false);

    if (latest === undefined) return;

    setRaidCodes((codes) => {
      const oldCode = codes.find((c) => c === latest);

      if (oldCode) oldCode.isUsed = true;

      return codes;
    });

    copyAndShowSnackbar(latest.code);
  };

  const handleClick = (raidCode: RaidCode) => {
    setRaidCodes((codes) => {
      const oldCode = codes.find((c) => c === raidCode);

      if (oldCode === undefined) return codes;

      oldCode.isUsed = true;
      copyAndShowSnackbar(raidCode.code);

      return codes;
    });
  };

  return (
    <Paper
      elevation={1}
      sx={{
        paddingTop: 2,
        width: "20em",
        height: "100%",
        flexDirection: "row",
      }}
    >
      <Stack gap={2} sx={{ display: "flex", height: "100%" }}>
        <Typography variant="h6" sx={{ alignSelf: "center" }}>
          Lv 150 Lucilius
        </Typography>
        <Divider variant="middle" />
        <Stack
          gap={1}
          sx={{ flexBasis: "100%", overflowY: "scroll", paddingX: 2 }}
          className="NoScroll"
        >
          {raidCodes.map((code: RaidCode) => (
            <RaidListEntry
              key={code.tweetedAt}
              raidCode={code}
              onClick={() => handleClick(code)}
            />
          ))}
        </Stack>
        <Button
          variant="contained"
          sx={{ height: "10em" }}
          onClick={copyLatest}
        >
          copy latest
        </Button>
      </Stack>
    </Paper>
  );
};

export default RaidList;
