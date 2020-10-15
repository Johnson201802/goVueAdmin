<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加 / Add
      </el-button>
      <span class="permission-alert" style="margin-left: 50px;">
        <el-tag class="permission-tag" size="medium">注意：此模块可以对系统管理人员进行管理，包括：添加，删除，修改，授权,谨慎操作！</el-tag>
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
      <el-table-column label="账号" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已有权限" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="150px">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status===1?'启用':'未启用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index,row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户组名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="用户组描述">
          <el-input
            v-model="temp.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="用户组描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请设置状态">
            <el-option v-for="(item,i) in statusOptions" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            :checked-keys="CheckedKeys"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
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
import { fetchList, getRoutes, addRole, updateRole, deleteRole, getOneRole } from '@/api/role'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const defaultRole = {
  title: '',
  name: '',
  status: '',
  routes: ''
}

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
      routes: [],
      total: 0,
      CheckedKeys: null,
      defaultCheckedKeys: null,
      role: Object.assign({}, defaultRole),
      checkStrictly: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      // calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [{ 'key': 1, 'name': '启用' }, { 'key': 0, 'name': '不启用' }],
      temp: {
        id: undefined,
        title: '',
        name: '',
        status: '',
        routes: [],
        description: ''
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
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        name: [{ required: true, message: '方法路径不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '用户组名称不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getList()
    this.getRoutes()
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
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      console.log(res)
      this.routes = this.generateRoutes(res.data)
      console.log(this.routes)
    },
    // getRoute(){
    //   this.routes = this.generateRoutes([{'component':'45678','hidden':true,'path':'/login'},{'component':'564325','hidden':true,'path':'/l4ogin'}])
    //   console.log(this.routes);
    // },
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
        id: undefined,
        title: '',
        name: '',
        status: '',
        routes: '',
        description: ''
      }
      this.defaultCheckedKeys = []
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.checkStrictly = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.tree.setCheckedKeys([])
      })
    },
    createData() {
      const that = this
      that.$refs['dataForm'].validate((valid) => {
        if (valid) {
          that.listLoading = true
          //
          const checkedKeys = that.$refs.tree.getCheckedKeys()
          let str = ''
          checkedKeys.forEach(function(item, index) {
            str += item + ','
          })
          that.temp.routes = str
          // 向后台发送请求
          addRole(that.temp).then(response => {
            const code = response.code
            const msg = response.msg
            const id = response.id

            if (code == 200) {
              that.temp.id = id
              that.temp.status = 1
              that.getList()
              that.dialogFormVisible = false
              that.$notify({
                title: '通知',
                message: '创建成功！',
                type: 'success',
                duration: 5000
              })
            } else {
              that.dialogFormVisible = false
              that.$notify({
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
    async handleUpdate(row) {
      this.temp = Object.assign({}, row)
      const that = this
      await getOneRole(that.temp).then((response) => {
        const code = response.code
        const msg = response.msg
        const data = response.data
        if (code == 200) {
          that.dialogStatus = 'update'
          that.dialogFormVisible = true
          that.$nextTick(() => {
            that.$refs['dataForm'].clearValidate()
            that.$refs.tree.setCheckedKeys(data)
          })
        } else {
          console.log(response.msg)
        }
      })
      // this.temp = Object.assign({}, row) // copy obj
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const checkedKeys = this.$refs.tree.getCheckedKeys()
          let str = ''
          checkedKeys.forEach(function(item, index) {
            const length = checkedKeys.length - 1
            if (length == index) {
              str += item
            } else {
              str += item + ','
            }
          })
          this.temp.routes = str
          const tempData = Object.assign({}, this.temp)
          updateRole(tempData).then((response) => {
            const code = response.code
            const msg = response.msg
            if (code == 200) {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.dialogFormVisible = false
              this.getList()
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
        deleteRole(id).then(response => {
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
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (const route of routes) {
        // skip some route
        if (route.hidden) { continue }

        // const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        // if (route.children && onlyOneShowingChild && !route.alwaysShow) {
        //   route = onlyOneShowingChild
        // }

        const data = {
          title: route.title,
          id: route.id

        }

        // recursive child routes
        // if (route.children) {
        //   data.children = this.generateRoutes(route.children, data.path)
        // }
        res.push(data)
      }
      return res
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
 .permission-tree {
    margin-bottom: 10px;
  }
</style>
