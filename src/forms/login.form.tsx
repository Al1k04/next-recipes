"use client";
import { useState } from "react";
import { validateEmail, validatePassword } from "@/utils/validation";
import { AuthInput } from "@/components/authInput/AuthInput";
import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import { signIn } from "next-auth/react";

interface IProps {
  onClose: () => void;
}

export function LoginForm({ onClose }: IProps) {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setErrors({ password: "Invalid email or password" });
      return;
    }

    onClose();
    window.location.reload();
  };

  return (
    <form onSubmit={onSubmit} noValidate style={{ height: "100%" }}>
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={2}>
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
        </Stack>
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
            Log in
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
