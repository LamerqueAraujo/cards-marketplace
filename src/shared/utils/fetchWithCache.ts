import { getCache, setCache } from './cache'

type Fetcher<T> = () => Promise<T>

type Options = {
  ttlMs: number
  tags?: string[]
}

const inFlight = new Map<string, Promise<unknown>>()

export async function fetchWithCache<T>(
  key: string,
  fetcher: Fetcher<T>,
  options: Options
): Promise<T> {
  const cached = getCache<T>(key)
  if (cached !== undefined) return cached

  const running = inFlight.get(key)
  if (running) return running as Promise<T>

  const promise = (async () => {
    const value = await fetcher()

    const payload: { key: string; value: T; ttlMs: number; tags?: string[] } = {
      key,
      value,
      ttlMs: options.ttlMs,
      ...(options.tags ? { tags: options.tags } : {})
    }

    setCache(payload)
    return value
  })()

  inFlight.set(key, promise)

  try {
    return await promise
  } finally {
    inFlight.delete(key)
  }
}
