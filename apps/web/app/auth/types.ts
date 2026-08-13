export type UserRole = "ADMIN" | "USER";

export type AuthUser = {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
};

export type AuthState = {
  user: AuthUser | null;
};

export type LoginInput = {
  username: string;
  password: string;
};
