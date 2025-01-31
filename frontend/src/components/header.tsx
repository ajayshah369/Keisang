import { Avatar, Button, Chip, Menu, MenuItem } from "@mui/material";
import logo from "../assets/logo.png";
import { ExpandMore, Support } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useState } from "react";
import axiosInstance from "../utilities/axiosInstance";
import { set as setAuth } from "../store/auth.slice";
import { set as setSnackbar } from "../store/snackbar.slice";
import UploadData from "./uploadData";

const Header = () => {
  const dispatch = useDispatch();
  const { admin } = useSelector((state: RootState) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget); // Set the anchor element (button) to open the menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const logout = () => {
    axiosInstance
      .get("/admin/auth/logout")
      .then((res) => {
        handleClose();
        dispatch(setAuth({ admin: null }));
        dispatch(
          setSnackbar({
            open: true,
            message: res?.data?.message ?? "Logout successful",
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
      });
  };

  return (
    <header
      className='px-8 py-2 flex items-center justify-between fixed top-0 left-0 w-full z-10'
      style={{ backgroundColor: "#404041" }}
    >
      <div className='flex items-center gap-4'>
        <img src={logo} alt='logo' className='h-10' />
        <h1 className='text-white text-lg font-medium'>Admin Console</h1>
        <Chip
          label='Admin View'
          sx={{
            backgroundColor: "#fff",
            color: "#393939",
            fontSize: 10,
            fontWeight: 500,
            padding: "2px",
          }}
          size='small'
        />
      </div>

      <UploadData />

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Support color='warning' sx={{ fontSize: 20 }} />
          <p className='text-white text-xs'>Support</p>
        </div>

        <div>
          <Button
            variant='contained'
            sx={{
              backgroundColor: "#242424",
              padding: 1,
            }}
            className='flex items-center gap-3'
            onClick={handleOpen}
          >
            <Avatar sx={{ width: 32, height: 32, margin: 0, fontSize: 16 }}>
              {admin?.first_name?.charAt(0).toLocaleUpperCase()}
            </Avatar>

            <p className='text-white text-xs'>{admin?.first_name}</p>

            <ExpandMore color='warning' />
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              style: {
                minWidth: anchorEl ? anchorEl.offsetWidth : undefined,
                backgroundColor: "#404041",
              },
            }}
            style={{
              marginTop: 4,
            }}
          >
            <MenuItem onClick={logout} sx={{ color: "#fff" }}>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
