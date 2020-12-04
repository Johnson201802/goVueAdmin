<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="11">
            <Warning />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.Title" :maxlength="100" name="name" required>
                文章标题
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <el-col :span="11">
          <Tinymce ref="editor"  v-model="postForm.Content" :height="500" :width="800"/>
          </el-col>
        </el-form-item>
      </div>
      <el-row>
        <el-col :span="11" style="text-align: center;margin-bottom: 4vh;">
          <el-button :loading = "loading" type="primary" @click="isEdit?submitFormEdit():submitFormAdd()">确定 / Comfirm</el-button>
          <el-button type="info" @click="cancel">重置 / Reset</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchOneArticle,createArticle, updateArticle} from '@/api/article'
import { searchUser } from '@/api/remote-search'
import Warning from './Warning'
import { Message } from 'element-ui'
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  article_id:undefined, // 文章ID
  title: '', // 文章题目
  content: '', // 文章内容
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce , ElDragSelect , MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      status: [{'name':'发布','value':'1'},{'name':'不发布','value':'0'}],
      options: [],
      cates: [],
      label: ['1','2'],
      rules: {
        Title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        Content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    this.initCateLabel()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchOneArticle(id).then(response => {
        this.postForm = response.data

        // just for test
        // this.postForm.title += `   Article Id:${this.postForm.id}`
        // this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // // set tagsview title
        // this.setTagsViewTitle()

        // // set page title
        // this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    initCateLabel(){
      // getArticleCateLabelList().then((response)=>{
      //   if(response.code==200){
      //     this.options = response.label
      //     this.cates = response.cates
      //   }else{
      //     Message({
      //       title: 'Notice',
      //       message: '网络错误，请稍后再试..',
      //       type: 'error',
      //       duration: 2000
      //     })
      //   }
      // })
    },
    // setTagsViewTitle() {
    //   const title = 'Edit Article'
    //   const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
    //   this.$store.dispatch('tagsView/updateVisitedView', route)
    // },
    // setPageTitle() {
    //   const title = 'Edit Article'
    //   document.title = `${title} - ${this.postForm.id}`
    // },
    cancel(){
      this.postForm = Object.assign({}, defaultForm)
      Message({
        title: 'Notice',
        message: '重置成功..',
        type: 'success',
        duration: 2000
      })
    },
    submitFormAdd() {
      this.loading = true
      this.$refs.postForm.validate(valid => {
        if (valid) {
          createArticle(this.postForm).then((response)=>{
           if(response.code == 200){
             this.$notify({
               title: '提示',
               message: '发布文章成功',
               type: 'success',
               duration: 5000
             })
           }else{
             this.$notify({
               title: '提示',
               message: '网络请求失败',
               type: 'error',
               duration: 5000
             })
           }
           this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitFormEdit(){
      this.loading = true
      this.$refs.postForm.validate(valid => {
        if (valid) {
          updateArticle(this.postForm).then((response)=>{
            console.log(response)
            if(response.code == 200){
              this.$notify({
                title: '提示',
                message: '更新文章成功',
                type: 'success',
                duration: 5000
              })
              this.loading = false
            }else{
              this.$notify({
                title: '提示',
                message: '网络请求失败',
                type: 'error',
                duration: 5000
              })
            }
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
