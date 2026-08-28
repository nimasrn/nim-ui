import { useRef, useState } from 'react'
import {
  Accordion,
  Avatar,
  Chart,
  Badge,
  Banner,
  Body,
  Breadcrumb,
  Button,
  Card,
  CausalChain,
  Caveat,
  Checkbox,
  Chip,
  ChipInput,
  Combobox,
  DataList,
  DateField,
  Diff,
  EvidenceLedger,
  EvidenceTrail,
  Facts,
  DatePicker,
  CommandPalette,
  Dialog,
  EmptyState,
  FileDrop,
  Icon,
  IconButton,
  Inline,
  Input,
  Label,
  List,
  MapView,
  MediaPlayer,
  ListRow,
  Menu,
  Pagination,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  Rating,
  SectionHeader,
  Segmented,
  Select,
  Sheet,
  Skeleton,
  Slider,
  Sparkline,
  Spinner,
  Stack,
  Stat,
  Stepper,
  Switch,
  Table,
  Tabs,
  Textarea,
  Timeline,
  Title,
  Tooltip,
  useToast,
} from 'nim'
import type { CalendarSystem } from 'nim'
import { COPY, type Lang } from '../copy'
import { Section, Specimen } from '../specimen'
import { SAMPLE_POSTER, SAMPLE_VIDEO, SAMPLE_VOICE, SAMPLE_WAVEFORM } from './chat-media'
import { MapTiles, TEHRAN } from './sample-map'

/** Seven months, named in the reader's own locale and calendar — a chart axis
    that says "1…7" has not localised anything, it has just avoided the
    question. Demo fixture; the labels are the caller's in real use. */
const months = (locale: string) => {
  const format = new Intl.DateTimeFormat(locale, { month: 'short' })
  return Array.from({ length: 7 }, (_, index) => format.format(new Date(2026, index + 1, 1)))
}

