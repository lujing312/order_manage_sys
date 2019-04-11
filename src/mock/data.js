export const success = {
  status: 0,
  msg: '请求成功',
  data: null
}
export const fail = {
  status: -1,
  msg: '请求失败',
  data: null
}
// 已入库唾液盒列表
export const boxList = {
  status: 0,
  msg: '请求成功',
  data: {
    totalCount: 2,
    boxList: [
      {
        boxNumber: '10000000001',
        waybill: '252307592178',
        signTime: '2018-12-21 13:51:56'
      },
      {
        boxNumber: '10000000002',
        waybill: '252307592178',
        signTime: '2018-12-21 13:52:05'
      }
    ]
  }
}
// 未发货列表
export const shippingList = {
  status: 0,
  msg: '请求成功',
  data: {
    totalCount: 2,
    shippingList: [
      {
        orderNum: '154339551978298',
        orderId: '154339551978298',
        orderStatus: 0,
        payTime: '2018-11-28 16:58',
        address: '北京市北京市朝阳区朝阳公园南路6号公园大道4号楼一单元5G',
        boxCount: 4,
        print: 0,
        bind: 1,
        productId: '',
        waybill: '24143243243'
      },
      {
        orderNum: '154339551978298',
        orderId: '154339551978298',
        orderStatus: 1,
        payTime: '2018-11-28 16:58',
        address: '北京市北京市朝阳区朝阳公园南路6号公园大道4号楼一单元5G',
        boxCount: 4,
        print: 1,
        bind: 0,
        productId: '',
        waybill: '24324324'
      }
    ]
  }
}
// 顺丰单号生成
export const generateWaybill = {
  status: 0,
  msg: '生成成功',
  data: {
    waybill: '111111111',
    imgUrl: 'https://static.genebox.cn/touch/s1-product.png'
  }
}
// 已发货唾液盒
export const statisticsNumber = {
  status: 0,
  msg: '',
  data: {
    boxCount: 18
  }
}
// 退款列表
export const refundList = {
  status: 0,
  msg: '',
  data: {
    totalCount: 100,
    refundList: [{
      orderId: '42424242',
      orderNum: '22224215',
      payTime: '2018-01-02',
      platform: '1',
      status: 5001,
      remainPrice: '¥323',
      refundPrice: '¥33',
      remark: ''
    }, {
      orderId: '42424242',
      orderNum: '22224215',
      payTime: '2018-01-02',
      platform: '2',
      status: 5031,
      remainPrice: '¥323',
      refundPrice: '¥33',
      remark: ''
    }, {
      orderId: '42424242',
      orderNum: '22224215',
      payTime: '2018-01-02',
      platform: '3',
      status: 5011,
      remainPrice: '¥323',
      refundPrice: '¥33',
      remark: ''
    }, {
      orderId: '42424242',
      orderNum: '22224215',
      payTime: '2018-01-02',
      platform: '4',
      status: 5001,
      remainPrice: '¥343',
      refundPrice: '¥33',
      remark: ''
    }]
  }
}
// 订单列表
export const orderList = {
  status: 0,
  msg: '',
  data: {
    totalCount: 100,
    orderList: [{
      orderId: '154339551978298',
      orderNum: '111',
      orderTime: '2018-12-12',
      payTime: '2018-12-12',
      payMethod: '微信',
      platform: '1',
      status: 1,
      orderStatus: 1,
      boxCount: '10',
      productInfo: {
        productId: '123',
        name: '刘柳',
        count: 1,
        price: 111,
        totalPrice: 222
      },
      discountInfo: {
        totalPrice: 300,
        remainPrice: 200,
        detail: [{
          coupon: 30,
          name: '优惠码',
          code: 'W1uTaA'
        }]
      },
      recipient: '王新',
      mobile: '15622783467',
      address: '深圳市',
      remark: '这是一条注释'
    }, {
      orderId: '154339551978298',
      orderNum: '111',
      orderTime: '2018-12-12',
      payTime: '2018-12-12',
      payMethod: '微信',
      platform: '2',
      status: 1,
      orderStatus: 0,
      boxCount: '10',
      productInfo: {
        productId: '123',
        name: '丽丽',
        count: 2,
        price: 111,
        totalPrice: 222
      },
      discountInfo: {
        totalPrice: 300,
        remainPrice: 200,
        detail: [{
          coupon: 30,
          name: '优惠码',
          code: 'W1uTaA'
        }]
      },
      recipient: '收件人',
      mobile: '13378652346',
      address: '北京市海淀区',
      remark: '这是一条注释'
    }]
  }
}
// 绑定唾液盒
export const bindBoxList = {
  status: 0,
  msg: '',
  data: [{
    productId: '10011',
    alreadyBind: [{
      boxNum: '10999919270'
    }],
    notBind: 2
  }, {
    productId: '10012',
    alreadyBind: [{
      boxNum: '33333333'
    }],
    notBind: 3
  }]
}
