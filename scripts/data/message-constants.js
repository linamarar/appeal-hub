/**
 * Константы и валидация сообщений / вложений.
 */

const MESSAGE_TYPES = {
  CLIENT_MESSAGE: 'CLIENT_MESSAGE',
  INTERNAL_COMMENT: 'INTERNAL_COMMENT',
  SYSTEM_EVENT: 'SYSTEM_EVENT',
};

const MESSAGE_VISIBILITY = {
  CLIENT: 'CLIENT',
  INTERNAL: 'INTERNAL',
};

const ATTACHMENT_STATUS = {
  READY: 'READY',
  UPLOADING: 'UPLOADING',
  ERROR: 'ERROR',
};

const ATTACHMENT_LIMITS = {
  maxFiles: 10,
  maxFileSizeBytes: 20 * 1024 * 1024,
  maxTotalSizeBytes: 50 * 1024 * 1024,
};

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'txt'];

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'text/plain',
];

const EXTENSION_MIME_MAP = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  txt: 'text/plain',
};

const COMMENT_MAX_LENGTH = 5000;

function getFileExtension(name) {
  const parts = String(name || '').split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

function isAllowedFile(name, mimeType) {
  const ext = getFileExtension(name);
  if (!ALLOWED_EXTENSIONS.includes(ext)) return false;
  if (mimeType && mimeType !== 'application/octet-stream') {
    const expected = EXTENSION_MIME_MAP[ext];
    if (expected && mimeType !== expected) {
      const alt = mimeType.startsWith('image/') && ['jpg', 'jpeg', 'png'].includes(ext);
      if (!alt) return false;
    }
  }
  return true;
}

function formatFileSize(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0).replace('.0', '')} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.0', '')} МБ`;
}

const AttachmentValidator = {
  validate(files, existingCount = 0) {
    if (!files?.length) return { valid: true, files: [] };

    if (existingCount + files.length > ATTACHMENT_LIMITS.maxFiles) {
      return { valid: false, message: `Максимум ${ATTACHMENT_LIMITS.maxFiles} файлов за один комментарий` };
    }

    let totalSize = 0;
    for (const file of files) {
      if (!file.name?.trim()) {
        return { valid: false, message: 'Имя файла не указано' };
      }
      if (!isAllowedFile(file.name, file.mimeType || file.type)) {
        return { valid: false, message: `Формат файла «${file.name}» не поддерживается` };
      }
      const size = file.size || 0;
      if (size > ATTACHMENT_LIMITS.maxFileSizeBytes) {
        return { valid: false, message: `Файл «${file.name}» превышает 20 МБ` };
      }
      totalSize += size;
    }

    if (totalSize > ATTACHMENT_LIMITS.maxTotalSizeBytes) {
      return { valid: false, message: 'Общий размер файлов не должен превышать 50 МБ' };
    }

    return { valid: true, files };
  },
};

function generateMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function generateAttachmentId() {
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
