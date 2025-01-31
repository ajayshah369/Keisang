import React from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { set as setSnackbar } from "../store/snackbar.slice";

const SnackbarComponent = () => {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.snackbar);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(setSnackbar({ open: false, message: "", severity: "info" }));
  };

  const action = (
    <React.Fragment>
      <Button color='secondary' size='small' onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleClose}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      open={data.open}
      autoHideDuration={6000}
      onClose={handleClose}
      action={action}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={data.severity}
        variant='filled'
        sx={{ width: "100%" }}
      >
        {data.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
