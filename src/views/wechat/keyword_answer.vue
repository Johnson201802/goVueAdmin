<template>
  <div class="components-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 100%;margin: 30px 0;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="关注回复" prop="keywords_submite">
              <el-input  type="textarea" rows="30" v-model="temp.keywords_submite"  style="line-height: normal;max-width: 270px;min-height: 500px;"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="无效关键词回复" prop="keywords_noeffict">
              <el-input type="textarea" rows="30" v-model="temp.keywords_noeffict"  style="line-height: normal;max-width: 270px;min-height: 500px;"></el-input>
            </el-form-item>
            </el-col>
        </el-row>
      </el-form>
     <el-form  style="width: 100%;">
     <el-form-item  style="text-align: center;">
        <el-button type="primary"  @click="saveConfig">
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
import { Message } from 'element-ui'
import { getEventAnswer, saveEventAnswer } from '@/api/wechat'

export default {
  data() {
    return {
      temp:{
        keywords_submite:'',
        keywords_noeffict:'',
      },
      data:[],
      rules: {
        keywords_submite: [{ required: true, message: '不能为空', trigger: 'blur' }],
        keywords_noeffict: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    getConfig(){
      console.log(this.temp)
      getEventAnswer().then((response=>{
        if(response.code == 200){
          this.temp = response.data
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
    saveConfig() {
      saveEventAnswer(this.temp).then((response=>{
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
