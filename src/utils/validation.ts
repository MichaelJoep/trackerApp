export type FieldErrors = Record<string, string | undefined>;

export function validateRequired(
  value: string,
  fieldName: string,
): string | null {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }

  return null;
}

export function validateName(
  value: string,
  fieldName: string,
): string | null {
  const requiredError = validateRequired(value, fieldName);

  if (requiredError) {
    return requiredError;
  }

  const name = value.trim();

  if (name.length < 2) {
    return `${fieldName} must contain at least 2 characters`;
  }

  if (name.length > 50) {
    return `${fieldName} cannot exceed 50 characters`;
  }

  // Allows letters, spaces, apostrophes and hyphens.
  const nameRegex = /^[A-Za-zÀ-ÿ' -]+$/;

  if (!nameRegex.test(name)) {
    return `${fieldName} contains invalid characters`;
  }

  return null;
}

export function validateEmail(
  email: string,
): string | null {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    return "Email address is required";
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    return "Please enter a valid email address";
  }

  return null;
}

export function validatePhone(
  phone: string,
): string | null {
  const normalizedPhone = phone.trim();

  if (!normalizedPhone) {
    return "Phone number is required";
  }

  // General international phone validation.
  const phoneRegex =
    /^\+?[0-9\s\-()]{7,20}$/;

  if (!phoneRegex.test(normalizedPhone)) {
    return "Please enter a valid phone number";
  }

  return null;
}

export function validatePassword(
  password: string,
): string | null {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must contain at least 8 characters";
  }

  if (password.length > 72) {
    return "Password cannot exceed 72 characters";
  }

  return null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
}

export function validateOtp(
  otp: string,
): string | null {
  const cleanedOtp = otp.replace(/\s/g, "");

  if (!cleanedOtp) {
    return "Verification code is required";
  }

  if (!/^\d{6}$/.test(cleanedOtp)) {
    return "Please enter a valid 6-digit verification code";
  }

  return null;
}