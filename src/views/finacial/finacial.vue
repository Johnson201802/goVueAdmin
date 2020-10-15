<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder=" 微信昵称 " style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
          <span>{{ row.order_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信昵称" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span style="display:block;text-overflow:ellipsis;white-space:wrap;overflow:hidden;">{{ row.nick_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" min-width="80px" align="center">
        <template slot-scope="{row}">
          <a v-if="row.avatar!=''?true:false" :href="row.avatar" target="_blank"><img :src="row.avatar" class="user-avatar22"></a>
          <span v-if="row.avatar==''?true:false">没有图片</span>
        </template>
      </el-table-column>
      <el-table-column label="商品及数量" min-width="150px" align="center">
        <template slot-scope="{row}">
          <p v-for="(item,index) in row.items"><span style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;width:50px;">{{item.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;X{{item.amount}}</p>
        </template>
      </el-table-column>
      <el-table-column label="全部金额" min-width="60px" align="center">
        <template slot-scope="{row}">
          <span style="">{{ row.total_money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="红豆劵抵扣" min-width="60px" align="center">
        <template slot-scope="{row}">
          <span style="">{{ row.coupon_discount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员抵扣" min-width="60px" align="center">
        <template slot-scope="{row}">
          <span style="">{{ row.vip_discount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实付金额" min-width="60px" align="center">
        <template slot-scope="{row}">
          <span style="">{{ row.real_pay }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="60px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.flag == 0" type="warning">红豆购买</el-tag>
          <el-tag v-if="row.flag == 1" type="warning">碎片合成</el-tag>
          <el-tag v-if="row.flag == 2" type="warning">会员赠送</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="60px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.status == 1" >已付款</el-tag>
          <el-tag v-if="row.status == 0" type="info">未支付</el-tag>
          <el-tag v-if="row.status == 2" type="warning">待收货</el-tag>
          <el-tag v-if="row.status == 3" type="success">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time  | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status==1" size="mini" type="success" @click="handleBack(row,$index,row.order_id)">
            发货
          </el-button>
          <el-button v-if="row.status!=1" size="mini" type="info">
            发货
          </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(row,$index,row.order_id)">
            删除
          </el-button>
          <el-button  size="mini" type="default" @click="handleFY(row,$index,row.order_id)">
            返佣信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="返佣信息" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="推广商家" prop="cate_name">
          <span>{{distribution.business_name}}</span>
        </el-form-item>
        <el-form-item label="返佣金额" prop="cate_desc">
          <span>{{distribution.business_give_bake}}</span>
        </el-form-item>
        <el-form-item label="返佣推广员" prop="cate_desc">
          <span>{{distribution.person_name}}</span>
        </el-form-item>
        <el-form-item label="返佣金额" prop="cate_desc">
          <span>{{distribution.person_give_back}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          知道了
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="发货信息" :visible.sync="dialogFormVisible2">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="收件人" prop="cate_name">
          <span>{{post.consignee}}</span>
        </el-form-item>
        <el-form-item label="手机号码" prop="cate_desc">
          <span>{{post.mobile}}</span>
        </el-form-item>
        <el-form-item label="定位地址" prop="cate_desc">
          <span>{{post.address}}</span>
        </el-form-item>
        <el-form-item label="详细地址" prop="cate_desc">
          <span>{{post.house_number}}</span>
        </el-form-item>
        <el-form-item label="快递单号" prop="cate_desc">
          <el-input v-model="postNum" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">
          取消 / Cancel
        </el-button>
        <el-button type="primary" @click="makeSure(post.order_id,postNum)">
          确定 / Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import ImageCropper from '@/components/ImageCropper'
import { fetchOrderList2, giveBack, delUserOrder, getFYinfo, getPostInfo, postOrder} from '@/api/order'
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
      postNum:'',
      imagecropperKey: 0,
      post:{consignee:'',mobile:'',address:'',house_number:'',order_id:''},
      distribution:{business_name:'',business_give_bake:'',person_name:'',person_give_back:''},
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined
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
        image_uri: '',
        url: '',
        is_newtab: '',
        status: '',
        sort: '',
        create_time:undefined
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
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
      fetchOrderList2(this.listQuery).then(response => {
        if(response.code == 9000){
          this.$router.push({ name: 'Page401'})
        }else{
          console.log(response.data)
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    handleBack(row,index,id) {
      this.dialogFormVisible2 = true
      let that = this
      that.post.order_id = id
      getPostInfo(id).then(response => {
        that.post.consignee = response.data.consignee
        that.post.mobile = response.data.mobile
        that.post.address = response.data.address
        that.post.house_number = response.data.house_number
      })
    },
    makeSure(id,postNum){
      let that = this
      postOrder(id,postNum).then(response => {
        that.dialogFormVisible2 = false
        that.getList()
        if(response.code==200){
          Message({
            title: '提示',
            message: '发货成功！',
            type: 'success',
            duration: 5000
          })
        }else{
          Message({
            title: '提示',
            message: '发货失败！',
            type: 'error',
            duration: 5000
          })
        }
      })
    },
    handleDelete(row,index,id) {
      this.$confirm('您确定要进行删除操作?。', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          delUserOrder(id).then(response => {
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
    handleFY(row,index,id){
      this.dialogFormVisible = true
      let that = this
      getFYinfo(id).then(response => {
        that.distribution.business_give_bake = response.data.business_give_bake
        that.distribution.business_name = response.data.business_name
        that.distribution.person_give_back = response.data.person_give_back
        that.distribution.person_name = response.data.person_name
      })
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
  .user-avatar22 {
    cursor: pointer;
    max-width: 60px;
    border-radius: 5px;
  }
</style>
