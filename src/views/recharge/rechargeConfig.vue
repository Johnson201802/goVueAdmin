<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加 / Add
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" min-width="100px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.vip_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="满足积分数量" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员名称" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.vip_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.discount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.time | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="delVipConfig(row,$index,row.vip_id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="会员名称" prop="vip_name">
          <el-input v-model="temp.vip_name" />
        </el-form-item>
        <el-form-item label="会员折扣" prop="discount">
          <el-input v-model="temp.discount" />
        </el-form-item>
        <el-form-item label="满足数量" prop="amount">
          <el-input v-model="temp.amount" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消 / Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定 / Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getVipConfigList, createVipConfig , updateVipConfig ,delVipConfig } from '@/api/order'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name: 'rechargeConfig',
  components: { Pagination },
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
    }
  },
  data() {
    return {
      is_show:false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        sort: '+id'
      },
      sortOptions: [{ label: 'ID-升序', key: '-id' }, { label: 'ID-降序', key: '+id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        vip_name: undefined,
        discount: '',
        amount: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑 / Edit',
        create: '创建 / Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        vip_name: [{ required: true, message: '会员名不能为空', trigger: 'blur' }],
        discount: [{ required: true, message: '会员折扣不能为空', trigger: 'blur' }],
        amount: [{ required: true, message: '红豆数量不能为空', trigger: 'blur' }],
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getVipConfigList(this.listQuery).then(response => {
        if(response.code == 9000){
          this.$router.push({ name: 'Page401'})
        }else{
          console.log(response.total)
          this.list = response.data
          this.total = response.total

        }

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
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
    uploadError(){
      Message({
        title: 'Notice',
        message: '网络错误！请重试...',
        type: 'error',
        duration: 2000
      })
    },
    uploadSuccess(response,file,filelist){
      if(response.code == 200){
        this.temp.cate_guide_icon = response.photo
        this.is_show = true
        Message({
          title: '提示',
          message: '已上传',
          type: 'success',
          duration: 2000
        })
      }
    },
    changeGuideStatus (id,status) {
         changeGuideStatus(id,status).then((response=>{
            if(response.code == 200 ){
              if(status == 1){
                Message({
                  title: '提示',
                  message: '开启成功',
                  type: 'success',
                  duration: 2000
                })
              }else{
                Message({
                  title: '提示',
                  message: '关闭成功',
                  type: 'success',
                  duration: 2000
                })
              }
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
    resetTemp() {
      this.temp = {
        vip_name: undefined,
        discount: '',
        amount: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createVipConfig(this.temp).then((response) => {
            if(response.code == 200){
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '提示',
                message: '创建成功',
                type: 'success',
                duration: 5000
              })
              return
            }else{
              this.dialogFormVisible = false
              this.$notify({
                title: '提示',
                message: response.msg,
                type: 'error',
                duration: 5000
              })
            }

          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateVipConfig(tempData).then((response) => {
            const index = this.list.findIndex(v => v.vip_id === this.temp.vip_id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            if(response.code == 200){
              this.$notify({
                title: '提示',
                message: '更新成功',
                type: 'success',
                duration: 5000
              })
            }else{
              this.$notify({
                title: '提示',
                message: response.msg,
                type: 'error',
                duration: 5000
              })
            }
          })
        }
      })
    },
    delVipConfig(row,index,id) {
      this.$confirm('您确定要删除此项?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          delVipConfig(id).then(response => {
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
  }
}
</script>
<style>
  .user-avatar22 {
    cursor: pointer;
    max-width: 150px;
    border-radius: 5px;
  }
</style>
