<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder=" 文章标题 " style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索 / Search
      </el-button>
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
      <el-table-column label="ID" prop="article_id" align="center" min-width="60px">
        <template slot-scope="{row}">
          <span>{{ row.article_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章标题" min-width="100px">
        <template slot-scope="{row}">
          <span  style="display:block;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" max-width="60px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.create_time  | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.article_id)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index,row.article_id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="200px" style="width: 500px; margin-left:50px;">
        <el-form-item label="广告名称" prop="ads_name">
          <el-input v-model="temp.ads_name" />
        </el-form-item>
        <el-form-item label="排序(可以为空)" prop="sort">
          <el-input v-model="temp.sort" />
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
import ImageCropper from '@/components/ImageCropper'
import { fetchArticleList , delArticle } from '@/api/article'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '0', display_name: '未启用' },
  { key: '1', display_name: '启用' }
]

const calendarTypeOptions2 = [
  { key: '0', display_name: '否' },
  { key: '1', display_name: '是' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue2 = calendarTypeOptions2.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination , ImageCropper},
  directives: { waves },
  filters: {
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
      cates:null,
      listLoading: true,
      imagecropperShow: false,
      imagecropperKey: 0,
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        cate_id:undefined
      },
      importanceOptions: [{'key':1,'name':'是'},{'key':0,'name':'否'}],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID-升序', key: '-id' }, { label: 'ID-降序', key: '+id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        ads_id: undefined,
        ads_name: '',
        url: '',
        create_time:undefined
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
        ads_name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '跳转地址不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
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
      fetchArticleList(this.listQuery).then(response => {
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
    uploadSuccess(response,file,filelist){
      if(response.code == 200){
        this.temp.image_uri = response.photo
        this.is_show = true
        Message({
          title: '提示',
          message: '已上传',
          type: 'success',
          duration: 2000
        })
      }
    },
    getCateList(){
      getArticleCateList().then((response)=>{
        if(response.code == 200){
          this.cates = response.data
        }else{
          Message({
            title: 'Notice',
            message: '网络错误！请重试...',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    changeArticleStatus (id,status) {
       changeArticleStatus(id,status).then((response=>{
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
    sortArticle(article_id,sort){
      sortArticle(article_id,sort).then((response)=>{
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
    handleCreate() {
      this.$router.push({ path: '/ads/articles_create'})
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createAds(this.temp).then((response) => {
            if(response.code == 200){
              this.temp.ads_id = response.id
              this.temp.create_time = response.create_time
              this.temp.cate_name = response.cate_name
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '提示',
                message: '创建成功',
                type: 'success',
                duration: 5000
              })
            }else{
              this.dialogFormVisible = false
              this.$notify({
                title: '提示',
                message: '创建失败',
                type: 'error',
                duration: 5000
              })
            }
          })
        }
      })
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
        ads_id: undefined,
        ads_name: '',
        url: '',
        create_time:undefined
      }
    },
    handleUpdate(id) {
      this.$router.push({ name:'articles_edit',params:{id:id}})
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          updateAds(tempData).then((response) => {
            const index = this.list.findIndex(v => v.ads_id === this.temp.ads_id)
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
          delArticle(id).then(response => {
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
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      if(resData.code == 200){
        console.log(resData);
        this.temp.image_url = resData.photo
        this.is_show = true
        Message({
          title: '提示',
          message: '已上传',
          type: 'success',
          duration: 2000
        })
      }else{
        Message({
          title: '提示',
          message: '上传失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>
<style>
  .thumb {
    cursor: pointer;
    max-width: 80px;
    border-radius: 5px;
  }
</style>
