import { type PrismaClient } from '@prisma/client'
import { type UUID } from '../models'
import { BATCH_SIZE } from '../models/constants'

export type SelectWebpagesBatchActivityOutput = Array<{
  id: UUID
  accountId: string
  hostname: string
}>

export async function selectWebpagesBatchActivity (
  prisma: PrismaClient): Promise<SelectWebpagesBatchActivityOutput> {
  const results = await prisma.webpage.findMany({
    where: {
      lastCrawledAt: null
    },
    select: {
      id: true,
      accountId: true,
      hostname: true
    },
    take: BATCH_SIZE
  })

  return results
}
