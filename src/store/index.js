import { createPinia } from 'pinia'
import useUserStore from './modules/user'
import useAppStore from './modules/app'
import useTagStore from './modules/tag'
import useKeepAliveStore from './modules/keepAlive'
import useIframeStore from './modules/iframe'
import useConfigStore from './modules/config'
import useMessageStore from './modules/message'
import useFormStore from './modules/form'
import useSysInfoStore from './modules/sysInfo'
import useBizDictStore from './modules/bizDict'
import useMessageStateStore from "@/store/modules/messageState";

const pinia = createPinia()

export {
  useUserStore,
  useAppStore,
  useTagStore,
  useKeepAliveStore,
  useIframeStore,
  useConfigStore,
  useMessageStore,
  useFormStore,
  useSysInfoStore,
  useBizDictStore,
  useMessageStateStore
}
export default pinia
