import { request } from '@/utils/request.js'

/**
 * 营销卡券内容 API接口
 */
export default {
	/**
	 * 数据列表
	 * @returns
	 */
	getPageList(params = {}) {
		return request({
			url: '/couponItem/index',
			method: 'get',
			params,
		})
	},

	/**
	 * 回收站数据列表
	 * @returns
	 */
	getRecyclePageList(params = {}) {
		return request({
			url: '/couponItem/recycle',
			method: 'get',
			params,
		})
	},

	/**
	 * 添加数据
	 * @returns
	 */
	save(params = {}) {
		return request({
			url: '/couponItem/save',
			method: 'post',
			data: params,
		})
	},

	/**
	 * 读取数据
	 * @returns
	 */
	read(id) {
		return request({
			url: '/couponItem/read/' + id,
			method: 'get',
		})
	},

	/**
	 * 软删除数据
	 * @returns
	 */
	delete(data) {
		return request({
			url: '/couponItem/destroy',
			method: 'delete',
			data,
		})
	},

	/**
	 * 恢复回收站数据
	 * @returns
	 */
	recovery(data) {
		return request({
			url: '/couponItem/recovery',
			method: 'post',
			data,
		})
	},

	/**
	 * 更新数据
	 * @returns
	 */
	update(id, data = {}) {
		return request({
			url: '/couponItem/update/' + id,
			method: 'put',
			data,
		})
	},

	/**
	 * 更改状态
	 * @returns
	 */
	changeStatus(data = {}) {
		return request({
			url: '/couponItem/changeStatus',
			method: 'post',
			data,
		})
	},

	/**
	 * 获取可用的卡券
	 * @returns
	 */
	getMyCoupon() {
		return request({
			url: '/couponItem/getMyCoupon',
			method: 'get',
		})
	},

	/**
	 * 用券/取消
	 * @returns
	 */
	selectCoupon(data = {}) {
		return request({
			url: '/couponItem/selectCoupon',
			method: 'post',
			data,
		})
	},

	/**
	 * 导出
	 * @returns
	 */
	export(data = {}) {
		return request({
			url: '/couponItem/export',
			method: 'post',
			data,
		})
	},
}
