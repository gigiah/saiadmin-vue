import { request } from '@/utils/request.js'

/**
 * 工艺价格模板 API接口
 */
export default {

	/**
	 * 数据列表
	 * @returns
	 */
	searchList(params = {}) {
		return request({
			url: '/pricingCraft/index4Search',
			method: 'get',
			params,
		})
	},

	/**
	 * 数据列表
	 * @returns
	 */
	getPageList(params = {}) {
		return request({
			url: '/pricingCraft/index',
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
			url: '/pricingCraft/recycle',
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
			url: '/pricingCraft/save',
			method: 'post',
			data: params,
		})
	},

	/**
	 * 批量添加数据
	 * @returns
	 */
	saveBatch(params = {}) {
		return request({
			url: '/pricingCraft/saveBatch',
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
			url: '/pricingCraft/read/' + id,
			method: 'get',
		})
	},

	/**
	 * 读取数据
	 * @returns
	 */
	read4Order(params = {}) {
		return request({
			url: '/pricingCraft/read4Order',
			method: 'get',
			params,
		})
	},

	/**
	 * 软删除数据
	 * @returns
	 */
	delete(data) {
		return request({
			url: '/pricingCraft/destroy',
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
			url: '/pricingCraft/recovery',
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
			url: '/pricingCraft/update/' + id,
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
			url: '/pricingCraft/changeStatus',
			method: 'post',
			data,
		})
	},
}
