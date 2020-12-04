<template>
  <div class="app-container">
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" min-width="30px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.Question_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信昵称" min-width="30px" align="center">
        <template slot-scope="{row}">
          <span class="" @click="handleUpdate(row)">{{ row.Nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" min-width="30px" align="center">
        <template slot-scope="{row}">
          <a :href="row.Avatar" target="_blank"><img :src="row.Avatar" class="user-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column label="手机" min-width="40px" align="center">
        <template slot-scope="{row}">
          <span class="" @click="handleUpdate(row)">{{ row.Phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈内容" min-width="300px" align="left">
        <template slot-scope="{row}">
          <span class="" >{{ row.Content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.Is_read=='0'" size="mini" type="success" @click="SetRead(row.Question_id)">
            设为已读
          </el-button>
          <el-button v-if="row.Is_read=='1'" disabled size="mini" type="success">
            设为已读
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
import { SetRead , getQuestionList } from '@/api/user_front'
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
      getQuestionList(that.listQuery).then(response => {
        if(response.code == 9000){
          that.$router.push({ name: 'Page401'})
        }else{
          that.list = response.data
          that.total = response.count
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          that.listLoading = false
        }, 1.5 * 1000)
      })
    },
    SetRead(id){
      let that = this
      SetRead(id).then(response => {
        if(response.code == 9000){
          that.$router.push({ name: 'Page401'})
        }else{
          if(response.code == 200){
            that.getList()
            Message({
              title: 'Notice',
              message: '操作成功！',
              type: 'success',
              duration: 2000
            })
          }
        }
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
