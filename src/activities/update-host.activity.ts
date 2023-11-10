import { type Host, type PrismaClient } from '@prisma/client'
import { type UUID } from '../models'

export interface UpdateHostActivityInput {
  id: UUID
  data: Partial<Host>
}

export async function updateHostActivity (input: UpdateHostActivityInput, prisma: PrismaClient): Promise<void> {
  const { id, data } = input
  await prisma.host.update({
    where: {
      id
    },
    data
  })
}
