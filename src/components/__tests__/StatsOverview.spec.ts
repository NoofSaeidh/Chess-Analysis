import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsOverview from '@/components/StatsOverview.vue'
import type { WinLossDrawStats } from '@/types/analysis'

function makeStats(overrides: Partial<WinLossDrawStats> = {}): WinLossDrawStats {
  return {
    wins: 60,
    losses: 30,
    draws: 10,
    total: 100,
    winRate: 60,
    lossRate: 30,
    drawRate: 10,
    ...overrides,
  }
}

describe('StatsOverview', () => {
  it('renders win/loss/draw counts', () => {
    const wrapper = mount(StatsOverview, { props: { stats: makeStats() } })
    expect(wrapper.text()).toContain('60')
    expect(wrapper.text()).toContain('30')
    expect(wrapper.text()).toContain('10')
  })

  it('renders title when provided', () => {
    const wrapper = mount(StatsOverview, {
      props: { stats: makeStats(), title: 'Test Title' },
    })
    expect(wrapper.text()).toContain('Test Title')
  })

  it('does not render title element when not provided', () => {
    const wrapper = mount(StatsOverview, { props: { stats: makeStats() } })
    expect(wrapper.find('h3').exists()).toBe(false)
  })

  it('renders progress bar segments', () => {
    const wrapper = mount(StatsOverview, { props: { stats: makeStats() } })
    expect(wrapper.find('.progress-segment--win').exists()).toBe(true)
    expect(wrapper.find('.progress-segment--loss').exists()).toBe(true)
    expect(wrapper.find('.progress-segment--draw').exists()).toBe(true)
  })

  it('displays total games count', () => {
    const wrapper = mount(StatsOverview, { props: { stats: makeStats({ total: 100 }) } })
    expect(wrapper.text()).toContain('100')
  })
})
