<script setup>
import {onMounted, ref} from "vue";
import customWebSocket from "../utils/websocket.js";
import request from '../utils/request.js'
import {NCarousel} from 'naive-ui'
import trama from '/src/assets/trama.jpg'
// const serverAddress = '192.168.8.43:9100'
const serverAddress = '150.158.148.22'
// const serverAddress = '192.168.0.38'
const altPicAddress = trama
const urls = ref([altPicAddress]);
const localIp = ref(null);
const {createWebsocket, connectionStatus} = customWebSocket({
  url: `ws://${serverAddress}/channel/echo`,
  onMessage: (data) => {
    if (data && data !== 'The heartbeat packets') {
      console.log(JSON.parse(data))
      let pics = [];
      JSON.parse(data).forEach((item) => {
        pics.push(`http://${serverAddress}/esop/${item}`);
      })
      urls.value = pics
    }
  },
})

const {startup} = request();

onMounted(() => {
  startup(serverAddress).then(function (response) {
    console.log(response.data);
    localIp.value = response.data;
    createWebsocket(response.data);
  })
      .catch(function (error) {
        console.log(error);
      });
})


</script>

<template>
  <div>
    <div :class="{'online': connectionStatus === true, 'offline': connectionStatus === false}"></div>
    <n-carousel autoplay show-arrow :interval="7000">
      <img v-for="item in urls" :key="item" :src="item"  alt=""/>
    </n-carousel>

  </div>
</template>

<style lang="css" scoped>

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.online {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 10px;
  background-color: green;
}

.offline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 10px;
  background-color: red;
}
</style>
