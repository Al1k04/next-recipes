"use client";

import { useState } from "react";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/validation";
import { AuthInput } from "@/components/authInput/AuthInput";
import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import { registerUser } from "@/actions/register";

interface IProps {
  onClose: () => void;
}

export function RegistrationForm({ onClose }: IProps) {
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    const hasErrors = Object.values(newErrors).some(Boolean);

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    await registerUser({
      email,
      password,
      confirmPassword,
    });

    console.log("registration:", registerUser);

    alert(JSON.stringify({ email, password }, null, 2));
    onClose();
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <Stack spacing={2} width="100%">
        <AuthInput
          name="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          error={!!errors.email}
          helperText={errors.email}
        />

        <AuthInput
          name="password"
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password}
        />

        <AuthInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ width: "100%" }}
        >
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button type="submit" variant="contained">
            Sign up
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
