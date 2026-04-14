export type Environment = 'dev' | 'staging' | 'prod';

interface EnvironmentConfig {
  baseURL: string;
  apiURL: string;
  timeout: number;
}

const configs: Record<Environment, EnvironmentConfig> = {
  dev: {
    baseURL: 'https://dev.example.com',
    apiURL:  'https://api.dev.example.com',
    timeout: 60_000,
  },
  staging: {
    baseURL: 'https://staging.example.com',
    apiURL:  'https://api.staging.example.com',
    timeout: 45_000,
  },
  prod: {
    baseURL: 'https://example.com',
    apiURL:  'https://api.example.com',
    timeout: 30_000,
  },
};

export function getEnvironmentConfig(): EnvironmentConfig {
  const env = (process.env.ENV as Environment) || 'dev';
  const config = configs[env];
  if (!config) {
    throw new Error(`Unknown environment: ${env}`);
  }
  return config;
}

export const ENV_CONFIG = getEnvironmentConfig();
