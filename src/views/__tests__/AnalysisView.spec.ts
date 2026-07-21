import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import AnalysisView from '@/views/AnalysisView.vue'
import { lichessApi } from '@/api/lichess'
import { useUserStore } from '@/stores/userStore'
import type { LichessUser } from '@/types/lichess'

vi.mock('@/api/lichess', () => ({
  lichessApi: { getUser: vi.fn(), getUserGames: vi.fn() },
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  RouterLink: { template: '<a><slot /></a>' },
}))

function makeUser(): LichessUser {
  return {
    id: 'alice',
    username: 'Alice',
    createdAt: 1_000_000_000_000,
    seenAt: 1_700_000_000_000,
    url: 'https://lichess.org/@/Alice',
    count: {
      all: 0, rated: 0, ai: 0, draw: 0, drawH: 0,
      loss: 0, lossH: 0, win: 0, winH: 0,
      bookmark: 0, playing: 0, import: 0, me: 0,
    },
    perfs: {},
  }
}

describe('AnalysisView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('shows loading spinner while fetching user', async () => {
    vi.mocked(lichessApi.getUser).mockReturnValue(new Promise(() => undefined))
    vi.mocked(lichessApi.getUserGames).mockResolvedValue([])
    const wrapper = mount(AnalysisView, { props: { username: 'Alice' } })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })

  it('shows user profile after successful fetch', async () => {
    vi.mocked(lichessApi.getUser).mockResolvedValue(makeUser())
    vi.mocked(lichessApi.getUserGames).mockResolvedValue([])
    const wrapper = mount(AnalysisView, { props: { username: 'Alice' } })
    await new Promise((r) => setTimeout(r, 50))
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Alice')
  })

  it('shows error when user fetch fails', async () => {
    vi.mocked(lichessApi.getUser).mockRejectedValue(new Error('User not found'))
    vi.mocked(lichessApi.getUserGames).mockResolvedValue([])
    const wrapper = mount(AnalysisView, { props: { username: 'unknown' } })
    await new Promise((r) => setTimeout(r, 50))
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('User not found')
  })

  it('reuses cached store data for the same username', async () => {
    const store = useUserStore()
    store.user = makeUser()
    store.games = []
    store.gamesUsername = 'alice'

    mount(AnalysisView, { props: { username: 'Alice' } })
    await new Promise((r) => setTimeout(r, 20))

    expect(lichessApi.getUser).not.toHaveBeenCalled()
    expect(lichessApi.getUserGames).not.toHaveBeenCalled()
  })
})
