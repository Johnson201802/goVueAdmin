<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder=" 微信昵称 " style="width: 300px;text-align: center;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索 / Search
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" min-width="80px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.User_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信昵称" min-width="60px" align="center">
        <template slot-scope="{row}">
          <span class="">{{ row.Nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" min-width="60px" align="center">
        <template slot-scope="{row}">
          <a :href="row.Avatar" target="_blank"><img :src="row.Avatar" class="user-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column label="手机" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Phone=='0'?"未授权获取":row.Phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否商户" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{row.Merchant_id==""?"否":"是"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否VIP" align="center" min-width="150px">
        <template slot-scope="{row}">
          <el-tag v-if="row.Is_vip != ''" type="warning">尊贵VIP</el-tag>
          <el-tag v-if="row.Is_vip == ''" type="info">非VIP</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column label="注册时间" max-width="100px" align="center">
        <template slot-scope="{row}">
          {{row.Expire_vip_time  | parseTime('{y}-{m}-{d}')}}
        </template>
      </el-table-column> -->

      <el-table-column label="操作" align="center" width="80px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index,row.user_id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import ImageCropper from '@/components/ImageCropper'
import { fetchList , changeRole , delUser } from '@/api/user_front'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '0', display_name: '个人认证' },
  { key: '1', display_name: '企业认证' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination , ImageCropper},
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
  },
  data() {
    return {
      is_show:false,
      is_show2:false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      imagecropperShow: false,
      imagecropperShow2: false,
      imagecropperKey: 0,
      imagecropperKey2: 0,
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        sort: '+id'
      },
      importanceOptions: [{'key':1,'name':'是'},{'key':0,'name':'否'}],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID-升序', key: '-id' }, { label: 'ID-降序', key: '+id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      pvData: [],
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      let that = this
      that.listLoading = true
      fetchList(that.listQuery).then(response => {
        if(response.code == 9000){
          that.$router.push({ name: 'Page401'})
        }else{
          that.list = response.data
          that.total = response.total
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          that.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    changeRole (row) {
         let row2 = Object.assign({}, row)
         changeRole(row2.user_id,row2.role).then((response=>{
            if(response.code == 200 ){
                Message({
                  title: '提示',
                  message: '切换成功！',
                  type: 'success',
                  duration: 2000
                })
            }else{
              Message({
                title: '提示',
                message: '网络错误！请重试...',
                type: 'error',
                duration: 2000
              })
            }
         }))
    },
    handleDelete(row,index,id) {
      this.$confirm('您确定要删除此项?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          delUser(id).then(response => {
            let code = response.code
            let msg = response.msg
            if(code == 200){
              this.dialogFormVisible = false
              this.list.splice(index, 1)
              this.$notify({
                title: '通知',
                message: '删除成功！',
                type: 'success',
                duration: 5000
              })
            }else{
              this.dialogFormVisible = false
              this.$notify({
                title: '通知',
                message: msg,
                type: 'error',
                duration: 5000
              })
            }

            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          })
        }).catch(err => { console.error(err) })

    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '手机号', 'QQ号', '微信号', '头像地址', '微信二维码地址']
        const filterVal = ['user_name', 'user_tel', 'qq', 'wechat', 'avater', 'wechat_qrcode']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {

        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>
<style>
  .user-avatar {
    cursor: pointer;
    width: 60px;
    height: 60px;
    border-radius: 5px;
  }
</style>
