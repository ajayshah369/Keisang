import { Button } from "@mui/material";
import { Upload } from "@mui/icons-material";
import { useRef, useState } from "react";
import axiosInstance from "../utilities/axiosInstance";
import { useDispatch } from "react-redux";
import { set as setSnackbar } from "../store/snackbar.slice";

const UploadData = () => {
  const dispatch = useDispatch();
  const fileInput = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const uploadData = (file: File) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    axiosInstance
      .post("/admin/vehicles/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        dispatch(
          setSnackbar({
            open: true,
            message:
              "Data uploaded successfully. Please refresh the page to view the changes.",
            severity: "success",
          })
        );

        window.location.reload();
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
        if (fileInput.current) {
          fileInput.current.value = "";
        }
        setLoading(false);
      });
  };

  return (
    <div>
      <input
        className='hidden'
        ref={fileInput}
        type='file'
        accept='.csv'
        id='file'
        name='file'
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            uploadData(file);
          }
        }}
      />
      <Button
        className='cursor-pointer! rounded-full!'
        startIcon={<Upload fontSize='large' />}
        sx={{
          backgroundColor: "#fff",
          color: "#393939",
          fontSize: 16,
          fontWeight: 500,
          width: "200px",
        }}
        onClick={() => fileInput.current?.click()}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Select File"}
      </Button>
    </div>
  );
};

export default UploadData;
