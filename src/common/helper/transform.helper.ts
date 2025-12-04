import { plainToInstance, Transform } from 'class-transformer';

export function transformObjectToClass<T>(
  sourceObject: object,
  targetClass: new () => T,
): T {
  return plainToInstance(targetClass, sourceObject, {
    enableImplicitConversion: false,
    excludeExtraneousValues: true,
  });
}

export function parseIfString<T>() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as T;
      } catch {
        // leave it as-is – class-validator will complain
        return value;
      }
    }
    return value;
  });
}
