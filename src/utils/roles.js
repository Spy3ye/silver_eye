/**
 * Role constants and utilities
 */

export const ROLES = {
  ADMIN: 'admin',
  PARTICIPANT: 'participant',
  AUTHOR: 'author'
};

export const ALL_ROLES = Object.values(ROLES);

/**
 * Check if a role is valid
 */
export const isValidRole = (role) => {
  return ALL_ROLES.includes(role);
};

/**
 * Check if user has admin role
 */
export const isAdmin = (user) => {
  return user?.role === ROLES.ADMIN;
};

/**
 * Check if user has author role
 */
export const isAuthor = (user) => {
  return user?.role === ROLES.AUTHOR;
};

/**
 * Check if user has participant role
 */
export const isParticipant = (user) => {
  return user?.role === ROLES.PARTICIPANT;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user, roles) => {
  if (!user || !user.role) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
};

