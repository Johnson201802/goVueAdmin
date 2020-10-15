<template>
  <el-table :data="list" class="el-card is-always-shadow" style="width: 100%;padding-top: 15px;padding-bottom: 18px;">
    <el-table-column label="管理员名称" max-width="100">
      <template slot-scope="scope">
        {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column label="登录IP" max-width="200" align="center">
      <template slot-scope="scope">
        {{ scope.row.ip }}
      </template>
    </el-table-column>
    <el-table-column label="登录时间" max-width="100" align="center">
      <template slot-scope="{row}">
        {{ row.time }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'
import { loginLog } from '@/api/common'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      loginLog().then(response => {
        console.log(response)
        this.list = response.data
      })
    }
  }
}
</script>
