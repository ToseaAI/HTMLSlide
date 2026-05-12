#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)

export async function validateDeck(deckDir) {
  const root = path.resolve(deckDir)
  const errors = []
  const warnings = []
  const manifestPath = path.join(root, 'htmlslice.json')

  let manifest
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
  } catch (error) {
    return {
      ok: false,
      errors: [`Missing or invalid htmlslice.json: ${error.message}`],
      warnings,
    }
  }

  if (manifest.version !== '1.0') {
    errors.push('htmlslice.json version must be "1.0".')
  }

  if (!manifest.title || typeof manifest.title !== 'string') {
    errors.push('htmlslice.json title is required.')
  }

  if (!Array.isArray(manifest.slides) || manifest.slides.length === 0) {
    errors.push('htmlslice.json slides must be a non-empty array.')
  }

  const slideIds = new Set()
  const slides = Array.isArray(manifest.slides) ? manifest.slides : []

  for (let index = 0; index < slides.length; index++) {
    const slide = slides[index]
    const label = `slides[${index}]`

    if (!slide || typeof slide !== 'object') {
      errors.push(`${label} must be an object.`)
      continue
    }

    if (slide.id) {
      if (slideIds.has(slide.id)) {
        errors.push(`${label}.id is duplicated: ${slide.id}`)
      }
      slideIds.add(slide.id)
    }

    if (!slide.src || typeof slide.src !== 'string') {
      errors.push(`${label}.src is required.`)
      continue
    }

    if (isUnsafeRelativePath(slide.src)) {
      errors.push(`${label}.src is unsafe: ${slide.src}`)
      continue
    }

    if (!/\.html?$/i.test(slide.src)) {
      errors.push(`${label}.src must point to .html or .htm: ${slide.src}`)
      continue
    }

    const slidePath = path.join(root, slide.src)
    let html
    try {
      html = await fs.readFile(slidePath, 'utf8')
    } catch {
      errors.push(`${label}.src does not exist: ${slide.src}`)
      continue
    }

    if (!isCompleteHtml(html)) {
      warnings.push(`${slide.src} is not a complete HTML document.`)
    }

    const refs = collectLocalRefs(html)
    for (const ref of refs) {
      if (isExternalUrl(ref)) {
        warnings.push(`${slide.src} references remote resource: ${ref}`)
        continue
      }

      const resolvedRef = normalizeRelativePath(path.posix.join(path.posix.dirname(slide.src), cleanUrl(ref)))
      if (isUnsafeRelativePath(resolvedRef)) {
        errors.push(`${slide.src} has unsafe local reference: ${ref}`)
        continue
      }

      try {
        await fs.access(path.join(root, resolvedRef))
      } catch {
        errors.push(`${slide.src} references missing asset: ${ref}`)
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings: Array.from(new Set(warnings)),
  }
}

function collectLocalRefs(html) {
  const refs = []
  const attrRegex = /\b(?:src|href)=("([^"]+)"|'([^']+)')/gi
  const cssRegex = /url\((["']?)([^"')]+)\1\)/gi
  let match

  while ((match = attrRegex.exec(html))) {
    refs.push(match[2] ?? match[3])
  }

  while ((match = cssRegex.exec(html))) {
    refs.push(match[2])
  }

  return refs.filter((ref) => ref && !ref.startsWith('#') && !/^(mailto:|tel:)/i.test(ref))
}

function isCompleteHtml(html) {
  const trimmed = html.trim().toLowerCase()
  return trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html')
}

function isExternalUrl(value) {
  return /^(https?:|data:|blob:|\/\/)/i.test(value)
}

function cleanUrl(value) {
  return decodeURIComponent(value.split('#')[0].split('?')[0])
}

function normalizeRelativePath(value) {
  const parts = []
  for (const part of value.replace(/\\/g, '/').split('/')) {
    if (!part || part === '.') continue
    if (part === '..') {
      parts.pop()
    } else {
      parts.push(part)
    }
  }
  return parts.join('/')
}

function isUnsafeRelativePath(value) {
  const normalized = value.replace(/\\/g, '/')
  return normalized.startsWith('/') || normalized.split('/').some((part) => part === '..')
}

async function main() {
  const deckDir = process.argv[2] || 'examples/basic-deck'
  const result = await validateDeck(deckDir)

  for (const warning of result.warnings) {
    console.warn(`warning: ${warning}`)
  }

  for (const error of result.errors) {
    console.error(`error: ${error}`)
  }

  if (!result.ok) {
    process.exit(1)
  }

  console.log(`HTMLSlice package is valid: ${path.resolve(deckDir)}`)
}

if (process.argv[1] === __filename) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

