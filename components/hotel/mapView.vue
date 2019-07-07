<template>
  <div class="map-box" :style="{width: width + 'px', height: height + 'px'}">
    <div id="map"></div>
    <div class="loading" v-if="!loaded" />
  </div>
</template>

<script>
  export default {
    props: ['value', 'width', 'height'],
    data() {
      return {
        loaded: false,
      }
    },
    mounted() {
      const url = '//webapi.amap.com/maps?v=1.4.14&key=db0d66709930d4182e4b07224dda735d&callback=onAMapLoad';
      const jsapi = document.createElement('script');
      jsapi.charset = 'utf-8';
      jsapi.src = url;
      document.head.appendChild(jsapi);

      window.onAMapLoad =  () => {
        const map = new AMap.Map('map')
        this.map = map

        this.addMarks()
      }
    },

    methods: {
      addMarks() {
        if (typeof AMap !== 'object' || !this.value) {
          return
        }
        const map = this.map
        const markers = this.value.map((hotel, i) => {
          const { name, address, location: {latitude, longitude} } = hotel
          const position = new AMap.LngLat(longitude, latitude)
          const marker = new AMap.Marker({
            position,
            title: name,
            content: `<span class="marker">${i + 1}</span>`,
            text: address,
            topWhenClick: true,
          })
          const infoWindow = new AMap.InfoWindow({
            content: `<span style="font-size: 12px;color: #333">${name}</span>`,
            offset: new AMap.Pixel(0, -32),
          })
          function showInfoWin() {
            infoWindow.open(map, position)
          }
          function closeInfoWin() {
            infoWindow.close()
          }
          marker.on('mouseover', showInfoWin)
          marker.on('mouseout', closeInfoWin)
          return marker
        })
        map.clearMap()
        map.add(markers);//添加到地图
        map.setFitView();
      },
    },

    watch: {
      value: function () {
        this.loaded = !!this.value
        if (this.map) {
          if (!this.value) {
            this.map.clearMap()
          } else {
            this.addMarks()
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .map-box {
    position: relative;
  }
  #map {
    width: 100%;
    height: 100%;
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
  }
  .loading {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: rgba(0,0,0,0.5) url('/images/loading.gif') center center no-repeat;
  }
</style>
