import { generateTemporalClient } from '../connection'
import { TASK_QUEUE } from '../models/constants'
import { resolveHostsWorkflow } from '../workflows'

async function startHostsResolver (): Promise<string> {
  const temporalClient = await generateTemporalClient()

  const randomInt = Math.floor(Math.random() * 100)
  const workflowId = `resolve:${randomInt}`
  await temporalClient.start(resolveHostsWorkflow, {
    workflowId,
    args: [],
    taskQueue: TASK_QUEUE
  })

  return workflowId
}

startHostsResolver()
  .then((workflowId) => { console.log(`${workflowId} started`) })
  .catch((err: any) => { console.error(err) })
