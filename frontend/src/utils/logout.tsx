import { deleteCookie } from "./cookies";

export function logoutUser(setAccountId: (id: string | null) => void) {
  deleteCookie("accountId");
  deleteCookie("petProfileId");
  localStorage.removeItem("accountId");
  localStorage.removeItem("petProfileId");
  sessionStorage.clear(); // if you're using session storage anywhere

  setAccountId(null);
}
