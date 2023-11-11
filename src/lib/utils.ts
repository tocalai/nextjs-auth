import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number) {
  return new Promise((reslove) => setTimeout(reslove, ms))
}

// TODO, send back alert message
export function validatePassword(password: string): boolean {
  // regular expressions
  const lowerRegex = /[a-z]/;
  const upperRegex = /[A-Z]/;
  const digitRegex = /\d/;
  const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
  const minLengthRegex = /.{8,}/;

  // check if meets all requirements
  const hasLower = lowerRegex.test(password);
  const hasUpper = upperRegex.test(password);
  const hasDigit = digitRegex.test(password);
  const hasSpecialChar = specialCharRegex.test(password);
  const hasMinLength = minLengthRegex.test(password);

  // check true if all conditions are met
  return hasLower && hasUpper && hasDigit && hasSpecialChar && hasMinLength;
}