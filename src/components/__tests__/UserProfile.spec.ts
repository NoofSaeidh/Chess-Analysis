import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserProfile from '@/components/UserProfile.vue'
import type { LichessUser } from '@/types/lichess'

function makeUser(overrides: Partial<LichessUser> = {}): LichessUser {
  return {
    id: 'alice',
    username: 'Alice',
    createdAt: 1_000_000_000_000,
    seenAt: 1_700_000_000_000,
    url: 'https://lichess.org/@/Alice',
    count: {
      all: 100, rated: 80, ai: 5, draw: 10, drawH: 8,
      loss: 30, lossH: 28, win: 60, winH: 55,
      bookmark: 0, playing: 0, import: 0, me: 0,
    },
    perfs: {},
    ...overrides,
  }
}

describe('UserProfile', () => {
  it('renders username', () => {
    const wrapper = mount(UserProfile, { props: { user: makeUser() } })
    expect(wrapper.text()).toContain('Alice')
  })

  it('renders lichess link', () => {
    const wrapper = mount(UserProfile, { props: { user: makeUser() } })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toContain('lichess.org')
  })

  it('renders title badge when user has title', () => {
    const wrapper = mount(UserProfile, {
      props: { user: makeUser({ title: 'GM' }) },
    })
    expect(wrapper.find('.title-badge').text()).toBe('GM')
  })

  it('does not render title badge when no title', () => {
    const wrapper = mount(UserProfile, { props: { user: makeUser() } })
    expect(wrapper.find('.title-badge').exists()).toBe(false)
  })

  it('renders online badge when user is online', () => {
    const wrapper = mount(UserProfile, {
      props: { user: makeUser({ online: true }) },
    })
    expect(wrapper.find('.online-badge').exists()).toBe(true)
  })

  it('renders wins/losses/draws stats', () => {
    const wrapper = mount(UserProfile, { props: { user: makeUser() } })
    expect(wrapper.text()).toContain('60') // wins
    expect(wrapper.text()).toContain('30') // losses
    expect(wrapper.text()).toContain('10') // draws
  })

  it('renders bio when provided', () => {
    const wrapper = mount(UserProfile, {
      props: { user: makeUser({ profile: { bio: 'Chess enthusiast' } }) },
    })
    expect(wrapper.text()).toContain('Chess enthusiast')
  })

  it('renders play time when available', () => {
    const wrapper = mount(UserProfile, {
      props: { user: makeUser({ playTime: { total: 3600, tv: 0 } }) },
    })
    expect(wrapper.text()).toContain('1h 0m')
  })
})
