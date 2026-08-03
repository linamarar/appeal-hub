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

  canAddInternalComment(user = getCurrentUser()) {
    return user.permissions.includes('appeal.addInternalComment');
  },

  canAddAttachment(user = getCurrentUser()) {
    return user.permissions.includes('appeal.addAttachment');
  },

  canViewInternalComments(user = getCurrentUser()) {
    return user.permissions.includes('appeal.viewInternalComments');
  },
};
