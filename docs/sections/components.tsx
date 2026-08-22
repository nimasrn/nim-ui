import { useState } from 'react'
import {
  Avatar,
  Badge,
  Banner,
  Body,
  Button,
  Card,
  Checkbox,
  EmptyState,
  Icon,
  IconButton,
  Inline,
  Input,
  Label,
  List,
  ListRow,
  Progress,
  SectionHeader,
  Segmented,
  Select,
  Sheet,
  Skeleton,
  Slider,
  Spinner,
  Stack,
  Stat,
  Switch,
  Textarea,
  Title,
  useToast,
} from 'nim'
import { Section, Specimen } from '../specimen'

export function Components() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [segment, setSegment] = useState<'week' | 'month' | 'year'>('week')
  const [load, setLoad] = useState(50)
  const [checked, setChecked] = useState(true)
  const [enabled, setEnabled] = useState(true)
  const toast = useToast()

  return (
    <>
      <div className="docs__intro">
        <Title>Components</Title>
        <Body>
          Every variant, size, and state the kit ships. Flip the theme, scheme, or direction in the
          bar above and read this page again — nothing below is re-authored per theme.
        </Body>
      </div>

      <Section id="button" title="Button">
        <Specimen
          title="Variants"
          code={`<Button variant="primary">Save</Button>\n<Button variant="accent">Start scan</Button>\n<Button variant="secondary">Cancel</Button>\n<Button variant="ghost">Skip</Button>\n<Button variant="danger">Delete</Button>`}
        >
          <Button>Save changes</Button>
          <Button variant="accent">Start scan</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="ghost">Skip</Button>
          <Button variant="danger">Delete</Button>
        </Specimen>
        <Specimen title="Sizes" code={`<Button size="sm" | "md" | "lg" />`}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Specimen>
        <Specimen
          title="States & icons"
          note="loading keeps the label in place so the width never jumps"
          code={`<Button loading>Saving</Button>\n<Button disabled>Unavailable</Button>\n<Button iconStart="plus">New</Button>\n<Button iconEnd="arrow-forward">Continue</Button>`}
        >
          <Button loading>Saving</Button>
          <Button disabled>Unavailable</Button>
          <Button iconStart="plus" variant="secondary">
            New entry
          </Button>
          <Button iconEnd="arrow-forward" variant="ghost">
            Continue
          </Button>
        </Specimen>
        <Specimen title="Icon button" code={`<IconButton label="Settings" name="settings" variant="ghost" />`}>
          <IconButton label="Search" name="search" />
          <IconButton label="Settings" name="settings" variant="outline" />
          <IconButton label="Add" name="plus" variant="solid" />
          <IconButton label="Delete" disabled name="trash" variant="outline" />
        </Specimen>
      </Section>

      <Section id="badge" title="Badge">
        <Specimen title="Tones" code={`<Badge variant="success" tone="soft" | "solid" | "outline" />`}>
          <Badge>Neutral</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success" dot>
            Live
          </Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="danger" tone="solid">
            Failed
          </Badge>
          <Badge variant="info" tone="outline">
            Info
          </Badge>
          <Badge pill size="sm" variant="accent">
            Beta
          </Badge>
        </Specimen>
      </Section>

      <Section id="card" title="Card">
        <Specimen
          layout="block"
          title="Variants"
          code={`<Card variant="raised" header={…} footer={…}>…</Card>`}
        >
          <div className="docs__grid">
            <Card>
              <Title size="md">Default</Title>
              <Body size="sm">A ruled plate on the canvas.</Body>
            </Card>
            <Card variant="raised">
              <Title size="md">Raised</Title>
              <Body size="sm">Carries the theme&apos;s elevation.</Body>
            </Card>
            <Card variant="muted">
              <Title size="md">Muted</Title>
              <Body size="sm">Recedes behind its neighbours.</Body>
            </Card>
            <Card variant="accent">
              <Title size="md">Accent</Title>
              <Body size="sm">For a single highlighted item.</Body>
            </Card>
          </div>
        </Specimen>
        <Specimen
          layout="block"
          title="With header and footer"
          code={`<Card header={<Label>…</Label>} footer={<Button …/>}>…</Card>`}
        >
          <Card
            footer={
              <Button size="sm" variant="secondary">
                View report
              </Button>
            }
            header={
              <>
                <Label>Session 04</Label>
                <Badge dot variant="success">
                  Complete
                </Badge>
              </>
            }
            variant="raised"
          >
            <Body size="sm">
              Composition is the card&apos;s job; spacing between cards belongs to the page.
            </Body>
          </Card>
        </Specimen>
      </Section>

      <Section id="stat" title="Stat">
        <Specimen layout="block" title="Metrics" code={`<Stat value="18M+" unit="/min" label="Events" delta="+12%" />`}>
          <div className="docs__grid">
            <Stat delta="+12%" label="Events per minute" unit="/min" value="18M" />
            <Stat delta="-4%" deltaDirection="down" label="p99 latency" unit="ms" value="8.4" />
            <Stat label="Throughput gain" value="20×" />
            <Stat label="Cost reduction" value="70%" />
          </div>
        </Specimen>
      </Section>

      <Section id="form" title="Form controls">
        <Specimen layout="column" title="Text inputs" code={`<Input label="Email" hint="…" error="…" iconStart="search" />`}>
          <Input hint="We only use this to send the report." label="Email" placeholder="you@example.com" />
          <Input iconStart="search" label="Search" placeholder="Find a routine" />
          <Input error="This field is required." label="Full name" placeholder="Nima Sarayan" required />
          <Input disabled label="Workspace" value="nim.zone" />
          <Textarea hint="Markdown is supported." label="Notes" placeholder="What changed?" />
          <Select
            label="Cadence"
            options={[
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' },
            ]}
            placeholder="Choose one"
          />
        </Specimen>
        <Specimen layout="column" title="Choice" code={`<Checkbox checked …>Label</Checkbox>\n<Switch checked …>Label</Switch>`}>
          <Checkbox checked={checked} description="Sent every Monday morning." onChange={(event) => setChecked(event.target.checked)}>
            Weekly summary
          </Checkbox>
          <Checkbox disabled>Unavailable on this plan</Checkbox>
          <Switch checked={enabled} description="Applies to this device only." onChange={(event) => setEnabled(event.target.checked)}>
            Reduced motion
          </Switch>
        </Specimen>
        <Specimen layout="block" title="Slider" code={`<Slider label="Load" value={load} onChange={…} scale={['1M','8M','15M']} />`}>
          <Slider
            label="Load"
            max={100}
            min={0}
            onChange={(event) => setLoad(Number(event.target.value))}
            scale={['1M', '8M', '15M']}
            value={load}
          />
        </Specimen>
        <Specimen title="Segmented" code={`<Segmented label="Range" options={…} value={…} onChange={…} />`}>
          <Segmented
            label="Range"
            onChange={setSegment}
            options={[
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month' },
              { label: 'Year', value: 'year' },
            ]}
            value={segment}
          />
        </Specimen>
      </Section>

      <Section id="list" title="List">
        <Specimen layout="block" title="Rows" code={`<List>\n  <ListRow title="…" subtitle="…" leading={…} onClick={…} />\n</List>`}>
          <List>
            <ListRow
              leading={<Avatar name="Nima Sarayan" />}
              onClick={() => toast({ message: 'Opened profile' })}
              subtitle="Signed in · nimax.sr@gmail.com"
              title="Nima Sarayan"
            />
            <ListRow
              leading={<Icon name="bell" />}
              onClick={() => toast({ message: 'Opened notifications' })}
              subtitle="Daily at 08:00"
              title="Notifications"
            />
            <ListRow
              leading={<Icon name="moon" />}
              title="Appearance"
              trailing={<Badge tone="outline">System</Badge>}
            />
            <ListRow leading={<Icon name="sign-out" tone="danger" />} onClick={() => toast({ message: 'Signed out', tone: 'danger' })} title="Sign out" />
          </List>
        </Specimen>
      </Section>

      <Section id="feedback" title="Feedback">
        <Specimen title="Banners" layout="column" code={`<Banner tone="warning" title="…">…</Banner>`}>
          <Banner title="Scan queued">Results usually arrive within a minute.</Banner>
          <Banner tone="accent" title="New in this release">
            Routines can now be shared with your clinician.
          </Banner>
          <Banner tone="success">Your profile is up to date.</Banner>
          <Banner tone="warning" title="Connection is slow">
            We will keep retrying in the background.
          </Banner>
          <Banner tone="danger" title="Upload failed">
            The file exceeded the 12 MB limit.
          </Banner>
        </Specimen>
        <Specimen title="Loading" code={`<Spinner />  <Progress value={64} />  <Skeleton width={220} />`}>
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
        </Specimen>
        <Specimen layout="column" title="Progress & skeleton">
          <Progress label="Upload" value={64} />
          <Progress label="Working" />
          <Stack gap="tight">
            <Skeleton height={20} width="60%" />
            <Skeleton height={14} />
            <Skeleton height={14} width="80%" />
          </Stack>
        </Specimen>
        <Specimen title="Toast" code={`const toast = useToast()\ntoast({ message: 'Saved', tone: 'success' })`}>
          <Button onClick={() => toast({ message: 'Changes saved.', tone: 'success' })} variant="secondary">
            Success toast
          </Button>
          <Button
            onClick={() => toast({ action: { label: 'Undo', onPress: () => undefined }, message: 'Entry deleted.', tone: 'danger' })}
            variant="secondary"
          >
            With action
          </Button>
        </Specimen>
        <Specimen layout="block" title="Empty state" code={`<EmptyState icon="search" title="…" description="…" actions={…} />`}>
          <EmptyState
            actions={<Button size="sm">Add your first routine</Button>}
            description="Nothing has been recorded yet. Once you add a routine it will appear here with its history."
            icon="document"
            title="No routines yet"
          />
        </Specimen>
      </Section>

      <Section id="sheet" title="Sheet">
        <Specimen title="Bottom sheet" note="scroll lock · Escape · focus restore" code={`<Sheet open={open} onClose={…} title="…" footer={…}>…</Sheet>`}>
          <Button onClick={() => setSheetOpen(true)} variant="secondary">
            Open sheet
          </Button>
          <Sheet
            footer={
              <>
                <Button fullWidth onClick={() => setSheetOpen(false)}>
                  Confirm
                </Button>
                <Button fullWidth onClick={() => setSheetOpen(false)} variant="ghost">
                  Cancel
                </Button>
              </>
            }
            onClose={() => setSheetOpen(false)}
            open={sheetOpen}
            title="Confirm routine"
          >
            <Stack>
              <Body size="sm">
                The sheet is the kit&apos;s modal surface. It locks the page behind it, closes on
                Escape, and returns focus to whatever opened it.
              </Body>
              <Input label="Name" placeholder="Evening routine" />
              <Switch defaultChecked>Remind me</Switch>
            </Stack>
          </Sheet>
        </Specimen>
      </Section>

      <Section id="composition" title="Composition">
        <Specimen layout="block" title="A screen assembled from the kit" note="no bespoke CSS">
          <Stack gap="loose">
            <SectionHeader
              action={
                <Button size="sm" variant="ghost" iconEnd="arrow-forward">
                  All
                </Button>
              }
              description="Everything below is kit output — the page only supplies rhythm."
              eyebrow="Today"
              title="Your morning"
            />
            <Inline>
              <Stat label="Streak" unit="days" value="12" />
              <Stat delta="+8%" label="Adherence" value="94%" />
              <Stat label="Next check" value="09:30" />
            </Inline>
            <Card variant="raised">
              <Stack>
                <Inline>
                  <Badge dot variant="success">
                    On track
                  </Badge>
                  <Badge tone="outline">3 steps</Badge>
                </Inline>
                <Title size="md">Evening routine</Title>
                <Body size="sm">Cleanser, serum, and SPF — logged automatically after each scan.</Body>
                <Progress label="Completion" value={66} />
              </Stack>
            </Card>
          </Stack>
        </Specimen>
      </Section>
    </>
  )
}
