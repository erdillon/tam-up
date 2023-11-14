import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { chromium } from 'playwright-extra'
import psl from 'psl'

import { PlaywrightBlocker } from '@cliqz/adblocker-playwright'
import fetch from 'cross-fetch'
import { filterExternalDomain, filterKnownDomains, noDocument, validUrl, allIFrameSrcs, allHrefs, chunk } from '../utils'
import { CrawlStatus } from '@prisma/client'
import { type Browser } from 'playwright'

export interface CrawlWebpageActivityResult {
  externalUrls: string[]
  visitedPages: string[]
  status: CrawlStatus
  error?: string
}

chromium.use(StealthPlugin())

/**
 * Crawls a webpage, and traverses all local links 1 level deep.
 *
 * "External" means that the URL does not point to the same hostname, i.e. a different domain or subdomain.
 *
 * @param url
 */
export async function crawlWebpageActivity (url: string): Promise<CrawlWebpageActivityResult> {
  const allExternalUrls: string[] = []
  const visitedPages: string[] = []

  const urlObj = new URL(url)

  const parsed = psl.parse(urlObj.hostname)

  if (parsed.error != null) {
    return {
      externalUrls: [],
      visitedPages: [],
      status: CrawlStatus.ERROR,
      error: parsed.error.message
    }
  }

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ ignoreHTTPSErrors: true })
  const blocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch)
  blocker.blockFonts()
  blocker.blockImages()
  blocker.blockFonts()
  blocker.blockStyles()
  // blocker.blockScripts()
  blocker.blockMedias()

  await blocker.enableBlockingInPage(page)

  try {
    await page.goto(url.toString(), { timeout: 180000 })

    // The actual URL may be different from the one we requested because of redirects.
    const actualUrl = page.url()
    visitedPages.push(actualUrl)

    const [hrefs, srcs] = await Promise.all([allHrefs(page), allIFrameSrcs(page)])

    allExternalUrls.push(...[...hrefs, ...srcs].filter(validUrl).filter(_ => !filterExternalDomain(_, actualUrl)).filter(filterKnownDomains))

    // Assemble a list of pages 1 level deep to visit.
    const pagesToVisit = Array.from(new Set(hrefs.filter(validUrl).filter(noDocument).filter(url => filterExternalDomain(url, actualUrl))))
    const chunks = chunk(pagesToVisit, 10)

    for (const urlChunk of chunks) {
      const chunkResult = await crawlUrlBatch(urlChunk, actualUrl, browser)
      visitedPages.push(...urlChunk)
      allExternalUrls.push(...chunkResult)
    }

    const externalUrls = Array.from(new Set(allExternalUrls))

    return {
      externalUrls,
      visitedPages,
      status: CrawlStatus.COMPLETE
    }
  } catch (err) {
    return {
      externalUrls: [],
      visitedPages: [],
      error: err.message,
      status: CrawlStatus.ERROR
    }
  } finally {
    await browser.close()
  }
}

/**
 * Crawl given urls in parallel for links external to baseDomain, opening a page on each and gathering all the results.
 *
 * NOTE: this function does not traverse links further down.
 *
 * @param urls
 * @param baseUrl
 * @param browser
 */
const crawlUrlBatch = async (urls: string[], baseUrl: string, browser: Browser): Promise<string[]> => {
  const pages = await Promise.all(urls.map(async url => await browser.newPage({ ignoreHTTPSErrors: true })))
  await Promise.all(urls.map(async (url, index) => await pages[index].goto(url, { timeout: 180000 })))
  const srcs = await Promise.all(pages.map(async page => await allIFrameSrcs(page)))
  const hrefs = await Promise.all(pages.map(async page => await allHrefs(page)))

  await Promise.all(pages.map(async page => { await page.close() }))
  return [...(srcs.flat()), ...(hrefs.flat())]
    .filter(validUrl)
    .filter(noDocument)
    .filter(url => !filterExternalDomain(url, baseUrl))
    .filter(filterKnownDomains)
}
