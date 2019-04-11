import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import config from '../server/config'

import {
  success,
  boxList,
  shippingList,
  generateWaybill,
  statisticsNumber,
  refundList,
  orderList,
  bindBoxList
} from './data'

export default {
  init () {
    let mock = new MockAdapter(axios)
    mock.onGet(config.getBoxList).reply(200, JSON.stringify(boxList))
    mock.onPost(config.addBox).reply(200, JSON.stringify(success))
    mock.onGet(config.getShippingList).reply(200, JSON.stringify(shippingList))
    mock.onPost(config.getGenerateWaybill).reply(200, JSON.stringify(generateWaybill))
    mock.onGet(config.printWaybillImg).reply(200, JSON.stringify(success))
    mock.onPost(config.bindBoxNumberForm).reply(200, JSON.stringify(success))
    mock.onGet(config.getStatisticsNumber).reply(200, JSON.stringify(statisticsNumber))
    mock.onGet(config.getRefundList).reply(200, JSON.stringify(refundList))
    mock.onPost(config.orderRefund).reply(200, JSON.stringify(success))
    mock.onPost(config.refundRefuse).reply(200, JSON.stringify(success))
    mock.onGet(config.getOrderList).reply(200, JSON.stringify(orderList))
    mock.onPost(config.getBindBoxList).reply(200, JSON.stringify(bindBoxList))
  }
}
