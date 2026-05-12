#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { validateDeck } from './validate.mjs'

const deckDir = path.resolve(process.argv[2] || 'examples/basic-deck')
const outputZip = path.resolve(process.argv[3] || 'dist/htmlslide-basic-demo.zip')

async function main() {
  const result = await validateDeck(deckDir)
  if (!result.ok) {
    for (const error of result.errors) {
      console.error(`error: ${error}`)
    }
    process.exit(1)
  }

  await fs.mkdir(path.dirname(outputZip), { recursive: true })
  await fs.rm(outputZip, { force: true })

  await run('zip', ['-r', '-q', outputZip, '.'], { cwd: deckDir })
  console.log(`Created ${path.relative(process.cwd(), outputZip)}`)
}

function run(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      stdio: 'inherit',
    })

    child.on('error', (error) => {
      if (error.code === 'ENOENT') {
        reject(new Error('The zip command is required. Install zip or create the archive manually.'))
      } else {
        reject(error)
      }
    })

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} exited with code ${code}`))
      }
    })
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})

