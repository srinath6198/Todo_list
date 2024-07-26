// src/components/roles.js
export const ROLES = {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    USER: 'User',
  };
  
  export const PERMISSIONS = {
    [ROLES.ADMIN]: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    [ROLES.MANAGER]: ['READ', 'UPDATE', 'ASSIGN'],
    [ROLES.USER]: ['READ', 'UPDATE'],
  };
  