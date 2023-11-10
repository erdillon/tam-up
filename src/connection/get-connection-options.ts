import { USE_LOCAL } from '../models/constants'
import { getEnvVariable } from '../utils/get-env-variable'

interface PartialConnectionOptions {
  address: string
  tls?: {
    clientCertPair: {
      crt: Buffer
      key: Buffer
    }
  }
}

export async function getConnectionOptions (): Promise<PartialConnectionOptions> {
  const connectionOptions: PartialConnectionOptions = {
    address: getEnvVariable('TEMPORAL_SERVER_ADDRESS')
  }

  if (USE_LOCAL) {
    return connectionOptions
  }

  const cert = Buffer.from(getEnvVariable('TEMPORAL_CLIENT_CERTIFICATE'), 'base64').toString('ascii')
  const key = Buffer.from(getEnvVariable('TEMPORAL_CLIENT_KEY'), 'base64').toString('ascii')

  connectionOptions.tls = {
    clientCertPair: {
      crt: Buffer.from(cert),
      key: Buffer.from(key)
    }
  }

  return connectionOptions
}
