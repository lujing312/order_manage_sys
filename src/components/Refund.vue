<template>
  <div>
    <el-form
      inline
      class="search-form"
      :model="refundSearchList">
      <el-form-item label="订单号">
        <el-input
          clearable
          v-model.trim="refundSearchList.orderNum" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          clearable
          v-model.trim="refundSearchList.mobile" />
      </el-form-item>
      <el-form-item label="顺丰单号">
        <el-input
          clearable
          v-model.trim="refundSearchList.waybill" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleRefundSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="refundList.refundList"
      style="width: 100%">
      <el-table-column
        prop="orderId"
        label="订单Id">
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="payTime"
        label="支付时间">
      </el-table-column>
      <el-table-column
        prop="platform"
        label="下单渠道"
        :formatter="formatterPlatform">
      </el-table-column>
      <el-table-column
        prop="status"
        label="退款状态"
        width="150px">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status ==='5002'"
            type="danger">等待发货中退款完成</el-tag>
          <el-tag
            v-if="scope.row.status === '5001'"
            type="danger">等待发货中退款</el-tag>
          <el-tag
            v-if="scope.row.status === '5003'"
            type="danger">等待发货中退款失败</el-tag>
          <el-tag
            v-if="scope.row.status ==='5011'"
            type="danger">已发货中退款</el-tag>
          <el-tag
            v-if="scope.row.status === '5012'"
            type="danger">已发货中退款完成</el-tag>
            <el-tag
            v-if="scope.row.status === '5013'"
            type="danger">已发货中退款失败</el-tag>
          <el-tag
            v-if="scope.row.status === '5031'"
            type="danger">已收货中退款</el-tag>
          <el-tag
            v-if="scope.row.status === '5032'"
            type="danger">已收货中退款完成</el-tag>
          <el-tag
              v-if="scope.row.status === '5033'"
              type="danger">已收货中退款失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="couponPrice"
        label="购买金额">
      </el-table-column>
      <el-table-column
        prop="refundPrice"
        label="退款金额">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180px"
        fixed="right">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            class="refund-button"
            @click="handleOrderRefundForm(scope.row)">退款</el-button>
          <el-button
            v-if="scope.row.platform !== '4'"
            type="danger"
            size="mini"
            class="refund-button"
            @click="handleRefundRefuseForm"
            width="30%">退款不通过</el-button>
          <el-button
            v-if="scope.row.platform == '4'"
            type="success"
            size="mini"
            class="refund-button"
            width="30%"
            @click="handleOrderRefundFinish(scope.row)">退款已成功</el-button>
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
    <!-- 退款弹框 -->
    <el-dialog
      title="退款详情"
      :visible.sync="orderRefundDialog"
      width="30%"
     >
      <el-form
        :model="orderForm"
        :rules="orderFormRules"
        ref="orderForm">
        <el-form-item label="订单ID" label-width="90px" prop="orderId">
          <el-input disabled v-model="orderForm.orderId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="退款金额" label-width="90px" prop="refundPrice">
          <el-input v-model="orderForm.refundPrice" :placehsolder="orderForm.couponPrice" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderRefundDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleOrderRefundSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 退款不通过弹框 -->
    <el-dialog
      title="退款失败原因:"
      :visible.sync="orderRefundRefuseDialog"
      width="30%"
       @close="() => {
        this.$refs['refuseForm'].resetFields()
      }">
      <el-form
        :model="refuseForm"
        :rules="refuseFormRules"
        ref="refuseForm">
        <el-form-item
          label="订单ID"
          label-width="100px"
          prop="orderId">
          <el-input v-model="refuseForm.orderId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="拒退款原因"
          label-width="100px"
          prop="remark">
          <el-input
            type="textarea"
            autocomplete="off"
            v-model="refuseForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderRefundRefuseDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleRefundRefuseSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 退款已完成 -->
    <el-dialog
      title="退款详情"
      :visible.sync="orderRefundFinishDialog"
      width="30%"
     @close="() => {
        this.$refs['orderForm'].resetFields()
      }">
      <el-form
        :model="orderForm"
        :rules="orderFormRules"
        ref="orderForm">
        <el-form-item label="订单ID" label-width="90px" prop="orderId">
          <el-input disabled v-model="orderForm.orderId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="退款金额" label-width="90px" prop="refundPrice">
          <el-input v-model="orderForm.refundPrice" placeholder="请输入退款金额..." autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orderRefundDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleOrderRefundFinishSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRefundList,
  orderRefund,
  refundRefuse
} from '../server'
export default {
  name: 'Refund',
  data () {
    return {
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      refundList: [],
      orderRefundDialog: false,
      orderRefundRefuseDialog: false,
      orderRefundFinishDialog: false,
      refundSearchList: {
        orderNum: '',
        mobile: '',
        waybill: ''
      },
      orderForm: {
        orderId: '',
        refundPrice: ''
      },
      orderFormRules: {
        orderId: [{
          required: true,
          message: '请输入订单ID',
          trigger: 'blur'
        }],
        refundPrice: [{
          required: true,
          message: '请输入退款金额',
          trigger: 'blur'
        }]
      },
      refuseForm: {
        orderId: '',
        remark: ''
      },
      refuseFormRules: {
        orderId: [{
          required: true,
          message: '请输入订单ID',
          trigger: 'blur'
        }],
        remark: [{
          required: true,
          message: '请输入退款不通过原因',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted () {
    this.getRefundList()
  },
  methods: {
    getRefundList () {
      getRefundList({
        ...this.refundSearchList,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        if (!res.status) {
          this.refundList = res.data || []
          this.totalCount = res.data.totalCount || 0
        } else {
          this.refundList = []
        }
      })
    },
    handleRefundSearch () {
      this.pageNum = 1
      this.getRefundList()
    },
    handleOrderRefundForm (row) {
      this.orderForm.orderId = row.orderId
      this.orderForm.refundPrice = row.couponPrice
      if (row.platform === '4') {
        window.location.href = 'https://www.youzan.com'
      } else {
        this.orderRefundDialog = true
      }
    },
    handleOrderRefundSubmit () {
      this.$refs['orderForm'].validate(valid => {
        if (valid) {
          this.$confirm('是否确认退款？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            orderRefund({
              orderId: this.orderForm.orderId,
              refundPrice: this.orderForm.refundPrice
            }).then(res => {
              if (!res.status) {
                this.$message({
                  type: 'success',
                  message: '退款成功!'
                })
                this.getRefundList()
                // 弹窗关闭
                this.orderRefundDialog = false
                // 清空输入框
                this.orderForm.orderId = ''
                this.orderForm.refundPrice = ''
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            })
          })
        }
      })
    },
    handleRefundRefuseForm () {
      this.orderRefundRefuseDialog = true
    },
    handleRefundRefuseSubmit () {
      this.$refs['refuseForm'].validate(valid => {
        if (valid) {
          refundRefuse({
            orderId: this.refuseForm.orderId,
            remark: this.refuseForm.remark
          }).then(res => {
            if (!res.status) {
              this.$message({
                type: 'success',
                message: '发送成功'
              })
              this.getRefundList()
              // 关闭弹框
              this.orderRefundRefuseDialog = false
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleOrderRefundFinish (row) {
      this.orderForm.orderId = row.orderId
      this.orderRefundFinishDialog = true
    },
    handleOrderRefundFinishSubmit () {
      this.$refs['orderForm'].validate(valid => {
        if (valid) {
          orderRefund({
            orderId: this.orderForm.orderId,
            refundPrice: this.orderForm.refundPrice
          }).then(res => {
            if (!res.status) {
              this.$message({
                type: 'success',
                message: '退款已完成'
              })
              // 弹窗关闭
              this.orderRefundFinishDialog = false
              // 清空输入框
              this.orderForm.orderId = ''
              this.orderForm.refundPrice = ''
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handlePageChange (currentPage) {
      this.pageNum = currentPage
      this.getRefundList()
    },
    formatterPlatform (row, column, cellValue) {
      var mapPlatform = {
        '1': 'ios',
        '2': '安卓',
        '3': '小程序',
        '4': '有赞'
      }
      return mapPlatform[row.platform]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-form {
  margin-top: 40px;
}
.refund-button {
  padding: 6px 10px;
}
.page-wrap {
text-align: right;
margin-top: 20px;
}
</style>
