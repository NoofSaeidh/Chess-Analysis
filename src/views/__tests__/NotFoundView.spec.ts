import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NotFoundView from '@/views/NotFoundView.vue'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

describe('NotFoundView', () => {
  it('renders 404 code', () => {
    const wrapper = mount(NotFoundView)
    expect(wrapper.text()).toContain('404')
  })

  it('renders the title', () => {
    const wrapper = mount(NotFoundView)
    expect(wrapper.text()).toContain('Page Not Found')
  })

  it('calls router.push when home button is clicked', async () => {
    const wrapper = mount(NotFoundView)
    await wrapper.find('.home-btn').trigger('click')
    expect(pushMock).toHaveBeenCalledWith({ name: 'home' })
  })
})
