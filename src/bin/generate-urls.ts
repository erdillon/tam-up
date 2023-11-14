import { PrismaClient } from '@prisma/client'

const NUMBERS = Array.from(Array(10).keys())
const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
  'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

/**
 * Generate a set of URLs
 */
async function generateUrls (suffix: string): Promise<void> {
  const prisma = new PrismaClient()

  for (const initial of LETTERS) {
    for (const second of [...LETTERS, ...NUMBERS]) {
      for (const third of [...LETTERS, ...NUMBERS]) {
        const hostname = `${initial}${second}${third}${suffix}`
        await prisma.host.create({ data: { hostname } })
      }
    }
  }
}

generateUrls('-tracking.riege.com')
  .then(() => { console.log('Done.') })
  .catch((err: any) => { console.error(err) })
