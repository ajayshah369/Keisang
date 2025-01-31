import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { set as setAuth } from "../../store/auth.slice";

import axiosInstance from "../../utilities/axiosInstance";

const AuthLoading = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      axiosInstance
        .get("/admin/auth")
        .then((res) => {
          dispatch(setAuth({ admin: res.data.data, loading: false }));
        })
        .catch(() => {
          dispatch(setAuth({ admin: null, loading: false }));
        });
    };

    getUser();
  }, [dispatch]);

  return (
    <Box
      component={"div"}
      className='h-screen flex justify-center items-center'
    >
      <CircularProgress size={80} color='warning' />
    </Box>
  );
};

export default AuthLoading;
