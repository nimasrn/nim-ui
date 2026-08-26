import { useState } from 'react'
import {
  ActionBar,
  ActivityFeed,
  AdminShell,
  Brand,
  BrandMark,
  CodeBlock,
  Columns,
  CopyChip,
  DataTable,
  DetailLayout,
  List,
  ListRow,
  Rail,
  RailSection,
  StageTrack,
  EmptyState,
  Facts,
  Metric,
  MetricGrid,
  Mono,
  Page,
  Panel,
  RecordLink,
  StatusDot,
  Toolbar,
  Inline,
  Input,
  Stack,
  AppShell,
  Badge,
  Body,
  Button,
  ChoiceGrid,
  DetailHeader,
  FilterChips,
  Icon,
  Onboarding,
  OptionCard,
  OrderSummary,
  PlanPicker,
  ProfileScreen,
  SignInFlow,
  TaskProgress,
  Textarea,
  Title,
  Wizard,
  AvatarRing,
} from 'nim'
import { COPY, type Lang } from '../copy'
import { Conversations } from './conversations'
import { Section, Specimen } from '../specimen'

interface ConsoleRow {
  host: string
  id: string
  region: string
  state: string
  tasks: number
  tone: 'danger' | 'success' | 'warning'
}

const CONSOLE_ROWS = (t: { csHealthy: string; csDegraded: string; csDraining: string }): ConsoleRow[] => [
  { host: 'edge-1.fra', id: 'n-8f21c4', region: 'eu-central', state: t.csHealthy, tasks: 12, tone: 'success' },
  { host: 'edge-2.fra', id: 'n-1a90de', region: 'eu-central', state: t.csHealthy, tasks: 11, tone: 'success' },
  { host: 'edge-3.ams', id: 'n-77b012', region: 'eu-west', state: t.csDraining, tasks: 3, tone: 'warning' },
  { host: 'core-1.iad', id: 'n-4c8e55', region: 'us-east', state: t.csDegraded, tasks: 0, tone: 'danger' },
]

/** The kit's own placeholder mark — the gallery ships no brand of its own. */
function Mark({ size = 40 }: { size?: number }) {
  return (
    <svg aria-hidden height={size} viewBox="0 0 48 48" width={size}>
      <rect fill="var(--nim-accent-soft)" height="48" rx="14" width="48" />
      <path
        d="M15 32V16l9 10 9-10v16"
        fill="none"
        stroke="var(--nim-accent)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.5"
      />
    </svg>
  )
}

