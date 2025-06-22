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
import { Question } from "../../types/questions";
import { useSelector } from "react-redux";
import { stateType } from "../../redux/adminSlice";
import { useDeleteQuestionMutation } from "../../redux/api";
import CustomizedSnackbar from "../components/CustomizedSnackbar";
import { snackbarPropsType } from "../../types/misc";

const DeleteQuestionModal = ({ question }: { question: Question }) => {
  const { jwt } = useSelector(
    (state: { quizzle: stateType }) => state?.quizzle
  );

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [snackbarProps, setSnackbarProps] = useState<snackbarPropsType>();

  const [deleteQuestionMutation, { isLoading: isDeletingQuestion }] =
    useDeleteQuestionMutation();

  const handleOpenModal = () => setOpenModal((prev) => !prev);

  const handleDeleteQuestion = async () => {
    try {
      const data = {
        id: question._id,
        jwt: jwt,
      };
      const res = await deleteQuestionMutation(data);
      if (res.error)
        return setSnackbarProps({
          isOpen: true,
          setOwn: setSnackbarProps,
          content: "Domanda non eliminata",
          severity: "error",
        });
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Domanda eliminata",
        severity: "success",
      });
      handleOpenModal();
    } catch (error) {
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Domanda non eliminata",
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
            Sei sicuro/a di voler eliminare la domanda:
          </DialogContentText>
          <Typography
            fontStyle={"italic"}
            padding={3}
            paddingTop={0}
            fontWeight={700}
          >
            "{question?.question}"
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

export default DeleteQuestionModal;
