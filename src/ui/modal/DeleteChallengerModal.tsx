import React, { useState } from "react";
import {
  Button,
  DialogActions,
  DialogContentText,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { stateType } from "../../redux/adminSlice";
import { useDeleteChallengerMutation } from "../../redux/api";
import CustomizedSnackbar from "../components/CustomizedSnackbar";
import { snackbarPropsType } from "../../types/misc";
import { Challenger } from "../../types/challenger";

const DeleteChallengerModal = ({ challenger }: { challenger: Challenger }) => {
  const { jwt } = useSelector(
    (state: { quizzle: stateType }) => state?.quizzle
  );

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [snackbarProps, setSnackbarProps] = useState<snackbarPropsType>();

  const [deleteChallengerMutation, { isLoading: isDeletingQuestion }] =
    useDeleteChallengerMutation();

  const handleOpenModal = () => setOpenModal((prev) => !prev);

  const handleDeleteQuestion = async () => {
    try {
      const data = {
        id: challenger._id,
        jwt: jwt,
      };
      const res = await deleteChallengerMutation(data);
      if (res.error)
        return setSnackbarProps({
          isOpen: true,
          setOwn: setSnackbarProps,
          content: "Challenger non eliminato",
          severity: "error",
        });
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Challenger eliminato",
        severity: "success",
      });
      handleOpenModal();
    } catch (error) {
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Challenger non eliminato",
        severity: "error",
      });
    }
  };
  return (
    <>
      <IconButton
        color="error"
        size="large"
        onClick={handleOpenModal}
        className="shadow-lg"
      >
        <DeleteIcon />
      </IconButton>
      <Drawer open={openModal} anchor="bottom">
        <div className="w-full h-80">
          <DialogContentText padding={3} fontWeight={700}>
            Sei sicuro/a di voler eliminare il challenger:
          </DialogContentText>
          <Typography
            fontStyle={"italic"}
            padding={3}
            paddingTop={0}
            fontWeight={700}
          >
            {challenger?.name}
          </Typography>
        </div>
        <DialogActions>
          <Button onClick={handleOpenModal}>Annulla</Button>
          <Button disabled={isDeletingQuestion} onClick={handleDeleteQuestion}>
            Elimina
          </Button>
        </DialogActions>
      </Drawer>
      <CustomizedSnackbar
        isOpen={!!snackbarProps?.isOpen}
        setOwn={snackbarProps?.setOwn}
        content={snackbarProps?.content}
        severity={snackbarProps?.severity}
      />
    </>
  );
};

export default DeleteChallengerModal;
