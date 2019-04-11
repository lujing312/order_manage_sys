<template>
  <div>
    <el-form
      inline
      class="search-form"
      :model="searchForm">
      <el-form-item label="订单号">
        <el-input
          clearable
          v-model.trim="searchForm.orderNum" />
      </el-form-item>
      <el-form-item label="快递单号">
        <el-input
          clearable
          v-model.trim="searchForm.waybill" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      class="search-table"
      :data="shippingList">
      <el-table-column prop="orderNum" label="订单号" width="160" />
      <el-table-column prop="waybill" label="顺丰单号" width="160" />
      <el-table-column label="订单状态" width="100">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.orderStatus === 0"
            type="success"
          >正常单</el-tag>
          <el-tag
            v-if="scope.row.orderStatus === 1"
            type="danger"
          >重寄单</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="boxCount" label="唾液盒数量" width="90" />
      <el-table-column label="是否打印" width="80">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.print === 0"
            type="danger"
          >未打印</el-tag>
          <el-tag
            v-if="scope.row.print === 1"
            type="success"
          >已打印</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="bind" label="是否绑定唾液盒" width="120">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.bind === 0"
            type="danger"
          >未绑定</el-tag>
          <el-tag
            v-if="scope.row.bind === 1"
            type="success"
          >已绑定</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="payTime" label="支付时间" width="100" />
      <el-table-column fixed="right" label="操作" width="110" class="operate-button">
        <template slot-scope="scope">
          <el-button
            class="list-op-btn"
            type="primary"
            @click="handleGenerateWaybill(scope.row)"
            size="mini">生成顺丰单</el-button>
          <el-button
            class="list-top-btn"
            type="success"
            @click="handleBindBox(scope.row)"
            size="mini">绑定唾液盒</el-button>
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
    <!-- 生成顺丰单号 -->
    <el-dialog
      title="顺丰面单"
      :visible.sync="showShunfengDocument"
      width="30%">
      <div v-for="(item, index) in waybillList" :key="index">
        <span>顺丰单号:</span>
        <span>{{item.waybill}}</span>
        <img :src="item.imgUrl" class="express-img-list"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="handlePrintWaybillImg">保存面单</el-button>
      </span>
    </el-dialog>
    <!-- 绑定唾液盒 -->
    <el-dialog
      title="绑定唾液盒"
      :visible.sync="ShowBindSpittleBox"
      width="30%">
      <el-form
        label="left"
        label-width="100px"
        :model="spittleBoxForm"
        ref="spittleBoxForm">
        <div v-for="(item, pIdx) in spittleBoxForm.bindBoxList" :key="pIdx">
          <div class="from-product">产品名称:{{item.productName}}</div>
          <div v-for="(it, index) in item.alreadyBind" :key="index">
            <div class="form-boxNum">已绑定唾液盒:{{it.boxNum}}</div>
          </div>
          <div
            v-for="(boxNumList, cIdx) in item.boxNums"
            :key="cIdx">
            <el-form-item
              label="唾液盒编号"
              :prop="'bindBoxList.'+pIdx+'.boxNums.'+cIdx+'.value'"
              :rules="{
                required: true,
                trigger: 'blur',
                message: '请输入唾液盒编号'
                }">
              <el-input
                v-model="boxNumList.value"
                placeholder="请输入唾液盒编号"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ShowBindSpittleBox = false">取 消</el-button>
        <el-button type="primary" @click="handleBindBoxNumber">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getShippingList,
  getGenerateWaybill,
  bindBoxNumberForm,
  getBindBoxList
} from '../server'
export default {
  name: 'Shipping',
  data () {
    return {
      searchForm: {
        orderNum: '',
        waybill: ''
      },
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
      shippingList: [],
      showShunfengDocument: false,
      waybillList: [],
      ShowBindSpittleBox: false,
      ShowCheckDetailList: false,
      fullscreenLoading: false,
      boxCount: '',
      orderNum: '',
      spittleBoxForm: {
        bindBoxList: []
      },
      boxNums: '',
      orderNumber: '',
      boxNumbers: ''
    }
  },
  mounted () {
    this.getShippingList()
  },
  methods: {
    getShippingList () {
      getShippingList({
        ...this.searchForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        if (!res.status) {
          this.shippingList = res.data.shippingList || []
          this.totalCount = res.data.totalCount || 0
        } else {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 5000
          })
        }
      })
    },
    handleSearch () {
      this.pageNum = 1
      this.getShippingList()
    },
    handlePageChange (currentPage) {
      this.pageNum = currentPage
      this.getShippingList()
    },
    handleGenerateWaybill (row) {
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中.....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.orderNum = row.orderNum
      getGenerateWaybill({
        orderId: row.orderId
      }).then(res => {
        if (!res.status) {
          this.waybillList = Array.of(res.data) || []
          loading.close()
          this.showShunfengDocument = true
        } else {
          this.waybillList = []
        }
      })
    },
    handlePrintWaybillImg () {
      window.location.href = 'ordersys/print?orderNum=' + this.orderNum
      this.getShippingList()
    },
    handleBindBox (row) {
      this.orderNum = row.orderNum
      getBindBoxList({
        orderNum: row.orderNum
      }).then(res => {
        if (!res.status) {
          this.spittleBoxForm.bindBoxList = res.data || []
          this.ShowBindSpittleBox = true
          this.spittleBoxForm.bindBoxList = this.spittleBoxForm.bindBoxList.map(item => {
            let arr = []
            for (var i = 0; i < item.notBind; i++) {
              arr.push({
                value: ''
              })
            }
            return {
              ...item,
              boxNums: arr
            }
          })
        } else {
          this.spittleBoxForm.bindBoxList = []
        }
      })
    },
    handleBindBoxNumber () {
      this.$refs['spittleBoxForm'].validate(valid => {
        if (valid) {
          bindBoxNumberForm({
            orderNum: this.orderNum,
            boxNumbers: this.spittleBoxForm.bindBoxList
          }).then(res => {
            if (!res.status) {
              this.$message({
                message: '绑定成功',
                type: 'success'
              })
              // 刷新列表
              this.getShippingList()
              this.ShowBindSpittleBox = false
            } else {
              this.$message({
                message: '系统错误：' + res.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleCheckDetail () {
      this.ShowCheckDetailList = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-form,
.search-table,
.page-wrap {
  margin-top: 20px;
}
.page-wrap {
  text-align: right;
}
.list-op-btn {
  margin-left: 0;
  margin-top: 6px;
}
.list-top-btn {
  margin-left: 0;
  margin-top: 6px;
}
.el-button+.el-button {
  margin-left: 0;
}
.express-img-list {
  width: 370px;
  margin-top: 20px;
}
.check-list {
  margin-bottom: 10px;
}
.form-boxNum {
  margin: 10px 0 10px 10px;
}
.from-product {
  margin: 10px 0 10px 10px;
}
.el-dialog__wrapper >>> .el-dialog__body {
  padding: 0px 20px;
}
</style>
