export function formatNPWP(input) {
    const numberString = input.toString();
    let formattedNumber = '';
    
    for (let i = 0; i < numberString.length; i++) {
        if (i === 9) {
            formattedNumber += '-';
        }

        formattedNumber += numberString[i];

        if (i === 1 || i === 4 || i === 7 || i === 11) {
            formattedNumber += '.';
        }

    }

    return formattedNumber;
}

export function formatPrice(input) {
    const numericInput = parseFloat(input);
  
    if (!isNaN(numericInput)) {
        const formattedPrice = numericInput.toLocaleString('id-ID');
        return formattedPrice;
    } else {
      return input;
    }
}

export function formatEmail(input) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (input == null || input == "") {
        return "Email is required"
    }
    else if (!regex.test(input)) {
        return "Email must be a valid email address"
    }
    else if (input.length < 5) {
        return "Contains at least 5 characters"
    }
    else {
        return null
    }
}

export function formatPassword(input) {
    const lowerCasePattern = /[a-z]/;
    const upperCasePattern = /[A-Z]/;
    const numberPattern = /[0-9]/;
    const specialCharPattern = /[@#%$^&*(){}\[\];'".,?!+=-]/;
    if (input == null || input == "") {
        return "Password is required"
    }
    else if (input.length < 8) {
        return "Contains at least 8 characters"
    }
    else if (!lowerCasePattern.test(input)) {
        return "Contains upper and lower case letters"
    }
    else if (!upperCasePattern.test(input)) {
        return "Contains upper and lower case letters"
    }
    else if (!numberPattern.test(input)) {
        return "Contain 1 numbers"
    }
    else if (!specialCharPattern.test(input)) {
        return "Contain 1 symbols (example: !#$)"
    }
    return null
}

export function formatConfirmPassword(password, confirmPassword) {
    const lowerCasePattern = /[a-z]/;
    const upperCasePattern = /[A-Z]/;
    const numberPattern = /[0-9]/;
    const specialCharPattern = /[@#%$^&*(){}\[\];'".,?!+=-]/;
    if (confirmPassword == null || confirmPassword == "") {
        return "Confirm password is required"
    }
    else if (confirmPassword.length < 8) {
        return "Contains at least 8 characters"
    }
    else if (!lowerCasePattern.test(confirmPassword)) {
        return "Contains upper and lower case letters"
    }
    else if (!upperCasePattern.test(confirmPassword)) {
        return "Contains upper and lower case letters"
    }
    else if (!numberPattern.test(confirmPassword)) {
        return "Contain 1 numbers"
    }
    else if (!specialCharPattern.test(confirmPassword)) {
        return "Contain 1 symbols (example: !#$)"
    }
    else if (password != confirmPassword) {
        return "Confirm password does not match"
    }
    return null
}

export function formatFullname(input) {
    const numberPattern = /[0-9]/;
    const specialCharPattern = /[@#%$^&*(){}\[\];'".,?!+=-]/;
    if (input == null || input == "") {
        return "Fullname is required"
    }
    else if (input.length < 10 || input.length > 20) {
        return "Fullname must be between 10 and 20 characters long"
    }
    else if (numberPattern.test(input)) {
        return "Fullname must contain alphabets"
    }
    else if (specialCharPattern.test(input)) {
        return "Fullname must contain alphabets"
    }
    else {
        return null
    }
}

export function formatPhoneNumber(input) {
    if (input == null || input == "") {
        return "Phone number is required"
    }
    else if (!input.startsWith("0")) {
        return "PhoneNumber must be started with 0xx"
    }
    else if (input.length < 10 || input.length > 15) {
        return "Phone number must be between 10 and 15 characters long"
    }
    else {
        return null
    }
}

export function decodeJWT(input) {
    if (!input) return null;
    const base64Url = input.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.exp;
}