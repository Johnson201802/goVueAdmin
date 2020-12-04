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
            <el-form-item style="margin-bottom: 40px;" prop="Merchant_name">
              <MDinput v-model="postForm.Name" :maxlength="100" name="Merchant_name" required>
                商户名称（必填）
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 40px;">
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="Merchant_name">
              <MDinput v-model="postForm.Mobile" :maxlength="100" name="Merchant_name" required>
                商户手机（必填）
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item  style="margin-bottom: 40px;" prop="thumb">
          <el-col :span="11" style="margin-right: 20px;">
            <Upload v-model="postForm.Img1" :value="postForm.Img1"/>
          </el-col>
          <el-col :span="11">
            <Upload v-model="postForm.Img2" :value="postForm.Img2"/>
          </el-col>
        </el-form-item>
          <el-row style="padding:20px 20px;border-radius: 5px;border: 1px dashed #d9d9d9;margin-bottom: 40px;">
            <el-col :span="8">
              <el-form-item prop="Merchant_desc" style="margin-bottom: 40px;padding:20px 20px;border-radius: 5px;">
                <MDinput v-model="postForm.Longitude" :maxlength="100" name="Merchant_name" required>
                  经度（地图选择）
                </MDinput>
              </el-form-item>
             </el-col>
             <el-col :span="8">
              <el-form-item prop="Merchant_desc" style="margin-bottom: 40px;padding:20px 20px;border-radius: 5px;">
                <MDinput v-model="postForm.Latitude" :maxlength="100" name="Merchant_name" required>
                  纬度（地图选择）
                </MDinput>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item prop="Merchant_desc" style="margin-bottom: 40px;padding:20px 20px;border-radius: 5px;">
                <MDinput v-model="postForm.Address" :maxlength="100" name="Merchant_name" required>
                  地址（地图选择）
                </MDinput>
              </el-form-item>
              </el-col>
          </el-row>
          <el-row style="padding:20px 20px;border-radius: 5px;border: 1px dashed #d9d9d9;">
            <el-form-item style="margin-bottom: 40px;" prop="Merchant_name">
              <el-form-item prop="Merchant_desc" style="margin-bottom: 40px;padding:20px 20px;border-radius: 5px;">
                <iframe id="mapPage" width="100%" height="800px" frameborder=0 :src="getSrc"></iframe>
              </el-form-item>
            </el-form-item>
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
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchOneMerchant, updateMerchant} from '@/api/merchant'
import { searchUser } from '@/api/remote-search'
import { createMerchant } from '@/api/merchant'
import Warning from './Warning'
import { Message } from 'element-ui'
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

export default {
  name: 'ArticleDetail',
  components: { ElDragSelect , MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
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
      postForm: {
                  Name: '', // 商品标题
                  Mobile: undefined, // 手机号
                  Img1: '', // 门头缩略图
                  Img2: '', // 内部缩略图
                  Longitude: undefined, // 经度
                  Latitude: undefined, // 纬度
                  Address: '' // 地址,
                  },
      loading: false,
      userListOptions: [],
      options: [],
      cates: [],
      label: ['1','2'],
      rules: {
        Name: [{ required: true, message: '请填写商户名称', trigger: 'blur' }],
        Mobile: [{ required: true, message: '请填写商户手机', trigger: 'blur' }],
        Img1: [{ required: true, message: '请上传门头照', trigger: 'change' }],
        Img2: [{ required: true, message: '请上传内部照', trigger: 'blur' }],
        Longitude: [{ required: true, message: '请选择商户地址', trigger: 'blur' }],
        Latitude: [{ required: true, message: '请选择商户地址', trigger: 'blur' }],
        Address: [{ required: true, message: '请选择商户地址', trigger: 'blur' }],
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
    },
    getSrc() {
                var baseUrl = 'https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=GHYBZ-A466U-EJ3VU-2OH33-YZ3ZK-BFFYY&referer=piduopiweb'
                if (this.lat && this.lng) {
                    baseUrl += `&coord=${this.lat},${this.lng}`
                }
                return baseUrl
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
  mounted() {
      var self = this
      window.addEventListener('message', function(event) {
          // 对于无法识别的地址，直接返回无法选择
          var loc = event.data
          console.log(loc)
          self.postForm.Latitude = loc.latlng.lat
          self.postForm.Longitude = loc.latlng.lng
          self.postForm.Address = loc.poiaddress
          // if (loc.poiname === '我的位置' || loc.poiaddress === '') {
          //     self.$toast('无法识别该地址，请移动地图重新选择')
          //     return false
          // }
          // if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
          //     self.$emit('callback', loc)
          // }
      }, false)
  },
  methods: {
    fetchData(id) {
      fetchOneMerchant(id).then(response => {
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
      // this.loading = true
      this.$refs.postForm.validate(valid => {
        if (valid) {
          Number(this.postForm.Mobile)
          Number(this.postForm.Latitude)
          Number(this.postForm.Longitude)
          createMerchant(this.postForm).then((response)=>{
           if(response.code == 200){
             this.$notify({
               title: '提示',
               message: '商户创建成功',
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
          updateMerchant(this.postForm).then((response)=>{
            if(response.code == 200){
              this.$notify({
                title: '提示',
                message: '更新商户成功!',
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
