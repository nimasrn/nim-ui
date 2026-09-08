import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { AdminShell, Chart, DetailLayout, Facts, Mono, Panel, Tabs } from '../dist/nim.js'

const render = (component, props) => renderToStaticMarkup(h(component, props))

test('numeric units and code identifiers remain isolated in RTL layouts', () => {
  const html = render(Chart, { value: '421/s', categories: ['Now'], series: [{label: 'Requests', values: [421]}], format: value => `${value}/s` })
  assert.match(html, /nim-chart__value"><bdi>421\/s<\/bdi>/)
  assert.match(html, /nim-chart__tick"[^>]*><bdi>/)
  assert.match(render(Facts, {items: [{label: 'Health path', mono: true, value: '/healthz'}]}), /<bdi dir="ltr">\/healthz<\/bdi>/)
  assert.match(render(Mono, {children: '/healthz'}), /dir="ltr"/)
})

test('area fill closes each measured segment separately', () => {
  const html = render(Chart, { kind: 'area', categories: ['a', 'b', 'gap', 'd', 'e'], series: [{label: 'CPU', values: [1, 2, null, 3, 4]}] })
  const area = html.match(/class="nim-chart__area" d="([^"]+)"/)[1]
  assert.equal((area.match(/M/g) ?? []).length, 2)
  assert.equal((area.match(/Z/g) ?? []).length, 2)
})

test('invalid samples are gaps and never create invalid SVG coordinates', () => {
  const html = render(Chart, { categories: ['a', 'b', 'c'], series: [{label: 'CPU', values: [NaN, Infinity, null]}] })
  assert.doesNotMatch(html, /NaN|Infinity/)
  assert.match(html, /No sample/)
})

test('axis thinning preserves complete categories and one keyboard entry point', () => {
  const categories = Array.from({length: 10}, (_, i) => `Full timestamp ${i}`)
  const html = render(Chart, { categories, maxXLabels: 3, formatCategory: (_, i) => `Tick ${i}`, dataTableLabel: 'View values', series: [{label: 'CPU', values: categories.map((_, i) => i)}] })
  assert.equal((html.match(/class="nim-chart__category"/g) ?? []).length, 3)
  assert.equal((html.match(/tabindex="0"/g) ?? []).length, 1)
  assert.ok(categories.every(category => html.includes(category)))
  assert.match(html, /aria-expanded="false"/)
})

test('nested shell composes both levels and a closed native mobile dialog', () => {
  const html = render(AdminShell, { children: 'Content', value: 'apps', navigation: 'nested', groups: [{key: 'areas', label: '', items: [{key: 'apps', label: 'Apps'}]}], contextualGroups: [{key: 'screens', label: '', items: [{key: 'applications', label: 'Applications'}]}], contextualValue: 'applications' })
  assert.match(html, /nim-admin__nested/)
  assert.match(html, /aria-current="location"/)
  assert.match(html, /aria-current="page"/)
  assert.match(html, /<dialog[^>]+nim-admin__drawer/)
  assert.doesNotMatch(html, /<dialog[^>]+ open/)
})

test('plain panels, optional inspector and tab associations are explicit', () => {
  assert.match(render(Panel, {variant: 'plain', children: 'Content'}), /data-variant="plain"/)
  assert.doesNotMatch(render(DetailLayout, {children: 'Content'}), /nim-detail__aside/)
  const html = render(Tabs, {label: 'Views', value: 'overview', onChange() {}, panelId: 'record-view', options: [{label: 'Overview', value: 'overview'}]})
  assert.match(html, /aria-controls="record-view"/)
  assert.match(html, /id="record-view-tab-overview"/)
})

test('a zero latest reading is still visible', () => {
  assert.match(render(Chart, { value: 0, categories: ['Now'], series: [{ label: 'Errors', values: [0] }] }), /nim-chart__value"><bdi>0<\/bdi>/)
})
