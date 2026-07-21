import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SpeedTable from '@/components/SpeedTable.vue'
import type { SpeedStats } from '@/types/analysis'

function makeSpeedStat(overrides: Partial<SpeedStats> = {}): SpeedStats {
  return {
    speed: 'blitz',
    games: 50,
    wins: 30,
    losses: 15,
    draws: 5,
    winRate: 60,
    averageRating: 1500,
    ...overrides,
  }
}

describe('SpeedTable', () => {
  it('shows empty state when no speeds', () => {
    const wrapper = mount(SpeedTable, { props: { speeds: [] } })
    expect(wrapper.text()).toContain('No data available')
  })

  it('renders speed name', () => {
    const wrapper = mount(SpeedTable, {
      props: { speeds: [makeSpeedStat({ speed: 'blitz' })] },
    })
    expect(wrapper.text()).toContain('Blitz')
  })

  it('renders game count', () => {
    const wrapper = mount(SpeedTable, {
      props: { speeds: [makeSpeedStat({ games: 99 })] },
    })
    expect(wrapper.text()).toContain('99')
  })

  it('shows em dash for missing average rating', () => {
    const wrapper = mount(SpeedTable, {
      props: { speeds: [makeSpeedStat({ averageRating: undefined })] },
    })
    expect(wrapper.text()).toContain('—')
  })

  it('sorts speeds in canonical order', () => {
    const speeds: SpeedStats[] = [
      makeSpeedStat({ speed: 'rapid' }),
      makeSpeedStat({ speed: 'bullet' }),
      makeSpeedStat({ speed: 'blitz' }),
    ]
    const wrapper = mount(SpeedTable, { props: { speeds } })
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0]?.text()).toContain('Bullet')
    expect(rows[1]?.text()).toContain('Blitz')
    expect(rows[2]?.text()).toContain('Rapid')
  })

  it('uses custom title', () => {
    const wrapper = mount(SpeedTable, {
      props: { speeds: [], title: 'Custom Title' },
    })
    expect(wrapper.text()).toContain('Custom Title')
  })
})
