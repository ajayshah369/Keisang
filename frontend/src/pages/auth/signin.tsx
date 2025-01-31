import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import axiosInstance from "../../utilities/axiosInstance";
import { useDispatch } from "react-redux";
import { set as setAuth } from "../../store/auth.slice";
import { RootState } from "../../store";
import { set as setSnackbar } from "../../store/snackbar.slice";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn() {
  const dispatch = useDispatch();

  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const signin = (data: { username: string; password: string }) => {
    setLoading(true);
    axiosInstance
      .post("/admin/auth/login", data)
      .then((res) => {
        dispatch(
          setAuth({ admin: res.data.data as RootState["auth"]["admin"] })
        );
        dispatch(
          setSnackbar({
            open: true,
            message: res?.data?.message ?? "Login successful",
            severity: "success",
          })
        );
      })
      .catch((err) => {
        const errorData = err?.response?.data;
        dispatch(
          setSnackbar({
            open: true,
            message:
              errorData?.message?.message ??
              errorData?.errors?.join(", ") ??
              errorData?.message ??
              "Login failed",
            severity: "error",
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (usernameError || passwordError) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const data = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    signin(data);
  };

  const validateInputs = () => {
    const username = document.getElementById("username") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!username.value || !/^[a-zA-Z0-9_-]+$/.test(username.value)) {
      setUsernameError(true);
      setUsernameErrorMessage("Please enter a valid username.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction='column' justifyContent='space-between'>
        <Card variant='outlined'>
          <Typography
            component='h1'
            variant='h4'
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign in
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor='username'>Username</FormLabel>
              <TextField
                error={usernameError}
                helperText={usernameErrorMessage}
                id='username'
                type='username'
                name='username'
                placeholder='username'
                autoComplete='username'
                autoFocus
                required
                fullWidth
                variant='outlined'
                color={usernameError ? "error" : "primary"}
                InputProps={{
                  sx: {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "warning.main",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "warning.dark",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "warning.light",
                    },
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='password'>Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name='password'
                placeholder='••••••'
                type='password'
                id='password'
                autoComplete='current-password'
                autoFocus
                required
                fullWidth
                variant='outlined'
                color={passwordError ? "error" : "primary"}
                InputProps={{
                  sx: {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "warning.main",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "warning.dark",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "warning.light",
                    },
                  },
                }}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value='remember' color='warning' />}
              label='Remember me'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              onClick={validateInputs}
              disabled={loading}
              color='warning'
            >
              {loading ? "Loading..." : "Sign in"}
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
}
