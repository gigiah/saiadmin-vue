<template>
  <div class="flex justify-end w-full mr-2 lg:justify-between lg:w-auto">

    <a-space class="mr-0 lg:mr-5" size="medium">

      <!--轮播图-->
      <div class="marquee">
        <div class="marquee-item" v-for="(record, index) in announcements" :key="index" v-show="index === current">
          <a-link @click="viewDetail(record)">{{ record.title }}</a-link>
        </div>
      </div>
      <a-modal v-model:visible="detailVisible" fullscreen :footer="true">
        <template #title>公告详情</template>
        <a-typography :style="{ marginTop: '-30px' }">
          <a-typography-title class="text-center">
            {{ row?.title }}
          </a-typography-title>
          <a-typography-paragraph class="text-right" style="font-size: 13px; color: var(--color-text-3)">
            <a-space size="large">
              <span>创建时间：{{ row?.create_time }}</span>
            </a-space>
          </a-typography-paragraph>
          <a-typography-paragraph>
            <div v-html="row?.content"></div>
          </a-typography-paragraph>
        </a-typography>
      </a-modal>
      <!--轮播图-->

      <a-tooltip :content="$t('sys.search')">
        <a-button :shape="'circle'" @click="() => appStore.searchOpen = true" class="hidden lg:inline">
          <template #icon>
            <icon-search />
          </template>
        </a-button>
      </a-tooltip>

      <!--      <a-tooltip content="锁屏">-->
      <!--        <a-button :shape="'circle'" class="hidden lg:inline">-->
      <!--          <template #icon>-->
      <!--            <icon-lock />-->
      <!--          </template>-->
      <!--        </a-button>-->
      <!--      </a-tooltip>-->

      <a-tooltip :content="isFullScreen ? $t('sys.closeFullScreen') : $t('sys.fullScreen')">
        <a-button :shape="'circle'" class="hidden lg:inline" @click="screen">
          <template #icon>
            <icon-fullscreen-exit v-if="isFullScreen" />
            <icon-fullscreen v-else />
          </template>
        </a-button>
      </a-tooltip>

      <!-- <a-trigger trigger="click">
        <a-button :shape="'circle'">
          <template #icon>
            <a-badge :count="5" dot :dotStyle="{ width: '5px', height: '5px' }"
              v-if="messageStore.messageList.length > 0">
              <icon-notification />
            </a-badge>
            <icon-notification v-else />
          </template>
        </a-button>

        <template #content>
          <message-notification />
        </template>
      </a-trigger> -->

      <a-tooltip :content="$t('sys.pageSetting')">
        <a-button :shape="'circle'" @click="() => appStore.settingOpen = true" class="hidden lg:inline">
          <template #icon>
            <icon-settings />
          </template>
        </a-button>
      </a-tooltip>

    </a-space>
    <a-dropdown @select="handleSelect" trigger="hover">

      <a-avatar class="text-3xl bg-blue-500 avatar" style="top: -1px;">
        <img
          :src="(userStore.user && userStore.user.avatar) ? $tool.showFile(userStore.user.avatar) : $url + 'avatar.jpg'" />
      </a-avatar>

      <template #content>
        <a-doption value="userCenter"><icon-user /> {{ $t('sys.userCenter') }}</a-doption>
        <!-- <a-doption value="clearCache"><icon-delete /> {{ $t('sys.clearCache') }}</a-doption> -->
        <a-divider style="margin: 5px 0" />
        <a-doption value="logout"><icon-poweroff /> {{ $t('sys.logout') }}</a-doption>
      </template>
    </a-dropdown>

    <a-modal v-model:visible="showLogoutModal" @ok="handleLogout" @cancel="handleLogoutCancel">
      <template #title>{{ $t('sys.logoutAlert') }}</template>
      <div>{{ $t('sys.logoutMessage') }}</div>
    </a-modal>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore, useUserStore, useMessageStore } from '@/store'
import tool from '@/utils/tool'
import MessageNotification from './components/message-notification.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import WsMessage from '@/ws-serve/message'
import { info } from '@/utils/common'
import commonApi from '@/api/common'
import noticeApi from '@/api/notice'

const { t } = useI18n()
const messageStore = useMessageStore()
const userStore = useUserStore()
const appStore = useAppStore()
const setting = ref(null)
const router = useRouter()
const isFullScreen = ref(false)
const showLogoutModal = ref(false)
const isDev = ref(import.meta.env.DEV)

const announcements = ref([])

const current = ref([])
let timer = null

const row = ref({})
const detailVisible = ref(false)

const viewDetail = async (record) => {
  row.value = record
  detailVisible.value = true
}

onMounted(() => {
  const res = noticeApi.getPageList({ limit: 5, orderBy: 'id', orderType: 'desc' })
    .then(res => {
      announcements.value = res.data.data
      startMarquee()
    })
})

const handleSelect = async (name) => {
  if (name === 'userCenter') {
    router.push({ name: 'userCenter' })
  }
  if (name === 'clearCache') {
    const res = await commonApi.clearAllCache()
    tool.local.remove('dictData')
    res.code === 200 && Message.success(res.message)
  }
  if (name === 'logout') {
    showLogoutModal.value = true
    document.querySelector('#app').style.filter = 'grayscale(1)'
  }
}

const handleLogout = async () => {
  await userStore.logout()
  document.querySelector('#app').style.filter = 'grayscale(0)'
  router.push({ name: 'login' })
}

const handleLogoutCancel = () => {
  document.querySelector('#app').style.filter = 'grayscale(0)'
}

const screen = () => {
  tool.screen(document.documentElement)
  isFullScreen.value = !isFullScreen.value
}

const startMarquee = async () => {
  setInterval(() => {
    current.value = (current.value + 1) % announcements.value.length;
  }, 5000);
}

const stopMarquee = () => {
  clearInterval(timer);
  timer = null;
}

// const Wsm = new WsMessage()
// Wsm.connection()
// Wsm.getMessage()

// Wsm.ws.on("ev_new_message", (msg, data) => {
//   if (data.length > messageStore.messageList.length) {
//     info('新消息提示', '您有新的消息，请注意查收！')
//   }
//   messageStore.messageList = data
// });

</script>
<style scoped>
:deep(.arco-avatar-text) {
  top: 1px;
}

:deep(.arco-divider-horizontal) {
  margin: 5px 0;
}

.avatar {
  cursor: pointer;
  margin-top: 6px;
}

.marquee {
  overflow: hidden;
  position: relative;
  height: 24px;
}

.marquee-item {
  line-height: 24px;
  white-space: nowrap;
  transition: transform 1s ease, opacity 1s ease;
}

.marquee-item-active {
  display: block;
  animation: slideIn 1s ease forwards, fadeOut 1s ease forwards;
}

@keyframes slideIn {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
