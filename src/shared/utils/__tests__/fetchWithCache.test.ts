import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchWithCache } from '../fetchWithCache'
import { clearCache } from '../cache'

describe('fetchWithCache', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    clearCache()
  })

  it('dedupes concurrent calls (inFlight)', async () => {
    const fetcher = vi.fn().mockResolvedValue('OK')

    const p1 = fetchWithCache('k', fetcher, { ttlMs: 1000, tags: ['t'] })
    const p2 = fetchWithCache('k', fetcher, { ttlMs: 1000, tags: ['t'] })

    const [r1, r2] = await Promise.all([p1, p2])

    expect(r1).toBe('OK')
    expect(r2).toBe('OK')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('returns cached value within ttl', async () => {
    const fetcher = vi.fn().mockResolvedValue('A')

    const r1 = await fetchWithCache('k', fetcher, { ttlMs: 1000 })
    expect(r1).toBe('A')
    expect(fetcher).toHaveBeenCalledTimes(1)

    const r2 = await fetchWithCache('k', fetcher, { ttlMs: 1000 })
    expect(r2).toBe('A')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('refetches after ttl expires', async () => {
    const fetcher = vi.fn().mockResolvedValue('A')

    const r1 = await fetchWithCache('k', fetcher, { ttlMs: 1000 })
    expect(r1).toBe('A')
    expect(fetcher).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1001)

    const r2 = await fetchWithCache('k', fetcher, { ttlMs: 1000 })
    expect(r2).toBe('A')
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
})
