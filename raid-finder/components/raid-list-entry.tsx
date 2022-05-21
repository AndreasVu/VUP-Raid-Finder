import { Box, Paper, Typography, ButtonBase } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { RaidCode } from "../models/raid-model";

type RaidListEntryProps = {
  raidCode: RaidCode;
  onClick: () => void;
};

const RaidListEntry = ({ raidCode, onClick }: RaidListEntryProps) => {
  return (
    <ButtonBase onClick={onClick}>
      <Paper
        elevation={2}
        sx={{
          padding: 1,
          width: "100%",
          backgroundColor: raidCode.isUsed
            ? "primary.dark"
            : "background.default",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">{raidCode.code}</Typography>
          <Typography variant="subtitle1">{raidCode.tweetedAt}</Typography>
        </Box>
      </Paper>
    </ButtonBase>
  );
};

export default RaidListEntry;
