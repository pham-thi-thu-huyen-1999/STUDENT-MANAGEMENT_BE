import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { IPaginationParams } from 'src/interfaces/global.interface';

interface ResponseError {
  errors: Record<string, string>[];
  statusCode: number;
}

const buildSuccess = <T = unknown>(T: T): { data: T } => ({
  data: T,
});

const buildError = ({ errors, statusCode }: ResponseError) => {
  throw new HttpException(
    {
      errors,
      statusCode,
    },
    statusCode,
  );
};

const buildMessageErrors = (errors: ValidationError[]) => {
  return errors.map((error) => {
    const keys = Object.keys(error.constraints);
    const textError = keys.map((key) => error.constraints[key]).join(', ');
    return { [error.property]: textError };
  });
};

const buildValidPagination = (params: IPaginationParams) => {
  type Key = keyof IPaginationParams;
  const keys = Object.keys(params) as Key[];
  const errors: Record<string, string>[] = [];
  keys.forEach((key) => {
    if (!params[key] || params[key] <= 0) {
      errors.push({ [params[key]]: `${params[key]} is not exists, invalid or smaller than 0` });
    }
  });
  if (errors.length > 0) {
    return buildError({
      errors,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
};

export { buildSuccess, buildError, buildMessageErrors, buildValidPagination };
