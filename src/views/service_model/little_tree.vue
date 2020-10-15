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
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置名称" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span @click="handleUpdate(row)">{{ row.config_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="能量球数量" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.ball_amount }}个</span>
        </template>
      </el-table-column>
      <el-table-column label="积分数量" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span @click="handleUpdate(row)">{{ row.intergal_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间间隔" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span @click="handleUpdate(row)">{{ row.time_distant }}分钟</span>
        </template>
      </el-table-column>
      <el-table-column label="最大浇水次数" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span @click="handleUpdate(row)">{{ row.max_watering_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浇水抵扣时间" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span @click="handleUpdate(row)">{{ row.watering_discount }}分钟</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index,row.Id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="配置名称" prop="config_name">
          <el-input v-model="temp.config_name" />
        </el-form-item>
        <el-form-item label="能量球数量" prop="ball_amount">
          <el-input v-model="temp.ball_amount" />
        </el-form-item>
        <el-form-item label="积分数量" prop="intergal_amount">
          <el-input v-model="temp.intergal_amount" />
        </el-form-item>
        <el-form-item label="时间间隔" prop="time_distant">
          <el-input v-model="temp.time_distant" />
        </el-form-item>
        <el-form-item label="浇水次数" prop="max_watering_time">
          <el-input v-model="temp.max_watering_time" />
        </el-form-item>
        <el-form-item label="抵扣时间" prop="watering_discount">
          <el-input v-model="temp.watering_discount" />
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
import { fetchTreeConfigList , createTreeConfig , updateTreeConfig ,delTreeConfig } from '@/api/tree'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
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
        service_id: ''
      },
      options: [{ label: '公司转让', key: '1' }, { label: '天猫转让', key: '2' }, { label: '商标转让', key: '3' }, { label: '需求大厅', key: '4' }, { label: '园区', key: '5' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        Id: undefined,
        config_name: '',
        ball_amount: '',
        intergal_amount: '',
        time_distant: '',
        max_watering_time: '',
        watering_discount: ''
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
        config_name: [{ required: true, message: '配置名称不能为空，例如：T001-第一次能量领取', trigger: 'blur' }],
        ball_amount: [{ required: true, message: '能量球数量不能为空', trigger: 'blur' }],
        intergal_amount: [{ required: true, message: '积分数量不能为空', trigger: 'blur' }],
        time_distant: [{ required: true, message: '时间间隔不能为空', trigger: 'blur' }],
        max_watering_time: [{ required: true, message: '允许浇水次数不能为空', trigger: 'blur' }],
        watering_discount: [{ required: true, message: '浇水时间抵扣不能为空，单位，分钟', trigger: 'blur' }],
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
      fetchTreeConfigList(this.listQuery).then(response => {
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
        Id: undefined,
        config_name: '',
        ball_amount: '',
        intergal_amount: '',
        time_distant: '',
        max_watering_time: '',
        watering_discount: ''
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
          createTreeConfig(this.temp).then((response) => {
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
          updateTreeConfig(tempData).then((response) => {
            const index = this.list.findIndex(v => v.Id === this.temp.Id)
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
          delTreeConfig(id).then(response => {
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
