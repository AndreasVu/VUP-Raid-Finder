import {
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  PaperProps,
} from "@mui/material";
import { Raid, RaidCode } from "../models/raid-model";
import RaidListEntry from "./raid-list-entry";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export interface RaidListProps extends PaperProps {
  raid: Raid;
}

const RaidList = ({ raid, sx, ...props }: RaidListProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const raidCodes = useSelector(
    (state: RootState) => state.signalR.raids[raid.id]
  );

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

    copyAndShowSnackbar(latest.code);
  };

  const handleClick = (raidCode: RaidCode) => {
    copyAndShowSnackbar(raidCode.code);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        paddingTop: 2,
        width: "20em",
        height: "100%",
        flexDirection: "row",
        ...sx,
      }}
      {...props}
    >
      <Stack gap={2} sx={{ display: "flex", height: "100%" }}>
        <Typography variant="h6" sx={{ alignSelf: "center" }}>
          {raid.englishName}
        </Typography>
        <Divider variant="middle" />
        <Stack
          gap={1}
          sx={{ flexBasis: "100%", overflowY: "scroll", paddingX: 2 }}
          className="NoScroll"
        >
          {raidCodes !== undefined &&
            raidCodes.map((code: RaidCode) => (
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
