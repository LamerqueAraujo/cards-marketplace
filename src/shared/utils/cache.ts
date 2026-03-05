type CacheEntry<T> = {
  value: T
  expiresAt: number
  tags: Set<string>
}

const store = new Map<string, CacheEntry<unknown>>()
const tagIndex = new Map<string, Set<string>>()

export function getCache<T>(key: string): T | undefined {
  const entry = store.get(key)
  if (!entry) return undefined

  if (Date.now() > entry.expiresAt) {
    removeCacheKey(key)
    return undefined
  }

  return entry.value as T
}

export function setCache<T>(args: {
  key: string
  value: T
  ttlMs: number
  tags?: string[]
}): void {
  const expiresAt = Date.now() + args.ttlMs
  const tags = new Set(args.tags ?? [])

  store.set(args.key, { value: args.value, expiresAt, tags })

  for (const tag of tags) {
    let keys = tagIndex.get(tag)
    if (!keys) {
      keys = new Set<string>()
      tagIndex.set(tag, keys)
    }
    keys.add(args.key)
  }
}

export function invalidateByTag(tag: string): void {
  const keys = tagIndex.get(tag)
  if (!keys) return

  for (const key of keys) {
    removeCacheKey(key)
  }

  tagIndex.delete(tag)
}

export function clearCache(): void {
  store.clear()
  tagIndex.clear()
}

function removeCacheKey(key: string): void {
  const entry = store.get(key)
  if (!entry) return

  for (const tag of entry.tags) {
    const keys = tagIndex.get(tag)
    if (!keys) continue

    keys.delete(key)
    if (keys.size === 0) tagIndex.delete(tag)
  }

  store.delete(key)
}
