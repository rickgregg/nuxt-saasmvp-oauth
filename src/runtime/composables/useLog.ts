// useLog.ts
import { reactive } from 'vue'

export const useLog = reactive({
  logFlag: false as boolean,
  setLogFlag(flag: boolean) {
    this.logFlag = flag
  },
  getLogFlag() {
    return this.logFlag
  },
})
