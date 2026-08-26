import { useMemo, useState } from 'react'
import {
  AssistantThread,
  Chart,
  Chat,
  ChatComposer,
  EmptyState,
  IconButton,
  Input,
  MapView,
  Messenger,
  RoomHeader,
  type AssistantTurn,
  type ChatDraft,
  type ChatMessage,
  type Conversation,
  type MenuItem,
} from 'nim'
import { COPY, type Lang } from '../copy'
import { Section, Specimen } from '../specimen'
import { SAMPLE_VOICE, SAMPLE_WAVEFORM } from './chat-media'
import { MapTiles, TEHRAN } from './sample-map'

/** One weekday shorthand per point; the chart in the bubble is a week. */
const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function Conversations({ lang }: { lang: Lang }) {
  const c = COPY[lang]
  const t = c.fl

  const [room, setRoom] = useState<string | undefined>('design-review')
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { at: '2026-08-24T08:40:00', id: 'g0', system: true, text: t.gmSystem },
    {
      at: '2026-08-24T09:02:00',
      author: { name: t.personLeila },
      id: 'g1',
      reactions: [{ count: 3, emoji: '👍', mine: true }],
      text: t.gm1,
    },
    { at: '2026-08-24T09:03:00', author: { name: t.personLeila }, id: 'g2', text: t.gm2 },
    {
      at: '2026-08-24T09:11:00',
      card: (
        <Chart
          categories={WEEK}
          height={140}
          kind="area"
          locale={c.locale}
          note={t.gmChartNote}
          series={[{ label: c.t.chSessions, values: [18, 21, 24, 19, 26, 12, 9] }]}
          title={t.gmChartTitle}
        />
      ),
      author: { name: t.personAmir },
      id: 'g3',
      text: t.gm3,
    },
    {
      at: '2026-08-24T09:12:00',
      author: { name: t.personAmir },
      id: 'g4',
      replyTo: { author: t.personLeila, id: 'g1', text: t.gm1 },
      text: t.gm4,
    },
    {
      at: '2026-08-24T09:26:00',
      card: (
        <MapView
          attribution={t.gmMapAttribution}
          bounds={TEHRAN}
          markers={[{ id: 'clinic', lat: 35.716, lng: 51.402, label: c.t.mapClinic }]}
          ratio={16 / 9}
          tiles={<MapTiles />}
          title={t.gmMapTitle}
        />
      ),
      id: 'g5',
      own: true,
      status: 'read',
      text: t.gm5,
    },
    {
      at: '2026-08-24T09:31:00',
      author: { name: t.person },
      id: 'g6',
      reactions: [
        { count: 1, emoji: '🙏' },
        { count: 2, emoji: '❤️' },
      ],
      text: t.gm6,
    },
    {
      at: '2026-08-24T09:34:00',
      attachments: [{ duration: 3, kind: 'voice', url: SAMPLE_VOICE, waveform: SAMPLE_WAVEFORM }],
      author: { name: t.person },
      id: 'g7',
      text: t.gm7,
    },
    { at: '2026-08-24T09:40:00', deleted: true, id: 'g8', own: true, status: 'sent', text: t.gm8 },
  ])

  const rooms: Conversation[] = useMemo(
    () => [
      {
        at: '2026-08-24T09:11:00',
        id: 'design-review',
        kind: 'channel',
        members: 12,
        name: t.roomDesign,
        preview: t.mgPreviewDesign,
      },
      {
        at: '2026-08-24T08:02:00',
        id: 'ship-room',
        kind: 'channel',
        name: t.roomShip,
        preview: t.mgPreviewShip,
        unread: 4,
      },
      {
        at: '2026-08-23T22:14:00',
        id: 'incidents',
        kind: 'channel',
        muted: true,
        name: t.roomIncidents,
        preview: t.mgPreviewIncidents,
        unread: 27,
      },
      {
        at: '2026-08-24T07:50:00',
        id: 'clinic',
        kind: 'group',
        members: 6,
        name: t.groupClinic,
        preview: t.mgPreviewClinic,
      },
      {
        at: '2026-08-22T16:30:00',
        id: 'launch',
        kind: 'group',
        members: 9,
        name: t.groupLaunch,
        preview: t.mgPreviewLaunch,
      },
      {
        at: '2026-08-24T09:34:00',
        id: 'sara',
        kind: 'direct',
        name: t.person,
        preview: t.mgPreviewSara,
        unread: 1,
      },
      { id: 'amir', kind: 'direct', name: t.personAmir, typing: t.mgPreviewAmir },
    ],
    [t],
  )

  const sections = [
    { items: rooms.filter((item) => item.kind === 'channel'), key: 'channels', label: t.mgChannels },
    { items: rooms.filter((item) => item.kind === 'group'), key: 'groups', label: t.mgGroups },
    { items: rooms.filter((item) => item.kind === 'direct'), key: 'direct', label: t.mgDirect },
  ]

  const react = (message: ChatMessage, emoji: string) =>
    setMessages((was) =>
      was.map((item) => {
        if (item.id !== message.id) return item
        const existing = item.reactions?.find((reaction) => reaction.emoji === emoji)
        if (!existing) return { ...item, reactions: [...(item.reactions ?? []), { count: 1, emoji, mine: true }] }
        const count = existing.count + (existing.mine ? -1 : 1)
        return {
          ...item,
          reactions: (count === 0
            ? item.reactions?.filter((reaction) => reaction.emoji !== emoji)
            : item.reactions?.map((reaction) =>
                reaction.emoji === emoji ? { count, emoji, mine: !existing.mine } : reaction,
              )) as ChatMessage['reactions'],
        }
      }),
    )

  // The menu is the CALLER's: what "delete" means — for me, for everyone,
  // after how long — is a product decision, and the kit only renders the list.
  const actions = (message: ChatMessage): MenuItem[] => {
    if (message.deleted) return []
    const items: MenuItem[] = [
      { icon: 'reply', label: t.acReply, onSelect: () => setReplyTo(message) },
      { icon: 'copy', label: t.acCopy, onSelect: () => void navigator.clipboard?.writeText(message.text ?? '') },
      { icon: 'forward', label: t.acForward, onSelect: () => undefined },
      { icon: 'pin', label: t.acPin, onSelect: () => undefined },
    ]
    if (message.own) {
      items.push(
        { kind: 'separator' },
        {
          danger: true,
          icon: 'trash',
          label: t.acDelete,
          onSelect: () =>
            setMessages((was) =>
              was.map((item) =>
                item.id === message.id ? { ...item, attachments: undefined, card: undefined, deleted: true, reactions: undefined } : item,
              ),
            ),
        },
      )
    }
    return items
  }

  const send = (draft: ChatDraft) => {
    setMessages((was) => [
      ...was,
      {
        at: new Date().toISOString(),
        attachments: draft.attachments,
        id: `local-${was.length}`,
        own: true,
        replyTo: replyTo
          ? { author: replyTo.author?.name ?? c.t.mapYou, id: replyTo.id, text: replyTo.text ?? '' }
          : undefined,
        status: 'sent',
        text: draft.text,
      },
    ])
    setReplyTo(null)
  }

  const transcript = (
    <Chat
      actions={actions}
      composer={
        <ChatComposer
          labels={t.composerLabels}
          onCancelReply={() => setReplyTo(null)}
          onSend={send}
          placeholder={t.chatPlaceholder}
          replyTo={
            replyTo ? { author: replyTo.author?.name ?? c.t.mapYou, text: replyTo.text ?? '' } : undefined
          }
        />
      }
      group
      header={
        <RoomHeader
          actions={
            <>
              <IconButton label={c.t.search} name="search" size="sm" />
              <IconButton label={c.t.settings} name="settings" size="sm" />
            </>
          }
          kind="channel"
          members={[
            { name: t.personLeila },
            { name: t.personAmir },
            { name: t.person },
            { name: t.actorNima },
          ]}
          meta={`12 ${t.mgMembersWord} · ${t.mgOnline}`}
          name={t.roomDesign}
        />
      }
      labels={t.chatLabels}
      locale={c.locale}
      messages={messages}
      onJump={(id) => document.getElementById(`nim-message-${id}`)?.scrollIntoView({ block: 'center' })}
      onReact={react}
      typing={t.personAmir}
    />
  )

  const [turns, setTurns] = useState<AssistantTurn[]>(() => [
    { content: <p>{t.asQ1}</p>, id: 'a1', role: 'user' },
    {
      content: (
        <>
          <p>{t.asA1Lead}</p>
          <p>{t.asA1Body}</p>
          <p>
            <strong>{t.asA1Tail}</strong>
          </p>
        </>
      ),
      id: 'a2',
      role: 'assistant',
      sources: [
        { href: '#assistant', title: t.asSource1 },
        { href: '#assistant', title: t.asSource2 },
      ],
      steps: [
        { icon: 'document', label: t.asStep1, status: 'done' },
        { detail: t.asStepDetail, icon: 'chart', label: t.asStep2, status: 'done' },
        { icon: 'clock', label: t.asStep3, status: 'running' },
      ],
    },
  ])

  return (
    <>
      <Section id="messenger" title={c.nav.messenger}>
        <Specimen
          code={`<Messenger activeId={room} sections={sections} onSelect={setRoom}>\n  <Chat group actions={actions} onReact={react} … />\n</Messenger>`}
          layout="block"
          note={t.ntMessenger}
          title={t.spMessenger}
        >
          <div className="docs__console">
            <Messenger
              activeId={room}
              brand={<strong>{c.pages.flows}</strong>}
              labels={{ back: t.mgChannels, compose: t.mgCompose }}
              locale={c.locale}
              onBack={() => setRoom(undefined)}
              onCompose={() => undefined}
              onSelect={(next: Conversation) => setRoom(next.id)}
              search={<Input aria-label={t.mgSearch} placeholder={t.mgSearch} />}
              sections={sections}
            >
              {transcript}
            </Messenger>
          </div>
        </Specimen>
      </Section>

      <Section id="chat" title={c.nav.chat}>
        <Specimen
          code={`<Chat\n  group\n  actions={(message) => [...]}\n  onReact={react}\n  messages={messages}\n/>`}
          layout="block"
          note={t.ntGroup}
          title={t.spGroup}
        >
          <div className="docs__screen docs__screen--tall">{transcript}</div>
        </Specimen>
      </Section>

      <Section id="assistant" title={c.nav.assistant}>
        <Specimen
          code={`<AssistantThread\n  turns={turns}\n  onCopy={copy}\n  onRetry={retry}\n  composer={<ChatComposer … />}\n/>`}
          layout="block"
          note={t.ntAssistant}
          title={t.spAssistant}
        >
          <div className="docs__console docs__console--short">
            <AssistantThread
              assistant={{ name: t.asName }}
              composer={
                <ChatComposer
                  allow={{ video: false, voice: false }}
                  labels={t.composerLabels}
                  onSend={(draft) =>
                    setTurns((was) => [
                      ...was,
                      { content: <p>{draft.text}</p>, id: `turn-${was.length}`, role: 'user' },
                    ])
                  }
                  placeholder={t.asPlaceholder}
                />
              }
              empty={
                <EmptyState description={t.asEmptyBody} icon="sparkle" title={t.asEmptyTitle} />
              }
              onCopy={() => undefined}
              onRate={() => undefined}
              onRetry={() => undefined}
              turns={turns}
            />
          </div>
        </Specimen>
      </Section>
    </>
  )
}
