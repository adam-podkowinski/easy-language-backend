import { PostgresErrorCode } from './error-codes.enum';
import { ConflictException } from '@nestjs/common';

export function catchUniqueViolation(error) {
  if (error?.code === PostgresErrorCode.UniqueViolation) {
    throw new ConflictException(
      'Dictionary with that language already exists.',
    );
  }
  throw error;
}
