import axios from './axios'
import config from './config'

// 获取入库的快递列表
export const getBoxList = params => {
  return axios.get(config.getBoxList, {params})
    .then(res => res.data, err => Promise.reject(err))
}
// 添加唾液盒
export const addBox = params => {
  return axios.post(config.addBox, params)
    .then(res => res.data, err => Promise.reject(err))
}
// 获取未发货列表
export const getShippingList = params => {
  return axios.get(config.getShippingList, {params})
    .then(res => res.data, err => Promise.reject(err))
}
// 顺丰单号生成
export const getGenerateWaybill = params => {
  return axios.post(config.getGenerateWaybill, params)
    .then(res => res.data, err => Promise.reject(err))
}
// 绑定唾液盒编号
export const bindBoxNumberForm = params => {
  return axios.post(config.bindBoxNumberForm, params)
    .then(res => res.data, err => Promise.reject(err))
}
// 查看唾液盒状态
export const getBindBoxList = params => {
  return axios.post(config.getBindBoxList, params)
    .then(res => res.data, err => Promise.reject(err))
}
// 已发货唾液盒数量
export const getStatisticsNumber = params => {
  return axios.get(config.getStatisticsNumber, {params})
    .then(res => res.data, err => Promise.reject(err))
}
// 退款列表
export const getRefundList = params => {
  return axios.get(config.getRefundList, {params})
    .then(res => res.data, err => Promise.reject(err))
}
// 退款
export const orderRefund = params => {
  return axios.post(config.orderRefund, params)
    .then(res => res.data, err => Promise.reject(err))
}
// 退款不成功
export const refundRefuse = params => {
  return axios.post(config.refundRefuse, params)
    .then(res => res.data, err => Promise.reject(err))
}
// 订单查询
export const getOrderList = params => {
  return axios.get(config.getOrderList, {params})
    .then(res => res.data, err => Promise.reject(err))
}
