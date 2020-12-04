<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加 / Add
      </el-button>
      <span class="permission-alert" style="margin-left: 50px;">
        <el-tag class="permission-tag" size="medium">注意：此模块可以对系统管理人员进行管理，包括：添加，删除，修改，授权时请谨慎操作！</el-tag>
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
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Admin_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" max-width="150px" align="center">
        <template slot-scope="{row}">
          <a :href="row.Avatar" target="_blank"><img :src="row.Avatar" class="user-avatar"></a>
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Title=='undefined'?'刷新获取':row.Title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近登陆IP" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Admin_login_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近登陆时间" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Login_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="150px">
        <template slot-scope="{row}">
          <el-tag :type="row.Status | statusFilter">
            {{ row.Status===1?'启用':'未启用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.Status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index,row.Id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="所属用户组" prop="group_id">
          <el-select v-model="temp.Group_id" class="filter-item" placeholder="请选择所属用户组">
            <el-option v-for="(item,index) in group" :key="item.Id" :label="item.Title" :value="item.Id" />
          </el-select>
        </el-form-item>
        <el-form-item label="管理员账号" prop="admin_name">
          <el-input v-model="temp.Admin_name" />
        </el-form-item>
        <el-form-item label="管理员密码" prop="pwd_t">
          <el-input v-model="temp.Admin_pwd" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.Status" class="filter-item" placeholder="请设置状态">
            <el-option v-for="(item,i) in statusOptions" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="账户备注" prop="introduction">
          <el-input v-model="temp.Introduction" />
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
import { fetchList, createAdmin, updateAdmin, delAdmin, groupList } from '@/api/admin'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
      group: [],
      // calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [{ 'key': 1, 'name': '启用' }, { 'key': 0, 'name': '不启用' }],
      showReviewer: false,
      temp: {
        Id: undefined,
        Group_id: '',
        Admin_name: '',
        Admin_pwd: '',
        Pwd_t: '',
        Introduction: '',
        Status: ''
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
        Group_id: [{ required: true, message: '请选择所属用户组', trigger: 'change' }],
        Status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        Admin_name: [{ required: true, message: '管理员账号不能为空', trigger: 'blur' }],
        Title: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.groupList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.code == 9000) {
          this.$router.push({ name: 'Page401' })
        } else {
          this.list = response.data
          this.total = response.total
        }

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    groupList() {
      groupList().then(response => {
        const code = response.code
        const msg = response.msg
        const data = response.data
        if (code == 200) {
          this.group = data
        } else {
          console.log(msg)
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
        Id: undefined,
        Group_id: '',
        Avatar: 'http://pic1.win4000.com/tj/2017-12-07/5a28ba185fe96.jpg',
        Admin_name: '',
        Admin_pwd: '',
        Introduction: '',
        Status: ''
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
          createAdmin(this.temp).then(response => {
            const code = response.code
            const msg = response.msg
            const id = response.id

            if (code == 200) {
              this.temp.id = id
              this.temp.status = 1
              this.getList()
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
          updateAdmin(tempData).then((response) => {
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
      this.$confirm('您确定要删除此项?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        delAdmin(id).then(response => {
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'title', 'name', 'status']
        const filterVal = ['id', 'title', 'name', 'status']
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
<style>
  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
</style>
