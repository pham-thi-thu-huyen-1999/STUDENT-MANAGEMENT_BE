import { HttpStatus, SetMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { IS_PUBLIC_KEY } from '../constants';
import { buildError, buildMessageErrors } from './builds';

const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

const handleValidate = async <T extends unknown>(dto: object, cb: (data: object) => T): Promise<T> => {
  const errors = await validate(dto);

  if (errors.length > 0) {
    return buildError({
      errors: buildMessageErrors(errors),
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
  return cb(dto);
};

/**
 * fix total 2 and size 10 => 0.2 => 0 => wrong => fix to 1
 */
const handleTotalPage = (lengthData: number, pageSize: number) =>
  (lengthData % pageSize !== 0 && lengthData % pageSize < pageSize / 2 ? 1 : 0) + Math.round(lengthData / pageSize);

export { Public, handleValidate, handleTotalPage };
