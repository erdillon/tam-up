import { type UUID } from '../models'

/**
 * We use 1 entity workflow per record
 *
 */
export function generateRecordProcessingWorkflowId (
  recordUUID: UUID,
  workflowType: string
): string {
  return `${workflowType}:${recordUUID}`
}
