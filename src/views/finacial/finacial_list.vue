<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder=" 微信昵称 " style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="所属状态" clearable style="width: 130px" class="filter-item">
        <el-option v-for="(item,index) in cates" :key="item.id" :label="item.name" :value="item.id" />
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
      <el-table-column label="ID" prop="Id" align="center" min-width="60px">
        <template slot-scope="{row}">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信昵称" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span style="display:block;text-overflow:ellipsis;white-space:wrap;overflow:hidden;">{{ row.nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" min-width="80px" align="center">
        <template slot-scope="{row}">
          <a v-if="row.avatar!=''?true:false" :href="row.avatar" target="_blank"><img :src="row.avatar" class="user2"></a>
          <span v-if="row.avatar==''?true:false">没有图片</span>
        </template>
      </el-table-column>
      <el-table-column label="提现红豆" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span style="">{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.status == 0">待审核</el-tag>
          <el-tag v-if="row.status == 1" type="success">已审核</el-tag>
          <el-tag v-if="row.status == 2" type="warning">已打款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status==0" size="mini" type="success" @click="handleBack(row,$index,row.Id)">
            确认审核
          </el-button>
          <el-button v-if="row.status!=0" size="mini" type="info">
            确认审核
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index,row.Id)">
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
import { fetchCashOutList, checkOut, delOrder2 } from '@/api/order'
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
  components: { Pagination, ImageCropper },
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
      is_show: false,
      tableKey: 0,
      list: null,
      total: 0,
      cates: [
        { id: 0, name: '待审核' },
        { id: 1, name: '待打款' },
        { id: 2, name: '已打款' }
      ],
      listLoading: true,
      imagecropperShow: false,
      imagecropperKey: 0,
      listQuery: {
        page: 1,
        limit: 10,
        type: undefined,
        title: undefined
      },
      importanceOptions: [{ 'key': 1, 'name': '是' }, { 'key': 0, 'name': '否' }],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID-升序', key: '-id' }, { label: 'ID-降序', key: '+id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        ads_id: undefined,
        cate_id: '',
        cate_name: undefined,
        ads_name: '',
        image_uri: '',
        url: '',
        is_newtab: '',
        status: '',
        sort: '',
        create_time: undefined
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
  },
  methods: {
    getList() {
      this.listLoading = true
      const that = this
      fetchCashOutList(that.listQuery).then(response => {
        if (response.code == 9000) {
          that.$router.push({ name: 'Page401' })
        } else {
          console.log(response.data.items)
          that.list = response.data.items
          that.total = response.data.total
        }

        // Just to simulate the time of the request
        setTimeout(() => {
          that.listLoading = false
        }, 1.5 * 1000)
      })
    },
    cannot() {
      this.$notify({
        title: '提示',
        message: '该状态下，不可退款！',
        type: 'error',
        duration: 5000
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    handleBack(row, index, id) {
      this.$confirm('亲，确认审核后，不要忘记给推广商或推广员打款哦！', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(async() => {
        checkOut(id).then(response => {
          const code = response.code
          const msg = response.msg
          if (code == 200) {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '通知',
              message: '审核成功！',
              type: 'success',
              duration: 5000
            })
          } else {
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
    handleDelete(row, index, id) {
      this.$confirm('您确定要进行删除操作?。', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        delOrder2(id).then(response => {
          const code = response.code
          const msg = response.msg
          if (code == 200) {
            this.dialogFormVisible = false
            this.list.splice(index, 1)
            this.$notify({
              title: '通知',
              message: '删除成功！',
              type: 'success',
              duration: 5000
            })
          } else {
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
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>
<style>
  .user2 {
    cursor: pointer;
    max-width: 40px;
    border-radius: 5px;
  }
</style>
