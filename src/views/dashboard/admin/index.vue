<template>
  <div class="dashboard-editor-container">
  <panel-group />
  <div ref="tencentMap" style="height:550px;border-radius: 10px;border: 5px solid #ffffff;"></div>

<!--    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart />
    </el-row> -->

<!--    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <BoxCard />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
// import LineChart from './components/LineChart'
// import TransactionTable from './components/TransactionTable'
// import BoxCard from './components/BoxCard'
import TencentMap from "tencent-map";
import { fetchMerchantListHome } from '@/api/home'


export default {
  name: 'DashboardAdmin',
  components: {
    TencentMap,
    PanelGroup,
    // LineChart,
    // TransactionTable,
    // BoxCard
  },
  created() {
      this.getList()
    },
  data() {
    return {
      data:[]
    }
  },
  methods: {
    async getList(){
      let that = this
      await fetchMerchantListHome().then((res)=>{
        TencentMap.load(this.$refs.tencentMap, { mapKey:"GHYBZ-A466U-EJ3VU-2OH33-YZ3ZK-BFFYY"}).then(qq => {
        const myLatlng = new qq.maps.LatLng(31.4, 121.24);
        const myOptions = {
            zoom: 12,
            center: myLatlng,
            mapTypeId: qq.maps.MapTypeId.ROADMAP,
            viewMode:'2D',
            // disableDefaultUI: true
        };
        let map = new qq.maps.Map(TencentMap.elements, myOptions);
              console.log(11111)
                  for (var i = 0; i < res.data.length; ++i) {
                      var latLng = new qq.maps.LatLng(res.data[i].Latitude, res.data[i].Longitude);
                      var marker = new qq.maps.Marker({
                          position:latLng,
                          map:map,
                          animation:qq.maps.MarkerAnimation.DROP
                      });
                      var info = new qq.maps.InfoWindow({
                            map: map
                        });
                        marker.name = res.data[i].Name
                        marker.mobile = res.data[i].Mobile
                        marker.sales = res.data[i].Sales
                        marker.address = res.data[i].Address
                        marker.latLng = latLng
                        // let data = this.data
                        qq.maps.event.addListener(marker, 'click', function(event) {
                               info.open();
                               info.setContent(
                               '<div style="text-align:left;white-space:nowrap;margin:10px;">名称：'+this.name+'</div>'+
                               '<div style="text-align:left;white-space:nowrap;margin:10px;">电话：'+this.mobile+'</div>'+
                               '<div style="text-align:left;white-space:nowrap;margin:10px;">销量：'+this.sales+'</div>'+
                               '<div style="text-align:left;white-space:nowrap;margin:10px;">地址：'+this.address+'</div>'
                               );
                               info.setPosition(this.latLng);
                      });
                  };
        });
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: #fff;
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
