import { type Page } from 'playwright'

export const allHrefs = async (page: Page): Promise<string[]> => {
  return await page.$$eval('a', (elements) =>
    elements.map((el) => el.href)
  )
}

export const allIFrameSrcs = async (page: Page): Promise<string[]> => {
  return await page.$$eval('iframe', (elements) =>
    elements.map((el) => el.src)
  )
}
