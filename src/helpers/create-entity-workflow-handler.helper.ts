// Only import the activity types
import {
  ActivityFailure,
  defaultPayloadConverter,
  type WorkflowInterceptors
} from '@temporalio/workflow'
import { type EntityWorkflowMessageBase } from '../models'

let currentMessage: EntityWorkflowMessageBase

export const STANDARD_ENTITY_WORKFLOW_SIGNAL_NAME = 'handleMessage'

export async function createEntityWorkflowHandlerHelper<TArgs extends EntityWorkflowMessageBase> ({
  args,
  messageHandler
}: CreateWorkflowHandlerInput<TArgs>): Promise<void> {
  currentMessage = args

  try {
    await messageHandler(args)
  } catch (error) {
    const isPoisonMessageFailure = error instanceof ActivityFailure &&
            (error.cause as { type: string } | undefined)?.type === 'PoisonMessageFailure'

    if (!isPoisonMessageFailure) {
      throw error
    }
  }
}

export interface CreateWorkflowHandlerInput<TArgs extends EntityWorkflowMessageBase> {
  args: TArgs
  messageHandler: (args: TArgs) => Promise<void>
}

export const interceptors = (): WorkflowInterceptors => ({
  inbound: [
  ],
  outbound: [
    {
      async scheduleActivity (input, next) {
        return await next({
          ...input,
          headers: {
            ...input.headers,
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            ...(currentMessage
              ? { message: defaultPayloadConverter.toPayload(currentMessage) }
              : {})
          }
        })
      }
    }
  ],
  internals: []
})
