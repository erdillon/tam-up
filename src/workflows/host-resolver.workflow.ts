import { ResolveStatus } from '@prisma/client'
import { orderedWorkflowHelper } from '../helpers'
import { hostToResolveMessageSignal, type HostToResolveWorkflowMessage } from '../models'
import type { createActivities } from '../activities'
import { proxyActivities } from '@temporalio/workflow'

const { resolveHostActivity, updateHostActivity } = proxyActivities<ReturnType <typeof createActivities>>({
  startToCloseTimeout: '3 minutes'
})

/**
 *
 */
export async function hostResolverWorkflow (): Promise<void> {
  await orderedWorkflowHelper({
    signalDefinition: hostToResolveMessageSignal,
    messageHandler: async (hostToResolveMessage: HostToResolveWorkflowMessage) => {
      const { hostname, entityId } = hostToResolveMessage

      try {
        const records = await resolveHostActivity(hostname)
        const resolveStatus = records.length !== 0 ? ResolveStatus.RESOLVED : ResolveStatus.UNRESOLVED

        await updateHostActivity(
          {
            id: entityId,
            data: {
              resolvedRecords: records,
              lastResolveTime: new Date(),
              lastResolveResult: resolveStatus
            }
          }
        )
      } catch (err) {
        // The exception is thrown after the max number of retries.
        await updateHostActivity(
          {
            id: entityId,
            data: {
              lastResolveTime: new Date(),
              lastResolveResult: ResolveStatus.ERROR
            }
          }
        )
      }
    }
  })
}
