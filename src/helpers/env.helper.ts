export type Environment = 'dev' | 'qa';

interface EnvironmentConfig {
  baseURL: string;
  apiURL: string;
  timeout: number;
}

const configs: Record<Environment, EnvironmentConfig> = {
  dev: {
    baseURL: 'https://webdev.fleetforc.com',
    apiURL:  'https://webdev.fleetforc.com/api',
    timeout: 60_000,
  },
  qa: {
    baseURL: 'https://webqa.fleetforc.com',
    apiURL:  'https://webqa.fleetforc.com/api',
    timeout: 60_000,
  },
};

export function getEnvironmentConfig(): EnvironmentConfig {
  const env = (process.env.ENV as Environment) ?? 'dev';
  const config = configs[env];
  if (!config) {
    throw new Error(`Unknown environment: ${env}`);
  }
  return config;
}

export const ENV_CONFIG = getEnvironmentConfig();
