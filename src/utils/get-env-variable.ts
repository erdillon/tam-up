import { env } from 'process'

export function getEnvVariable (variableName: string): string {
  const value = env[variableName]

  if (value === undefined || value == null) {
    throw new Error(`Environment variable ${variableName} missing, check configuration`)
  }

  return value
}
