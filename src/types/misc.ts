import { AlertColor } from "@mui/material";

export type snackbarPropsType = {
  isOpen: boolean;
  setOwn: Function | undefined;
  content: string | undefined;
  severity: AlertColor | undefined;
};

export type errorType = {
  status: number;
  data: {
    error: string;
  };
};
