import { EnvNamesEnum } from '../enums/env-names.enum';

export interface IEnvElement {
  name: string;
  type: 'string' | 'int' | 'float' | 'boolean';
  minOrMinLength?: number;
  maxOrMaxLength?: number;
  required: boolean | EnvNamesEnum;
  bootedValue?: string | number | boolean;
}

export interface IEnvReturnedMessage {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
}
