import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { buildMessageErrors, buildError } from 'src/utils/functions/builds';

@Injectable()
class ValidationPipe implements PipeTransform<any> {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (!value) {
      return buildError({
        errors: [{ data: 'No data submitted' }],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      return buildError({
        errors: buildMessageErrors(errors),
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}

export default ValidationPipe;
