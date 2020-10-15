<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
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
      <el-table-column label="ID" prop="id"  align="center" min-width="100px" >
        <template slot-scope="{row}">
          <span>{{ row.present_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="礼品名称" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span @click="handleUpdate(row)">{{ row.type  | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参数" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.param }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领取时间间隔" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span @click="handleUpdate(row)">{{ row.distant_time }}分钟</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" min-width="30px" align="center">
        <template slot-scope="{row}">
          <el-input  align="center" v-model="row.order" @blur="sortGiftConfig(row.present_id,row.order)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index,row.present_id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="领取名称" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择领取名称">
            <el-option key="0" label="积分" value="0" />
            <el-option key="1" label="红豆劵" value="1" />
            <el-option key="2" label="礼物碎片" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="领取参数" prop="param">
          <el-input v-model="temp.param" />
        </el-form-item>
        <el-form-item label="间隔时间" prop="distant_time">
          <el-input v-model="temp.distant_time" />
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
import { fetchPresentConfigList , createPresentConfigList , updatePresentConfigList ,delPresentConfig, sortGiftConfig} from '@/api/services'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '积分',
        1: '红豆劵',
        2: '礼物碎片'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      is_show:false,
      is_show2:false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        service_id: ''
      },
      options: [{ label: '公司转让', key: '1' }, { label: '天猫转让', key: '2' }, { label: '商标转让', key: '3' }, { label: '需求大厅', key: '4' }, { label: '园区', key: '5' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        present_id: undefined,
        type: '',
        param: '',
        distant_time: ''
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
        type: [{ required: true, message: '请选择赠送的类型', trigger: 'change' }],
        param: [{ required: true, message: '参数不能为空，礼品碎片参数格式：1-2，其它：1', trigger: 'blur' }],
        distant_time: [{ required: true, message: '间隔时间不能为空', trigger: 'blur' }]
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
      fetchPresentConfigList(this.listQuery).then(response => {
        if(response.code == 9000){
          this.$router.push({ name: 'Page401'})
        }else{
          this.list = response.data.items
          this.total = response.data.total
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
    sortGiftConfig(article_id,sort){
      sortGiftConfig(article_id,sort).then((response)=>{
          if(response.code  == 200){
            this.getList()
            Message({
              title: '提示',
              message: '排序成功',
              type: 'success',
              duration: 2000
            })
          }else{
            Message({
              title: '提示',
              message: '排序失败',
              type: 'error',
              duration: 2000
            })
          }
      })
    },
    changeServiceCateStatus (id,status) {
         changeServiceCateStatus(id,status).then((response=>{
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
    resetTemp() {
      this.temp = {
        present_id: undefined,
        type: '',
        param: '',
        distant_time: ''
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
          createPresentConfigList(this.temp).then((response) => {
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
          updatePresentConfigList(tempData).then((response) => {
            const index = this.list.findIndex(v => v.present_id === this.temp.present_id)
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
    handleDelete(row,index,id) {
      this.$confirm('您确定要删除此项?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          delPresentConfig(id).then(response => {
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
