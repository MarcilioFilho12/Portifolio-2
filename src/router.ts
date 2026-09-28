import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/games', name: 'games', component: () => import('@/views/GamesView.vue') },
    { path: '/games/rokenpo', name: 'rokenpo', component: () => import('@/views/RokenpoView.vue') },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ el: to.hash, top: 96 }), 80)
      })
    }
    return { top: 0 }
  },
})
