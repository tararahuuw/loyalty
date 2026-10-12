import { parsePhoneNumberFromString } from "libphonenumber-js";

export function formatPrefixPhoneNumber (phone) {
  if (!phone) return "";

  let normalizedPhone = phone;
  if (phone.startsWith("0")) {
    normalizedPhone = "+62" + phone.slice(1);
  }

  const parsed = parsePhoneNumberFromString(normalizedPhone);
  if (!parsed) return phone;

  const countryCallingCode = parsed.countryCallingCode; 
  const nationalNumber = parsed.nationalNumber;

  const prefix = `+${countryCallingCode}`; 
  const firstPart = nationalNumber.slice(0, 3); 
  const remaining = nationalNumber.slice(3); 

  const chunked = remaining.match(/.{1,4}/g)?.join(" ") || "";

  return `${prefix} ${firstPart} ${chunked}`;
};

export function formatNPWP(input) {
  const numberString = input.toString();
  let formattedNumber = "";

  for (let i = 0; i < numberString.length; i++) {
    if (i === 9) {
      formattedNumber += "-";
    }

    formattedNumber += numberString[i];

    if (i === 1 || i === 4 || i === 7 || i === 11) {
      formattedNumber += ".";
    }
  }

  return formattedNumber;
}

export function formatPrice(input) {
  const numericInput = parseFloat(input);

  if (!isNaN(numericInput)) {
    const formattedPrice = numericInput.toLocaleString("id-ID");
    return formattedPrice;
  } else {
    return input;
  }
}

export function formatDate(input) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(input);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const period = hours < 12 ? "AM" : "PM";
  const formattedDate = `${day} ${month} ${year}, ${formattedHours}.${minutes < 10 ? "0" : ""}${minutes} ${period}`;

  return formattedDate;
}

export function formatDateOnly(dateString) {
  // Make sure to convert the dateString to a Date object
  const date = new Date(dateString);
  // Use toLocaleDateString to format as day, month (long), year
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export function formatTimeOnly(dateString) {
  // Convert dateString to a Date object
  const date = new Date(dateString);
  // Format time with toLocaleTimeString
  const timeString = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `At ${timeString}`;
}

export function formatEmail(input) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (input == null || input == "") {
    return "Email is required";
  } else if (!regex.test(input)) {
    return "Email must be a valid email address";
  } else if (input.length < 5) {
    return "Contains at least 5 characters";
  } else {
    return null;
  }
}

export function formatPassword(input) {
  const lowerCasePattern = /[a-z]/;
  const upperCasePattern = /[A-Z]/;
  const numberPattern = /[0-9]/;
  const specialCharPattern = /[@#%$^&*(){}\[\];'".,?!+=-]/;
  if (input == null || input == "") {
    return "Password is required";
  } else if (input.length < 8) {
    return "Contains at least 8 characters";
  } else if (!lowerCasePattern.test(input)) {
    return "Contains upper and lower case letters";
  } else if (!upperCasePattern.test(input)) {
    return "Contains upper and lower case letters";
  } else if (!numberPattern.test(input)) {
    return "Contain 1 numbers";
  } else if (!specialCharPattern.test(input)) {
    return "Contain 1 symbols (example: !#$)";
  }
  return null;
}

export function formatConfirmPassword(password, confirmPassword) {
  const lowerCasePattern = /[a-z]/;
  const upperCasePattern = /[A-Z]/;
  const numberPattern = /[0-9]/;
  const specialCharPattern = /[@#%$^&*(){}\[\];'".,?!+=-]/;
  if (confirmPassword == null || confirmPassword == "") {
    return "Confirm password is required";
  } else if (confirmPassword.length < 8) {
    return "Contains at least 8 characters";
  } else if (!lowerCasePattern.test(confirmPassword)) {
    return "Contains upper and lower case letters";
  } else if (!upperCasePattern.test(confirmPassword)) {
    return "Contains upper and lower case letters";
  } else if (!numberPattern.test(confirmPassword)) {
    return "Contain 1 numbers";
  } else if (!specialCharPattern.test(confirmPassword)) {
    return "Contain 1 symbols (example: !#$)";
  } else if (password != confirmPassword) {
    return "Confirm password does not match";
  }
  return null;
}

export function formatFullname(input) {
  const numberPattern = /[0-9]/;
  const specialCharPattern = /[@#%$^&*(){}\[\];'".,?!+=-]/;
  if (input == null || input == "") {
    return "Fullname is required";
  } else if (input.length < 10 || input.length > 20) {
    return "Fullname must be between 10 and 20 characters long";
  } else if (numberPattern.test(input)) {
    return "Fullname must contain alphabets";
  } else if (specialCharPattern.test(input)) {
    return "Fullname must contain alphabets";
  } else {
    return null;
  }
}

export function formatPhoneNumber(input) {
  if (input == null || input == "") {
    return "Phone number is required";
  } else if (!input.startsWith("0")) {
    return "PhoneNumber must be started with 0xx";
  } else if (input.length < 10 || input.length > 15) {
    return "Phone number must be between 10 and 15 characters long";
  } else {
    return null;
  }
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
// Define valid file extensions by type
const validFileExtensions = {
  files: ["pdf", "jpeg", "jpg"],
};

/**
 * Validate file type and size
 * @param {File} file - The file object to validate
 * @param {string} fileType - The type category to validate (e.g., "files")
 * @param {number} maxFileSize - Maximum file size in bytes (default: 5 MB)
 * @returns {boolean} - Returns true if file is valid, otherwise false
 */
export function validateFile(file, fileType = "files", maxFileSize = MAX_FILE_SIZE) {
  if (!file) return false;

  // Check if file extension is valid
  const fileExtension = file.name.split(".").pop().toLowerCase();
  const isValidType = validFileExtensions[fileType]?.includes(fileExtension);

  // Check if file size is within the allowed limit
  const isValidSize = file.size <= maxFileSize;

  return isValidType && isValidSize;
}
