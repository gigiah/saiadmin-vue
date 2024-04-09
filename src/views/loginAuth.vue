<script setup>
import { reactive, ref } from 'vue'
import loginApi from '@/api/login'
import { useUserStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const captcha = ref(null)

const loading = ref(false)

let isDevelop = import.meta.env.VITE_APP_ENV === 'development'

var odata = isDevelop ? { username: 'admin', password: '123456', code: '' } : { username: '', password: '', code: '' }

const form = reactive(odata)

const refreshCaptcha = () => {
	form.code = ''
	form.uuid = ''
	loginApi.getCaptch().then((res) => {
		if (res.code === 200) {
			captcha.value = 'data:image/jpeg;base64,' + res.img
			form.uuid = res.uuid
		}
	})
}

refreshCaptcha()

const userStore = useUserStore()

const redirect = route.query.redirect ? route.query.redirect : '/'

const handleSubmit = async ({ values, errors }) => {
	if (loading.value) {
		return
	}
	loading.value = true
	if (!errors) {
		const result = await userStore.login(form)
		if (!result) {
			loading.value = false
			refreshCaptcha()
			return
		}
		router.push(redirect)
	}
	loading.value = false
}

const toLogin = (e) => {
	router.push('login')
}

</script>
<template>
	<div id="background" class="fixed"></div>
	<div class="bg-backdrop-layout"></div>
	<div class="login-container">
		<div class="flex items-center justify-between w-11/12 h-full mx-auto login-width md:w-10/12">
			<div class="hidden w-6/12 pl-5 pr-5 mx-auto rounded-l left-panel md:block">
				<div class="logo">
					<img :src="`${$url}logo.png`" width="45" /><span>{{ $title }}</span>
				</div>
				<div class="flex justify-end slogan">
					<span>---- {{ $t('sys.login.slogan') }}</span>
				</div>
			</div>

			<div class="w-11/12 pb-10 pl-5 pr-5 mx-auto md:w-6/12 md:rounded-r">
				<h2 class="pb-0 mt-10 mb-10 text-3xl">{{ $t('sys.login.title') }}</h2>
				<a-form :model="form" @submit="handleSubmit">
					<!-- <a-form-item field="username" :hide-label="true" :rules="[{ required: true, message: $t('sys.login.usernameNotice') }]">
						<a-input v-model="form.username" class="w-full" size="large" :placeholder="$t('sys.login.username')" allow-clear>
							<template #prefix><icon-user /></template>
						</a-input>
					</a-form-item> -->

					<a-form-item field="password" :hide-label="true" :rules="[{ required: true, message: $t('sys.login.passwordNotice') }]">
						<a-input-password v-model="form.password" :placeholder="$t('sys.login.password')" size="large" allow-clear>
							<template #prefix><icon-lock /></template>
						</a-input-password>
					</a-form-item>

					<!-- <a-form-item
						field="code"
						:hide-label="true"
						:rules="[
							{
								required: true,
								match: /^[a-zA-Z0-9]{4}$/,
								message: $t('sys.login.verifyCodeNotice'),
							},
						]"
					>
						<a-input v-model="form.code" :placeholder="$t('sys.login.verifyCode')" size="large" allow-clear>
							<template #prefix><icon-safe /></template>
							<template #append>
								<img :src="captcha" style="height: 120px; height: 36px; cursor: pointer" @click="refreshCaptcha" />
							</template>
						</a-input>
					</a-form-item> -->

					<a-form-item :hide-label="true" class="mt-5">
						<a-button html-type="submit" type="primary" long size="large" :loading="loading">
							{{ $t('sys.login.loginBtn') }}
						</a-button>
					</a-form-item>

					<a-divider orientation="center">{{ $t('sys.login.otherLoginType') }}</a-divider>
					<div class="flex items-stretch justify-around w-1/4 pt-2 mx-auto">
						<a-button @click="toLogin" type="outline" long size="medium" :loading="loading">密码登录</a-button>
					</div>
					<!-- <div class="flex items-stretch justify-around w-3/4 pt-2 mx-auto">
						<a-avatar class="other-login wechat"><icon-wechat /></a-avatar>
						<a-avatar class="other-login alipay"><icon-alipay-circle /></a-avatar>
						<a-avatar class="other-login qq"><icon-qq /></a-avatar>
						<a-avatar class="other-login weibo"><icon-weibo /></a-avatar>
					</div> -->
				</a-form>
			</div>
		</div>
	</div>
</template>

<style scoped lang="less">
#background {
	top: 0;
	left: 0;
	z-index: 1;
	background-image: url(@/assets/BingWallpaper.jpg);
	width: 100%;
	height: 100%;
}
.bg-backdrop-layout {
	top: 0;
	left: 0;
	position: fixed;
	width: 100%;
	height: 100%;
	z-index: 2;
	backdrop-filter: blur(25px);
}
.login-container {
	width: 100%;
	height: 100%;
	position: absolute;
	background-size: cover;
	z-index: 3;
	.login-width {
		max-width: 950px;
		background: #fff;
		padding: 10px;
		height: 500px;
		position: relative;
		top: 50%;
		margin-top: -255px;
		border-radius: 10px;
	}

	.left-panel {
		height: 491px;
		background-image: url(@/assets/login_picture.svg);
		background-repeat: no-repeat;
		background-position: center 60px;
		background-size: contain;
	}

	.logo {
		display: flex;
		margin-top: 20px;
		color: #333;
		span {
			font-size: 28px;
			margin-left: 15px;
			color: rgb(var(--primary-6));
		}
	}
	.slogan {
		font-size: 16px;
		line-height: 50px;
	}

	:deep(.arco-input-append) {
		padding: 0 !important;
	}

	.other-login {
		cursor: pointer;
	}

	.qq:hover,
	.alipay:hover {
		background: #165dff;
	}
	.wechat:hover {
		background: #0f9c02;
	}

	.weibo:hover {
		background: #f3ce2b;
	}
}
</style>
