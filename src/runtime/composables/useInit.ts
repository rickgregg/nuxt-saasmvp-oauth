// useInit.ts
import { reactive } from 'vue'

export const useInit = reactive({
  init: false as boolean,
  setInit(flag: boolean) {
    this.init = flag
  },
  getInit() {
    return this.init
  },
})
