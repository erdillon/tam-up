import { type PrismaClient } from '@prisma/client'

import { TASK_QUEUE } from '../models/constants'
import { type SignalDefinition, type Workflow } from '@temporalio/common'
import { generateTemporalClient } from '../connection/generate-temporal-client'
import { type EntityWorkflowMessageBase } from '../models'

import { selectWebpagesBatchActivity, type SelectWebpagesBatchActivityOutput } from './select-webpages-batch.activity'
import { updateHostActivity, type UpdateHostActivityInput } from './update-host.activity'
import { type SelectHostsActivityOutput, selectHostsActivity } from './select-hosts-batch.activity'
import { resolveHostActivity } from './resolve-host.activity'
import { hostnameToUrlActivity } from './hostname-to-url.activity'
import { type CrawlWebpageActivityResult, crawlWebpageActivity } from './crawl-webpage.activity'
import { type SaveCrawlResultActivityInput, saveCrawlResultActivity } from './save-crawl-result.activity'
import { markCrawlPendingActivity, type MarkCrawlPendingActivityInput } from './mark-crawl-pending.activity'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createActivities = (prisma: PrismaClient) => ({
  // Generic Activities
  async getTaskQueueActivity (): Promise<string> {
    return TASK_QUEUE
  },
  async signalWithStartActivity<TPayload extends EntityWorkflowMessageBase>(
    workflowType: string | Workflow,
    signal: string | SignalDefinition<[TPayload]>,
    signalPayload: TPayload,
    workflowId: string,
    taskQueue: string
  ): Promise<void> {
    const temporalClient = await generateTemporalClient()

    await temporalClient.signalWithStart(workflowType, {
      signal,
      signalArgs: [signalPayload],
      taskQueue,
      workflowId
    })
  },

  // Crawling activities
  async selectWebpagesBatchActivity (): Promise<SelectWebpagesBatchActivityOutput> {
    return await selectWebpagesBatchActivity(prisma)
  },
  async hostnameToUrlActivity (hostname: string): Promise<string> {
    return await hostnameToUrlActivity(hostname)
  },
  async crawlWebpageActivity (url: string): Promise<CrawlWebpageActivityResult> {
    return await crawlWebpageActivity(url)
  },
  async saveCrawlResultActivity (input: SaveCrawlResultActivityInput): Promise<void> {
    await saveCrawlResultActivity(input, prisma)
  },
  async markCrawlPendingActivity (input: MarkCrawlPendingActivityInput): Promise<void> {
    await markCrawlPendingActivity(input, prisma)
  },

  // Host Resolutions
  async resolveHostActivity (host: string): Promise<string[]> {
    return await resolveHostActivity(host)
  },
  async selectHostsActivity (): Promise<SelectHostsActivityOutput> {
    return await selectHostsActivity(prisma)
  },
  async updateHostActivity (input: UpdateHostActivityInput): Promise<void> {
    await updateHostActivity(input, prisma)
  }
})
