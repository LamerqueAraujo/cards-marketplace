import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getCache, setCache, clearCache, invalidateByTag } from '../cache'

describe('cache', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    clearCache()
  })

  it('returns cached value before ttl', () => {
    setCache({ key: 'k1', value: 123, ttlMs: 1000, tags: ['cards:list'] })

    expect(getCache<number>('k1')).toBe(123)

    vi.advanceTimersByTime(900)
    expect(getCache<number>('k1')).toBe(123)
  })

  it('expires after ttl', () => {
    setCache({ key: 'k1', value: 123, ttlMs: 1000, tags: ['cards:list'] })

    vi.advanceTimersByTime(1001)
    expect(getCache<number>('k1')).toBeUndefined()
  })

  it('invalidates by tag', () => {
    setCache({ key: 'a', value: 'A', ttlMs: 10000, tags: ['trades:list'] })
    setCache({ key: 'b', value: 'B', ttlMs: 10000, tags: ['cards:list'] })

    invalidateByTag('trades:list')

    expect(getCache<string>('a')).toBeUndefined()
    expect(getCache<string>('b')).toBe('B')
  })
})
