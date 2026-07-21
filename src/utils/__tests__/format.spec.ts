import { describe, it, expect } from 'vitest'
import {
  capitalize,
  formatClockTime,
  formatPercentage,
  formatPlayTime,
  formatTimestamp,
  isValidUsername,
} from '@/utils/format'

describe('formatTimestamp', () => {
  it('returns a localized date string', () => {
    const result = formatTimestamp(0)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('formatPercentage', () => {
  it('formats with 1 decimal by default', () => {
    expect(formatPercentage(50)).toBe('50.0%')
  })

  it('respects custom decimal places', () => {
    expect(formatPercentage(33.333, 2)).toBe('33.33%')
  })
})

describe('formatPlayTime', () => {
  it('returns hours and minutes for long durations', () => {
    expect(formatPlayTime(3600)).toBe('1h 0m')
    expect(formatPlayTime(7380)).toBe('2h 3m')
  })

  it('returns only minutes for short durations', () => {
    expect(formatPlayTime(600)).toBe('10m')
    expect(formatPlayTime(3599)).toBe('59m')
  })
})

describe('formatClockTime', () => {
  it('formats increment notation', () => {
    expect(formatClockTime(180)).toBe('3m')
    expect(formatClockTime(183)).toBe('3+3')
  })

  it('formats seconds only', () => {
    expect(formatClockTime(30)).toBe('30s')
  })
})

describe('capitalize', () => {
  it('capitalizes the first letter', () => {
    expect(capitalize('blitz')).toBe('Blitz')
    expect(capitalize('bullet')).toBe('Bullet')
  })

  it('returns empty string for empty input', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('isValidUsername', () => {
  it('accepts valid usernames', () => {
    expect(isValidUsername('magnus')).toBe(true)
    expect(isValidUsername('DragonSlayer99')).toBe(true)
    expect(isValidUsername('a')).toBe(true)
  })

  it('rejects invalid usernames', () => {
    expect(isValidUsername('')).toBe(false)
    expect(isValidUsername('  ')).toBe(false)
    expect(isValidUsername('123invalid')).toBe(false)
  })
})
