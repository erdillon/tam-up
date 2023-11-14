import * as fs from 'fs'
import { parse } from 'csv-parse'
import psl from 'psl'

const fileContent = fs.readFileSync('./bquxjob_353ca05d_18bca124bcd.csv', 'utf8')
parse(fileContent, { columns: true }, async (err, records) => {
  console.log('domain')
  for (const record of records) {
    try {
      if (record !== 'url') {
        const url = new URL(record.url)
        const parsedHostname = psl.parse(url.hostname)
        if (parsedHostname.error == null) {
          console.log(parsedHostname.domain)
        } else {
          console.log('ERROR')
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
})
