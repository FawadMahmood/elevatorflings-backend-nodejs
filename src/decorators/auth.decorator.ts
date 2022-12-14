import { ApolloError } from 'apollo-server-express';
import { AppConstants } from '../constants/app.constants';
import { ErrorConstants } from '../constants/errors.constants';
import { errors } from '../errors';

export function VerifyAuthorization(
  _target: any,
  _propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<void>>
) {
  const fn = descriptor.value!;
  descriptor.value = async function DescriptorValue(...args: any[]) {
    try {
      if (!args[1][AppConstants.IS_USER_LOGGED]) {
        return {
          error: {
            message: ErrorConstants.USER_NOT_AUTHORIZED,
            code: errors.INVALID_CREDENTIALS
          },
        } as any
        // throw new ApolloError(ErrorConstants.USER_NOT_AUTHORIZED);
      }
      return await fn.apply(this, args);
    } catch (error) {
      throw new ApolloError(error as unknown as string);
    }
  };
  return descriptor;
}