import { useState } from "react";
import { Tabs, Tab, Box, TextField, Button } from "@mui/material";
import { useLoginMutation, useSignupMutation } from "../../../redux/api";
import { snackbarPropsType } from "../../../types/misc";
import CustomizedSnackbar from "../../components/CustomizedSnackbar";
import { useDispatch } from "react-redux";
import { setAdminStuff } from "../../../redux/adminSlice";
import { jwtDecode } from "jwt-decode";
import LogoLine from "../../components/LogoLine";
const defaultFormValue = { username: "", passphrase: "", password: "" };
const defaultMissingField = "Campo obbligatorio";
const Login = () => {
  const dispatch = useDispatch();

  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ ...defaultFormValue });
  const [formError, setFormError] = useState({ ...defaultFormValue });
  const [snackbarProps, setSnackbarProps] = useState<snackbarPropsType>();

  const [signupCall, { isLoading: isSignupLoading }] = useSignupMutation();
  const [loginCall, { isLoading: isLoginLoading }] = useLoginMutation();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) return;
    try {
      const response = await loginCall(form);
      if (response.error)
        return setSnackbarProps({
          isOpen: true,
          setOwn: setSnackbarProps,
          content: "Credenziali errate",
          severity: "error",
        });
      const jwtDecoded = jwtDecode(response.data.token);
      dispatch(setAdminStuff({ ...jwtDecoded, jwt: response.data.token }));
      setForm({ ...defaultFormValue });
    } catch (error) {
      console.error(error);
      return setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Errore durante il login",
        severity: "error",
      });
    }
  };

  const signup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) return;
    try {
      form.username = form.username.trim();
      form.passphrase = form.passphrase.trim();
      const response = await signupCall(form);
      if (response.error)
        return setSnackbarProps({
          isOpen: true,
          setOwn: setSnackbarProps,
          content: "Errore durante la registrazione",
          severity: "error",
        });
      setForm({ ...defaultFormValue });
      return setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Admin registrato con successo, effettua il login",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      return setSnackbarProps({
        isOpen: true,
        setOwn: setSnackbarProps,
        content: "Errore durante la registrazione",
        severity: "error",
      });
    }
  };

  const isFormValid = () => {
    const errors = { ...defaultFormValue };
    if (!form.username.trim()) errors.username = defaultMissingField;
    if (!form.password) errors.password = defaultMissingField;
    if (tab === 1 && !form.passphrase.trim())
      errors.passphrase = defaultMissingField;
    setFormError(errors);
    return !Object.values(errors).some((e) => e);
  };

  const tabChange = (newValue: number) => {
    setTab(newValue);
    setForm({ ...defaultFormValue });
    setFormError({ ...defaultFormValue });
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFormError({ ...formError, [name]: "" });
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-lg w-11/12 max-w-md">
        <LogoLine />
        <Tabs
          value={tab}
          onChange={(e, newValue) => tabChange(newValue)}
          centered
        >
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        <Box className="mt-4">
          {tab === 0 ? (
            <form className="flex flex-col gap-4" onSubmit={login}>
              <TextField
                label="Username"
                name="username"
                variant="outlined"
                value={form.username}
                onChange={onInputChange}
                error={!!formError.username}
                helperText={formError.username}
                fullWidth
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={form.password}
                onChange={onInputChange}
                error={!!formError.password}
                helperText={formError.password}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={isLoginLoading}
              >
                Login
              </Button>
            </form>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={signup}>
              <TextField
                label="Username"
                name="username"
                variant="outlined"
                value={form.username}
                onChange={onInputChange}
                error={!!formError.username}
                helperText={formError.username}
                fullWidth
              />
              <TextField
                label="Passphrase"
                name="passphrase"
                variant="outlined"
                value={form.passphrase}
                onChange={onInputChange}
                error={!!formError.passphrase}
                helperText={formError.passphrase}
                fullWidth
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={form.password}
                onChange={onInputChange}
                error={!!formError.password}
                helperText={formError.password}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={isSignupLoading}
              >
                Sign Up
              </Button>
            </form>
          )}
        </Box>
      </div>
      <CustomizedSnackbar
        isOpen={!!snackbarProps?.isOpen}
        setOwn={snackbarProps?.setOwn}
        content={snackbarProps?.content}
        severity={snackbarProps?.severity}
      />
    </>
  );
};

export default Login;
