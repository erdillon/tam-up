import { getConnectionOptions } from './get-connection-options'
import { Connection, WorkflowClient } from '@temporalio/client'
import { getEnvVariable } from '../utils/get-env-variable'

export async function generateTemporalClient (): Promise<WorkflowClient> {
  const connectionOptions = await getConnectionOptions()

  const connection = await Connection.connect(connectionOptions)

  // getContext().log.debug('Connection created!')

  return new WorkflowClient({
    connection,
    namespace: getEnvVariable('TEMPORAL_NAMESPACE') // connects to 'default' namespace if not specified
  })
}
