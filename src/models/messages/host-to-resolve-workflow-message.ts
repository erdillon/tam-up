import { defineSignal } from '@temporalio/workflow'
import { type EntityWorkflowMessageBase } from './entity-workflow-message-base'

export interface HostToResolveWorkflowMessage extends EntityWorkflowMessageBase {
  hostname: string
}

export const hostToResolveMessageSignal = defineSignal<[HostToResolveWorkflowMessage]>('hostToResolveMessageSignal')
