import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';

export class PageQueryParamDTO {
  page?: number;
}

export class ReturnPerPageQueryParamDTO {
  returnPerPage?: number;
}

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const returnPerPageQueryParamSchema = z
  .string()
  .optional()
  .default('10')
  .transform(Number)
  .pipe(z.number().min(1).max(50));

export const pageQueryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
export const returnPerPageQueryValidationPipe = new ZodValidationPipe(returnPerPageQueryParamSchema);
