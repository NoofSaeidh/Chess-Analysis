import { createRouter, createWebHistory } from 'vue-router'
import type { RouteComponent } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: (): Promise<RouteComponent> => import('../views/HomeView.vue'),
    },
    {
      path: '/analysis/:username',
      name: 'analysis',
      component: (): Promise<RouteComponent> => import('../views/AnalysisView.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: (): Promise<RouteComponent> => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
