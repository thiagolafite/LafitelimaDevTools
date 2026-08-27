"use client";

export type UserRole = "admin" | "user";
export type UserStatus = "approved" | "pending_approval" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string;
  favoriteTools: string[];
  avatarColor?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const USERS_STORAGE_KEY = "lafitelimadev_users_db";
const SESSION_STORAGE_KEY = "lafitelimadev_active_session";

// Master Admin Seed
export const MASTER_ADMIN_EMAIL = "admin@lafitelima.com.br";
const MASTER_ADMIN_HASH = "f2b4294ace3572f5bd85051d8b8b77824de206f91796211ba7550835f8c08663"; // Hash of LfDev#9824$KmZ!2026@Adm

export const DEFAULT_ADMIN_USER: User = {
  id: "usr_master_admin_001",
  name: "Thiago Lafite",
  email: MASTER_ADMIN_EMAIL,
  passwordHash: MASTER_ADMIN_HASH,
  role: "admin",
  status: "approved",
  createdAt: "2026-08-26T00:00:00.000Z",
  lastLoginAt: "2026-08-26T00:00:00.000Z",
  favoriteTools: [],
  avatarColor: "bg-amber-500",
};

// Helper: SHA-256 Hash using native Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate random avatar background color
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function getRandomColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

// Helper: Load users from localStorage (always guarantees master admin exists)
export function getRegisteredUsers(): User[] {
  if (typeof window === "undefined") return [DEFAULT_ADMIN_USER];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    let users: User[] = raw ? JSON.parse(raw) : [];

    // Ensure Master Admin exists in database
    if (!users.some((u) => u.email === MASTER_ADMIN_EMAIL)) {
      users.unshift(DEFAULT_ADMIN_USER);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    return users;
  } catch {
    return [DEFAULT_ADMIN_USER];
  }
}

// Helper: Save users to localStorage
function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Register a new user (New users ALWAYS require Admin Approval)
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; requiresApproval?: boolean; error?: string }> {
  if (!name.trim() || !email.trim() || !password.trim()) {
    return { success: false, error: "Preencha todos os campos obrigatórios." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();

  if (users.some((u) => u.email === normalizedEmail)) {
    return { success: false, error: "Este e-mail já está cadastrado no sistema." };
  }

  if (password.length < 6) {
    return { success: false, error: "A senha deve conter no mínimo 6 caracteres." };
  }

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  // All newly registered users are created as role 'user' and status 'pending_approval'
  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "user",
    status: "pending_approval",
    createdAt: now,
    lastLoginAt: now,
    favoriteTools: [],
    avatarColor: getRandomColor(),
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, user: newUser, requiresApproval: true };
}

// Login user (Enforces strict Admin Approval)
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  if (!email.trim() || !password.trim()) {
    return { success: false, error: "Preencha o e-mail e a senha." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const targetUser = users.find((u) => u.email === normalizedEmail);

  if (!targetUser) {
    return { success: false, error: "E-mail ou senha incorretos." };
  }

  const passwordHash = await hashPassword(password);
  if (targetUser.passwordHash !== passwordHash) {
    return { success: false, error: "E-mail ou senha incorretos." };
  }

  // Check Approval Status
  if (targetUser.status === "pending_approval") {
    return {
      success: false,
      error: "Sua conta foi criada, mas está aguardando a aprovação do Administrador para ser liberada.",
    };
  }

  if (targetUser.status === "rejected") {
    return {
      success: false,
      error: "Seu cadastro foi recusado pelo Administrador. Entre em contato com o suporte.",
    };
  }

  // Update last login
  targetUser.lastLoginAt = new Date().toISOString();
  saveUsers(users);

  // Set active session
  setCurrentSession(targetUser);

  return { success: true, user: targetUser };
}

// Set active user session
export function setCurrentSession(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

// Get currently logged-in user
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Logout
export function logoutUser() {
  setCurrentSession(null);
}

// Toggle tool favorite
export function toggleFavoriteTool(userId: string, toolId: string): string[] {
  const users = getRegisteredUsers();
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) return [];

  const user = users[userIndex];
  const exists = user.favoriteTools.includes(toolId);
  const updatedFavorites = exists
    ? user.favoriteTools.filter((id) => id !== toolId)
    : [...user.favoriteTools, toolId];

  user.favoriteTools = updatedFavorites;
  users[userIndex] = user;
  saveUsers(users);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    current.favoriteTools = updatedFavorites;
    setCurrentSession(current);
  }

  return updatedFavorites;
}

// Admin: Approve pending user
export function approveUser(adminUserId: string, targetUserId: string): boolean {
  const current = getCurrentUser();
  if (!current || current.role !== "admin") return false;

  const users = getRegisteredUsers();
  const target = users.find((u) => u.id === targetUserId);
  if (!target) return false;

  target.status = "approved";
  saveUsers(users);
  return true;
}

// Admin: Reject pending user
export function rejectUser(adminUserId: string, targetUserId: string): boolean {
  const current = getCurrentUser();
  if (!current || current.role !== "admin") return false;

  const users = getRegisteredUsers();
  const target = users.find((u) => u.id === targetUserId);
  if (!target) return false;

  target.status = "rejected";
  saveUsers(users);
  return true;
}

// Admin: Promote or demote user
export function updateUserRole(adminUserId: string, targetUserId: string, newRole: UserRole): boolean {
  const current = getCurrentUser();
  if (!current || current.role !== "admin" || targetUserId === DEFAULT_ADMIN_USER.id) return false;

  const users = getRegisteredUsers();
  const target = users.find((u) => u.id === targetUserId);
  if (!target) return false;

  target.role = newRole;
  saveUsers(users);

  if (current.id === targetUserId) {
    current.role = newRole;
    setCurrentSession(current);
  }

  return true;
}

// Admin: Delete user
export function deleteUser(adminUserId: string, targetUserId: string): boolean {
  const current = getCurrentUser();
  if (!current || current.role !== "admin" || adminUserId === targetUserId || targetUserId === DEFAULT_ADMIN_USER.id) {
    return false;
  }

  let users = getRegisteredUsers();
  users = users.filter((u) => u.id !== targetUserId);
  saveUsers(users);
  return true;
}
