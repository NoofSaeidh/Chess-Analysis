import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorDisplay from '@/components/ErrorDisplay.vue'

describe('ErrorDisplay', () => {
  it('renders error message', () => {
    const wrapper = mount(ErrorDisplay, {
      props: { message: 'Something went wrong' },
    })
    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('uses default title when none provided', () => {
    const wrapper = mount(ErrorDisplay, {
      props: { message: 'Error' },
    })
    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('uses custom title when provided', () => {
    const wrapper = mount(ErrorDisplay, {
      props: { message: 'Error', title: 'Custom Error Title' },
    })
    expect(wrapper.text()).toContain('Custom Error Title')
  })

  it('emits retry event when button is clicked', async () => {
    const wrapper = mount(ErrorDisplay, {
      props: { message: 'Error' },
    })
    await wrapper.find('.retry-btn').trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('has role="alert"', () => {
    const wrapper = mount(ErrorDisplay, {
      props: { message: 'Error' },
    })
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })
})
