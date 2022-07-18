import {
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  PaperProps,
  Box,
  IconButton,
} from "@mui/material";
import { Raid, RaidCode } from "../models/raid-model";
import RaidListEntry from "./raid-list-entry";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setIsUsed, unsubscribe } from "../store/raidCodeSlice";
import DeleteIcon from "@mui/icons-material/Delete";
export interface RaidListProps extends PaperProps {
  raid: Raid;
}

const RaidList = ({ raid, sx, ...props }: RaidListProps) => {
  const raidCodes = useSelector(
    (state: RootState) => state.signalR.raids[raid.id]
  );
  const dispatch = useDispatch();

  const copyToClipboard = (raidCode: string) => {
    navigator.clipboard.writeText(raidCode);
  };

  const copyLatest = () => {
    const latest = raidCodes.find((c) => c.isUsed === false);

    if (latest === undefined) return;

    dispatch(setIsUsed({ codeId: latest.id, raidId: raid.id }));
    copyToClipboard(latest.code);
  };

  const handleClick = (raidCode: RaidCode) => {
    dispatch(setIsUsed({ codeId: raidCode.id, raidId: raid.id }));
    copyToClipboard(raidCode.code);
  };

  const onRemoved = () => {
    dispatch(unsubscribe(raid));
  };

  return (
    <Paper
      elevation={1}
      sx={{
        ...sx,
      }}
      {...props}
    >
      <Stack gap={2} sx={{ display: "flex", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Typography variant="h6" sx={{ alignSelf: "center" }}>
            {raid.englishName}
          </Typography>
          <IconButton onClick={onRemoved}>
            <DeleteIcon
              sx={{
                alignSelf: "right",
              }}
            />
          </IconButton>
        </Box>
        <Divider variant="middle" />
        <Stack
          gap={1}
          sx={{ flexBasis: "100%", overflowY: "scroll", paddingX: 2 }}
          className="NoScroll"
        >
          {raidCodes !== undefined &&
            raidCodes.map((code: RaidCode) => (
              <RaidListEntry
                key={code.id}
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
