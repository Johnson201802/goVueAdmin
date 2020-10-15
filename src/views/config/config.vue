<template>
  <div class="tab-container">
    <el-tag>管理此CMS系统所有的配置项，也可以在其它配置里添加字段供前端使用，在使用时，请弄清楚每项所对应的功能，再做修改！</el-tag>
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane  key="base" label="基础配置" name="base">
        <keep-alive>
          <el-form ref="dataForm" :rules="rules" :model="temp" v-if="activeName=='base'"  label-position="left" label-width="0px" style="width: 100%;margin: 30px 0;">
            <el-form-item prop="qrcode" style="max-width: 200px;">
              <span style="color: #909399;">小程序推广二维码&emsp;&emsp;</span>
              <el-upload
                list-type="none"
                action="https://yilixiangsi.magicxhx.com/admin/uploads/ads_img_uploads"
                accept="image/jpeg,image/jpg,image/gif,image/png"
                :limit="1"
                :on-error="uploadError"
                :on-success="uploadSuccess"
                >
                <div  style="max-width:400px;display: flex;justify-content:center;align-items: center;border:1px dashed #d9d9d9;font-size: large;" ><i v-show="!is_show" style='padding:50px' class="el-icon-plus" /><img :src="temp.qrcode" v-show="is_show"  class="user-avatar22"></div>
               </el-upload>
            </el-form-item>
            <el-form-item  prop="miniapp_id">
              <MDinput v-model="temp.miniapp_id" :maxlength="100" name="name" required>
                小程序APPID
              </MDinput>
            </el-form-item>
            <el-form-item  prop="miniapp_secrets">
              <MDinput v-model="temp.miniapp_secrets" :maxlength="100" name="name" required>
                小程序APPSECRETS
              </MDinput>
            </el-form-item>
            <el-form-item  prop="telphone">
              <MDinput v-model="temp.telphone" :maxlength="100" name="name" required>
                联系电话
              </MDinput>
            </el-form-item>
            <el-form-item  prop="tell_content">
              <MDinput v-model="temp.tell_content" :maxlength="100" name="name" required>
                公告
              </MDinput>
            </el-form-item>
            <el-form-item  style="text-align: center;">
               <el-button type="primary" size="mini"  @click="saveConfigBase()">
                 修改 / Comfirm
               </el-button>
               <el-button type="info" size="mini" @click="reset()">
                 取消 / Cancel
               </el-button>
             </el-form-item>
          </el-form>

        </keep-alive>
      </el-tab-pane>
      <el-tab-pane  key="msm" label="短信配置" name="msm">
        <keep-alive>
          <el-form ref="dataForm" :rules="rules" :model="temp2" v-if="activeName=='msm'"  label-position="left" label-width="0px" style="width: 100%;margin: 30px 0;">
            <el-form-item prop="sms_app_id">
              <MDinput v-model="temp2.sms_app_id" :maxlength="100" name="name" required>
                腾讯短信APPid
              </MDinput>
            </el-form-item>
            <el-form-item  prop="sms_app_key">
              <MDinput v-model="temp2.sms_app_key" :maxlength="100" name="name" required>
                腾讯短信APPkey
              </MDinput>
            </el-form-item>
            <el-form-item  prop="sms_sign">
              <MDinput v-model="temp2.sms_sign" :maxlength="100" name="name" required>
                腾讯短信SmsSign
              </MDinput>
            </el-form-item>
            <el-form-item  style="text-align: center;">
               <el-button type="primary" size="mini"  @click="saveConfigSms()">
                 修改 / Comfirm
               </el-button>
               <el-button type="info" size="mini" @click="reset()">
                 取消 / Cancel
               </el-button>
             </el-form-item>
          </el-form>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane  key="chant" label="微信商户号" name="chant">
        <keep-alive>
          <el-form ref="dataForm" :rules="rules" :model="temp3" v-if="activeName=='chant'"  label-position="left" label-width="0px" style="width: 100%;margin: 30px 0;">
            <el-form-item  prop="mch_appid">
              <MDinput v-model="temp3.mch_appid" :maxlength="100" name="name" required>
                商户号Mchid
              </MDinput>
            </el-form-item>
            <el-form-item  prop="mch_key">
              <MDinput v-model="temp3.mch_key" :maxlength="100" name="name" required>
                商户号Mchkey
              </MDinput>
            </el-form-item>
            <el-form-item  prop="url">
              <MDinput v-model="temp3.url" :maxlength="100" name="name" required>
                回调URL
              </MDinput>
            </el-form-item>
            <el-form-item  style="text-align: center;">
               <el-button type="primary" size="mini"  @click="saveConfigMch()">
                 修改 / Comfirm
               </el-button>
               <el-button type="info" size="mini" @click="reset()">
                 取消 / Cancel
               </el-button>
             </el-form-item>
          </el-form>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import { Message } from 'element-ui'
