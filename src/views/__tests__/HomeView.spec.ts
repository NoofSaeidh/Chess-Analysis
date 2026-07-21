import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import HomeView from '@/views/HomeView.vue'
import UserSearch from '@/components/UserSearch.vue'

vi.mock('@/api/lichess', () => ({
  lichessApi: { getUser: vi.fn(), getUserGames: vi.fn() },
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  RouterLink: { template: '<a><slot /></a>' },
  RouterView: { template: '<div />' },
}))

describe('HomeView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders UserSearch component', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.findComponent(UserSearch).exists()).toBe(true)
  })

  it('renders the hero title', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.text()).toContain('Chess Analysis')
  })

  it('renders the subtitle', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.text()).toContain('Lichess')
  })
})
