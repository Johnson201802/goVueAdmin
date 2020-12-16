<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary"  @click="handleCreate">
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
      <el-table-column label="ID" prop="id"  align="center" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.Service_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务名称" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Service_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务ICON" min-width="80px" align="center">
        <template slot-scope="{row}">
          <a :href="row.Icon" target="_blank"><img :src="row.Icon" class="user-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column label="原价" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Origin_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="现价" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Now_price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属商户" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否上架" min-width="80px" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.Is_sale" active-value="1" active-color="#13ce66" inactive-color="#ff4949" inactive-value="0" @change="changeSwitch(row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index,row.Service_id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 600px; margin-left:50px;">
        <el-form-item label="服务名称" prop="present_name">
          <el-input v-model="temp.Service_name" />
        </el-form-item>
        <el-form-item label="服务原价" prop="chip_amount">
          <el-input v-model="temp.Origin_price" />
        </el-form-item>
        <el-form-item label="服务现价" prop="total_amount">
          <el-input v-model="temp.Now_price" />
        </el-form-item>
        <el-form-item label="服务ICON">
          <el-upload
            list-type="none"
            action="https://api.piduopi.com/imgUploads"
            accept="image/jpeg,image/jpg,image/gif,image/png"
            :limit="1"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            >
            <div  style="max-width:400px;display: flex;justify-content:center;align-items: center;border:1px dashed #d9d9d9;font-size: large;" ><i v-show="!is_show" style='padding:100px' class="el-icon-plus" /><img :src="temp.Icon" v-show="is_show"  class="user-avatar22" style="padding:20px 20px;"></div>
           </el-upload>
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
import { fetchServicesList , createService , delPresent ,getMerchant , updateService, changeStatus} from '@/api/services'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mapGetters } from 'vuex'

const calendarTypeOptions = [
  { key: '1', display_name: '已审核' },
  { key: '0', display_name: '未审核' }
]

const calendarTypeOptions2 = [
  { key: '1', display_name: '免费转' },
  { key: '2', display_name: '面议' },
  { key: '3', display_name: '一口价' },
]

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const calendarTypeKeyValue2 = calendarTypeOptions2.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
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
    },
    typeFilter2(type) {
      return calendarTypeKeyValue2[type]
    }
  },
  data() {
    return {
      is_show:false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      merchant:[],
      data:[],
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        id:0,
      },
      options: [{ label: '免费转', key: '1' }, { label: '面议', key: '2' }, { label: '一口价', key: '3' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        Service_name:'',
        Origin_price:undefined,
        Now_price:undefined,
        Is_sale:"1",
        Pid:0,
        Icon:''
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
        Service_name: [{ required: true, message: '服务名不能为空', trigger: 'blur' }],
        Origin_price: [{ required: true, message: '原价不能为空', trigger: 'blur' }],
        Now_price: [{ required: true, message: '现价不能为空', trigger: 'blur' }],
        Pid: [{ required: true, message: '所属商户不能为空', trigger: 'blur' }],
        Icon: [{ required: true, message: '缩略图不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    const id = this.$route.params.id
    this.getList(id)
    this.listQuery.id = id
    this.temp.Pid = id
  },
  methods: {
    getList(id) {
      this.listLoading = true
      fetchServicesList(this.listQuery).then(response => {
        if(response.code == 9000){
          this.$router.push({ name: 'Page401'})
        }else{
          this.list = response.data
          this.total = response.total
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
        this.temp.Icon = response.qrcode
        this.is_show = true
        Message({
          title: '提示',
          message: '已上传',
          type: 'success',
          duration: 2000
        })
      }
    },
    changeSwitch (row) {
         let row2 = Object.assign({}, row)
         changeStatus(row2.Service_id,row2.Is_sale).then((response=>{
            if(response.code == 200 ){
              if(row2.Is_sale == 1){
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
    uploadSuccess2(response,file,filelist){
      if(response.code == 200){
        this.temp.thumb2 = response.photo
        this.is_show2 = true
        Message({
          title: '提示',
          message: '已上传',
          type: 'success',
          duration: 2000
        })
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
    recommand_type_change(id,type){
      recommand_type_change(id,type).then((response)=>{
        if(response.code == 200){
          Message({
            title:'提示',
            message:'更改成功！',
            type:'success',
            duration:5000
          })
        }else{
          Message({
            title:'提示',
            message:'API服务器连接失败！',
            type:'error',
            duration:5000
          })
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
    resetTemp() {
      this.temp = {
        Service_name:'',
        Origin_price:undefined,
        Now_price:undefined,
        Is_sale:"1",
        Pid:this.temp.Pid,
        Icon:''
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      let Icon = this.temp.Icon
      if(Icon != ''){
        this.is_show = true;
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          updateService(tempData).then((response) => {
            const index = this.list.findIndex(v => v.Merchant_id === this.temp.Merchant_id)
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
          createService(this.temp).then((response) => {
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
    async handleCheck(row) {
      this.temp = Object.assign({}, row) // copy obj
      await this.getOneCompany(this.temp.service_id)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row,index,id) {
      this.$confirm('您确定要删除此项?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          delPresent(id).then(response => {
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
<style lang="less">
  .user-avatar {
    cursor: pointer;
    width: 60px;
    height: 60px;
    border-radius: 5px;
  }
  .user-avatar22 {
    cursor: pointer;
    max-width: 150px;
    border-radius: 5px;
    margin:20px 0;
  }
</style>
