import { CrawlStatus, type PrismaClient } from '@prisma/client'
import { type UUID } from '../models'

export interface MarkCrawlPendingActivityInput {
  id: UUID
}

export async function markCrawlPendingActivity (input: MarkCrawlPendingActivityInput, prisma: PrismaClient): Promise<void> {
  const { id } = input
  await prisma.webpage.update({
    where: {
      id
    },
    data: {
      lastCrawlStatus: CrawlStatus.PENDING
    }
  })
}
