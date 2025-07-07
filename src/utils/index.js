export const swrConfig = (navigate) => ({
  keepPreviousData: true,
  revalidateOnFocus: true,
  onError: (err) => {
    const isTokenInvalid =
      err.response?.data?.message === "Invalid or expired refresh token." ||
      err.response?.data?.message === "No refresh token provided.";

    if (err.response?.status === 400 && isTokenInvalid) {
      navigate("/login");
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
