export const swrConfig = (navigate) => ({
  keepPreviousData: true,
  revalidateOnFocus: true,
  onError: (err) => {
    const isTokenInvalid =
      err.response?.data?.message === "Invalid or expired refresh token." ||
      err.response?.data?.message === "No refresh token provided.";

    if (err.response?.status === 400 && isTokenInvalid) {
      navigate("/");
    }
  },
});

export function capitalize(string) {
  let strArr = string.split(" ");

  strArr = strArr.map((item) => {
    let newItem = "";
    if (item.length === 2 && item !== "up") {
      newItem = item.toUpperCase();
    } else {
      newItem = item[0].substring(0).toUpperCase() + item.substring(1);
    }
    return newItem;
  });

  return strArr.join(" ");
}

export default function navigate(to) {
  return window.history.pushState({}, "", to);
}


export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidTenDigitPhone(phone) {
  return /^\d{10}$/.test(phone);
}

// Allows letters and spaces
export function isValidName(name) {
  return /^[a-zA-Z\s]+$/.test(name);
}

// New helper for password validation
export function isValidPassword(password = "", names = []) {
  let isValid = true;
  let message = "";

  // check if names are included in the password
  if (password && names.length !== 0) {
    const [firstname, lastname] = names
    if (password.includes(firstname) || password.includes(lastname)) {
      isValid = false
      message = "Password should not contain your names."
      return { isValid, message }
    }

  }

  // check password length
  if (password.length < 8) {
    isValid = false
    message = "Password should be greater than 10 characters"
    return { isValid, message }
  }

  return { isValid, message }
}



