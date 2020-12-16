<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
      <div class="card-panel1">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="wechat" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总用户数
          </div>
          <count-to :start-val="0" :end-val="data.count" :duration="2600" class="card-panel-num" style="margin-top: 5px;" />
          <p>计量单位：人</p>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
      <div class="card-panel2">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="web" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日活跃
          </div>
          <count-to :start-val="0" :end-val="data.active_count" :duration="3060" class="card-panel-num" />
          <p>计量单位：人</p>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="6" class="card-panel-col">
      <div class="card-panel3">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            VIP总数
          </div>
          <count-to :start-val="0" :end-val="data.member_count" :duration="3200" class="card-panel-num" />
          <p>计量单位：人</p>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :md="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel4">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="chart" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            商家总数
          </div>
          <count-to :start-val="0" :end-val="data.merchant_count" :duration="3600" class="card-panel-num" />
          <p>计量单位：人</p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { cardData } from '@/api/common'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      data: {
        "count":0,
        "member_count":0,
        "merchant_count":0,
        "active_count":0,
      }
    }
  },
  created() {
    cardData().then((response) => {
      this.data = response
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel1 {
    height: 160px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    color: #fff;
    // background-image: linear-gradient(to right, #ff9569 0%, #e92758 100%);
    background-image: linear-gradient(-100deg, #2EC7C9 0%, #5AB1EF 70%);
    box-shadow: 20px 10px 40px rgba(217, 217, 217, .5);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .card-panel-icon {
        font-size: 65px;
      }
    }

    .icon-people {
      color: #fff;//#40c9c6;
    }

    .icon-message {
      color: #fff;//#36a3f7;
    }

    .icon-money {
      color: #fff;//#f4516c;
    }

    .icon-shopping {
      color: #fff;//#34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 55px;
      transition: all 0.38s ease-out;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: #fff;
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }

  .card-panel2 {
    height: 160px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    color: #fff;
    // background-image: linear-gradient(to right, #ff9569 0%, #e92758 100%);
    background-image:linear-gradient(-100deg, #d1baff 0%, #B6A2DE 70%);
    box-shadow: 20px 10px 40px rgba(217, 217, 217, .5);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .card-panel-icon {
        font-size: 65px;
      }
    }

    .icon-people {
      color: #fff;//#40c9c6;
    }

    .icon-message {
      color: #fff;//#36a3f7;
    }

    .icon-money {
      color: #fff;//#f4516c;
    }

    .icon-shopping {
      color: #fff;//#34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 55px;
      transition: all 0.38s ease-out;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: #fff;
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }

  .card-panel3 {
    height: 160px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    color: #fff;
    // background-image: linear-gradient(to right, #ff9569 0%, #e92758 100%);
    background-image:linear-gradient(-100deg, #FEDF95 0%, #FFB980 70%);
    box-shadow: 20px 10px 40px rgba(217, 217, 217, .5);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .card-panel-icon {
        font-size: 65px;
      }
    }

    .icon-people {
      color: #fff;//#40c9c6;
    }

    .icon-message {
      color: #fff;//#36a3f7;
    }

    .icon-money {
      color: #fff;//#f4516c;
    }

    .icon-shopping {
      color: #fff;//#34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 55px;
      transition: all 0.38s ease-out;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: #fff;
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }

  .card-panel4 {
    height: 160px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    color: #fff;
    // background-image: linear-gradient(to right, #ff9569 0%, #e92758 100%);
    background-image:linear-gradient(-100deg, #FAD0C4 0%, #E79796 70%);
    box-shadow: 20px 10px 40px rgba(217, 217, 217, .5);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .card-panel-icon {
        font-size: 65px;
      }
    }

    .icon-people {
      color: #fff;//#40c9c6;
    }

    .icon-message {
      color: #fff;//#36a3f7;
    }

    .icon-money {
      color: #fff;//#f4516c;
    }

    .icon-shopping {
      color: #fff;//#34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 55px;
      transition: all 0.38s ease-out;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: #fff;
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }

}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
