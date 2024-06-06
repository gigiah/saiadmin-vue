import { request } from '@/utils/request.js'

/**
 * 汇总单 API接口
 */
export default {
	/**
	 * 数据列表
	 * @returns
	 */
	getPageList(params = {}) {
		return request({
			url: '/summaryOrder/index',
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
			url: '/summaryOrder/recycle',
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
			url: '/summaryOrder/save',
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
			url: '/summaryOrder/read/' + id,
			method: 'get',
		})
	},

	/**
	 * 软删除数据
	 * @returns
	 */
	delete(data) {
		return request({
			url: '/summaryOrder/destroy',
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
			url: '/summaryOrder/recovery',
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
			url: '/summaryOrder/update/' + id,
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
			url: '/summaryOrder/changeStatus',
			method: 'post',
			data,
		})
	},

	/**
	 * 处理汇总
	 * @returns
	 */
	handleOrderSummary(data = {}) {
		return request({
			url: '/order/handleOrderSummary',
			method: 'post',
			data,
		})
	},

	/**
	 * //发起生产/取消
	 * @returns
	 */
	handleProduce(data = {}) {
		return request({
			url: '/summaryOrder/handleProduce',
			method: 'post',
			data,
		})
	},
}
