import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.find('.spinner--md').exists()).toBe(true)
  })

  it('renders with small size', () => {
    const wrapper = mount(LoadingSpinner, { props: { size: 'sm' } })
    expect(wrapper.find('.spinner--sm').exists()).toBe(true)
  })

  it('renders with large size', () => {
    const wrapper = mount(LoadingSpinner, { props: { size: 'lg' } })
    expect(wrapper.find('.spinner--lg').exists()).toBe(true)
  })

  it('uses custom label in aria-label', () => {
    const wrapper = mount(LoadingSpinner, { props: { label: 'Fetching data' } })
    expect(wrapper.find('[role="status"]').attributes('aria-label')).toBe('Fetching data')
  })
})
