import { proxyActivities } from '@temporalio/workflow'
import { generateRecordProcessingWorkflowId } from '../helpers/generate-record-processing-workflow-id'
import { type HostToResolveWorkflowMessage } from '../models'
import type { createActivities } from '../activities'

const { signalWithStartActivity, selectHostsActivity, getTaskQueueActivity } = proxyActivities<ReturnType <typeof createActivities>>({
  startToCloseTimeout: '3 minutes'
})

/**
 * Attempts to resolve urls found in the DB with matching criteria
 *
 * @param input
 */
export async function resolveHostsWorkflow (): Promise<void> {
  const hostsToResolve = await selectHostsActivity()

  if (hostsToResolve.length !== 0) {
    for (const hostToResolve of hostsToResolve) {
      await signalWithStartActivity<HostToResolveWorkflowMessage>(
        'hostResolverWorkflow',
        'hostToResolveMessageSignal',
        {
          entityId: hostToResolve.id,
          hostname: hostToResolve.hostname
        },
        generateRecordProcessingWorkflowId(hostToResolve.id, 'hostResolver'),
        await getTaskQueueActivity()
      )
    }
  }
}
