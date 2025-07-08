import { deleteCookie } from "./cookies";
import { logout } from "../slices/authSlice";

export function logoutUser(dispatch: (action: any) => void) {
  // Clear cookies
  deleteCookie("accountId");
  deleteCookie("petProfileId");

  // Clear local storage
  localStorage.removeItem("accountId");
  localStorage.removeItem("petProfileId");

  // Clear session storage
  sessionStorage.clear();

  // Dispatch logout action
  dispatch(logout());

  // Additional cleanup if needed
  console.log("Logout complete - cookies cleared:", document.cookie);
}