/** Stand-in art, so a slide has something to hold without shipping artwork. */
function SlideArt({ seed }: { seed: number }) {
  return (
    <svg aria-hidden viewBox="0 0 300 220">
      <ellipse cx="150" cy="112" fill="var(--nim-accent-soft)" rx="120" ry="96" />
      <rect
        fill="var(--nim-surface-raised)"
        height="132"
        rx="20"
        stroke="var(--nim-line-soft)"
        width="104"
        x={seed === 1 ? 46 : 30}
        y="46"
      />
      <rect
        fill="var(--nim-surface)"
        height="112"
        rx="20"
        stroke="var(--nim-line-soft)"
        width="104"
        x={seed === 1 ? 160 : 172}
        y="62"
      />
      <circle cx={seed === 1 ? 98 : 82} cy="88" fill="var(--nim-accent)" r="18" />
      <rect fill="var(--nim-line-soft)" height="8" rx="4" width="64" x={seed === 1 ? 66 : 50} y="126" />
      <rect fill="var(--nim-line-soft)" height="8" rx="4" width="44" x={seed === 1 ? 76 : 60} y="144" />
      <rect fill="var(--nim-line-soft)" height="8" rx="4" width="64" x={seed === 1 ? 180 : 192} y="112" />
      <rect fill="var(--nim-line-soft)" height="8" rx="4" width="40" x={seed === 1 ? 190 : 202} y="130" />
    </svg>
  )
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function Flows({ lang }: { lang: Lang }) {
  const c = COPY[lang]
  const t = c.fl
  const num = new Intl.NumberFormat(c.locale)

  const [plan, setPlan] = useState('plus')
  const [cycle, setCycle] = useState('m6')
  const [tab, setTab] = useState('home')
  const [notifications, setNotifications] = useState(true)
  const [mood, setMood] = useState<string[]>([])
  const [causes, setCauses] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [gateway, setGateway] = useState('card')
  const [adminPage, setAdminPage] = useState('payments')
  const [filters, setFilters] = useState(['status', 'gateway', 'range'])
  const [reduced, setReduced] = useState(false)

  const months = cycle === 'm1' ? 1 : cycle === 'm3' ? 3 : 6
  const price = (monthly: number) => num.format(monthly * months)


  return (
    <>
      <div className="docs__intro">
        <Title>{t.introTitle}</Title>
        <Body>{t.introBody}</Body>
      </div>

      <Section id="onboarding" title={c.nav.onboarding}>
        <Specimen
          layout="block"
          note={t.ntIntro}
          title={t.spIntro}
          code={`<Onboarding\n  slides={[{ id, label, title, body, art, proof }, …]}\n  nextLabel="Continue"\n  finishLabel="Start"\n  skipLabel="Sign in"\n  onDone={goToAuth}\n/>`}
        >
          <div className="docs__screen">
            <Onboarding
              brand={<Mark size={32} />}
              finishLabel={t.finish}
              footnote={t.version}
              nextLabel={t.next}
              onDone={() => undefined}
              skipLabel={t.signIn}
              slides={[
                {
                  art: <SlideArt seed={1} />,
                  body: t.slide1Body,
                  id: 'scan',
                  label: t.slide1Label,
                  proof: { points: t.slide1Points, title: t.slide1Proof },
                  title: t.slide1Title,
                },
                {
                  art: <SlideArt seed={2} />,
                  body: t.slide2Body,
                  id: 'routine',
                  label: t.slide2Label,
                  proof: { points: t.slide2Points, title: t.slide2Proof },
                  title: t.slide2Title,
                },
                {
                  art: <SlideArt seed={3} />,
                  body: t.slide3Body,
                  id: 'trend',
                  label: t.slide3Label,
                  proof: { points: t.slide3Points, title: t.slide3Proof },
                  title: t.slide3Title,
                },
              ]}
            />
          </div>
        </Specimen>
      </Section>

      <Section id="auth" title={c.nav.auth}>
        <Specimen
          layout="block"
          note={t.ntSignInFlow}
          title={t.spSignIn}
          code={`<SignInFlow\n  brand={<Logo />}\n  onRequestCode={(e164) => api.sendCode(e164)}\n  onVerifyCode={(e164, code) => api.verify(e164, code)}\n  onPasswordSignIn={(email, password) => api.signIn(email, password)}\n/>`}
        >
          <div className="docs__screen">
            <SignInFlow
              brand={<Mark size={56} />}
              copy={t.signInCopy}
              footer={t.terms}
              // A stand-in backend: the code step accepts 12345 and rejects
              // everything else, so the error path is on this page too.
              onPasswordSignIn={async () => {
                await wait(700)
              }}
              onRequestCode={async () => {
                await wait(700)
              }}
              onVerifyCode={async (_e164, code) => {
                await wait(700)
                if (code !== '12345') throw new Error(t.wrongCode)
              }}
              resendSeconds={15}
            />
          </div>
        </Specimen>
      </Section>

      <Section id="wizard" title={c.nav.wizard}>
        <Specimen
          layout="block"
          note={t.ntWizard}
          title={t.spWizard}
          code={`<Wizard\n  steps={[{ id, question, subtitle, content, canContinue }, …]}\n  continueLabel="Continue" finishLabel="Save"\n  onClose={leave} onDone={save}\n/>`}
        >
          <div className="docs__screen">
            <Wizard
              continueLabel={t.next}
              finishLabel={t.wizardDone}
              onClose={() => undefined}
              onDone={() => undefined}
              steps={[
                {
                  canContinue: mood.length > 0,
                  content: (
                    <ChoiceGrid
                      onChange={setMood}
                      options={[
                        { icon: <span aria-hidden>😔</span>, id: 'bad', label: t.moodBad },
                        { icon: <span aria-hidden>😕</span>, id: 'low', label: t.moodLow },
                        { icon: <span aria-hidden>😐</span>, id: 'ok', label: t.moodOk },
                        { icon: <span aria-hidden>🙂</span>, id: 'good', label: t.moodGood },
                        { icon: <span aria-hidden>😄</span>, id: 'great', label: t.moodGreat },
                      ]}
                      selected={mood}
                    />
                  ),
                  id: 'mood',
                  question: t.wizardQ1,
                  subtitle: t.wizardS1,
                },
                {
                  canContinue: causes.length > 0,
                  content: (
                    <ChoiceGrid
                      max={3}
                      multiple
                      onChange={setCauses}
                      options={[
                        { icon: <Icon name="document" size="md" />, id: 'work', label: t.causeWork },
                        { icon: <Icon name="heart" size="md" />, id: 'family', label: t.causeFamily },
                        { icon: <Icon name="moon" size="md" />, id: 'sleep', label: t.causeSleep },
                        { icon: <Icon name="sparkle" size="md" />, id: 'health', label: t.causeHealth },
                        { icon: <Icon name="user" size="md" />, id: 'friends', label: t.causeFriends },
                        { icon: <Icon name="sun" size="md" />, id: 'outdoors', label: t.causeOutdoors },
                      ]}
                      selected={causes}
                    />
                  ),
                  id: 'cause',
                  question: t.wizardQ2,
                  subtitle: t.wizardS2,
                },
                {
                  content: (
                    <Textarea
                      label=""
                      onChange={(event) => setNote(event.target.value)}
                      placeholder={t.notePlaceholder}
                      rows={6}
                      value={note}
                    />
                  ),
                  id: 'note',
                  question: t.wizardQ3,
                  subtitle: t.wizardS3,
                },
              ]}
            />
          </div>
        </Specimen>
      </Section>

      <Conversations lang={lang} />

      <Section id="checkout" title={c.nav.checkout}>
        <Specimen
          layout="block"
          note={t.ntCheckout}
          title={t.spCheckout}
          code={`<OrderSummary items={lines} totals={[…, { emphasis: true }]} />\n<OptionCard selected={…} onSelect={…} title="Bank card" badge="Fastest" />\n<ActionBar total={{ label, value }} action={<Button>Pay now</Button>} />`}
        >
          <div className="docs__screen">
            <div className="docs__screen-body">
              <OrderSummary
                items={[
                  {
                    key: 'plan',
                    label: t.linePlan,
                    meta: t.linePlanMeta,
                    value: `${num.format(1194000)}`,
                  },
                  {
                    key: 'scans',
                    label: t.lineScan,
                    meta: t.lineScanMeta,
                    value: `${num.format(160000)}`,
                  },
                ]}
                title={t.orderTitle}
                totals={[
                  { key: 'sub', label: t.subtotal, value: num.format(1354000) },
                  { key: 'tax', label: t.tax, value: num.format(121860) },
                  { key: 'fee', label: t.fee, value: num.format(12000) },
                  { emphasis: true, key: 'total', label: t.totalLabel, value: num.format(1487860) },
                ]}
              />

              <div className="docs__stack">
                <strong>{t.payWith}</strong>
                <OptionCard
                  badge={t.gatewayDefault}
                  description={t.gatewayCardDesc}
                  icon="star"
                  name="gateway"
                  onSelect={() => setGateway('card')}
                  selected={gateway === 'card'}
                  title={t.gatewayCard}
                />
                <OptionCard
                  badge={t.gatewayReview}
                  description={t.gatewayTransferDesc}
                  detail={t.gatewayDetail}
                  icon="document"
                  name="gateway"
                  onSelect={() => setGateway('transfer')}
                  selected={gateway === 'transfer'}
                  title={t.gatewayTransfer}
                />
              </div>
            </div>

            <ActionBar
              action={<Button variant="accent">{t.payNow}</Button>}
              note={t.payNote}
              total={{ label: t.totalLabel, value: num.format(1487860) }}
            />
          </div>
        </Specimen>
      </Section>
      <Section id="progress" title={c.nav.progress}>
        <Specimen
          layout="column"
          note={t.ntProgress}
          title={t.spProgress}
          code={`<TaskProgress\n  title="Analysing your scan"\n  steps={[{ id, label, status: 'done' | 'active' | 'failed' | 'pending' }]}\n  action={<Button variant="ghost">Cancel</Button>}\n/>`}
        >
          <TaskProgress
            action={
              <Button size="sm" variant="ghost">
                {t.cancelJob}
              </Button>
            }
            caption={t.scanCaption}
            labels={{ of: t.stepsOf, status: t.stepStatus }}
            steps={[
              { id: 'upload', label: t.stepUpload, status: 'done' },
              { id: 'quality', label: t.stepQuality, status: 'active' },
              { id: 'analyse', label: t.stepAnalyse, status: 'pending' },
              { id: 'routine', label: t.stepRoutine, status: 'pending' },
              { id: 'report', label: t.stepReport, status: 'pending' },
            ]}
            title={t.scanTitle}
          />

          <TaskProgress
            caption={t.scanCaption}
            labels={{ of: t.stepsOf, status: t.stepStatus }}
            steps={[
              { id: 'upload', label: t.stepUpload, status: 'done' },
              { detail: t.stepFailedDetail, id: 'quality', label: t.stepQuality, status: 'failed' },
              { id: 'analyse', label: t.stepAnalyse, status: 'skipped' },
              { id: 'routine', label: t.stepRoutine, status: 'skipped' },
              { id: 'report', label: t.stepReport, status: 'skipped' },
            ]}
            title={t.scanTitle}
          />
        </Specimen>
      </Section>

      <Section id="plans" title={c.nav.plans}>
        <Specimen
          layout="block"
          note={t.ntPlanPicker}
          title={t.spPlans}
          code={`<PlanPicker\n  cycles={[{ id: 'm1', label: '1 month' }, …]}\n  plans={[{ id, name, badge, features, prices: { m1: { price, monthly } } }]}\n  submitLabel="Continue to payment"\n  onSubmit={(plan, cycle) => checkout(plan, cycle)}\n/>`}
        >
          <div className="docs__screen docs__screen--tall">
            <PlanPicker
              cycle={cycle}
              cycles={[
                { id: 'm1', label: t.oneMonth },
                { id: 'm3', label: t.threeMonths },
                { id: 'm6', label: t.sixMonths, note: t.save },
              ]}
              labels={{ cycle: t.spBilling, monthly: t.perMonth, price: t.perPack }}
              note={t.planNote}
              onCycleChange={setCycle}
              onPlanChange={setPlan}
              plan={plan}
              plans={[
                {
                  features: [
                    { label: t.fFree1 },
                    { label: t.fFree2 },
                    { label: t.fFree4, state: 'excluded' },
                  ],
                  icon: 'star',
                  id: 'free',
                  name: t.free,
                  prices: { m1: { price: num.format(0) }, m3: { price: num.format(0) }, m6: { price: num.format(0) } },
                  tagline: t.freeTag,
                },
                {
                  badge: t.recommended,
                  features: [
                    { label: t.fPlus1 },
                    { label: t.fPlus3 },
                    { label: t.fPlus4, note: t.soon, state: 'pending' },
                  ],
                  icon: 'sparkle',
                  id: 'plus',
                  name: t.plus,
                  prices: {
                    m1: { monthly: num.format(199000), price: price(199000) },
                    m3: { monthly: num.format(199000), price: price(199000) },
                    m6: { monthly: num.format(199000), price: price(199000) },
                  },
                  tagline: t.plusTag,
                },
                {
                  badge: t.mostCapacity,
                  features: [{ label: t.fPlus1 }, { label: t.fPlus5 }],
                  icon: 'heart',
                  id: 'pro',
                  name: t.pro,
                  prices: {
                    m1: { monthly: num.format(399000), price: price(399000) },
                    m3: { monthly: num.format(399000), price: price(399000) },
                    m6: { monthly: num.format(399000), price: price(399000) },
                  },
                  tagline: t.proTag,
                },
              ]}
              submitLabel={t.continueToPayment}
            />
          </div>
        </Specimen>
      </Section>

      <Section id="profile" title={c.nav.profile}>
        <Specimen
          layout="block"
          note={t.ntProfileScreen}
          title={t.spProfile}
          code={`<ProfileScreen\n  avatar={<AvatarRing … />} eyebrow="member account" name="Sara Ahmadi"\n  stats={[{ label, value }, …]}\n  sections={[{ key, title, rows: [{ key, label, icon, onSelect | onToggle }] }]}\n  footer={<Button variant="danger">Sign out</Button>}\n/>`}
        >
          <div className="docs__screen docs__screen--tall">
            <ProfileScreen
              actions={
                <>
                  <Button variant="accent">{t.completeProfile}</Button>
                  <Button variant="secondary">{t.seeAnalysis}</Button>
                </>
              }
              avatar={
                <AvatarRing
                  caption={num.format(72)}
                  initials={lang === 'fa' ? 'س' : 'S'}
                  label={`${t.completion} ${num.format(72)}%`}
                  value={72}
                />
              }
              chips={
                <>
                  <Badge variant="accent">{t.skinChip}</Badge>
                  <Badge tone="outline">{t.planChip}</Badge>
                </>
              }
              eyebrow={t.account}
              footer={<Button variant="danger">{t.signOut}</Button>}
              name={t.person}
              sections={[
                {
                  key: 'account',
                  rows: [
                    { icon: 'user', key: 'personal', label: t.rowPersonal, onSelect: () => undefined },
                    { icon: 'sparkle', key: 'skin', label: t.rowSkin, onSelect: () => undefined },
                    { icon: 'star', key: 'plan', label: t.rowPlan, value: t.plus, onSelect: () => undefined },
                  ],
                  title: t.groupAccount,
                },
                {
                  key: 'prefs',
                  rows: [
                    {
                      checked: notifications,
                      icon: 'bell',
                      key: 'notifications',
                      label: t.rowNotifications,
                      onToggle: setNotifications,
                      subtitle: t.rowNotificationsSub,
                    },
                    {
                      checked: reduced,
                      icon: 'settings',
                      key: 'reduced',
                      label: t.rowReduced,
                      onToggle: setReduced,
                    },
                  ],
                  title: t.groupPreferences,
                },
                {
                  key: 'app',
                  rows: [
                    { icon: 'info', key: 'version', label: t.rowVersion, value: t.version },
                    { danger: true, icon: 'trash', key: 'delete', label: t.rowDelete, onSelect: () => undefined },
                  ],
                  title: t.groupApp,
                },
              ]}
              stats={[
                { label: t.completion, value: `${num.format(72)}%` },
                { label: t.scans, value: num.format(9) },
                { label: t.streak, value: num.format(14) },
              ]}
            />
          </div>
        </Specimen>
      </Section>

      <Section id="tabbar" title={c.nav.tabbar}>
        <Specimen
          layout="block"
          note={t.ntAppShell}
          title={t.spTabBar}
          code={`<AppShell\n  header={<Title size="md">Home</Title>}\n  tabs={{ label: 'Main navigation', value: tab, items: [...] }}\n>\n  {page}\n</AppShell>\n\n// Past 64rem the frame widens and the tabs become a side rail.\n// A phone-only product — or a demo in a phone-sized box, as here —\n// pins the phone frame:\n<AppShell frame="phone" …>`}
        >
          {/* The specimen is a phone-sized box, so it pins the phone frame:
              the responsive switch answers the WINDOW, and a rail drawn inside
              a 360px demo would show a layout no viewer is actually in. */}
          <div className="docs__screen">
            <AppShell
              frame="phone"
              header={<Title size="md">{t.tabHome}</Title>}
              tabs={{
                items: [
                  { icon: 'sparkle', key: 'home', label: t.tabHome, onSelect: () => setTab('home') },
                  { icon: 'calendar', key: 'routine', label: t.tabRoutine, onSelect: () => setTab('routine') },
                  { center: true, icon: 'camera', key: 'scan', label: t.tabScan, onSelect: () => setTab('scan') },
                  { icon: 'heart', key: 'reflect', label: t.tabReflect, onSelect: () => setTab('reflect') },
                  { icon: 'user', key: 'profile', label: t.tabProfile, onSelect: () => setTab('profile') },
                ],
                label: c.nav.navigation,
                value: tab,
              }}
            >
              <Body size="sm">{t.shellBody}</Body>
            </AppShell>
          </div>
        </Specimen>
      </Section>
      <Section id="console" title={c.nav.console}>
        <Specimen
          layout="block"
          note={t.ntConsole}
          title={t.spConsole}
          code={`<Page>\n  <MetricGrid><Metric label value delta tone /></MetricGrid>\n  <Columns template="aside">\n    <Panel eyebrow title actions>…</Panel>\n    <Panel title><Facts items={[{ label, value, mono }]} /></Panel>\n  </Columns>\n</Page>`}
        >
          <div className="docs__console">
            <Page>
              <MetricGrid>
                <Metric delta="8.2%" icon="activity" label={t.csRequests} value="1,284,003" />
                <Metric delta="0.4%" deltaDirection="up" deltaIntent="less-is-better" icon="danger" label={t.csErrors} tone="danger" value="0.9%" />
                <Metric delta="12ms" deltaDirection="down" deltaIntent="less-is-better" icon="clock" label={t.csLatency} tone="success" value="184ms" />
                <Metric hint={t.csSince} icon="layers" label={t.csQueue} tone="warning" value="47" />
              </MetricGrid>

              <Columns template="aside">
                <Panel
                  actions={<Button size="sm" variant="secondary">{t.approve}</Button>}
                  eyebrow={t.csFleet}
                  title={t.navOverview}
                >
                  <Stack>
                    <Toolbar actions={<Button size="sm" variant="accent">{t.approve}</Button>}>
                      <Input iconStart="search" label={t.csNode} placeholder={t.csNode} />
                    </Toolbar>
                    <CodeBlock label={t.csDeploy}>{'swarm deploy --stack edge --digest sha256:9f21c4\n  › resolving 4 services\n  › edge-router   updated  (2/2)\n  › edge-cache    updated  (3/3)\n  ✓ converged in 41s'}</CodeBlock>
                  </Stack>
                </Panel>
                <Panel title={t.paymentTitle}>
                  <Facts
                    items={[
                      { label: t.csHost, mono: true, value: 'edge-3.fra' },
                      { label: t.csRegion, value: 'eu-central' },
                      { label: t.csImage, mono: true, value: 'ghcr.io/example/edge:2026.08' },
                      { label: t.csUptime, value: '19d 04h' },
                    ]}
                  />
                </Panel>
              </Columns>
            </Page>
          </div>
        </Specimen>

        <Specimen
          note={t.ntBrand}
          title={t.spBrand}
          code={`<Brand mark={<YourMark />} name="Swarm" nameAccent="Ops" tagline size="lg" />\n<BrandMark name="postgresql" size="sm" />   // brandFor('postgres') → 'postgresql'`}
        >
          <Stack>
            <Brand
              mark={<BrandMark name="prometheus" size="lg" />}
              name="Swarm"
              nameAccent="Ops"
              size="lg"
              tagline={t.brandTagline}
            />
            <Brand className="docs__brand-accent" mark={<BrandMark name="grafana" />} name="Swarm" nameAccent="Ops" tagline={t.brandTagline} />
            <Brand mark={<BrandMark name="jaeger" size="sm" />} name="Swarm" nameAccent="Ops" size="sm" />
            <Inline>
              {(['github', 'gitlab', 'gitea', 'postgresql', 'mongodb', 'redis', 'valkey', 'prometheus', 'grafana', 'jaeger', 'loki'] as const).map((brand) => (
                <BrandMark key={brand} label={brand} name={brand} />
              ))}
            </Inline>
          </Stack>
        </Specimen>

        <Specimen
          layout="block"
          note={t.ntProcedure}
          title={t.spProcedure}
          code={`<StageTrack stages={[{ id, label, caption, status }]} />\n<DetailLayout aside={<Rail title footer={<Button …/>}>\n  <RailSection title meta tone>…</RailSection>\n</Rail>}>\n  <Panel marker="1" title description>…</Panel>\n</DetailLayout>`}
        >
          <div className="docs__console">
            <Page width="full">
              <StageTrack
                stages={[
                  { caption: t.prConnect, id: 'provider', label: t.prStages, status: 'done' },
                  { caption: t.prSelect, id: 'repository', label: t.prStages2, status: 'done' },
                  { caption: t.prScan, id: 'discover', label: t.prStages3, status: 'active' },
                  { caption: t.prClassify, id: 'review', label: t.prStages4, status: 'pending' },
                  { caption: t.prConfigure, id: 'deploy', label: t.prStages5, status: 'pending' },
                ]}
              />
              <DetailLayout
                aside={
                  <Rail
                    footer={
                      <>
                        <Button disabled fullWidth variant="accent">{t.prDeploy}</Button>
                        <span>{t.prBlocked}</span>
                      </>
                    }
                    title={t.prPlan}
                  >
                    <RailSection meta="2" title={t.prApps}>
                      <List plain>
                        <ListRow leading={<Icon name="check-circle" size="sm" tone="success" />} title="api" trailing={<Badge pill size="sm" tone="soft" variant="accent">prod-api-a</Badge>} />
                        <ListRow leading={<Icon name="check-circle" size="sm" tone="success" />} title="worker" trailing={<Badge pill size="sm" tone="soft" variant="accent">prod-worker-a</Badge>} />
                      </List>
                    </RailSection>
                    <RailSection meta="2" title={t.prImages}>
                      <List plain>
                        <ListRow leading={<Icon name="package" size="sm" />} subtitle="ghcr.io/example/api" title="api" trailing={<CopyChip>a1b2c3d</CopyChip>} />
                        <ListRow leading={<Icon name="package" size="sm" />} subtitle="ghcr.io/example/worker" title="worker" trailing={<CopyChip>d4e5f6g</CopyChip>} />
                      </List>
                    </RailSection>
                    <RailSection meta="1" title={t.prWarnings} tone="warning">
                      <List plain>
                        <ListRow leading={<Icon name="alert" size="sm" tone="warning" />} title={t.prWarning} />
                      </List>
                    </RailSection>
                    <RailSection meta="1" title={t.prBlockers} tone="danger">
                      <List plain>
                        <ListRow leading={<Icon name="danger" size="sm" tone="danger" />} title={t.prBlocker} />
                      </List>
                    </RailSection>
                  </Rail>
                }
              >
                <Panel description={t.prConnect} marker="1" title={t.prStages}>
                  <Facts
                    columns={3}
                    items={[
                      { label: t.csHost, value: 'git.corp.example.com' },
                      { label: t.csImage, mono: true, value: 'ghcr.io/example/api' },
                      { label: t.csRegion, value: 'eu-central' },
                    ]}
                  />
                </Panel>
                <Panel description={t.prScan} marker="3" title={t.prStages3}>
                  <Body size="sm">{t.prProviderBody}</Body>
                </Panel>
              </DetailLayout>
            </Page>
          </div>
        </Specimen>

        <Specimen
          layout="block"
          note={t.ntConsoleTable}
          title={t.spConsoleTable}
          code={`<DataTable\n  columns={columns} rows={rows} rowKey={(r) => r.id}\n  loading={firstLoad} refreshing={polling}\n  error={message} onRetry={refetch}\n  empty={<EmptyState … />}\n  page={page} pageCount={pages} onPageChange={setPage}\n/>`}
        >
          <DataTable
            columns={[
              { header: t.csNode, key: 'node', render: (row: ConsoleRow) => <RecordLink meta={row.id} title={row.host} /> },
              { header: t.csRegion, key: 'region', render: (row: ConsoleRow) => <Mono>{row.region}</Mono> },
              { header: t.csState, key: 'state', render: (row: ConsoleRow) => <StatusDot pulse={row.tone === 'warning'} tone={row.tone}>{row.state}</StatusDot> },
              { header: t.csTasks, key: 'tasks', numeric: true, render: (row: ConsoleRow) => row.tasks },
            ]}
            empty={<EmptyState description={t.csEmptyBody} icon="server" title={t.csEmpty} />}
            rowKey={(row: ConsoleRow) => row.id}
            rows={CONSOLE_ROWS(t)}
            summary="Showing 1–4 of 4"
          />
        </Specimen>
      </Section>
      <Section id="admin" title={c.nav.admin}>
        <Specimen
          layout="block"
          note={t.ntAdmin}
          title={t.spAdmin}
          code={`<AdminShell\n  brand={<Logo />} title="Payments" value={route}\n  groups={[{ key, label, items: [{ key, label, icon, onSelect }] }]}\n  toolbar={<Input iconStart="search" />}\n  sidebarFooter={<>…</>}\n>{page}</AdminShell>`}
        >
          <div className="docs__console">
            <AdminShell
              brand={<Mark size={32} />}
              groups={[
                {
                  icon: 'sparkle',
                  items: [
                    { icon: 'sparkle', key: 'dashboard', label: t.navDashboard, onSelect: () => setAdminPage('dashboard') },
                    { icon: 'user', key: 'users', label: t.navUsers, onSelect: () => setAdminPage('users') },
                  ],
                  key: 'overview',
                  label: t.navOverview,
                },
                {
                  icon: 'document',
                  items: [
                    { icon: 'document', key: 'orders', label: t.navOrders, onSelect: () => setAdminPage('orders') },
                    { icon: 'star', key: 'payments', label: t.navPayments, onSelect: () => setAdminPage('payments') },
                  ],
                  key: 'commerce',
                  label: t.navCommerce,
                },
                {
                  icon: 'alert',
                  items: [
                    { icon: 'clock', key: 'queues', label: t.navQueues, onSelect: () => setAdminPage('queues') },
                    { icon: 'camera', key: 'scans', label: t.navScans, onSelect: () => setAdminPage('scans') },
                    { icon: 'settings', key: 'settings', label: t.navSettings, onSelect: () => setAdminPage('settings') },
                  ],
                  key: 'monitoring',
                  label: t.navMonitoring,
                },
              ]}
              sidebarFooter={
                <>
                  <span>{t.adminSession}</span>
                  <span>{t.adminBuild}</span>
                </>
              }
              title={t.navPayments}
              toolbar={<Badge tone="outline">{t.adminSession}</Badge>}
              value={adminPage}
            >
              <div className="docs__stack">
                <DetailHeader
                  actions={
                    <>
                      <Button size="sm" variant="accent">
                        {t.approve}
                      </Button>
                      <Button size="sm" variant="secondary">
                        {t.reject}
                      </Button>
                    </>
                  }
                  back={{ label: t.backToPayments, onClick: () => undefined }}
                  meta={t.paymentMeta}
                  status={<Badge tone="soft" variant="warning">{t.paymentStatus}</Badge>}
                  subtitle={t.paymentSubtitle}
                  title={t.paymentTitle}
                />

                <FilterChips
                  chips={[
                    { key: 'status', label: t.filterStatus, onRemove: () => setFilters((was) => was.filter((f) => f !== 'status')), value: t.filterPending },
                    { key: 'gateway', label: t.filterGateway, onRemove: () => setFilters((was) => was.filter((f) => f !== 'gateway')), value: t.filterManual },
                    { key: 'range', label: t.filterRange, onRemove: () => setFilters((was) => was.filter((f) => f !== 'range')), value: t.filterThisWeek },
                  ].filter((chip) => filters.includes(chip.key))}
                  clearLabel={t.clearAll}
                  onClearAll={() => setFilters([])}
                />

                <ActivityFeed
                  events={[
                    { action: t.feed1, actor: t.actorNima, at: '2026-08-23T09:41:00', icon: 'check', id: 'a1', target: t.targetPayment, tone: 'success' },
                    { action: t.feed2, actor: t.actorSara, at: '2026-08-23T09:12:00', icon: 'close', id: 'a2', target: t.targetPayment, tone: 'danger' },
                    { action: t.feed3, actor: t.actorNima, at: '2026-08-22T18:03:00', icon: 'star', id: 'a3', target: t.targetUser, tone: 'accent' },
                    { action: t.feed4, actor: t.actorSara, at: '2026-08-22T11:20:00', icon: 'bell', id: 'a4', target: t.targetUser },
                  ]}
                  locale={c.locale}
                />
              </div>
            </AdminShell>
          </div>
        </Specimen>
      </Section>
    </>
  )
}
