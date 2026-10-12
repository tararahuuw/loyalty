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

// Function to validate IPv4 address
function isIPv4(ip) {
  const ipv4Pattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Pattern.test(ip)) return false;

  // Check each octet to ensure it is within the 0-255 range
  return ip.split(".").every((octet) => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
}

function isIPv6(ip) {
  const ipv6Pattern =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|:([0-9a-fA-F]{1,4}:){1,7}|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(:[0-9a-fA-F]{1,4}){1,6}|:(:(:[0-9a-fA-F]{1,4}){1,7}|:)|::|([0-9a-fA-F]{1,4}:){1,7}:)$/;
  return ipv6Pattern.test(ip.trim());
}

// Function to validate if a list of IPs are valid IPv4 or IPv6 addresses
export function isIP(ipAddresses) {
  if (typeof ipAddresses === "string") {
    // Validate a single IP address
    return isIPv4(ipAddresses) || isIPv6(ipAddresses);
  }

  if (Array.isArray(ipAddresses)) {
    // Validate each IP in the list
    return ipAddresses.every((ip) => isIPv4(ip) || isIPv6(ip));
  }

  // Return false if it's neither a string nor an array
  return false;
}

// Function to validate general URL
export function isURL(url) {
  const urlPattern =
    /^(https?:\/\/)?(localhost|(\b\d{1,3}(\.\d{1,3}){3}\b)|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))(:\d+)?(\/[^\s]*)?(\?[^\s]*)?(#\S*)?$/;
  return urlPattern.test(url);
}