import { getBaseconfig ,saveConfigBase ,getMsmConfig ,saveConfigSms ,getMchConfig ,saveConfigMch } from '@/api/config'
export default {
  components: { MDinput },
  data() {
    return {
      is_show:false,
      tabMapOptions: [
        { label: '基础配置', key: 'base' },
        { label: '短信配置', key: 'msm' },
        { label: '微信商户号', key: 'chant' }
      ],
      temp: {
        miniapp_id:'',
        qrcode:'',
        telphone:'',
        miniapp_secrets:'',
        tell_content:''
      },
      temp2: {
        sms_app_id:'',
        sms_app_key:'',
        sms_sign:'',
      },
      temp3: {
        mch_appid:'',
        mch_key:'',
        url:'',
      },
      rules: {
        miniapp_id: [{ required: true, message: '不能为空', trigger: 'blur' }],
        qrcode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        telphone: [{ required: true, message: '不能为空', trigger: 'blur' }],
        miniapp_secrets: [{ required: true, message: '不能为空', trigger: 'blur' }],
        sms_app_id: [{ required: true, message: '不能为空', trigger: 'blur' }],
        sms_app_key: [{ required: true, message: '不能为空', trigger: 'blur' }],
        sms_sign: [{ required: true, message: '不能为空', trigger: 'blur' }],
        mch_appid: [{ required: true, message: '不能为空', trigger: 'blur' }],
        mch_key: [{ required: true, message: '不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '不能为空', trigger: 'blur' }],
        tell_content: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      activeName: 'base',
      createdTimes: 0
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    this.getBaseconfig()
    this.getMsmConfig()
    this.getMchConfig()
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    getBaseconfig() {
      let that = this
      getBaseconfig().then((response)=>{
        console.log(response.data)
        if(response.code == 9000){
          this.$router.push({ name: 'Page401'})
        }
        let aa = response.data
        aa.forEach(function(item,index){
          if(item.config_name_other == 'miniapp_id'){that.temp.miniapp_id = item.config_value}
          if(item.config_name_other == 'qrcode'){
            that.temp.qrcode = item.config_value
            that.is_show = true
            }
          if(item.config_name_other == 'telphone'){that.temp.telphone = item.config_value}
          if(item.config_name_other == 'miniapp_secrets'){that.temp.miniapp_secrets = item.config_value}
          if(item.config_name_other == 'tell_content'){that.temp.tell_content = item.config_value}
        })
      })
    },
    getMsmConfig() {
      let that = this
      getMsmConfig().then((response)=>{
        if(response.code == 9000){
          this.$router.push({ name: 'Page401'})
        }
        let aa = response.data
        aa.forEach(function(item,index){
          if(item.config_name_other == 'sms_app_id'){that.temp2.sms_app_id = item.config_value}
          if(item.config_name_other == 'sms_app_key'){that.temp2.sms_app_key = item.config_value}
          if(item.config_name_other == 'sms_sign'){that.temp2.sms_sign = item.config_value}
        })
      })
    },
    getMchConfig() {
      let that = this
      getMchConfig().then((response)=>{
        if(response.code == 9000){
          this.$router.push({ name: 'Page401'})
        }
        let aa = response.data
        aa.forEach(function(item,index){
          if(item.config_name_other == 'mch_appid'){that.temp3.mch_appid = item.config_value}
          if(item.config_name_other == 'mch_key'){that.temp3.mch_key = item.config_value}
          if(item.config_name_other == 'url'){that.temp3.url = item.config_value}
        })
      })
    },
    saveConfigBase(){
      saveConfigBase(this.temp).then((response)=>{
        if(response.code==200){
          Message({
            title: 'Notice',
            message: '修改成功！',
            type: 'success',
            duration: 5000
          })
        }else{
          Message({
            title: 'Notice',
            message: '错误：'+response.msg,
            type: 'error',
            duration: 5000
          })
        }
      })
    },
    saveConfigSms(){
      saveConfigSms(this.temp2).then((response)=>{
        if(response.code==200){
          Message({
            title: 'Notice',
            message: '修改成功！',
            type: 'success',
            duration: 5000
          })
        }else{
          Message({
            title: 'Notice',
            message: '错误：'+response.msg,
            type: 'error',
            duration: 5000
          })
        }
      })
    },
    saveConfigMch(){
      saveConfigMch(this.temp3).then((response)=>{
        if(response.code==200){
          Message({
            title: 'Notice',
            message: '修改成功！',
            type: 'success',
            duration: 5000
          })
        }else{
          Message({
            title: 'Notice',
            message: '错误：'+response.msg,
            type: 'error',
            duration: 5000
          })
        }
      })
    },
    uploadError(){
      Message({
        title: 'Notice',
        message: '网络错误！请重试...',
        type: 'error',
        duration: 2000
      })
    },
    uploadSuccess(response,file,filelist){
      if(response.code == 200){
        this.temp.qrcode = response.photo
        this.is_show = true
        Message({
          title: '提示',
          message: '已上传',
          type: 'success',
          duration: 2000
        })
      }
    }
  },
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .user-avatar22 {
    cursor: pointer;
    max-width: 150px;
    border-radius: 5px;
    margin:0 0;
  }
</style>
