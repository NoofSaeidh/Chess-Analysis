import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OpeningsTable from '@/components/OpeningsTable.vue'
import type { OpeningStats } from '@/types/analysis'

function makeOpening(overrides: Partial<OpeningStats> = {}): OpeningStats {
  return {
    eco: 'E04',
    name: 'Catalan Opening',
    games: 20,
    wins: 12,
    losses: 6,
    draws: 2,
    winRate: 60,
    ...overrides,
  }
}

describe('OpeningsTable', () => {
  it('renders empty state when no openings', () => {
    const wrapper = mount(OpeningsTable, { props: { openings: [] } })
    expect(wrapper.text()).toContain('No opening data available')
  })

  it('renders opening ECO and name', () => {
    const wrapper = mount(OpeningsTable, {
      props: { openings: [makeOpening()] },
    })
    expect(wrapper.text()).toContain('E04')
    expect(wrapper.text()).toContain('Catalan Opening')
  })

  it('renders games count', () => {
    const wrapper = mount(OpeningsTable, {
      props: { openings: [makeOpening({ games: 42 })] },
    })
    expect(wrapper.text()).toContain('42')
  })

  it('applies high win rate class for >= 60%', () => {
    const wrapper = mount(OpeningsTable, {
      props: { openings: [makeOpening({ winRate: 65 })] },
    })
    expect(wrapper.find('.win-rate--high').exists()).toBe(true)
  })

  it('applies mid win rate class for 40-59%', () => {
    const wrapper = mount(OpeningsTable, {
      props: { openings: [makeOpening({ winRate: 50 })] },
    })
    expect(wrapper.find('.win-rate--mid').exists()).toBe(true)
  })

  it('applies low win rate class for < 40%', () => {
    const wrapper = mount(OpeningsTable, {
      props: { openings: [makeOpening({ winRate: 30 })] },
    })
    expect(wrapper.find('.win-rate--low').exists()).toBe(true)
  })

  it('uses custom title', () => {
    const wrapper = mount(OpeningsTable, {
      props: { openings: [], title: 'My Openings' },
    })
    expect(wrapper.text()).toContain('My Openings')
  })

  it('renders multiple openings', () => {
    const openings = [makeOpening({ eco: 'E04' }), makeOpening({ eco: 'B01' })]
    const wrapper = mount(OpeningsTable, { props: { openings } })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })
})
