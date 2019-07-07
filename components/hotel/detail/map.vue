<template>
  <div class="map-view">
    <div class="map-box">
      <div id="map"></div>
    </div>

    <div class="poi-list">
      <el-tabs v-model="poiKey" @tab-click="handleTabClick">
        <el-tab-pane v-for="tab in tabs" :label="tab.name" :key="tab.value" :name="tab.value" :lazy="true">
          <div class="poi-list-ov" v-if="list[tab.value]">
            <ol>
              <li class="poi-list-item"
                v-for="poi in list[tab.value].pois"
                @mouseover="_ => showPoi(poi)"
              >
                <span class="name">{{poi.name}}</span>
                <span class="distance">{{getDistance(poi.location)}}公里</span>
              </li>
            </ol>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  const poiTypeNameMap = {
    scenic: '风景名胜',
    traffic: '交通设施服务'
  }
  const url = '//webapi.amap.com/maps?v=1.4.14&key=db0d66709930d4182e4b07224dda735d&callback=onAMapLoad';

  export default {
    props: ['dataSource'],
    data() {
      return {
        tabs: [{value: 'scenic', name: '风景'}, {value: 'traffic', name: '交通'}],
        poiKey: '',
        activePointer: null,
        list: {
          scenic: {},
          traffic: {},
        }
      }
    },

    mounted() {
      this.poiKey = 'scenic'

      const jsapi = document.createElement('script');
      jsapi.charset = 'utf-8';
      jsapi.src = url;

      document.head.appendChild(jsapi);
      window.onAMapLoad =  () => {
        const map = new AMap.Map('map')
        this.map = map

        this.addMarks()
        this.addPoiList()
      }
    },

    computed: {
      position() {
        const { location: {latitude, longitude} } = this.dataSource
        return new AMap.LngLat(longitude, latitude)
      },

      poiType() {
        return poiTypeNameMap[this.poiKey]
      },

      locationList() {
        const { name, address, location: {latitude, longitude} } = this.dataSource
        const hotelData = {name, address, location: `${longitude},${latitude}`}
        const {pois: poiList = []} = this.list[this.poiKey]

        return [hotelData, ...poiList]
      },
    },

    methods: {
      renderMark(item, i) {
        const { name, address, location } = item
        const position = new AMap.LngLat(...location.split(','))
        const content = item.id ?
          `<span class="marker" data-id=${item.id}>${i}</span>`
          : '<span class="marker hotel-marker" />'
        const marker = new AMap.Marker({
          position,
          title: name,
          content,
          text: address,
          extData: item.id,
          // animation: 'AMAP_ANIMATION_DROP',
          topWhenClick: true,
        })
        if (!item.id) {
          marker.setzIndex(9999)
        }
        marker.on('mouseover', _ => this.showPoi(item))
        return marker
      },

      addMarks() {
        if (typeof AMap !== 'object') {
          return
        }
        const map = this.map
        const markers = this.locationList.map(this.renderMark)
        map.clearMap()
        map.add(markers);//添加到地图
        map.setFitView();
      },

      addPoiList() {
        const types = this.poiType
        const { real_city } = this.dataSource
        const {lng, lat} = this.position
        if (this.list[this.poiKey].pois) {
          return
        }
        this.$axios({url: 'https://restapi.amap.com/v3/place/text', params: {
          keywords: '',
          city: real_city,
          location: `${lng},${lat}`,
          types,
          output: 'json',
          page: 1,
          offset: 10,
          key: '79041dfa1c752f49599e2b507c64da42'
        }}).then(r => {
          this.list[this.poiKey] = r.data
          this.addMarks()
        })
      },

      getDistance(p) {
        const distance = AMap.GeometryUtil.distance(this.position, p.split(','))
        return (distance / 1000).toFixed(2)
      },

      handleTabClick(v) {
        this.poiKey = v.name
        this.addPoiList()
        this.addMarks()
      },

      showPoi(poi) {
        this.map.getAllOverlays('marker').forEach(m => {
          if (m.getExtData() === poi.id) {
            // m.setAnimation('AMAP_ANIMATION_DROP')
            m.setTop(true)
            const infoWindow = new AMap.InfoWindow({
              content: `<span style="font-size: 12px;color: #333">${m.getTitle()}</span>`,
              offset: new AMap.Pixel(0, -32),
            })
            infoWindow.open(this.map, m.getPosition())
            this.map.setCenter(m.getPosition())
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .map-view {
    display: flex;
    flex: 1;
    height: 360px;
  }
  .map-box {
    width: 65%;
    height: 100%;
  }
  #map {
    width: 100%;
    height: 100%;
  }
  .poi-list {
    flex: 1;
    background-color: #fff;
    padding-left: 20px;

    .poi-list-ov {
      height: 300px;
      overflow: auto;
      font-size: 14px;
      color: #666;
    }

    .poi-list-item {
      display: flex;
      margin: 0 20px 20px 10px;
      cursor: pointer;

      .name {
        flex: 1;
      }
    }
  }

  @keyframes jump {
    0% { transform: translateY(0);  }
    50% { transform: translateY(-20px);  }
    100% { transform: translateY(0); }
  }

  /deep/ .marker {
    display: inline-block;
    width: 22px;
    height: 36px;
    background-image: url(https://webapi.amap.com/theme/v1.3/markers/b/mark_b.png);
    background-size: 22px 36px;
    text-align: center;
    line-height: 24px;
    color: #fff;

    &.hotel-marker {
      background-image: url(/images/mark_b.png);
      background-size: 22px 36px;
    }

    &.active {
      animation: jump 0.25s ease-in 3;
    }
  }
</style>
