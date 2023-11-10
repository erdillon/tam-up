import { type PrismaClient } from '@prisma/client'
import { BATCH_SIZE } from '../models/constants'
import { type UUID } from '../models'

export type SelectHostsActivityOutput = Array<{
  id: UUID
  hostname: string
}>

export async function selectHostsActivity (prisma: PrismaClient): Promise<SelectHostsActivityOutput> {
  return await prisma.host.findMany({
    where: {
      lastResolveTime: null
    },
    select: {
      id: true,
      hostname: true
    },
    take: BATCH_SIZE
  })
}
