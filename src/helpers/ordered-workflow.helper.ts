import {
  condition,
  setHandler,
  type SignalDefinition
} from '@temporalio/workflow'
import { type EntityWorkflowMessageBase } from '../models'
import { createEntityWorkflowHandlerHelper } from './create-entity-workflow-handler.helper'

interface MessageQueue<TData> {
  data: TData
  insertedTime: Date
}

export async function orderedWorkflowHelper<TSignalArgs extends EntityWorkflowMessageBase> ({
  signalDefinition,
  messageHandler
}: OrderedWorkflowInput<TSignalArgs>): Promise<void> {
  const queue: Array<MessageQueue<TSignalArgs>> = []
  let queueIndex = 0

  setHandler(signalDefinition, async signalArgs => {
    queue.push({
      data: signalArgs,
      insertedTime: new Date()
    })
  })

  await condition(() => queue.length > 0)

  while (queue.length > queueIndex) {
    // Typescript is not smart enough to know that it's not undefined
    const currentMessage = queue[queueIndex]

    await createEntityWorkflowHandlerHelper({
      args: currentMessage.data,
      messageHandler
    })

    queueIndex += 1
  }
}

export interface OrderedWorkflowInput<TSignalArgs extends EntityWorkflowMessageBase> {
  signalDefinition: SignalDefinition<[TSignalArgs]>
  messageHandler: (args: TSignalArgs) => Promise<void>
}
