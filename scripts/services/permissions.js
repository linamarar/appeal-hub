/**
 * Проверка прав текущего mock-пользователя.
 */

const Permissions = {
  canAccept(user = getCurrentUser()) {
    return user.permissions.includes('appeal.accept');
  },

  canChangeStatus(user = getCurrentUser()) {
    return user.permissions.includes('appeal.changeStatus');
  },

  canAssign(user = getCurrentUser()) {
    return user.permissions.includes('appeal.assign');
  },

  canReassign(user = getCurrentUser()) {
    return user.permissions.includes('appeal.reassign');
  },
};