export function Components({ lang }: { lang: Lang }) {
  const c = COPY[lang]
  const t = c.t
  // Demo figures are formatted for the active locale — a Farsi page showing
  // Latin digits is the usual half-localised result.
  const num = new Intl.NumberFormat(c.locale)
  const money = new Intl.NumberFormat(c.locale, { minimumFractionDigits: 2 })
  const [sheetOpen, setSheetOpen] = useState(false)
  const [segment, setSegment] = useState<'week' | 'month' | 'year'>('week')
  const [load, setLoad] = useState(50)
  const [checked, setChecked] = useState(true)
  const [enabled, setEnabled] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tab, setTab] = useState<'open' | 'overdue' | 'paid'>('open')
  const [client, setClient] = useState<string | null>('reelforge')
  const [due, setDue] = useState('2026-09-05')
  const [hearing, setHearing] = useState('2026-09-12')
  const [system, setSystem] = useState<CalendarSystem>('gregory')
  const [quantity, setQuantity] = useState(12)
  const [delivery, setDelivery] = useState('standard')
  const [recipients, setRecipients] = useState(['nima@nim.zone'])
  const [filters, setFilters] = useState<string[]>(['unread'])
  const [rating, setRating] = useState(4)
  const [picked, setPicked] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const popoverTrigger = useRef<HTMLButtonElement>(null)
  const toast = useToast()

  return (
    <>
      <div className="docs__intro">
        <Title>{t.introTitle}</Title>
        <Body>{t.introBody}</Body>
      </div>

      <Section id="button" title={c.nav.button}>
        <Specimen
          title={t.spVariants}
          code={`<Button variant="primary">Save</Button>\n<Button variant="accent">Start scan</Button>\n<Button variant="secondary">Cancel</Button>\n<Button variant="ghost">Skip</Button>\n<Button variant="danger">Delete</Button>`}
        >
          <Button>{t.saveChanges}</Button>
          <Button variant="accent">{t.startScan}</Button>
          <Button variant="secondary">{t.cancel}</Button>
          <Button variant="ghost">{t.skip}</Button>
          <Button variant="danger">{t.del}</Button>
        </Specimen>
        <Specimen title={t.spSizes} code={`<Button size="sm" | "md" | "lg" />`}>
          <Button size="sm">{t.small}</Button>
          <Button size="md">{t.medium}</Button>
          <Button size="lg">{t.large}</Button>
        </Specimen>
        <Specimen
          title={t.spStatesIcons}
          note={t.ntLoadingKeepsTheLabel}
          code={`<Button loading>Saving</Button>\n<Button disabled>Unavailable</Button>\n<Button iconStart="plus">New</Button>\n<Button iconEnd="arrow-forward">Continue</Button>`}
        >
          <Button loading>{t.saving}</Button>
          <Button disabled>{t.unavailable}</Button>
          <Button iconStart="plus" variant="secondary">
            {t.newEntry}
          </Button>
          <Button iconEnd="arrow-forward" variant="ghost">
            {t.continueLabel}
          </Button>
        </Specimen>
        <Specimen title={t.spIconButton} code={`<IconButton label="Settings" name="settings" variant="ghost" />`}>
          <IconButton label={t.search} name="search" />
          <IconButton label={t.settings} name="settings" variant="outline" />
          <IconButton label={t.add} name="plus" variant="solid" />
          <IconButton label={t.del} disabled name="trash" variant="outline" />
        </Specimen>
      </Section>


      <Section id="diagnosis" title={c.nav.diagnosis}>
        <Specimen
          layout="block"
          title={t.spCausalChain}
          note={t.ntCausalStops}
          code={`<CausalChain\n  links={[{ step: 'observed', claim: '…', evidence: '2/3 tasks', source: 'swarm manager' }]}\n  resolution={<Button>Preview the fix</Button>}\n  caveat={<Caveat title="…">…</Caveat>}\n/>`}
        >
          <CausalChain
            caveat={<Caveat title={t.dgCaveatTitle}>{t.dgCaveatBody}</Caveat>}
            links={[
              { claim: t.dgClaim1, evidence: t.dgEv1, source: t.dgSrc1, step: t.dgObserved, tone: 'warning' },
              { claim: t.dgClaim2, evidence: t.dgEv2, source: t.dgSrc2, step: t.dgBecause },
              { claim: t.dgClaim3, evidence: t.dgEv3, source: t.dgSrc3, step: t.dgBecause, tone: 'danger' },
            ]}
            resolution={<Button size="sm" variant="accent">{t.dgFix}</Button>}
          />
        </Specimen>

        <Specimen
          layout="block"
          title={t.spCaveat}
          note={t.ntCaveatQuiet}
          code={`<Caveat title="What this cannot see">…</Caveat>`}
        >
          <Caveat title={t.dgCaveatTitle}>{t.dgCaveatBody}</Caveat>
        </Specimen>

        <Specimen
          layout="block"
          title={t.spDiff}
          note={t.ntDiffMarkers}
          code={`<Diff\n  caption="api-gateway · 7c41b8e → 9f2c1ab"\n  lines={[{ kind: 'removed', text: '…' }, { kind: 'added', text: '…' }]}\n/>`}
        >
          <Diff
            caption="api-gateway · 7c41b8e → 9f2c1ab"
            lines={[
              { kind: 'context', text: 'services:' },
              { kind: 'context', text: '  api-gateway:' },
              { kind: 'removed', text: '    image: api-gateway:7c41b8e' },
              { kind: 'added', text: '    image: api-gateway:9f2c1ab' },
              { kind: 'context', text: '    constraints:' },
              { kind: 'added', text: '    healthcheck: GET /healthz' },
            ]}
          />
        </Specimen>
      </Section>


      <Section id="evidence" title={c.nav.evidence}>
        <Specimen
          layout="block"
          title={t.spProvenance}
          note={t.ntProvenance}
          code={`<Facts items={[\n  { label: 'Memory used', value: '38%', source: '4 host probes' },\n  { label: 'CPU utilisation', value: 'not measured', unmeasured: true, why: 'load average is not utilisation' },\n]} />`}
        >
          <Facts
            columns={1}
            items={[
              { label: t.evMemory, source: t.evProbe, value: '38%' },
              { label: t.evNodes, source: t.evSwarm, value: '4/4' },
              { label: t.evCpu, unmeasured: true, value: t.evNotMeasured, why: t.evWhyCpu },
            ]}
          />
        </Specimen>

        <Specimen
          layout="column"
          title={t.spUnknownEmpty}
          note={t.ntUnknownEmpty}
          code={`<EmptyState reason="empty" title="No stacks" />\n<EmptyState reason="unknown" title="Cannot see stacks" />`}
        >
          <EmptyState description={t.evEmptyBody} icon="layers" title={t.evEmptyTitle} />
          <EmptyState description={t.evUnknownBody} icon="layers" reason="unknown" title={t.evUnknownTitle} />
        </Specimen>

        <Specimen
          layout="block"
          title={t.spLedger}
          note={t.ntLedgerHonest}
          code={`<EvidenceLedger\n  measured={[{ label: 'Nodes ready', value: '4/4', source: 'cluster manager' }]}\n  absent={[{ label: 'CPU utilisation', value: '—', why: 'load average is not utilisation' }]}\n  coverage="4/4 probes healthy"\n/>`}
        >
          <EvidenceLedger
            absent={[
              { label: t.evCpu, value: '—', why: t.evWhyCpu },
              { label: t.evTraces, value: 'absent', why: t.evWhyTraces },
            ]}
            coverage={t.evCoverage}
            labels={{ absent: t.evAbsent, measured: t.evMeasured }}
            measured={[
              { label: t.evNodes, source: t.evSwarm, value: '4/4' },
              { label: t.evTasks, source: t.evSwarm, value: '18/18' },
              { label: t.evMemory, source: t.evProbe, value: '38%' },
            ]}
          />
        </Specimen>

        <Specimen
          layout="block"
          title={t.spTrail}
          note={t.ntTrailAge}
          code={`<EvidenceTrail entries={[{ label: '1.4 GB free', source: 'host probe', age: '22s ago' }]} />`}
        >
          <EvidenceTrail
            caption={t.evTrailCaption}
            entries={[
              { age: '4s', label: '2/3 tasks', source: 'swarm manager' },
              { age: '22s', label: '1.4 GB free · 2.1 GB required', source: 'host probe · worker-03' },
              { age: '1m', label: 'image 2.1 GB', source: 'registry manifest' },
            ]}
          />
        </Specimen>
      </Section>

      <Section id="badge" title={c.nav.badge}>
        <Specimen title={t.spTones} code={`<Badge variant="success" tone="soft" | "solid" | "outline" />`}>
          <Badge>{t.neutral}</Badge>
          <Badge variant="accent">{t.accent}</Badge>
          <Badge variant="success" dot>
            {t.live}
          </Badge>
          <Badge variant="warning">{t.pending}</Badge>
          <Badge variant="danger" tone="solid">
            {t.failed}
          </Badge>
          <Badge variant="info" tone="outline">
            {t.info}
          </Badge>
          <Badge pill size="sm" variant="accent">
            {t.beta}
          </Badge>
        </Specimen>
      </Section>

      <Section id="card" title={c.nav.card}>
        <Specimen
          layout="block"
          title={t.spVariants}
          code={`<Card variant="raised" header={…} footer={…}>…</Card>`}
        >
          <div className="docs__grid">
            <Card>
              <Title size="md">{t.cardDefault}</Title>
              <Body size="sm">{t.cardDefaultBody}</Body>
            </Card>
            <Card variant="raised">
              <Title size="md">{t.cardRaised}</Title>
              <Body size="sm">{t.cardRaisedBody}</Body>
            </Card>
            <Card variant="muted">
              <Title size="md">{t.cardMuted}</Title>
              <Body size="sm">{t.cardMutedBody}</Body>
            </Card>
            <Card variant="accent">
              <Title size="md">{t.cardAccent}</Title>
              <Body size="sm">{t.cardAccentBody}</Body>
            </Card>
          </div>
        </Specimen>
        <Specimen
          layout="block"
          title={t.spWithHeaderAndFooter}
          code={`<Card header={<Label>…</Label>} footer={<Button …/>}>…</Card>`}
        >
          <Card
            footer={
              <Button size="sm" variant="secondary">
                {t.viewReport}
              </Button>
            }
            header={
              <>
                <Label>{t.session}</Label>
                <Badge dot variant="success">
                  {t.complete}
                </Badge>
              </>
            }
            variant="raised"
          >
            <Body size="sm">{t.cardBody}</Body>
          </Card>
        </Specimen>
      </Section>

      <Section id="stat" title={c.nav.stat}>
        <Specimen layout="block" title={t.spMetrics} code={`<Stat value="18M+" unit="/min" label="Events" delta="+12%" />`}>
          <div className="docs__grid">
            <Stat delta="+12%" label={t.eventsPerMinute} unit="/min" value="18M" />
            <Stat delta="-4%" deltaDirection="down" label={t.latency} unit="ms" value="8.4" />
            <Stat label={t.throughput} value="20×" />
            <Stat label={t.costReduction} value="70%" />
          </div>
        </Specimen>
      </Section>

      <Section id="form" title={c.nav.form}>
        <Specimen layout="column" title={t.spTextInputs} code={`<Input label="Email" hint="…" error="…" iconStart="search" />`}>
          <Input hint={t.emailHint} label={t.email} placeholder="you@example.com" />
          <Input iconStart="search" label={t.search} placeholder={t.findRoutine} />
          <Input error={t.fullNameError} label={t.fullName} placeholder={c.author} required />
          <Input disabled label={t.workspace} value="nim.zone" />
          <Textarea hint={t.notesHint} label={t.notes} placeholder={t.notesPlaceholder} />
          <Select
            label={t.cadence}
            options={[
              { label: t.daily, value: 'daily' },
              { label: t.weekly, value: 'weekly' },
              { label: t.monthly, value: 'monthly' },
            ]}
            placeholder={t.chooseOne}
          />
        </Specimen>
        <Specimen layout="column" title={t.spChoice} code={`<Checkbox checked …>Label</Checkbox>\n<Switch checked …>Label</Switch>`}>
          <Checkbox checked={checked} description={t.weeklySummaryDesc} onChange={(event) => setChecked(event.target.checked)}>
            {t.weeklySummary}
          </Checkbox>
          <Checkbox disabled>{t.notOnPlan}</Checkbox>
          <Switch checked={enabled} description={t.reducedMotionDesc} onChange={(event) => setEnabled(event.target.checked)}>
            {t.reducedMotion}
          </Switch>
        </Specimen>
        <Specimen layout="column" title={t.spRadio} note={t.ntRadio} code={`<RadioGroup label="Delivery" value={value} onChange={setValue}>\n  <Radio value="standard" description="…">Standard</Radio>\n</RadioGroup>`}>
          <RadioGroup hint={t.rgHint} label={t.rgDelivery} onChange={setDelivery} value={delivery}>
            <Radio description={t.rgStandardDesc} value="standard">
              {t.rgStandard}
            </Radio>
            <Radio description={t.rgExpressDesc} value="express">
              {t.rgExpress}
            </Radio>
            <Radio disabled value="pickup">
              {t.rgPickup}
            </Radio>
          </RadioGroup>
        </Specimen>
        <Specimen layout="column" title={t.spRating} note={t.ntRating} code={`<Rating label="Rate this session" value={rating} onChange={setRating} />\n<Rating label="Average" value={4.3} readOnly />`}>
          <Rating label={t.ratingLabel} onChange={setRating} value={rating} />
          <Inline gap="tight">
            <Rating label={t.ratingStatic} readOnly size="sm" value={4.3} />
            <span className="nim-caption">{t.ratingStatic}</span>
          </Inline>
        </Specimen>
        <Specimen layout="block" title={t.spSlider} code={`<Slider label="Load" value={load} onChange={…} scale={['1M','8M','15M']} />`}>
          <Slider
            label={t.load}
            max={100}
            min={0}
            onChange={(event) => setLoad(Number(event.target.value))}
            scale={['1M', '8M', '15M']}
            value={load}
          />
        </Specimen>
        <Specimen title={t.spSegmented} code={`<Segmented label="Range" options={…} value={…} onChange={…} />`}>
          <Segmented
            label={t.range}
            onChange={setSegment}
            options={[
              { label: t.week, value: 'week' },
              { label: t.month, value: 'month' },
              { label: t.year, value: 'year' },
            ]}
            value={segment}
          />
        </Specimen>
      </Section>

      <Section id="list" title={c.nav.list}>
        <Specimen layout="block" title={t.spRows} code={`<List>\n  <ListRow title="…" subtitle="…" leading={…} onClick={…} />\n</List>`}>
          <List>
            <ListRow
              leading={<Avatar name={c.author} />}
              onClick={() => toast({ message: t.openedProfile })}
              subtitle={t.profileSub}
              title={c.author}
            />
            <ListRow
              leading={<Icon name="bell" />}
              onClick={() => toast({ message: t.openedNotifications })}
              subtitle={t.notificationsSub}
              title={t.notifications}
            />
            <ListRow
              leading={<Icon name="moon" />}
              title={t.appearance}
              trailing={<Badge tone="outline">{c.schemes.system}</Badge>}
            />
            <ListRow leading={<Icon name="sign-out" tone="danger" />} onClick={() => toast({ message: t.signedOut, tone: 'danger' })} title={t.signOut} />
          </List>
        </Specimen>
      </Section>

      <Section id="feedback" title={c.nav.feedback}>
        <Specimen title={t.spBanners} layout="column" code={`<Banner tone="warning" title="…">…</Banner>`}>
          <Banner title={t.scanQueued}>{t.scanQueuedBody}</Banner>
          <Banner tone="accent" title={t.newRelease}>
            {t.newReleaseBody}
          </Banner>
          <Banner tone="success">{t.profileCurrent}</Banner>
          <Banner tone="warning" title={t.connectionSlow}>
            {t.connectionSlowBody}
          </Banner>
          <Banner tone="danger" title={t.uploadFailed}>
            {t.uploadFailedBody}
          </Banner>
        </Specimen>
        <Specimen title={t.spLoading} code={`<Spinner />  <Progress value={64} />  <Skeleton width={220} />`}>
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
        </Specimen>
        <Specimen layout="column" title={t.spProgressSkeleton}>
          <Progress label={t.upload} value={64} />
          <Progress label={t.working} />
          <Stack gap="tight">
            <Skeleton height={20} width="60%" />
            <Skeleton height={14} />
            <Skeleton height={14} width="80%" />
          </Stack>
        </Specimen>
        <Specimen title={t.spToast} code={`const toast = useToast()\ntoast({ message: 'Saved', tone: 'success' })`}>
          <Button onClick={() => toast({ message: t.changesSaved, tone: 'success' })} variant="secondary">
            {t.successToast}
          </Button>
          <Button
            onClick={() => toast({ action: { label: t.undo, onPress: () => undefined }, message: t.entryDeleted, tone: 'danger' })}
            variant="secondary"
          >
            {t.withAction}
          </Button>
        </Specimen>
        <Specimen layout="block" title={t.spEmptyState} code={`<EmptyState icon="search" title="…" description="…" actions={…} />`}>
          <EmptyState
            actions={<Button size="sm">{t.addFirstRoutine}</Button>}
            description={t.noRoutinesBody}
            icon="document"
            title={t.noRoutines}
          />
        </Specimen>
      </Section>

      <Section id="sheet" title={c.nav.sheet}>
        <Specimen title={t.spBottomSheet} note={t.ntScrollLockEscapeFocus} code={`<Sheet open={open} onClose={…} title="…" footer={…}>…</Sheet>`}>
          <Button onClick={() => setSheetOpen(true)} variant="secondary">
            {t.openSheet}
          </Button>
          <Sheet
            footer={
              <>
                <Button fullWidth onClick={() => setSheetOpen(false)}>
                  {t.confirm}
                </Button>
                <Button fullWidth onClick={() => setSheetOpen(false)} variant="ghost">
                  {t.cancel}
                </Button>
              </>
            }
            onClose={() => setSheetOpen(false)}
            open={sheetOpen}
            title={t.confirmRoutine}
          >
            <Stack>
              <Body size="sm">{t.sheetBody}</Body>
              <Input label={t.name} placeholder={t.eveningRoutine} />
              <Switch defaultChecked>{t.remindMe}</Switch>
            </Stack>
          </Sheet>
        </Specimen>
      </Section>


      <Section id="navigation" title={c.nav.navigation}>
        <Specimen title={t.spBreadcrumb} note={t.ntTheLastCrumbIs} code={`<Breadcrumb items={[{ label: 'Workspace', href: '#' }, …]} />`}>
          <Breadcrumb
            items={[
              { href: '#', label: t.workspaceCrumb },
              { href: '#', label: t.billing },
              { label: t.invoices },
            ]}
          />
        </Specimen>

        <Specimen layout="block" title={t.spTabs} note={t.ntSwitchesARegionA} code={`<Tabs label="Invoices" options={…} value={tab} onChange={setTab} />`}>
          <Tabs
            label={t.invoices}
            onChange={setTab}
            options={[
              { count: num.format(12), label: t.open, value: 'open' },
              { count: num.format(3), label: t.overdue, value: 'overdue' },
              { count: num.format(69), label: t.paid, value: 'paid' },
            ]}
            value={tab}
          />
        </Specimen>

        <Specimen layout="block" title={t.spPagination} note={t.ntASevenSlotWindow} code={`<Pagination page={page} pageCount={14} onChange={setPage} summary="…" />`}>
          <Pagination
            onChange={setPage}
            page={page}
            pageCount={14}
            summary={t.pageSummary(page)}
          />
        </Specimen>
      </Section>

      <Section id="overlay" title={c.nav.overlay}>
        <Specimen title={t.spMenu} note={t.ntArrowKeysEscapeFocus} code={`<Menu label="Actions" items={…}>{({ ref, toggle }) => <Button ref={ref} onClick={toggle}>…</Button>}</Menu>`}>
          <Menu
            items={[
              { kind: 'heading', label: t.thisInvoice },
              { icon: 'download', label: t.downloadPdf, onSelect: () => {}, shortcut: '⌘D' },
              { icon: 'share', label: t.sendToClient, onSelect: () => {} },
              { icon: 'copy', label: t.duplicate, onSelect: () => {} },
              { kind: 'separator' },
              { danger: true, icon: 'trash', label: t.voidInvoice, onSelect: () => {} },
            ]}
            label={t.invoiceActions}
          >
            {({ ref, toggle }) => (
              <Button iconEnd="chevron-down" onClick={toggle} ref={ref} variant="secondary">
                {t.invoiceActions}
              </Button>
            )}
          </Menu>
        </Specimen>

        <Specimen title={t.spDialog} note={t.ntARealDialogTop} code={`<Dialog open={open} onClose={…} title="…" footer={…}>…</Dialog>`}>
          <Button onClick={() => setDialogOpen(true)} variant="danger">
            {t.voidInvoice}
          </Button>
          <Dialog
            description={t.voidDesc}
            footer={
              <>
                <Button onClick={() => setDialogOpen(false)} variant="ghost">
                  {t.keepIt}
                </Button>
                <Button onClick={() => setDialogOpen(false)} variant="danger">
                  {t.voidInvoice}
                </Button>
              </>
            }
            onClose={() => setDialogOpen(false)}
            open={dialogOpen}
            title={t.voidTitle}
          >
            <Body size="sm">{t.voidBody}</Body>
          </Dialog>
        </Specimen>

        <Specimen title={t.spCommandPalette} note={t.ntPaletteRanks} code={`<CommandPalette open={open} onClose={…} commands={[…]} label="…" />`}>
          <Button iconStart="search" onClick={() => setPaletteOpen(true)} variant="secondary">
            {t.palOpenIt}
          </Button>
          <CommandPalette
            commands={[
              { group: t.palGoTo, hint: t.palInvoicesHint, icon: 'document', id: 'invoices', keywords: 'billing receipts', label: t.palInvoices, onRun: () => {} },
              { group: t.palGoTo, hint: t.palClientsHint, icon: 'users', id: 'clients', label: t.palClients, onRun: () => {} },
              { group: t.palRun, icon: 'download', id: 'download', label: t.downloadPdf, onRun: () => {}, shortcut: '⌘D' },
              { group: t.palRun, icon: 'share', id: 'send', label: t.sendToClient, onRun: () => {} },
              { group: t.palRun, icon: 'trash', id: 'void', label: t.voidInvoice, onRun: () => {} },
            ]}
            label={t.palFindOrRun}
            onClose={() => setPaletteOpen(false)}
            open={paletteOpen}
            placeholder={t.palSearch}
          />
        </Specimen>

        <Specimen title={t.spPopover} note={t.ntAMenuSGeometry} code={`<Popover open={open} onClose={…} triggerRef={ref} label="…">…</Popover>`}>
          <Button onClick={() => setPopoverOpen((value) => !value)} ref={popoverTrigger} variant="secondary">
            {t.adjustDue}
          </Button>
          <Popover label={t.dueDate} onClose={() => setPopoverOpen(false)} open={popoverOpen} triggerRef={popoverTrigger}>
            <Stack>
              <Input label={t.dueDate} defaultValue="2026-09-05" />
              <Button fullWidth onClick={() => setPopoverOpen(false)} size="sm">
                {t.apply}
              </Button>
            </Stack>
          </Popover>
        </Specimen>

        <Specimen title={t.spTooltip} note={t.ntHoverWaits200msFocus} code={`<Tooltip label="Reconcile with bank"><IconButton … /></Tooltip>`}>
          <Tooltip label={t.reconcile}>
            <IconButton label={t.reconcile} name="arrow-forward" variant="outline" />
          </Tooltip>
          <Tooltip label={t.archiveTip}>
            <IconButton label={t.archive} name="bookmark" variant="outline" />
          </Tooltip>
        </Specimen>
      </Section>

      <Section id="data" title={c.nav.data}>
        <Specimen layout="block" title={t.spTable} note={t.ntRowHeightFollowsNim} code={`<Table columns={…} rows={…} rowKey={…} />`}>
          <Table
            columns={[
              { header: t.client, key: 'client', render: (row) => row.client, sortable: true },
              { header: t.reference, key: 'ref', render: (row) => <Label>{row.ref}</Label> },
              {
                header: t.status,
                key: 'status',
                render: (row) => (
                  <Badge variant={row.variant} size="sm">
                    {row.status}
                  </Badge>
                ),
              },
              { header: t.amount, key: 'amount', numeric: true, render: (row) => row.amount, sortable: true },
            ]}
            rowKey={(row) => row.ref}
            rows={[
              { amount: money.format(4200), client: c.clients[0], ref: 'INV-2291', status: t.open, variant: 'warning' as const },
              { amount: money.format(2850), client: c.clients[1], ref: 'INV-2288', status: t.paid, variant: 'success' as const },
              { amount: money.format(3100), client: c.clients[2], ref: 'INV-2284', status: t.overdue, variant: 'danger' as const },
            ]}
            sort={{ direction: 'ascending', key: 'client' }}
          />
        </Specimen>

        <Specimen layout="block" title={t.spDataList} note={t.ntDataList} code={`<DataList rows={[{ id, label, value }]} />`}>
          <DataList
            rows={[
              { id: 'plan', label: t.dlPlan, value: t.dlPlanValue },
              { id: 'seats', label: t.dlSeats, value: t.dlSeatsValue },
              { id: 'renews', label: t.dlRenews, value: t.dlRenewsValue },
              { id: 'ref', label: t.dlReference, mono: true, value: 'sub_9Q2X41KDPA' },
            ]}
          />
        </Specimen>

        <Specimen layout="block" title={t.spTimeline} note={t.ntTimeline} code={`<Timeline entries={[{ id, title, time, tone }]} />`}>
          <Timeline
            entries={[
              { id: 'submitted', time: t.tlSubmittedAt, title: t.tlSubmitted, tone: 'muted' },
              { body: t.tlReviewBody, icon: 'eye', id: 'review', time: t.tlReviewAt, title: t.tlReview, tone: 'accent' },
              { icon: 'check', id: 'approved', time: t.tlApprovedAt, title: t.tlApproved, tone: 'success' },
              { icon: 'clock', id: 'settled', time: t.tlSettledAt, title: t.tlSettled },
            ]}
          />
        </Specimen>

        <Specimen layout="block" title={t.spAccordion} note={t.ntAccordion} code={`<Accordion mode="single" items={[{ id, title, content }]} />`}>
          <Accordion
            defaultOpen={['billing']}
            items={[
              { content: <Body>{t.accBillingBody}</Body>, id: 'billing', meta: t.accItems, title: t.accBilling },
              { content: <Body>{t.accSecurityBody}</Body>, id: 'security', title: t.accSecurity },
              { content: <Body>{t.accDataBody}</Body>, id: 'data', title: t.accData },
            ]}
          />
        </Specimen>
      </Section>

      <Section id="input" title={c.nav.input}>
        <Specimen layout="column" title={t.spCombobox} note={t.ntTypeToFilterEscape} code={`<Combobox label="Client" options={…} value={client} onChange={setClient} />`}>
          <Combobox
            emptyState={(query) => t.noMatch(query)}
            label={t.client}
            onChange={setClient}
            options={[
              { label: c.clients[0], meta: num.format(14), value: 'atelier' },
              { label: c.clients[1], meta: num.format(31), value: 'ilc' },
              { label: c.clients[2], meta: num.format(9), value: 'reelforge' },
              { label: c.clients[3], meta: num.format(22), value: 'vlora' },
            ]}
            placeholder={t.startTyping}
            value={client}
          />
        </Specimen>

        <Specimen title={t.spStepper} note={t.ntTwoControlHeightTargets} code={`<Stepper label="Quantity" value={quantity} onChange={setQuantity} min={1} />`}>
          <Stepper label={t.quantity} min={1} onChange={setQuantity} value={quantity} />
        </Specimen>

        <Specimen layout="column" title={t.spChips} note={t.ntChips} code={`<ChipInput label="Recipients" values={values} onChange={setValues} />\n<Chip selected onClick={…} onRemove={…}>Unread</Chip>`}>
          <ChipInput
            hint={t.chipHint}
            label={t.chipRecipients}
            onChange={setRecipients}
            placeholder={t.chipAdd}
            removeLabel={t.chipRemove}
            values={recipients}
          />
          <Inline gap="tight">
            {[
              { id: 'unread', label: t.chipUnread },
              { id: 'flagged', label: t.chipFlagged },
              { id: 'overdue', label: t.chipOverdue },
              { id: 'archived', label: t.chipArchived },
            ].map((chip) => (
              <Chip
                key={chip.id}
                onClick={() =>
                  setFilters((current) =>
                    current.includes(chip.id)
                      ? current.filter((entry) => entry !== chip.id)
                      : [...current, chip.id],
                  )
                }
                selected={filters.includes(chip.id)}
              >
                {chip.label}
              </Chip>
            ))}
          </Inline>
        </Specimen>

        <Specimen layout="block" title={t.spUpload} note={t.ntUpload} code={`<FileDrop label="Drop a receipt here" accept="image/*,.pdf" onFiles={…} />`}>
          <FileDrop
            accept="image/png,image/jpeg,application/pdf"
            caption={picked ? `${t.uploadPicked}: ${picked}` : t.uploadCaption}
            label={t.uploadLabel}
            onFiles={(files) => setPicked(files[0]?.name ?? null)}
            prompt={t.uploadPrompt}
          />
        </Specimen>

        <Specimen layout="column" title={t.spDateField} note={t.ntTypingAlwaysWorksThe} code={`<DateField label="Due date" value={due} onChange={setDue} marked={…} />`}>
          {/* No `system`: this one follows the locale, so the language switch
              above turns the grid Jalali on its own. */}
          <DateField label={t.dueDate} marked={['2026-09-16']} onChange={setDue} value={due} />
        </Specimen>

        <Specimen
          layout="column"
          note={t.ntJalali}
          title={t.spCalendarSystem}
          code={`<Calendar system="persian" … />   // or "gregory"\n// unset follows the locale: fa → Jalali`}
        >
          <Segmented
            fullWidth
            label={t.spCalendarSystem}
            onChange={setSystem}
            options={[
              { label: t.calGregorian, value: 'gregory' },
              { label: t.calJalali, value: 'persian' },
            ]}
            value={system}
          />
        </Specimen>

        <Specimen
          layout="column"
          note={t.ntPickerCompact}
          title={t.spDatePicker}
          code={`<DatePicker label="Hearing date" value={hearing} onChange={setHearing} />`}
        >
          <DatePicker
            label={t.hearingDate}
            onChange={setHearing}
            system={system}
            value={hearing}
          />
        </Specimen>
      </Section>

      <Section id="composition" title={c.nav.composition}>
        <Specimen layout="block" title={t.spAScreenAssembledFromTheKit} note={t.ntNoBespokeCss}>
          <Stack gap="loose">
            <SectionHeader
              action={
                <Button size="sm" variant="ghost" iconEnd="arrow-forward">
                  {t.all}
                </Button>
              }
              description={t.compositionDesc}
              eyebrow={t.today}
              title={t.yourMorning}
            />
            <Inline>
              <Stat label={t.streak} unit={t.days} value={num.format(12)} />
              <Stat delta="+8%" label={t.adherence} value="94%" />
              <Stat label={t.nextCheck} value="09:30" />
            </Inline>
            <Card variant="raised">
              <Stack>
                <Inline>
                  <Badge dot variant="success">
                    {t.onTrack}
                  </Badge>
                  <Badge tone="outline">{t.steps}</Badge>
                </Inline>
                <Title size="md">{t.eveningRoutine}</Title>
                <Body size="sm">{t.routineBody}</Body>
                <Progress label={t.completion} value={66} />
              </Stack>
            </Card>
          </Stack>
        </Specimen>
      </Section>

      <Section id="chart" title={c.nav.chart}>
        <Specimen
          code={`<Chart\n  kind="area"\n  categories={months}\n  series={[{ label: 'Sessions', values }, { label: 'Sign-ups', values }]}\n  title="Sessions and sign-ups"\n/>`}
          layout="block"
          note={t.ntChart}
          title={t.spChartLine}
        >
          <Chart
            categories={months(c.locale)}
            kind="area"
            locale={c.locale}
            note={t.chNote}
            series={[
              { label: t.chSessions, values: [12, 15, 14, 19, 23, 21, 28] },
              { label: t.chSignups, values: [4, 6, 5, 9, 11, 10, 14] },
              { label: t.chChurn, values: [2, 2, 3, 2, 4, 3, 3] },
            ]}
            title={t.chTitle}
          />
        </Specimen>

        <Specimen
          code={`<Chart kind="bar" categories={regions} series={[…]} />`}
          layout="block"
          note={t.ntChartBar}
          title={t.spChartBar}
        >
          <Chart
            categories={[t.chEurope, t.chAsia, t.chAmericas]}
            kind="bar"
            locale={c.locale}
            note={t.chBarNote}
            series={[
              { label: t.chSessions, values: [42, 58, 24] },
              { label: t.chSignups, values: [18, 31, 12] },
            ]}
            title={t.chBarTitle}
          />
        </Specimen>

        <Specimen code={`<Sparkline label="Sessions" values={values} />`} note={t.ntSparkline} title={t.spSparkline}>
          <Stat
            label={t.chSessions}
            value={num.format(28_400)}
            delta="+12%"
            deltaDirection="up"
          />
          <Sparkline label={t.chSessions} values={[12, 15, 14, 19, 23, 21, 28]} />
          <Sparkline label={t.chSignups} series={3} values={[9, 7, 8, 5, 6, 4, 3]} />
        </Specimen>
      </Section>

      <Section id="map" title={c.nav.map}>
        <Specimen
          code={`<MapView\n  bounds={{ north, south, east, west }}\n  tiles={<img src={staticMap} alt="" />}\n  markers={[{ id, lat, lng, label }]}\n  attribution="© …"\n/>`}
          layout="block"
          note={t.ntMap}
          title={t.spMap}
        >
          <MapView
            attribution={t.mapAttribution}
            bounds={TEHRAN}
            markers={[
              { id: 'office', label: t.mapOffice, lat: 35.735, lng: 51.386 },
              { id: 'clinic', label: t.mapClinic, lat: 35.712, lng: 51.418, tone: 'danger' },
              { id: 'self', label: t.mapYou, lat: 35.724, lng: 51.4, self: true },
            ]}
            onSelect={() => undefined}
            onZoom={() => undefined}
            tiles={<MapTiles />}
            title={t.mapTitle}
          />
        </Specimen>
      </Section>

      <Section id="player" title={c.nav.player}>
        <Specimen
          code={`<MediaPlayer src={url} title="Room tone" waveform={samples} />`}
          layout="column"
          note={t.ntPlayer}
          title={t.spPlayerAudio}
        >
          <MediaPlayer
            locale={c.locale}
            src={SAMPLE_VOICE}
            title={t.playerTrack}
            waveform={SAMPLE_WAVEFORM}
          />
        </Specimen>

        <Specimen
          code={`<MediaPlayer kind="video" src={url} poster={poster} />`}
          layout="column"
          title={t.spPlayerVideo}
        >
          <MediaPlayer
            kind="video"
            locale={c.locale}
            poster={SAMPLE_POSTER}
            src={SAMPLE_VIDEO}
            title={t.playerEpisode}
          />
        </Specimen>
      </Section>
    </>
  )
}
