import React, { useState } from "react";
import {
  Button,
  DialogActions,
  DialogContentText,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Question } from "../../types/questions";
import { useSelector } from "react-redux";
import { stateType } from "../../redux/adminSlice";
import { usePublishQuestionMutation } from "../../redux/api";
import CustomizedSnackbar from "../components/CustomizedSnackbar";
import { snackbarPropsType } from "../../types/misc";

const PublishQuestionModal = ({ question }: { question: Question }) => {
  const { jwt } = useSelector(
    (state: { quizzle: stateType }) => state?.quizzle
  );

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [snackbarProps, setSnackbarProps] = useState<snackbarPropsType>();

  const [publishQuestionMutation, { isLoading: isPublishingQuestion }] =
    usePublishQuestionMutation();

  const handleOpenModal = () => setOpenModal((prev) => !prev);

  const handlePublishQuestion = async () => {
    try {
      const data = {
        questionId: question._id,
        jwt: jwt,
      };
      const res = await publishQuestionMutation(data);
      if (res.error)
        return setSnackbarProps({
          isOpen: true,
          setOwn: setSnackbarProps,
          content: "Domanda non pubblicata",
          severity: "error",
        });
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Domanda pubblicata",
        severity: "success",
      });
      handleOpenModal();
    } catch (error) {
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Domanda non pubblicata",
        severity: "error",
      });
    }
  };
  return (
    <>
      <IconButton
        color="primary"
        size="large"
        onClick={handleOpenModal}
        className="shadow-lg"
      >
        <PlayArrowIcon />
      </IconButton>
      <Drawer open={openModal} anchor="bottom">
        <div className="w-full h-80">
          <DialogContentText padding={3} fontWeight={700}>
            Sei sicuro/a di voler pubblicare la domanda:
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
          <Button
            disabled={isPublishingQuestion}
            onClick={handlePublishQuestion}
          >
            Pubblica
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

export default PublishQuestionModal;
