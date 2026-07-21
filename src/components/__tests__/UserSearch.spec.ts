import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import UserSearch from '@/components/UserSearch.vue'
import { lichessApi } from '@/api/lichess'
import type { LichessUser } from '@/types/lichess'

vi.mock('@/api/lichess', () => ({
  lichessApi: {
    getUser: vi.fn(),
    getUserGames: vi.fn(),
  },
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn().mockResolvedValue(undefined),
  }),
}))

function makeUser(): LichessUser {
  return {
    id: 'magnus',
    username: 'Magnus',
    createdAt: 1_000_000_000,
    seenAt: 1_700_000_000,
    url: 'https://lichess.org/@/Magnus',
    count: {
      all: 100, rated: 90, ai: 0, draw: 10, drawH: 8,
      loss: 30, lossH: 28, win: 60, winH: 55,
      bookmark: 0, playing: 0, import: 0, me: 0,
    },
    perfs: {},
  }
}

describe('UserSearch', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders the username input', () => {
    const wrapper = mount(UserSearch)
    expect(wrapper.find('#username-input').exists()).toBe(true)
  })

  it('renders the submit button', () => {
    const wrapper = mount(UserSearch)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('button is disabled when input is empty', () => {
    const wrapper = mount(UserSearch)
    const btn = wrapper.find('button[type="submit"]')
    expect((btn.element as HTMLButtonElement).disabled).toBe(true)
  })

  it('shows error for empty submission', async () => {
    const wrapper = mount(UserSearch)
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })

  it('shows error for invalid username', async () => {
    const wrapper = mount(UserSearch)
    await wrapper.find('#username-input').setValue('123invalid')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })

  it('submits successfully with valid username', async () => {
    vi.mocked(lichessApi.getUser).mockResolvedValue(makeUser())
    vi.mocked(lichessApi.getUserGames).mockResolvedValue([])
    const wrapper = mount(UserSearch)
    await wrapper.find('#username-input').setValue('magnus')
    await wrapper.find('form').trigger('submit')
    await new Promise((r) => setTimeout(r, 100))
    expect(lichessApi.getUser).toHaveBeenCalledWith('magnus')
  })

  it('shows initial username when provided', () => {
    const wrapper = mount(UserSearch, {
      props: { initialUsername: 'testuser' },
    })
    const input = wrapper.find('#username-input').element as HTMLInputElement
    expect(input.value).toBe('testuser')
  })

  it('input is disabled when loading prop is true', () => {
    const wrapper = mount(UserSearch, {
      props: { loading: true },
    })
    const input = wrapper.find('#username-input').element as HTMLInputElement
    expect(input.disabled).toBe(true)
  })
})
