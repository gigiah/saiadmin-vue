import { request } from '@/utils/request.js'

/**
 * 我的申请 API接口
 */
export default {
	/**
	 * 提交申请
	 * @returns
	 */
	submitApply(params = {}) {
		return request({
			url: '/storeItemApply/submitApply',
			method: 'post',
			data: params,
		})
	},

	/**
	 * 保存申请
	 * @returns
	 */
	saveApply(params = {}) {
		return request({
			url: '/storeItemApply/saveApply',
			method: 'post',
			data: params,
		})
	},

	/**
	 * 修改申请
	 * @returns
	 */
	updateApply(params = {}) {
		return request({
			url: '/storeItemApply/updateApply',
			method: 'post',
			data: params,
		})
	},

	/**
	 * 数据列表
	 * @returns
	 */
	getPageList(params = {}) {
		return request({
			url: '/storeItemApply/index',
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
			url: '/storeItemApply/recycle',
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
			url: '/storeItemApply/save',
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
			url: '/storeItemApply/read/' + id,
			method: 'get',
		})
	},

	/**
	 * 软删除数据
	 * @returns
	 */
	delete(data) {
		return request({
			url: '/storeItemApply/destroy',
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
			url: '/storeItemApply/recovery',
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
			url: '/storeItemApply/update/' + id,
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
			url: '/storeItemApply/changeStatus',
			method: 'post',
			data,
		})
	},
}
