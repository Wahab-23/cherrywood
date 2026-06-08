export const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  AUTHOR: "author",
  BUYER: "buyer",
  USER: "user",
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];

export const DASHBOARD_ROLES = new Set<string>([
  ROLES.ADMIN,
  ROLES.EDITOR,
  ROLES.AUTHOR,
]);

export const STOREFRONT_ROLES = new Set<string>([
  ROLES.ADMIN,
  ROLES.EDITOR,
  ROLES.AUTHOR,
  ROLES.BUYER,
]);
