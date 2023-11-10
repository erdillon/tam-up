import { CrawlStatus, type PrismaClient } from '@prisma/client'
import { type UUID } from '../models'
import { type CrawlWebpageActivityResult } from './crawl-webpage.activity'

export interface SaveCrawlResultActivityInput {
  id: UUID
  data: CrawlWebpageActivityResult
}

export async function saveCrawlResultActivity (input: SaveCrawlResultActivityInput, prisma: PrismaClient): Promise<void> {
  const { id, data } = input

  const now = new Date()

  if (data.status === CrawlStatus.ERROR) {
    await prisma.webpage.update({
      where: {
        id
      },
      data: {
        lastCrawlStatus: CrawlStatus.ERROR,
        lastCrawledAt: now,
        lastCrawlResult: data.error
      }
    })
  } else {
    for (const url of data.externalUrls) {
      await prisma.link.create({
        data: {
          url,
          webPageId: id
        }
      })
    }

    await prisma.webpage.update({
      where: {
        id
      },
      data: {
        lastCrawlStatus: CrawlStatus.COMPLETE,
        lastCrawledAt: now,
        visitedPages: data.visitedPages
      }
    })
  }
}
