import { chromium } from 'playwright-core'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1672, height: 941 }, deviceScaleFactor: 1 })
await page.goto(process.argv[2])
await page.waitForTimeout(600)
await page.screenshot({ path: process.argv[3] })
await browser.close()
console.log('captured')
