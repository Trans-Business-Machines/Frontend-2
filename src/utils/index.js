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

export default function navigate(to) {
  return window.history.pushState({}, "", to);
}
