import { defineSignal } from '@temporalio/workflow'
import { type EntityWorkflowMessageBase } from './entity-workflow-message-base'

/**
 * Start crawling a webpage identified by the accountId (Salesforce)
 */
export interface WebpageCrawlerWorkflowMessage extends EntityWorkflowMessageBase {
  accountId: string
  hostname: string
}

export const webpageCrawlerMessageSignal = defineSignal<[WebpageCrawlerWorkflowMessage]>('webpageCrawlerMessageSignal')
