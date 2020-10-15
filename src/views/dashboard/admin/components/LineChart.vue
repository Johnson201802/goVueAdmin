<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { fetchLineChartData } from '@/api/order'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      days:[],
      all_hd:[],
      all_hd_jy:[]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchLineChartData()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    fetchLineChartData() {
      let that = this
      fetchLineChartData().then(response => {
        if(response.code == 200){
          that.chart = echarts.init(that.$el, 'macarons')
          that.setOptions(response.days,response.all_hd,response.all_hd_jy)
        }

      })
    },
    setOptions(days, all_hd, all_hd_jy) {
      console.log(days)
      console.log(all_hd)
      console.log(all_hd_jy)
      this.chart.setOption({
        xAxis: {
          data: days,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['红豆购买量', '红豆交易额']
        },
        series: [{
          name: '红豆购买量', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: all_hd,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '红豆交易额',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: all_hd_jy,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
