
import { defineStore } from 'pinia'
import systemUserApi from '@/api/system/user'

let data = {
  info: undefined,
}

const useSysInfoStore = defineStore('sysInfo', {
  state: () => ({ ...data }),

  getters: {
    getInfo(state) {
      return { ...state }
    },
  },

  actions: {

    setInfo(info) {
      this.info = info;
    },

    requestInfo() {
      return new Promise((resolve, reject) => {
        systemUserApi.sysUserInfo().then(response => {
          if (! response || ! response.data) {
            reject(false)
          } else {
            this.setInfo(response.data)
            resolve(response.data)
          }
        })
      })
    },

  },
})

export default useSysInfoStore