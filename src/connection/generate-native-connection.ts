import { NativeConnection } from '@temporalio/worker'
import { getConnectionOptions } from './get-connection-options'

export async function generateNativeConnection (): Promise<NativeConnection> {
  const connectionOptions = await getConnectionOptions()

  return await NativeConnection.connect(connectionOptions)
}
