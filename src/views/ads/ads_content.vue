<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder=" 广告名称 " style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.cate_id" placeholder="所属分类" clearable style="width: 130px" class="filter-item">
        <el-option v-for="(item,index) in cates" :key="item.ads_cate_id" :label="item.cate_name" :value="item.ads_cate_id" />
      </el-select>
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
      <el-table-column label="ID" prop="id" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.ads_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告名称" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.ads_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属分类" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.cate_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转地址" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">地址：{{ row.url }}?id={{row.detail_id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" min-width="150px" align="center">
        <template slot-scope="{row}">
          <a :href="row.image_url" target="_blank"><img :src="row.image_url" class="user-avatar22"></a>
        </template>
      </el-table-column>
      <el-table-column label="广告状态" min-width="100px" align="center">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" active-value="1" active-color="#13ce66" inactive-color="#ff4949" inactive-value="0" @change="changeSwitch(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="排序" min-width="100px" align="center">
        <template slot-scope="{row}">
          <el-input  align="center" v-model="row.sort" @blur="sort(row)"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.create_time  | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="delAds(row,$index,row.ads_id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="200px" style="width: 500px; margin-left:50px;">
        <el-form-item label="所属分类" prop="cate_id">
          <el-select v-model="temp.cate_id" class="filter-item" placeholder="请选择所属分类">
            <el-option v-for="(item,index) in cates" :key="item.ads_cate_id" :label="item.cate_name" :value="item.ads_cate_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="广告状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择选项">
            <el-option key="1" label="开启" value="1" />
            <el-option key="0" label="关闭" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转地址" prop="url">
          <el-select v-model="temp.url" class="filter-item" placeholder="请选择选项" @change="show">
            <el-option key="5" label="特定商品" value="../productDetail/productDetail" />
            <el-option key="7" label="文章" value="../article/article" />
            <el-option key="0" label="签到" value="../Register/Register" />
            <el-option key="1" label="买豆" value="../Buydou/Buydou" />
            <el-option key="2" label="领取礼品" value="../getGif/getGif" />
            <el-option key="3" label="小树" value="../LittleTree/LittleTree" />
            <el-option key="4" label="排行榜" value="../Chats/Chats" />
            <el-option key="6" label="仓库" value="../cangku/cangku" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="is_show_detail_id" label="详情ID" prop="detail_id">
          <el-input v-model="temp.detail_id" />
        </el-form-item>
        <el-form-item label="广告名称" prop="ads_name">
          <el-input v-model="temp.ads_name" />
        </el-form-item>
        <el-form-item label="排序(可以为空)" prop="sort">
          <el-input v-model="temp.sort" />
        </el-form-item>
        <el-form-item label="图片(没有可不传)">
          <el-upload
            list-type="none"
            action="https://yilixiangsi.magicxhx.com/admin/uploads/ads_img_uploads"
            accept="image/jpeg,image/jpg,image/gif,image/png"
            :limit="1"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            >
            <div  style="max-width:400px;display: flex;justify-content:center;align-items: center;border:1px dashed #d9d9d9;font-size: large;" ><i v-show="!is_show" style='padding:100px' class="el-icon-plus" /><img :src="temp.image_url" v-show="is_show"  class="user-avatar22"></div>
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
import ImageCropper from '@/components/ImageCropper'
import { fetchAdsList, sort, changeStatus, getCateList, createAds, updateAds, delAds } from '@/api/ads'
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
      is_show_detail_id:false,
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
        cate_id: '',
        cate_name:undefined,
        ads_name: '',
        image_url: '',
        url: '',
        detail_id:'',
        status: '',
        sort: '',
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
        cate_id: [{ required: true, message: '请选择分类', trigger: 'change' }],
        ads_name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '跳转地址不能为空', trigger: 'blur' }],
        is_newtab: [{ required: true, message: '请选择状态', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getCateList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchAdsList(this.listQuery).then(response => {
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
    show(){
      if(this.temp.url == '../productDetail/productDetail' || this.temp.url == '../article/article'){
        this.is_show_detail_id = true
      }else{
         this.is_show_detail_id = false
      }

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
        this.temp.image_url = response.photo
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
      getCateList().then((response)=>{
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
    changeSwitch (row) {
       let row2 = Object.assign({}, row)
       changeStatus(row2.ads_id,row2.status).then((response=>{
          if(response.code == 200 ){
            if(row2.status == 1){
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
    sort(row){
      let data = Object.assign({}, row)
      sort(data).then((response)=>{
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
      this.is_show = false
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
              console.log(response)
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
        cate_id: '',
        cate_name:undefined,
        ads_name: '',
        image_url: '',
        url: '',
        detail_id: '',
        status: '1',
        sort: '',
        create_time:undefined
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      if(this.temp.is_newtab == 1){this.temp.is_newtab = '1'}else{this.temp.is_newtab = '0'}
      let image_url = this.temp.image_url
      if(image_url != ''){
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
    delAds(row,index,id) {
      this.$confirm('您确定要删除此项?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          delAds(id).then(response => {
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
  .user-avatar22 {
    cursor: pointer;
    max-width: 100px;
    border-radius: 5px;
  }
</style>
