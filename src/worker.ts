import { Worker } from '@temporalio/worker'
import { createActivities } from './activities'
import { generateNativeConnection } from './connection'
import { TASK_QUEUE } from './models/constants'
import { PrismaClient } from '@prisma/client'

async function run (): Promise<void> {
  const nativeConnection = await generateNativeConnection()

  // We're going to share the DB connection across all activities
  const prisma = new PrismaClient()

  const worker = await Worker.create({
    connection: nativeConnection,
    workflowsPath: require.resolve('./workflows'),
    taskQueue: TASK_QUEUE,
    activities: createActivities(prisma),
    maxConcurrentActivityTaskExecutions: 10,
    maxConcurrentLocalActivityExecutions: 10,
    maxConcurrentWorkflowTaskExecutions: 10
  })

  await worker.run()
}

run()
  .then(() => { console.log('Done.') })
  .catch((err: any) => { console.error(err) })
