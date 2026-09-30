export const USERS_STORAGE_KEY = "nbro_users";
export const PASSWORD_RESET_STORAGE_KEY = "nbro_password_reset_request";

export function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

export function isValidEmail(email = "") {
  const normalizedEmail = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
}

export async function hashPassword(password = "") {
  const encoder = new TextEncoder();
  const data = encoder.encode(String(password));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getUsers() {
  if (typeof window === "undefined") return [];

  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getPasswordResetRequest() {
  if (typeof window === "undefined") return null;

  try {
    const storedRequest = localStorage.getItem(PASSWORD_RESET_STORAGE_KEY);
    return storedRequest ? JSON.parse(storedRequest) : null;
  } catch {
    return null;
  }
}

export function savePasswordResetRequest(request) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PASSWORD_RESET_STORAGE_KEY, JSON.stringify(request));
}

export function clearPasswordResetRequest() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PASSWORD_RESET_STORAGE_KEY);
}

export function requestPasswordReset(users, email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return { ok: false, message: "Please enter your email address" };
  }

  if (!isValidEmail(normalizedEmail)) {
    return { ok: false, message: "Please enter a valid email address" };
  }

  const user = users.find(
    (entry) => normalizeEmail(entry.email) === normalizedEmail,
  );

  if (!user) {
    return { ok: false, message: "No account found for this email" };
  }

  const token =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const request = {
    email: normalizedEmail,
    token,
    createdAt: new Date().toISOString(),
  };

  savePasswordResetRequest(request);

  return {
    ok: true,
    email: normalizedEmail,
    token,
    message: "Password reset instructions have been sent to your email address.",
  };
}

export async function resetPassword(users, email, newPassword) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return { ok: false, message: "Please enter your email address" };
  }

  if (!isValidEmail(normalizedEmail)) {
    return { ok: false, message: "Please enter a valid email address" };
  }

  const user = users.find(
    (entry) => normalizeEmail(entry.email) === normalizedEmail,
  );

  if (!user) {
    return { ok: false, message: "No account found for this email" };
  }

  if (!newPassword || String(newPassword).trim().length < 6) {
    return { ok: false, message: "Password must be at least 6 characters" };
  }

  const updatedUser = {
    ...user,
    passwordHash: await hashPassword(String(newPassword)),
  };

  const updatedUsers = users.map((entry) =>
    normalizeEmail(entry.email) === normalizedEmail ? updatedUser : entry,
  );

  saveUsers(updatedUsers);
  clearPasswordResetRequest();

  return {
    ok: true,
    user: { name: updatedUser.name, email: updatedUser.email, passwordHash: updatedUser.passwordHash },
    message: "Password reset successfully",
  };
}

export async function registerUser({ name, email, password }) {
  const trimmedName = String(name || "").trim();
  const normalizedEmail = normalizeEmail(email);
  const users = getUsers();

  if (!trimmedName || !normalizedEmail || !password) {
    return { ok: false, message: "All fields are required" };
  }

  if (!isValidEmail(normalizedEmail)) {
    return { ok: false, message: "Please enter a valid email address" };
  }

  if (password.length < 6) {
    return { ok: false, message: "Password must be at least 6 characters" };
  }

  const emailAlreadyExists = users.some(
    (user) => normalizeEmail(user.email) === normalizedEmail,
  );

  if (emailAlreadyExists) {
    return { ok: false, message: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(password);
  const user = {
    name: trimmedName,
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, user]);

  return {
    ok: true,
    user: { name: user.name, email: user.email },
  };
}

export async function verifyCredentials(users, email, password) {
  const normalizedEmail = normalizeEmail(email);
  const user = users.find(
    (entry) => normalizeEmail(entry.email) === normalizedEmail,
  );

  if (!user) {
    return { ok: false, message: "Invalid email or password" };
  }

  const passwordHash = await hashPassword(password);

  if (user.passwordHash !== passwordHash) {
    return { ok: false, message: "Invalid email or password" };
  }

  return {
    ok: true,
    user: { name: user.name, email: user.email },
  };
}
