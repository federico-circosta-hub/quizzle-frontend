import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  Drawer,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { NewQuestion, Question } from "../../types/questions";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import {
  useAddQuestionMutation,
  useEditQuestionMutation,
} from "../../redux/api";
import {
  addQuestionPayload,
  editQuestionPayload,
} from "../../types/apiPayload";
import { useSelector } from "react-redux";
import { stateType } from "../../redux/adminSlice";
import CustomizedSnackbar from "../components/CustomizedSnackbar";
import { snackbarPropsType } from "../../types/misc";
const defaultFormValue = {
  question: "",
  media: "",
  options: ["", "", "", ""],
  correctOpt: undefined,
  adminUsername: "",
};
const NewQuestionModal = ({ question }: { question?: Question }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState<NewQuestion>(defaultFormValue);
  const [isFormFilled, setIsFormFilled] = useState<boolean>();
  const [snackbarProps, setSnackbarProps] = useState<snackbarPropsType>();

  const { username, jwt } = useSelector(
    (state: { quizzle: stateType }) => state?.quizzle
  );

  useEffect(() => {
    if (question) {
      const formByPropQuestion: NewQuestion = (({
        question,
        media,
        options,
        correctOpt,
        adminUsername,
      }) => ({ question, media, options, correctOpt, adminUsername }))(
        question
      );
      setForm(formByPropQuestion);
    }
  }, [question]);

  const [addQuestionMutation, { isLoading: isAddingQuestion }] =
    useAddQuestionMutation();
  const [editQuestionMutation, { isLoading: isEditingQuestion }] =
    useEditQuestionMutation();
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
        media: form.media,
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
      setForm(defaultFormValue);
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

  const handleEditQuestion = async () => {
    try {
      const data: editQuestionPayload = {
        id: question?._id as string,
        question: form.question,
        media: form.media,
        correctOpt: form.correctOpt || 0,
        options: form.options,
        adminUsername: username,
        jwt: jwt,
      };
      const res = await editQuestionMutation(data);
      if (res.error)
        return setSnackbarProps({
          isOpen: true,
          setOwn: setSnackbarProps,
          content: "Domanda non modificata",
          severity: "error",
        });
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Domanda modificata",
        severity: "success",
      });
      setForm(defaultFormValue);
      handleCloseDialog();
    } catch (error) {
      setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Domanda non modificata",
        severity: "error",
      });
    }
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (name === "opt")
      setForm({
        ...form,
        options: form.options.map((opt, i) =>
          i === (index || 0) ? value : opt
        ),
      });
    else {
      setForm({ ...form, [name]: value });
    }
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
  console.log("form", form);
  return (
    <>
      <IconButton
        color="primary"
        size="large"
        onClick={handleClickOpenDialog}
        className="shadow-lg"
      >
        {!!question ? <EditIcon /> : <AddIcon color="info" />}
      </IconButton>

      <Drawer open={openDialog} onClose={handleCloseDialog} anchor="bottom">
        <DialogContent>
          <DialogContentText fontWeight={700}>Domanda</DialogContentText>
          <TextField
            multiline={true}
            rows={4}
            onChange={onInputChange}
            autoFocus
            name="question"
            required
            margin="dense"
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={form.question}
          />
          <div className="flex gap-2 items-center mt-2">
            <TextField
              multiline
              rows={5}
              label="Media link"
              onChange={onInputChange}
              name="media"
              type="text"
              variant="outlined"
              autoComplete="off"
              value={form.media}
            />
            <div
              style={{ width: 200, height: 150 }}
              className={`flex justify-center border border-gray-200 rounded-md ${
                !form.media && "bg-slate-50"
              }`}
            >
              {form.media ? (
                <img src={form.media} alt="question media" width={180} />
              ) : (
                <>Anteprima</>
              )}
            </div>
          </div>
          <DialogContentText fontWeight={700}>Risposte</DialogContentText>
          <div className="flex justify-between items-center">
            <div className="w-full flex flex-col justify-between">
              <RadioGroup onChange={handleRadio}>
                {form.options.map((element, index) => (
                  <div className="w-full flex justify-between">
                    <div className="w-5/6">
                      <TextField
                        color={
                          form.correctOpt === index ? "success" : undefined
                        }
                        focused={form.correctOpt === index}
                        multiline={true}
                        rows={2}
                        autoComplete="off"
                        onChange={(e) => onInputChange(e, index)}
                        name="opt"
                        required
                        fullWidth
                        margin="dense"
                        type="text"
                        variant="outlined"
                        value={element}
                      />
                    </div>
                    <FormControlLabel
                      sx={{ margin: 0 }}
                      value={index}
                      control={<Radio checked={index === form.correctOpt} />}
                      label
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Chiudi</Button>
          <Button
            disabled={!isFormFilled || isAddingQuestion || isEditingQuestion}
            onClick={!!question ? handleEditQuestion : handleSaveQuestion}
          >
            Salva
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

export default NewQuestionModal;
