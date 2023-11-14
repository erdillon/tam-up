import { orderedWorkflowHelper } from '../helpers'
import { type WebpageCrawlerWorkflowMessage, webpageCrawlerMessageSignal } from '../models/messages/webpage-crawler-workflow-message'
import type { createActivities } from '../activities'
import { proxyActivities } from '@temporalio/workflow'

const { crawlWebpageActivity, hostnameToUrlActivity, saveCrawlResultActivity } = proxyActivities<ReturnType <typeof createActivities>>({
  startToCloseTimeout: '10 minutes'
})

export async function webpageCrawlerWorkflow (): Promise<void> {
  await orderedWorkflowHelper({
    signalDefinition: webpageCrawlerMessageSignal,
    messageHandler: async (webpageCrawlerMessage: WebpageCrawlerWorkflowMessage) => {
      // Check if the hostname is valid and make a URL for it
      try {
        const url = await hostnameToUrlActivity(webpageCrawlerMessage.hostname)

        console.log(`STARTING: Crawling ${webpageCrawlerMessage.hostname} for account ${webpageCrawlerMessage.accountId}`)

        // Crawl it and get the results
        const result = await crawlWebpageActivity(url)

        // Update the DB with the results
        await saveCrawlResultActivity({
          id: webpageCrawlerMessage.entityId,
          data: result
        })

        console.log(`COMPLETE: Crawling ${webpageCrawlerMessage.hostname} for account ${webpageCrawlerMessage.accountId}`)
      } catch (err) {
        console.log(`ERROR: Crawling ${webpageCrawlerMessage.hostname} for account ${webpageCrawlerMessage.accountId}: ${err}`)
      }
    }
  })
}
