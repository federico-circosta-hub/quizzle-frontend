import React from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { snackbarPropsType } from "../../types/misc";

const CustomizedSnackbar = (snackbarProps: snackbarPropsType) => {
  const {
    isOpen,
    setOwn = () => {},
    content = "",
    severity = "info",
  } = snackbarProps;

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOwn({ ...snackbarProps, isOpen: false });
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={Slide}
    >
      <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
        {content}
      </Alert>
    </Snackbar>
  );
};

export default CustomizedSnackbar;
