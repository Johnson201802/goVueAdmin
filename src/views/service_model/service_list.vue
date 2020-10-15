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
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="礼品名称" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.present_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合成前图" min-width="80px" align="center">
        <template slot-scope="{row}">
          <a :href="row.thumb1" target="_blank"><img :src="row.thumb1" class="user-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column label="合成后图" min-width="80px" align="center">
        <template slot-scope="{row}">
          <a :href="row.thumb2" target="_blank"><img :src="row.thumb2" class="user-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column label="碎片数量" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.chip_amount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="合成要求数量" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.total_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="礼品库存" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.all_amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index,row.Id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 600px; margin-left:50px;">
        <el-form-item label="礼物名称" prop="present_name">
          <el-input v-model="temp.present_name" />
        </el-form-item>
        <el-form-item label="碎片数量" prop="chip_amount">
          <el-input v-model="temp.chip_amount" />
        </el-form-item>
        <el-form-item label="合成达到数量" prop="total_amount">
          <el-input v-model="temp.total_amount" />
        </el-form-item>
        <el-form-item label="库存" prop="all_amount">
          <el-input v-model="temp.all_amount" />
        </el-form-item>
        <el-form-item label="合成前图">
          <el-upload
            list-type="none"
            action="https://yilixiangsi.magicxhx.com/admin/uploads/ads_img_uploads"
            accept="image/jpeg,image/jpg,image/gif,image/png"
            :limit="1"
            :on-error="uploadError"
            :on-success="uploadSuccess1"
            >
            <div  style="max-width:400px;display: flex;justify-content:center;align-items: center;border:1px dashed #d9d9d9;font-size: large;" ><i v-show="!is_show1" style='padding:100px' class="el-icon-plus" /><img :src="temp.thumb1" v-show="is_show1"  class="user-avatar22"></div>
           </el-upload>
        </el-form-item>
        <el-form-item label="合成后图">
          <el-upload
            list-type="none"
            action="https://yilixiangsi.magicxhx.com/admin/uploads/ads_img_uploads"
            accept="image/jpeg,image/jpg,image/gif,image/png"
            :limit="1"
            :on-error="uploadError"
            :on-success="uploadSuccess2"
            >
            <div  style="max-width:400px;display: flex;justify-content:center;align-items: center;border:1px dashed #d9d9d9;font-size: large;" ><i v-show="!is_show2" style='padding:100px' class="el-icon-plus" /><img :src="temp.thumb2" v-show="is_show2"  class="user-avatar22"></div>
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
import { fetchPresentList , createPresent , delPresent , updatePresent} from '@/api/present'
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
      is_show1:false,
      is_show2:false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      data:[],
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        payment: ''
      },
      options: [{ label: '免费转', key: '1' }, { label: '面议', key: '2' }, { label: '一口价', key: '3' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        Id:undefined,
        present_name:'',
        chip_amount:'',
        thumb1:'',
        thumb2:'',
        total_amount:'',
        all_amount:''
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
        present_name: [{ required: true, message: '礼品名不能为空', trigger: 'blur' }],
        thumb1: [{ required: true, message: '缩略图不能为空', trigger: 'blur' }],
        thumb2: [{ required: true, message: '缩略图不能为空', trigger: 'blur' }],
        chip_amount: [{ required: true, message: '碎片数量不能为空', trigger: 'blur' }],
        total_amount: [{ required: true, message: '合成数量不能为空', trigger: 'blur' }],
        all_amount: [{ required: true, message: '库存不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchPresentList(this.listQuery).then(response => {
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
    uploadError(){
      Message({
        title: 'Notice',
        message: '网络错误！请重试...',
        type: 'error',
        duration: 2000
      })
    },
    uploadSuccess1(response,file,filelist){
      if(response.code == 200){
        this.temp.thumb1 = response.photo
        this.is_show1 = true
        Message({
          title: '提示',
          message: '已上传',
          type: 'success',
          duration: 2000
        })
      }
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
        Id:undefined,
        present_name:'',
        chip_amount:'',
        total_amount:'',
        all_amount:'',
        post_fee:''
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      let thumb1 = this.temp.thumb1
      if(thumb1 != ''){
        this.is_show1 = true;
      }
      let thumb2 = this.temp.thumb2
      if(thumb2 != ''){
        this.is_show2 = true;
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
          updatePresent(tempData).then((response) => {
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
          createPresent(this.temp).then((response) => {
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
