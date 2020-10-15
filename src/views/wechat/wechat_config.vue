<template>
  <div class="components-container">
    <aside style="margin: 30px 0">微信公众配置，请正确配置填写，如果您不是技术运维人员，请勿改动其配置项，
    该模块的所有参数仅限技术运维人员使用，不建议管理员使用，极易出错！
    </aside>
    <el-form ref="dataForm" :rules="rules"  label-position="left" label-width="150px" style="width: 100%;margin: 30px 0;display: flex;">
      <el-form-item label="公众号二维码" prop="qrcode" style="width: 30%;">
        <el-upload
          list-type="none"
          action="https://yilixiangsi.magicxhx.com/admin/uploads/ads_img_uploads"
          accept="image/jpeg,image/jpg,image/gif,image/png"
          :limit="1"
          :on-error="uploadError"
          :on-success="uploadSuccess1"
          >
          <div  style="max-width:400px;display: flex;justify-content:center;align-items: center;border:1px dashed #d9d9d9;font-size: large;" ><i v-show="!is_show1" style='padding:50px' class="el-icon-plus" /><img :src="temp.qrcode" v-show="is_show1"  class="user-avatar22"></div>
         </el-upload>
        <!-- <div @click="chooseImg" style="max-width:400px;display: flex;justify-content:center;align-items: center;border:1px dashed #d9d9d9;font-size: large;" ><i v-show="!is_show" style='padding:100px' class="el-icon-plus" /><img :src="temp.image_url" v-show="is_show"  class="user-avatar22"></div> -->
      </el-form-item>
      <el-form-item label="分享图片地址" prop="share_img" style="width: 30%;">
        <el-upload
          list-type="none"
          action="https://yilixiangsi.magicxhx.com/admin/uploads/ads_img_uploads"
          accept="image/jpeg,image/jpg,image/gif,image/png"
          :limit="1"
          :on-error="uploadError"
          :on-success="uploadSuccess2"
          >
          <div  style="max-width:400px;display: flex;justify-content:center;align-items: center;border:1px dashed #d9d9d9;font-size: large;" ><i v-show="!is_show2" style='padding:50px' class="el-icon-plus" /><img :src="temp.share_img" v-show="is_show2"  class="user-avatar22"></div>
         </el-upload>
        <!-- <div @click="chooseImg" style="max-width:400px;display: flex;justify-content:center;align-items: center;border:1px dashed #d9d9d9;font-size: large;" ><i v-show="!is_show" style='padding:100px' class="el-icon-plus" /><img :src="temp.image_url" v-show="is_show"  class="user-avatar22"></div> -->
      </el-form-item>
      <el-form-item label="公众号logo" prop="logo" style="width: 30%;">
        <el-upload
          list-type="none"
          action="https://yilixiangsi.magicxhx.com/admin/uploads/ads_img_uploads"
          accept="image/jpeg,image/jpg,image/gif,image/png"
          :limit="1"
          :on-error="uploadError"
          :on-success="uploadSuccess3"
          >
          <div  style="max-width:400px;display: flex;justify-content:center;align-items: center;border:1px dashed #d9d9d9;font-size: large;" ><i v-show="!is_show3" style='padding:50px' class="el-icon-plus" /><img :src="temp.logo" v-show="is_show3"  class="user-avatar22"></div>
         </el-upload>
        <!-- <div @click="chooseImg" style="max-width:400px;display: flex;justify-content:center;align-items: center;border:1px dashed #d9d9d9;font-size: large;" ><i v-show="!is_show" style='padding:100px' class="el-icon-plus" /><img :src="temp.image_url" v-show="is_show"  class="user-avatar22"></div> -->
      </el-form-item>
     </el-form>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="0px" style="width: 100%;margin: 30px 0;">
        <el-form-item prop="server_address">
          <MDinput v-model="temp.server_address" :maxlength="100" name="name" required>
            公众号接口地址
          </MDinput>
        </el-form-item>
        <el-form-item  prop="appid">
          <MDinput v-model="temp.appid" :maxlength="100" name="name" required>
            APPID
          </MDinput>
        </el-form-item>
        <el-form-item  prop="appsecret">
          <MDinput v-model="temp.appsecret" :maxlength="100" name="name" required>
            AppSecret
          </MDinput>
        </el-form-item>
        <el-form-item prop="token">
          <MDinput v-model="temp.token" :maxlength="100" name="name" required>
            微信验证TOKEN
          </MDinput>
        </el-form-item>
        <el-form-item prop="encryption_way">
          <MDinput v-model="temp.encryption_way" :maxlength="100" name="name" required>
            加密方式
          </MDinput>
        </el-form-item>
        <el-form-item  prop="encodingaeskey">
          <MDinput v-model="temp.encodingaeskey" :maxlength="100" name="name" required>
            encodingAESKey
          </MDinput>
        </el-form-item>
        <el-form-item  prop="share_title">
          <MDinput v-model="temp.share_title" :maxlength="100" name="name" required>
            分享标题
          </MDinput>
        </el-form-item>
        <el-form-item prop="share_desc">
          <MDinput v-model="temp.share_desc" :maxlength="100" name="name" required>
            分享描述
          </MDinput>
        </el-form-item>
      </el-form>

     <el-form  style="width: 100%;">
     <el-form-item  style="text-align: center;">
        <el-button type="primary"  @click="saveConfig()">
          修改 / Comfirm
        </el-button>
        <el-button type="info"  @click="reset()">
          取消 / Cancel
        </el-button>
      </el-form-item>
     </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import { Message } from 'element-ui'
