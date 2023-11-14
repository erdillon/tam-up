import { generateTemporalClient } from '../connection'
import { TASK_QUEUE } from '../models/constants'
import { crawlWebpagesWorkflow } from '../workflows'

async function startWebpagesCrawler (): Promise<string> {
  const temporalClient = await generateTemporalClient()

  const randomInt = Math.floor(Math.random() * 100)
  const workflowId = `resolve:${randomInt}`
  await temporalClient.start(crawlWebpagesWorkflow, {
    workflowId,
    args: [],
    taskQueue: TASK_QUEUE
  })

  return workflowId
}

startWebpagesCrawler()
  .then((workflowId) => { console.log(`${workflowId} started`) })
  .catch((err: any) => { console.error(err) })
