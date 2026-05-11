"use client";

import TextField, { TextFieldProps } from "@mui/material/TextField";

export function AuthInput(props: TextFieldProps) {
  return (
    <TextField
      {...props}
      fullWidth
      sx={{
        "& .MuiInputBase-input": {
          color: "white",
        },

        "& .MuiInputBase-input::placeholder": {
          color: "white",
          opacity: 0.7,
        },

        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "white",
          },
          "&:hover fieldset": {
            borderColor: "white",
          },
          "&.Mui-focused fieldset": {
            borderColor: "white",
          },
        },

        "& .MuiInputLabel-root": {
          color: "white",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "white",
        },
      }}
    />
  );
}
