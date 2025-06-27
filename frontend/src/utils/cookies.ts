export function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}
