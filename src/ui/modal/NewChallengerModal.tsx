import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import CustomizedSnackbar from "../components/CustomizedSnackbar";
import { errorType, snackbarPropsType } from "../../types/misc";
import useAdmin from "../../hooks/useAdmin";
import { useCreateChallengerMutation } from "../../redux/api";
import { getError } from "../../utils/functions";

const defaultFormValue = {
  name: "",
  imgLink: "",
};

const NewChallengerModal = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(defaultFormValue);
  const [isFormFilled, setIsFormFilled] = useState<boolean>(false);
  const [snackbarProps, setSnackbarProps] = useState<snackbarPropsType>();

  const { jwt } = useAdmin();

  const [createChallengerMutation, { isLoading: isCreatingChallenger }] =
    useCreateChallengerMutation();

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm(defaultFormValue);
  };

  const handleSaveChallenger = async () => {
    try {
      const data = {
        name: form.name,
        imgLink: form.imgLink,
        jwt: jwt,
      };
      const res = await createChallengerMutation(data);
      if (res.error)
        return setSnackbarProps({
          isOpen: true,
          setOwn: setSnackbarProps,
          content: `Challenger non creato: ${getError(res.error as errorType)}`,
          severity: "error",
        });
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Challenger creato",
        severity: "success",
      });
      handleCloseDialog();
    } catch (error) {
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Errore durante la creazione del challenger",
        severity: "error",
      });
    }
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setIsFormFilled(!!form.name.trim() && !!form.imgLink.trim());
  };

  return (
    <>
      <Button
        onClick={handleClickOpenDialog}
        variant="contained"
        color="info"
        endIcon={<AddCircleOutlineRoundedIcon />}
      >
        Nuovo
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText fontWeight={700}>Nuovo Sfidante</DialogContentText>
          <TextField
            onChange={onInputChange}
            autoFocus
            name="name"
            label="Nome"
            required
            margin="dense"
            type="text"
            fullWidth
            variant="standard"
            value={form.name}
          />
          <TextField
            onChange={onInputChange}
            name="imgLink"
            label="Link Immagine"
            required
            margin="dense"
            type="text"
            fullWidth
            variant="standard"
            value={form.imgLink}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Chiudi</Button>
          <Button
            disabled={!isFormFilled || isCreatingChallenger}
            onClick={handleSaveChallenger}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
      <CustomizedSnackbar
        isOpen={!!snackbarProps?.isOpen}
        setOwn={snackbarProps?.setOwn}
        content={snackbarProps?.content}
        severity={snackbarProps?.severity}
      />
    </>
  );
};

export default NewChallengerModal;
