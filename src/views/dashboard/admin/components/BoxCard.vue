<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div style="position:relative;">
      <mallki class-name="mallki-text" text="服务器负载信息" />
      <div style="padding-top:50px;" class="progress-item">
        <span>CPU使用率</span>
        <el-progress :percentage="cpu.percentage" />
      </div>
      <div class="progress-item">
        <span>内存使用率</span>
        <el-progress :percentage="mem.percentage" />
      </div>
      <div class="progress-item">
        <span>硬盘使用率</span>
        <el-progress :percentage="disk.percentage" />
      </div>
      <div class="progress-item">
        <span>整体负载率</span>
        <el-progress :percentage="balance.percentage" />
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { serve_info } from '@/api/common'
import PanThumb from '@/components/PanThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'

export default {
  components: { PanThumb, Mallki },

  data() {
    return {
      timer: null,
      cpu: { percentage: 0, 'status1': 'success' },
      mem: { percentage: 0, 'status2': 'success' },
      disk: { percentage: 0, 'status3': 'exception' },
      balance: { percentage: 0, 'status4': 'exception' }
    }
  },
  created() {
    this.serve_info()
    this.timer = setInterval(() => {
      this.serve_info()
    }, 20000) // 5s
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    serve_info() {
      serve_info().then((response) => {
        this.cpu.percentage = response.cpu
        this.cpu.status = response.status1

        this.mem.percentage = response.mem
        this.mem.status = response.status2

        this.disk.percentage = response.disk
        this.disk.status = response.status3

        this.balance.percentage = response.balance
        this.balance.status = response.status4
      })
    }
  }
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    left: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    /deep/ .pan-info {
      box-shadow: none!important;
    }
  }
  .progress-item {
    margin-bottom: 20px;
    font-size: 14px;
    width: 96%;
  }
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
}
</style>
