import { request } from '@/utils/request.js'

/**
 * 客户申请 API接口
 */
export default {
	/**
	 * 数据列表
	 * @returns
	 */
	getPageList(params = {}) {
		return request({
			url: '/clientApply/index',
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
			url: '/clientApply/recycle',
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
			url: '/clientApply/save',
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
			url: '/clientApply/read/' + id,
			method: 'get',
		})
	},

	/**
	 * 软删除数据
	 * @returns
	 */
	delete(data) {
		return request({
			url: '/clientApply/destroy',
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
			url: '/clientApply/recovery',
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
			url: '/clientApply/update/' + id,
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
			url: '/clientApply/changeStatus',
			method: 'post',
			data,
		})
	},

	/**
	 * 通过
	 * @returns
	 */
	passApply(params = {}) {
		return request({
			url: '/clientApply/passApply',
			method: 'post',
			data: params,
		})
	},

	/**
	 * 拒绝
	 * @returns
	 */
	rejectApply(params = {}) {
		return request({
			url: '/clientApply/rejectApply',
			method: 'post',
			data: params,
		})
	},
}
