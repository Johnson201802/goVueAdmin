<template>
  <div class="upload-container">
    <span style="cursor: pointer;line-height: 30px;font-size: 12px;padding:5px;color: #595959;border: 1px solid #d9d9d9;" @click=" dialogVisible=true">
      <i class="icon el-icon-upload" />
      上传图片
    </span>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="http://test.yiwanqingtang.com/admin/uploads/ads_img_uploads"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
      <el-button :loading="loading" @click="dialogVisible = false">
        取消 / Cancel
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确定 / Confirm
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#d9d9d9'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      loading: false
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      console.log(response)
      if (response.code == 200) {
        const uid = response.photo
        const objKeyArr = Object.keys(this.listObj)
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid != '') {
            this.listObj[objKeyArr[i]].uid = response.photo
            this.listObj[objKeyArr[i]].url = response.photo
            this.listObj[objKeyArr[i]].hasSuccess = true
          } else {
            console.log(response)
          }
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      console.log(fileName)
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
