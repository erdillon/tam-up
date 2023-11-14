import { CrawlStatus, type PrismaClient } from '@prisma/client'
import { type UUID } from '../models'
import { type CrawlWebpageActivityResult } from './crawl-webpage.activity'
import psl from 'psl'

export interface SaveCrawlResultActivityInput {
  id: UUID
  data: CrawlWebpageActivityResult
}

export async function saveCrawlResultActivity (input: SaveCrawlResultActivityInput, prisma: PrismaClient): Promise<void> {
  const { id, data } = input

  const now = new Date()

  if (data.status === CrawlStatus.ERROR) {
    await prisma.website.update({
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
      // Get the domain
      try {
        let domain = null
        const parsedUrl = new URL(url)
        const parsedHostname = psl.parse(parsedUrl.hostname)

        if (parsedHostname.error == null) {
          domain = parsedHostname.domain
        }

        await prisma.link.create({
          data: {
            url,
            domain,
            websiteId: id
          }
        })
      } catch (err) {
        console.log(`Invalid ${url}: ${err}`)
      }
    }

    await prisma.website.update({
      where: {
        id
      },
      data: {
        lastCrawlStatus: CrawlStatus.COMPLETE,
        lastCrawledAt: now,
        lastCrawlResult: null,
        visitedPages: data.visitedPages
      }
    })
  }
}
