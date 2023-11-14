import { proxyActivities } from '@temporalio/workflow'
import { generateRecordProcessingWorkflowId } from '../helpers/generate-record-processing-workflow-id'
import { type WebpageCrawlerWorkflowMessage } from '../models'
import type { createActivities } from '../activities'

const { signalWithStartActivity, getTaskQueueActivity, selectWebpagesBatchActivity, markCrawlPendingActivity } = proxyActivities<ReturnType <typeof createActivities>>({
  startToCloseTimeout: '3 minutes'
})

/**
 * Starts webpage crawler workflows for all webpages in DB with matching criteria
 *
 * @param input
 */
export async function crawlWebpagesWorkflow (): Promise<void> {
  const webpagesToCrawl = await selectWebpagesBatchActivity()

  if (webpagesToCrawl.length !== 0) {
    for (const webpageToCrawl of webpagesToCrawl) {
      // Mark the webpage as pending and signal the workflow
      await markCrawlPendingActivity({ id: webpageToCrawl.id })
      await signalWithStartActivity<WebpageCrawlerWorkflowMessage>(
        'webpageCrawlerWorkflow',
        'webpageCrawlerMessageSignal',
        {
          entityId: webpageToCrawl.id,
          accountId: webpageToCrawl.accountId,
          hostname: webpageToCrawl.hostname
        },
        generateRecordProcessingWorkflowId(webpageToCrawl.accountId, 'webpageCrawler'),
        await getTaskQueueActivity()
      )
    }
  }
}
