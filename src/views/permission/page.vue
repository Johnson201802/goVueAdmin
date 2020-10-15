<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加 / Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出 / Excel Export
      </el-button>
      <span class="permission-alert" style="margin-left: 50px;">
        <el-tag class="permission-tag" size="medium">注意：此模块只限于技术维护人员操作，如果您是系统管理，请勿动这个模块的数据，系统权限数据不可随意更改！</el-tag>
      </span>
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
      <el-table-column label="ID" prop="id" sortable="order" align="center" width="150px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则名称" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模块 / 控制器 / 方法" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="150px">
        <template slot-scope="{row}">
          <el-tag :type="row.status_t | statusFilter">
            {{ row.status_t===1?'启用':'未启用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status_t!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index,row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="上级规则" prop="pid">
          <el-select v-model="temp.pid" class="filter-item" placeholder="请选择上级项">
            <el-option v-for="(item,index) in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="规则" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="状态" prop="status_t">
          <el-select v-model="temp.status_t" class="filter-item" placeholder="请设置状态">
            <el-option v-for="(item,i) in statusOptions" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
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
import { fetchList, createRule, updateRule, delRule } from '@/api/auth_rules'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 0, display_name: '顶级分类' }
]

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [{ 'key': 1, 'name': '启用' }, { 'key': 0, 'name': '不启用' }],
      showReviewer: false,
      temp: {
        id: undefined,
        pid: '',
        name: '',
        title: '',
        type: '',
        status_t: ''
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
        pid: [{ required: true, message: '请选择上级规则', trigger: 'change' }],
        status_t: [{ required: true, message: '请选择状态', trigger: 'change' }],
        name: [{ required: true, message: '规则不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    console.log(1111)
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.code == 9000) {
          this.$router.push({ name: 'Page401' })
        } else {
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
      row.status_t = status_t
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
        id: undefined,
        pid: '',
        name: '',
        title: '',
        type: '1',
        status_t: ''
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
          this.listLoading = true
          // 向后台发送请求
          createRule(this.temp).then(response => {
            const code = response.code
            const msg = response.msg
            const id = response.id

            if (code == 200) {
              this.temp.id = id
              this.temp.status_t = 1
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '通知',
                message: '创建成功！',
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
          updateRule(tempData).then((response) => {
            const code = response.code
            const msg = response.msg
            if (code == 200) {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '通知',
                message: '更新成功！',
                type: 'success',
                duration: 5000
              })
            } else {
              this.$notify({
                title: '通知',
                message: '更新失败！',
                type: 'error',
                duration: 5000
              })
            }
          })
        }
      })
    },
    handleDelete(row, index, id) {
      this.$confirm('如果您不是技术人员，请不要动这里的数据，容易造成系统故障！您确定要删除此项?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        delRule(id).then(response => {
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
      // this.$notify({
      //   title: 'Success',
      //   message: 'Delete Successfully',
      //   type: 'success',
      //   duration: 2000
      // })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'title', 'name', 'status_t']
        const filterVal = ['id', 'title', 'name', 'status_t']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
