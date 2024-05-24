// useRestAuth.ts
import { reactive } from 'vue'

export const useRestAuth = reactive({
  init: false as boolean,
  setAuth(flag: boolean) {
    this.init = flag // true - rest endpoint authorized, false - rest endpoint NOT authorized
  },
  getAuth() {
    return this.init
  },
})
