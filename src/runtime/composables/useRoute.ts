// useRoute.ts
import { reactive } from 'vue'

export const useRoute = reactive({
  route: '/' as string,
  setRoute(route: string) {
    this.route = route
  },
  getRoute() {
    return this.route
  },
})
