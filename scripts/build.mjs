import { mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { spawn } from 'node:child_process'

const mode = process.argv[2]
if (mode !== 'lib' && mode !== 'docs') {
  throw new Error('usage: node scripts/build.mjs <lib|docs>')
}

const root = resolve(import.meta.dirname, '..')
const lockDir = join(root, '.nim-ui-build.lock')
const ownerFile = join(lockDir, 'owner.json')
const lockTimeoutMs = 60_000
const lockPollMs = 100
const orphanGraceMs = 5_000
let ownsLock = false

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms))

function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return error?.code === 'EPERM'
  }
}

function lockOwner() {
  try {
    const parsed = JSON.parse(readFileSync(ownerFile, 'utf8'))
    return typeof parsed?.pid === 'number' ? parsed : undefined
  } catch {
    return undefined
  }
}

function lockAgeMs() {
  try {
    return Date.now() - statSync(lockDir).mtimeMs
  } catch {
    return 0
  }
}

function releaseLock() {
  if (!ownsLock) return
  ownsLock = false
  rmSync(lockDir, { recursive: true, force: true })
}

async function acquireLock() {
  const startedAt = Date.now()
  while (true) {
    try {
      mkdirSync(lockDir)
      ownsLock = true
      writeFileSync(ownerFile, `${JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() })}\n`)
      return
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error
    }

    const owner = lockOwner()
    if ((owner && !processIsAlive(owner.pid)) || (!owner && lockAgeMs() > orphanGraceMs)) {
      rmSync(lockDir, { recursive: true, force: true })
      continue
    }
    if (Date.now() - startedAt >= lockTimeoutMs) {
      throw new Error(`timed out after ${lockTimeoutMs / 1000}s waiting for another nim-ui build`)
    }
    await sleep(lockPollMs)
  }
}

function localBinary(name) {
  return join(root, 'node_modules', '.bin', process.platform === 'win32' ? `${name}.cmd` : name)
}

function run(name, args) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(localBinary(name), args, { cwd: root, stdio: 'inherit' })
    child.on('error', rejectRun)
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolveRun()
        return
      }
      rejectRun(new Error(`${name} ${args.join(' ')} ${signal ? `stopped by ${signal}` : `exited with ${code}`}`))
    })
  })
}

process.on('exit', releaseLock)

try {
  await acquireLock()
  await run('tsc', ['-b'])
  await run('vite', mode === 'lib' ? ['build', '--mode', 'lib'] : ['build'])
} finally {
  releaseLock()
}
