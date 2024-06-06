import { request } from '@/utils/request.js'

/**
 * 对账单 API接口
 */
export default {
	/**
	 * 数据列表
	 * @returns
	 */
	getPageList(params = {}) {
		return request({
			url: '/bill/index',
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
			url: '/bill/recycle',
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
			url: '/bill/save',
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
			url: '/bill/read/' + id,
			method: 'get',
		})
	},

	/**
	 * 软删除数据
	 * @returns
	 */
	delete(data) {
		return request({
			url: '/bill/destroy',
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
			url: '/bill/recovery',
			method: 'post',
			data,
		})
	},

	/**
	 * 真实删除数据
	 * @returns
	 */
	realDestroy(data) {
		return request({
			url: '/bill/realDestroy',
			method: 'delete',
			data,
		})
	},

	/**
	 * 更新数据
	 * @returns
	 */
	update(id, data = {}) {
		return request({
			url: '/bill/update/' + id,
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
			url: '/bill/changeStatus',
			method: 'post',
			data,
		})
	},

	/**
	 * 生成对账单
	 * @returns
	 */
	handleCreateBill(data = {}) {
		return request({
			url: '/bill/handleCreateBill',
			method: 'post',
			data,
		})
	},

	/**
	 * 下载对账单
	 * @returns
	 */
	exportBillExcel(data = {}) {
		return request({
			url: '/bill/exportBillExcel',
			method: 'post',
			data,
		})
	},

	/**
	 * 更改状态
	 * @returns
	 */
	changeFapiaoStatus(data = {}) {
		return request({
			url: '/bill/changeFapiaoStatus',
			method: 'post',
			data,
		})
	},

	/**
	 * 更改状态
	 * @returns
	 */
	changeCheckoutStatus(data = {}) {
		return request({
			url: '/bill/changeCheckoutStatus',
			method: 'post',
			data,
		})
	},
}
