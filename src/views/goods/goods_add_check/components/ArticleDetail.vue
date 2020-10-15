<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <Warning />
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 40px;">
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="goods_name">
              <MDinput v-model="postForm.goods_name" :maxlength="100" name="goods_name" required>
                商品标题（必填）
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item  style="margin-bottom: 40px;" prop="thumb">
          <el-col :span="24">
            <Upload v-model="postForm.thumb" :value="postForm.thumb"/>
          </el-col>
        </el-form-item>
          <el-row style="padding:20px 20px;border-radius: 5px;border: 1px dashed #d9d9d9;">
            <el-col :span="10" style="display: flex;flex-direction: column;margin-left: 40px;">
              <el-form-item prop="goods_price" style="margin-bottom: 40px;padding:20px 20px;border-radius: 5px;">
                <MDinput v-model="postForm.goods_price" :maxlength="100" name="goods_price" required>
                  商品价格（必填）
                </MDinput>
              </el-form-item>
              <el-form-item prop="goods_account" style="margin-bottom: 40px;padding:20px 20px;border-radius: 5px;">
                <MDinput v-model="postForm.goods_account" :maxlength="100" name="goods_account" required>
                  商品库存（必填）
                </MDinput>
              </el-form-item>
              <el-form-item prop="order" style="margin-bottom: 40px;padding:20px 20px;border-radius: 5px;">
                <MDinput v-model="postForm.order" :maxlength="100" name="order" required>
                  排序，数值越大越靠前，默认0
                </MDinput>
                </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item prop="goods_desc" style="margin-bottom: 40px;padding:20px 20px;border-radius: 5px;">
                <Tinymce ref="editor"  v-model="postForm.goods_desc" :height="667" :width="800" />
              </el-form-item>
            </el-col>
          </el-row>
      </div>
      <el-row style="padding: 10vh;">
        <el-col :span="24" style="display: flex;justify-content: center;align-items: center;">
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
import { fetchOneGoods, updateGoods} from '@/api/goods'
import { searchUser } from '@/api/remote-search'
import { createGoods } from '@/api/goods'
import Warning from './Warning'
import { Message } from 'element-ui'
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  goods_name: '', // 商品标题
  goods_price: '', // 商品价格
  thumb: '', // 商品缩略图
  goods_account: '', // 库存
  goods_desc: '', // 商品详情
  is_sale: '', // 是否上架
  order: '', // 排序
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
      options: [],
      cates: [],
      label: ['1','2'],
      rules: {
        goods_name: [{ required: true, message: '请填写商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请填写商品价格', trigger: 'blur' }],
        thumb: [{ required: true, message: '请上传缩略图', trigger: 'change' }],
        goods_account: [{ required: true, message: '请填写库存', trigger: 'blur' }],
        goods_desc: [{ required: true, message: '请填写商品详情', trigger: 'blur' }],
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
      fetchOneGoods(id).then(response => {
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
          createGoods(this.postForm).then((response)=>{
           if(response.code == 200){
             this.$notify({
               title: '提示',
               message: '商品创建成功',
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
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          updateGoods(this.postForm).then((response)=>{
            console.log(response)
            if(response.code == 200){
              this.$notify({
                title: '提示',
                message: '更新商品成功',
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
