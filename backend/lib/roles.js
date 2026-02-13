export function requireRole(...allowedRoles) {
    return function (req, res, user) {
      if (!user || !allowedRoles.includes(user.role)) {
        return {
          error: "Forbidden: You do not have permission",
          status: 403,
        };
      }
  
      return { success: true };
    };
  }