import { fetchWechatConfig, saveConfig } from '@/api/wechat'

export default {
  components: { MDinput },
  data() {
    return {
      is_show1:false,
      is_show2:false,
      is_show3:false,
      temp:{
        server_address:'',
        appid:'',
        appsecret:'',
        token:'',
        encryption_way:'',
        encodingaeskey:'',
        qrcode:'',
        share_img:'',
        logo:''
      },
      rules: {
        server_address: [{ required: true, message: '不能为空', trigger: 'blur' }],
        appid: [{ required: true, message: '不能为空', trigger: 'blur' }],
        appsecret: [{ required: true, message: '不能为空', trigger: 'blur' }],
        token: [{ required: true, message: '不能为空', trigger: 'blur' }],
        encryption_way: [{ required: true, message: '不能为空', trigger: 'blur' }],
        encodingaeskey: [{ required: true, message: '不能为空', trigger: 'blur' }],
        qrcode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        share_img: [{ required: true, message: '不能为空', trigger: 'blur' }],
        logo: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig(){
      fetchWechatConfig().then((response=>{
        if(response.code == 200){
          this.temp = response.data
          if(this.temp.qrcode != ''){
            this.is_show1 = true
          }
          if(this.temp.share_img != ''){
            this.is_show2 = true
          }
          if(this.temp.logo != ''){
            this.is_show3 = true
          }
        }else{
          Message({
            title: 'Notice',
            message: '网络错误！请重试...',
            type: 'error',
            duration: 2000
          })
        }
      }))
    },
    uploadError(){
      Message({
        title: 'Notice',
        message: '网络错误！请重试...',
        type: 'error',
        duration: 2000
      })
    },
    uploadSuccess1(response,file,filelist){
      if(response.code == 200){
        this.temp.qrcode = response.photo
        this.is_show1 = true
        Message({
          title: '提示',
          message: '已上传',
          type: 'success',
          duration: 2000
        })
      }
    },
    uploadSuccess2(response,file,filelist){
      if(response.code == 200){
        this.temp.share_img = response.photo
        this.is_show2 = true
        Message({
          title: '提示',
          message: '已上传',
          type: 'success',
          duration: 2000
        })
      }
    },
    uploadSuccess3(response,file,filelist){
      if(response.code == 200){
        this.temp.logo = response.photo
        this.is_show3 = true
        Message({
          title: '提示',
          message: '已上传',
          type: 'success',
          duration: 2000
        })
      }
    },
    saveConfig() {
      saveConfig(this.temp).then((response=>{
        if(response.code==200){
          Message({
            title: '提示',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        }else{
          Message({
            title: '提示',
            message: '修改失败',
            type: 'error',
            duration: 2000
          })
        }
      }))
    },
    reset() {
      this.getConfig()
    }
  }
}
</script>

<style scoped>
  .user-avatar22{
    max-width: 150px;
  }
</style>
