// useAuth.ts
import { reactive } from 'vue'

export const useAuth = reactive({
  token: null as string | null,
  login: false as boolean,
  setToken(token: string | null) {
    this.token = token,
    this.login = true
  },
  setLogout() {
    this.token = null,
    this.login = false
  },
  getToken() {
    return this.token
  },
  getLogin() {
    return this.login
  },
})
