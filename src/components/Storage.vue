<template>
  <div>
    <el-card class="add-form">
      <el-form inline :model="addForm" @submit.native.prevent>
        <el-form-item>
          <el-input
            clearable
            placeholder="扫描唾液盒条形码"
            v-model.trim="addForm.boxNumber" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            @click="handleAdd">入库</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="search-form">
      <el-form inline :model="searchForm">
        <el-form-item label="唾液盒编号">
          <el-input
            clearable
            placeholder="输入唾液盒编号"
            v-model.trim="searchForm.boxNumber" />
        </el-form-item>
        <el-form-item label="入库时间">
          <el-date-picker
            v-model="searchForm.daterange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        class="box-list"
        :data="boxList">
        <el-table-column prop="boxNumber" label="唾液盒编号" />
        <el-table-column prop="waybill" label="顺丰单号" />
        <el-table-column prop="signTime" label="签收时间" />
      </el-table>
      <el-pagination
        v-if="totalCount>pageSize"
        class="page-wrap"
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="totalCount"
        @current-change="handlePageChange">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getBoxList,
  addBox
} from '../server'
export default {
  name: 'Storage',
  data () {
    return {
      addForm: {
        boxNumber: ''
      },
      searchForm: {
        boxNumber: '',
        daterange: '',
        fromDate: '',
        toDate: ''
      },
      boxList: [],
      totalCount: 0,
      pageNum: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.getBoxList()
  },
  methods: {
    getBoxList () {
      getBoxList({
        boxNumber: this.searchForm.boxNumber,
        fromDate: this.searchForm.daterange ? this.searchForm.daterange[0] : '',
        toDate: this.searchForm.daterange ? this.searchForm.daterange[1] : '',
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        if (!res.status) {
          this.boxList = res.data.boxList || []
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
    handleAdd () {
      if (!this.addForm.boxNumber) {
        this.$message({
          message: '唾液盒编号不能为空',
          type: 'error'
        })
        return
      }
      addBox({
        boxNumber: this.addForm.boxNumber
      }).then(res => {
        if (!res.status) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          // 清空参数
          this.addForm.boxNumber = ''
          this.pageNum = 1
          // 刷新列表
          this.getBoxList()
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
      this.getBoxList()
    },
    handlePageChange (currentPage) {
      this.pageNum = currentPage
      this.getBoxList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.add-form,
.search-form,
.box-list,
.page-wrap {
  margin-top: 20px;
}
.page-wrap {
  text-align: right;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
