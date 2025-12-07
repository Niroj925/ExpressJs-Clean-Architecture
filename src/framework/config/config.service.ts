
import { IConfigService } from 'core/interface/config.interface';
import 'dotenv/config';

export class ConfigService implements IConfigService {
  get(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  }

  getNumber(key: string): number {
    const value = this.get(key);
    const num = Number(value);
    if (isNaN(num)) {
      throw new Error(`Environment variable ${key} is not a number`);
    }
    return num;
  }

  getBoolean(key: string): boolean {
    const value = this.get(key).toLowerCase();
    return value === 'true' || value === '1';
  }
}
