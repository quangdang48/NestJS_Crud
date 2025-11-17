export class ImportUserResponseDto {
  message: string;
  imported: string[];
  failed: FailedImport[];
}

export class FailedImport {
  row: number;
  email?: string;
  descriptions: FailedField[];
}
export class FailedField {
  property: string;
  reason: string[];
}

export enum ErrorCodeImportUser {
  FIRST_NAME_REQUIRED = 'FIRST_NAME_REQUIRED',
  FIRST_NAME_INVALID = 'FIRST_NAME_INVALID',
  LAST_NAME_REQUIRED = 'LAST_NAME_REQUIRED',
  LAST_NAME_INVALID = 'LAST_NAME_INVALID',
  EMAIL_REQUIRED = 'EMAIL_REQUIRED',
  EMAIL_INVALID = 'EMAIL_INVALID',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  PASSWORD_REQUIRED = 'PASSWORD_REQUIRED',
  PASSWORD_TOO_SHORT = 'PASSWORD_TOO_SHORT',
  PASSWORD_TOO_LONG = 'PASSWORD_TOO_LONG',
  INVALID_ROW_FORMAT = 'INVALID_ROW_FORMAT',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export const ErrorMessageMap: Record<ErrorCodeImportUser, string> = {
  [ErrorCodeImportUser.FIRST_NAME_REQUIRED]: 'First name is required',
  [ErrorCodeImportUser.FIRST_NAME_INVALID]:
    'First name must be 2-30 characters',
  [ErrorCodeImportUser.LAST_NAME_REQUIRED]: 'Last name is required',
  [ErrorCodeImportUser.LAST_NAME_INVALID]: 'Last name must be 2-30 characters',
  [ErrorCodeImportUser.EMAIL_REQUIRED]: 'Email is required',
  [ErrorCodeImportUser.EMAIL_INVALID]: 'Email format is invalid',
  [ErrorCodeImportUser.EMAIL_ALREADY_EXISTS]: 'Email already exists',
  [ErrorCodeImportUser.PASSWORD_REQUIRED]: 'Password is required',
  [ErrorCodeImportUser.PASSWORD_TOO_SHORT]:
    'Password must be at least 8 characters',
  [ErrorCodeImportUser.PASSWORD_TOO_LONG]:
    'Password must be no more than 20 characters',
  [ErrorCodeImportUser.INVALID_ROW_FORMAT]: 'Invalid row format',
  [ErrorCodeImportUser.DATABASE_ERROR]: 'Database error occurred',
  [ErrorCodeImportUser.UNKNOWN_ERROR]: 'Unknown error occurred',
};
