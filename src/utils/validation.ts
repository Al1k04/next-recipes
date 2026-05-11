export const validateEmail = (email: string): string | undefined => {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return "Enter a correct email";
  }
};

export const validatePassword = (password: string): string | undefined => {
  if (password.length < 8) return "Minimum 8 characters";
  if (!/[A-Z]/.test(password)) return "At least one capital letter is required";
  if (!/[0-9]/.test(password)) return "At least one digit is needed";
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | undefined => {
  if (password !== confirmPassword) return "Passwords do not match";
};
