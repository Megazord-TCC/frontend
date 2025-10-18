
export function decodeToken<T>(token: string): T | undefined {
  try {
    const payload = token.split(".")[1]; // JWT format: header.payload.signature
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/")); // base64url → base64
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Invalid token:", e);
    return undefined;
  }
}