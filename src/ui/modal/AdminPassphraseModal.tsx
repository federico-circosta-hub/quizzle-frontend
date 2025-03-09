import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import CustomizedSnackbar from "../components/CustomizedSnackbar";
import { errorType, snackbarPropsType } from "../../types/misc";
import { useVerifyPassphraseMutation } from "../../redux/api";
import { getError } from "../../utils/functions";

const expirationTime = 2 * 60 * 60 * 1000;

const AdminPassphraseModal = ({ onSuccess }) => {
  const [open, setOpen] = useState(true);
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState(false);
  const [snackbarProps, setSnackbarProps] = useState<snackbarPropsType>();

  const { name } = useParams();

  const [verifyPassphrase, { isLoading }] = useVerifyPassphraseMutation();

  const handleSubmit = async () => {
    try {
      const data = {
        challengerName: name,
        passphrase: passphrase,
      };
      const res = await verifyPassphrase(data);
      if (res.error)
        return setSnackbarProps({
          isOpen: true,
          setOwn: setSnackbarProps,
          content: `Errore nella verifica: ${getError(res.error as errorType)}`,
          severity: "error",
        });
      if (!res.data.valid) {
        setError(true);
        return setSnackbarProps({
          isOpen: true,
          setOwn: setSnackbarProps,
          content: `Passphrase errata`,
          severity: "error",
        });
      }
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Passphrase corretta",
        severity: "success",
      });
      const expirationTimestamp = Date.now() + expirationTime;
      localStorage.setItem("isChallengerAuthorized", "true");
      localStorage.setItem(
        "authChallengerExpiration",
        expirationTimestamp.toString()
      );
      localStorage.setItem("adminUsername", res.data.adminUsername);
      setOpen(false);
      onSuccess();
    } catch (error) {
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Errore durante la verifica",
        severity: "error",
      });
    }
  };

  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>🔐 Inserisci la passphrase</DialogTitle>
      <DialogContent sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}>
        <div className="h-44 w-full flex flex-col">
          <TextField
            label="Passphrase"
            type="password"
            fullWidth
            error={error}
            helperText={error ? "Passphrase errata" : ""}
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
          />
          <Button
            disabled={isLoading}
            onClick={handleSubmit}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Conferma
          </Button>
        </div>
      </DialogContent>
      <CustomizedSnackbar
        isOpen={!!snackbarProps?.isOpen}
        setOwn={snackbarProps?.setOwn}
        content={snackbarProps?.content}
        severity={snackbarProps?.severity}
      />
    </Dialog>
  );
};

export default AdminPassphraseModal;
