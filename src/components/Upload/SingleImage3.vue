<template>
  <div class="upload-container">
    <el-upload
      :data="dataObj"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      class="image-uploader"
      drag
      action="https://api.piduopi.com/imgUploads"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        <em>点击上传缩略图</em>
      </div>
    </el-upload>
    <div class="image-preview" v-for="(item,index) in getList" :key="index">
      <div class="image-preview-wrapper">
        <img :src="item">
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage(index)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/api/qiniu'

export default {
  name: 'SingleImageUpload3',
  props: {
    value: {
      type: String,
      default:''
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { token: '', key: '' },
      list:[],
      str_list:''
    }
  },
  computed: {
    getList(){
      if(this.value!=''){
        // this.list = this.value.split(',');
        return this.value.split(',');
      }
    }
  },
  methods: {
    rmImage(index) {
      this.list.splice(index,1)
      let b = this.list.join(",");
      this.str_list = b
      this.$emit('input', b)
    },
    emitInput(val) {
      this.list.push(val)
      let b = this.list.join(",");
      this.str_list = b
      this.$emit('input', b)
    },
    handleImageSuccess(response, file, filelist) {
      this.emitInput(response.qrcode)
    },
    beforeUpload() {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken().then(response => {
          const key = response.data.qiniu_key
          const token = response.data.qiniu_token
          _self._data.dataObj.token = token
          _self._data.dataObj.key = key
          this.tempUrl = response.data.qiniu_url
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.upload-container {
  width: 100%;
  border:1px dashed #d9d9d9;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  @include clearfix;
  .image-uploader {
    width: 200px;
    height: 200px;
    margin:20px;
    line-height:40px;
  }
  .image-preview {
    width: 200px;
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    border-radius: 5px;

    margin:20px;
    overflow: hidden;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      img {
        width: 80%;
        height: 80%;
        border-radius: 5px;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
  .image-app-preview {
    width: 320px;
    height: 180px;
    position: relative;
    border: 1px dashed #d9d9d9;
    .app-fake-conver {
      height: 44px;
      position: absolute;
      width: 100%; // background: rgba(0, 0, 0, .1);
      text-align: center;
      // line-height: 64px;
      color: #fff;
    }
  }
}
</style>
