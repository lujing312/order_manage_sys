<template>
  <el-container>
    <el-header>
      <div class="title">订单管理系统</div>
      <div>
        <el-button size="mini" round v-if="boxCount!== 0">已发出唾液盒：{{boxCount || 0}}个</el-button>
        <!-- <el-button size="mini" round @click="handleLogout">退出登录</el-button> -->
      </div>
    </el-header>
    <el-container class="container">
      <el-aside width="160px">
        <el-menu
          @select="handleSelectMenu"
          :default-active="defaultActive"
          router>
          <el-menu-item index="/storage">
            <i class="el-icon-tickets"></i>
            <span slot="title">回寄入库</span>
          </el-menu-item>
          <el-menu-item index="/shipping">
            <i class="el-icon-printer"></i>
            <span slot="title">未发货列表</span>
          </el-menu-item>
          <el-menu-item index="/refund">
            <i class="el-icon-warning"></i>
            <span slot="title">退款列表</span>
          </el-menu-item>
          <el-menu-item index="/order">
            <i class="el-icon-search"></i>
            <span slot="title">订单查询</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {
  getStatisticsNumber
} from '../server'
export default {
  name: 'Home',
  data () {
    return {
      boxCount: ''
    }
  },
  mounted () {
    this.getStatisticsNumber()
  },
  methods: {
    handleSelectMenu (path) {
      this.$router.push(path)
    },
    handleLogout () {
      window.location.href = '/ordersys/logout'
    },
    getStatisticsNumber () {
      getStatisticsNumber({}).then(res => {
        if (!res.status) {
          this.boxCount = res.data.boxCount
        }
      })
    }
  },
  computed: {
    defaultActive () {
      return this.$route.path
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin-top: 60px;
}
.el-header {
  background-color: #409eff;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  line-height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.open-link {
  color: #fff;
}
.el-aside {
  color: #333;
}
.el-menu {
  height: 100%;
}
.el-main {
  color: #333;
  padding-top: 0;
}
</style>
