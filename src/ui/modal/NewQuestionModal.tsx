import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { NewQuestion } from "../../types/questions";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useAddQuestionMutation } from "../../redux/api";
import { addQuestionPayload } from "../../types/apiPayload";
import { useSelector } from "react-redux";
import { stateType } from "../../redux/adminSlice";
import CustomizedSnackbar from "../components/CustomizedSnackbar";
import { snackbarPropsType } from "../../types/misc";
const defaultFormValue = {
  question: "",
  options: ["", "", "", ""],
  correctOpt: undefined,
  adminUsername: "",
};
const NewQuestionModal = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState<NewQuestion>(defaultFormValue);
  const [isFormFilled, setIsFormFilled] = useState<boolean>();
  const [snackbarProps, setSnackbarProps] = useState<snackbarPropsType>();

  const { username, jwt } = useSelector(
    (state: { quizzle: stateType }) => state?.quizzle
  );

  const [addQuestionMutation, { isLoading: isAddingQuestion }] =
    useAddQuestionMutation();
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveQuestion = async () => {
    try {
      const data: addQuestionPayload = {
        question: form.question,
        correctOpt: form.correctOpt || 0,
        options: form.options,
        adminUsername: username,
        jwt: jwt,
      };
      const res = await addQuestionMutation(data);
      if (res.error)
        return setSnackbarProps({
          isOpen: true,
          setOwn: setSnackbarProps,
          content: "Domanda non aggiunta",
          severity: "error",
        });
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Domanda aggiunta",
        severity: "success",
      });
      handleCloseDialog();
    } catch (error) {
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Domanda non aggiunta",
        severity: "error",
      });
    }
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (name === "question") setForm({ ...form, question: value });
    if (name === "opt")
      setForm({
        ...form,
        options: form.options.map((opt, i) =>
          i === (index || 0) ? value : opt
        ),
      });
  };

  const handleRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setForm({ ...form, correctOpt: Number(value) });
  };

  const checkIsFormFilled = () => {
    setIsFormFilled(
      !!form.question.trim() &&
        form.correctOpt !== undefined &&
        form.options.every((e) => e.trim())
    );
  };

  useEffect(() => {
    checkIsFormFilled();
    // eslint-disable-next-line
  }, [form]);

  return (
    <>
      <Button
        onClick={handleClickOpenDialog}
        variant="contained"
        color="info"
        endIcon={<AddCircleOutlineRoundedIcon />}
      >
        Nuova
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogContentText fontWeight={700}>Domanda</DialogContentText>
          <TextField
            onChange={onInputChange}
            autoFocus
            name="question"
            required
            margin="dense"
            type="text"
            fullWidth
            variant="standard"
            value={form.question}
          />
          <DialogContentText fontWeight={700}>Risposte</DialogContentText>
          <div className="flex justify-between items-center">
            <FormControl>
              <RadioGroup value={form.correctOpt} onChange={handleRadio}>
                {form.options.map((element, index) => (
                  <div className="w-full flex justify-between">
                    <TextField
                      onChange={(e) => onInputChange(e, index)}
                      name="opt"
                      required
                      fullWidth
                      margin="dense"
                      type="text"
                      variant="standard"
                      value={element}
                    />

                    <FormControlLabel
                      sx={{ margin: 0 }}
                      value={index}
                      control={<Radio />}
                      label
                    />
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Chiudi</Button>
          <Button
            disabled={!isFormFilled || isAddingQuestion}
            onClick={handleSaveQuestion}
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

export default NewQuestionModal;
