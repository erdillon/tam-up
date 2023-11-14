import { PrismaClient } from '@prisma/client'
import { markCrawlPendingActivity } from '../activities/mark-crawl-pending.activity'
import { crawlWebpageActivity } from '../activities/crawl-webpage.activity'
import { hostnameToUrlActivity } from '../activities/hostname-to-url.activity'
import { saveCrawlResultActivity } from '../activities/save-crawl-result.activity'

async function crawlOne (accountId: string): Promise<void> {
  const prisma = new PrismaClient()

  const webpage = await prisma.website.findFirst({
    where: {
      accountId
    }
  })

  if (webpage === null) {
    throw new Error(`No webpage found for account ${accountId}`)
  }

  await markCrawlPendingActivity({ id: webpage.id }, prisma)

  const url = await hostnameToUrlActivity(webpage.hostname)

  const result = await crawlWebpageActivity(url)

  await saveCrawlResultActivity({
    id: webpage.id,
    data: result
  }, prisma)

  console.log(result)
}

crawlOne('0014z00001oMNYOAA4')
  .then(() => { console.log('done') })
  .catch((err: any) => { console.error(err) })
