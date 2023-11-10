import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import { parse } from 'csv-parse'

const fileContent = fs.readFileSync('./accounts.csv', 'utf8')

// eslint-disable-next-line @typescript-eslint/no-misused-promises
parse(fileContent, { columns: true }, async (err, records) => {
  if (err != null) {
    console.error(err)
    return
  }

  const prisma = new PrismaClient()

  for (const record of records) {
    try {
      const webpage = {
        name: record['Account Name'],
        accountId: record['CaseSafeID: Account Id'],
        hostname: record.Website
      }
      console.log('loading:', webpage)
      await prisma.webpage.create({ data: webpage })
    } catch (e) {
      console.error(e)
    }
    console.log('========================================')
  }
})
