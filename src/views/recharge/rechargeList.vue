<template>
  <div class="app-container">
   <div class="filter-container">
      <el-select v-model="listQuery.pid" placeholder="商户选择" clearable style="width: 260px" class="filter-item">
        <el-option v-for="(item,key) in importanceOptions" :key="key" :label="item.Name" :value="item.Merchant_id" />
      </el-select>
      <el-date-picker v-model="listQuery.timestamp" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间" class="filter-item"/>
      <el-date-picker v-model="listQuery.timestamp2" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索 / Search
      </el-button>
      <el-button v-if="is_excel" v-waves class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出 / Excel
      </el-button>
      <el-button v-if="!is_excel" disabled v-waves class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出 / Excel
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
<!--      <el-table-column label="ID" prop="Id" align="center" min-width="60px">
        <template slot-scope="{row}">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="商户名称" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span style="display:block;text-overflow:ellipsis;white-space:wrap;overflow:hidden;">{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span style="display:block;text-overflow:ellipsis;white-space:wrap;overflow:hidden;">{{ row.Nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.Price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.Status == 1" type="success">已付款</el-tag>
          <el-tag v-if="row.Status == 0 && row.Price != 0 && row.Discount != '99999999'" type="info">未支付</el-tag>
          <el-tag v-if="row.Status == 0 && row.Discount == '99999999'" type="warning">活动抵扣</el-tag>
          <el-tag v-if="row.Price == 0" type="warning">VIP支付</el-tag>
          <el-tag v-if="row.Status == 2" type="danger">已退款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="星级" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Stars }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
<!--          <el-button v-if="row.status==1" size="mini" type="warning" @click="handleBack(row,$index,row.Id)">
            退款
          </el-button>
          <el-button v-if="row.status!=1" size="mini" type="" @click="cannot(row.Id)">
            退款
          </el-button> -->
          <el-button  size="mini" type="danger" @click="handleDelete(row,$index,row.Id)">
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
import { fetchOrderList, giveBack, delOrder } from '@/api/order'
import { getMerchant } from '@/api/services'
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
      is_excel:false,
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        pid:undefined,
        timestamp:undefined,
        timestamp2:undefined
      },
      importanceOptions: [],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID-升序', key: '-id' }, { label: 'ID-降序', key: '+id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        ads_id: undefined,
        cate_id: '',
        cate_name:undefined,
        ads_name: '',
        image_uri: '',
        url: '',
        is_newtab: '',
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
    this.getMerchant()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchOrderList(this.listQuery).then(response => {
        if(response.code == 9000){
          this.$router.push({ name: 'Page401'})
        }else{
          this.list = response.data
          this.total = response.total
          this.is_excel = true
        }

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['商户名', '用户名', '价格', '状态', '星级', '下单时间']
        const filterVal = ['Name', 'Nick_name', 'Price', 'Status', 'Stars', 'Time']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '订单表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'Time') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getMerchant(){
      getMerchant().then(response => {
        if(response.code == 9000){
          this.$router.push({ name: 'Page401'})
        }else{
          this.importanceOptions = response.data
        }
      })
    },
    cannot(){
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
    handleBack(row,index,id) {
      this.$confirm('您确定要进行退款操作?确认后会原路返回用户账户,具体到账时间以微信实际到账时间为准！', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          giveBack(id).then(response => {
            let code = response.code
            let msg = response.msg
            if(code == 1){
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '通知',
                message: '退款成功！',
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
    handleDelete(row,index,id) {
      this.$confirm('您确定要进行删除操作?。', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          delOrder(id).then(response => {
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
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>
<style>
  .user {
    cursor: pointer;
    max-width: 60px;
    border-radius: 5px;
  }
</style>
