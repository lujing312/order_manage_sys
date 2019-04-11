<template>
  <div>
    <el-form
      inline
      class="search-form"
      :model="orderSearchList">
      <el-form-item label="手机号">
        <el-input
          v-model.trim="orderSearchList.mobile"
          clearable />
      </el-form-item>
      <el-form-item label="顺丰单号">
        <el-input
          clearable
          v-model.trim="orderSearchList.waybill"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleOrderSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="orderList.orderList"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="收件人">
              <span>{{ props.row.recipient }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderId"
        label="订单Id"
        width="120px">
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="orderTime"
        label="下单时间">
      </el-table-column>
      <el-table-column
        prop="payTime"
        label="支付时间">
      </el-table-column>
      <el-table-column
        prop="payMethod"
        label="支付方式"
        :formatter="formatterpayMethod">
      </el-table-column>
      <el-table-column
        prop="platform"
        label="下单渠道"
        :formatter="formatterPlatform">
      </el-table-column>
      <el-table-column
        prop="status"
        label="订单状态"
        :formatter="formatterStatus">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单类型"
        :formatter="formatterOrderStatus">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160px">
        <template slot-scope="infoItem">
          <el-button
            size="mini"
            type="success"
            class="order-button"
            @click="handleProductInfoShow(infoItem.row.productInfo)">商品详情</el-button>
          <el-button
            size="mini"
            type="success"
            class="order-button"
            @click="handleDiscountInfoShow(infoItem.row.discountInfo)">折扣详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="totalCount>pageSize"
      class="page-wrap"
      background
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="handlePageChange">
    </el-pagination>
    <!-- 商品详情 -->
    <el-dialog
      title="商品详情"
      :visible.sync="productInfoDialog"
      width="40%">
      <el-table :data="productList">
        <el-table-column property="productId" label="商品ID" ></el-table-column>
        <el-table-column property="name" label="商品名称" width="150px"></el-table-column>
        <el-table-column property="count" label="数量"></el-table-column>
        <el-table-column property="price" label="单价"></el-table-column>
        <el-table-column property="totalPrice" label="总价"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 折扣详情 -->
    <el-dialog
      title="折扣详情"
      :visible.sync="discountInfoDialog"
      width="30%">
      <div class="discount-title">
        <p>单价金额:{{remainPrice}}</p>
        <p>总金额:{{discountTotalPrice}}</p>
      </div>
      <el-table :data="detail">
        <el-table-column property="coupon" label="优惠券"></el-table-column>
        <el-table-column property="name" label="优惠名"></el-table-column>
        <el-table-column property="code" label="优惠码"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderList
} from '../server'
export default {
  name: 'Order',
  data () {
    return {
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      orderSearchList: {
        mobile: '',
        waybill: ''
      },
      orderList: {},
      productInfoDialog: false,
      discountInfoDialog: false,
      productList: [],
      detail: [],
      remainPrice: '',
      discountTotalPrice: ''
    }
  },
  mounted () {
    this.getOrderList()
  },
  methods: {
    getOrderList () {
      getOrderList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: this.status,
        ...this.orderSearchList
      }).then(res => {
        if (!res.status) {
          this.orderList = res.data || {}
          this.totalCount = res.data.totalCount || 0
        } else {
          this.orderList = {}
        }
      })
    },
    handleOrderSearch () {
      this.pageNum = 1
      this.getOrderList()
    },
    formatterPlatform (row, column, cellValue) {
      var mapPlatform = {
        '1': 'ios',
        '2': 'adr',
        '3': '小程序',
        '4': '有赞'
      }
      return mapPlatform[row.platform]
    },
    formatterpayMethod (row, column, cellValue) {
      var mapPayMethod = {
        '0': '未支付',
        '1': '支付宝',
        '2': '微信',
        '3': '未知支付方式'
      }
      return mapPayMethod[row.payMethod]
    },
    formatterStatus (row, column, cellValue) {
      var mapStatus = {
        '1001': '下单成功',
        '1002': '取消订单',
        '2001': '等待支付',
        '2002': '支付中',
        '2003': '支付成功'
      }
      return mapStatus[row.status]
    },
    formatterOrderStatus (row, column, cellValue) {
      var mapOrderStatus = {
        '0': '正常',
        '1': '重寄'
      }
      return mapOrderStatus[row.orderStatus]
    },
    handleProductInfoShow (row) {
      this.productList = row
      this.productInfoDialog = true
    },
    handleDiscountInfoShow (discountInfo) {
      this.discountInfoDialog = true
      this.detail = discountInfo.detail
      this.remainPrice = discountInfo.remainPrice
      this.discountTotalPrice = discountInfo.totalPrice
    },
    handlePageChange (currentPage) {
      this.pageNum = currentPage
      this.getOrderList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-form {
  margin-top: 50px;
}
.order-button {
  padding: 8px 5px;
}
.page-wrap {
  text-align: right;
  margin-top: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.discount-title {
  display: flex;
  flex-direction: row;
}
.discount-title > p {
  margin-right: 40px;
  margin-bottom: 10px;
  font-weight: 500;
}
.el-dialog__wrapper >>> .el-dialog__body {
  padding: 20px 20px;
}
.el-dialog__wrapper >>> .el-dialog__header {
  padding: 20px 20px 0px;
}
</style>
