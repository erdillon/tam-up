import { upsertSearchAttributes, workflowInfo } from '@temporalio/workflow'

export const setWorkflowInfoSearchAttributes = (): void => {
  upsertSearchAttributes({
    workflowTypeText: [workflowInfo().workflowType]
  })
}
