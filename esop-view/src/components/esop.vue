<script setup>
import {onMounted, ref, computed} from "vue";
import customWebSocket from "../utils/websocket.js";
import request from '../utils/request.js'
import {NCarousel, NImage} from 'naive-ui'
import trama from '/src/assets/trama.jpg'
// const serverAddress = '192.168.8.43:9100'
const serverAddress = '150.158.148.22'
// const serverAddress = '192.168.0.38'
// const qStation = true;
const qStation = false;
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

const calcImgStyle = computed( () => {
  return `object-fit: ${urls.value.length === 1 ? 'contain' : 'fill'}`;
})

const isLogo = computed(() => {
  return urls.value.length === 1
})



</script>

<template>
  <div style="height: 95%; width: 100%">
    <n-carousel v-if="qStation === true" show-arrow direction="vertical">
      <img v-if="isLogo" v-for="item in urls" :key="item" :src="item"  alt=""/>
      <n-image v-else object-fit="fill"  v-for="(item, index) in urls" :key="item + index" :src="item" />
    </n-carousel>
    <n-carousel v-else autoplay :interval="7000" show-dots="false" direction="vertical">
      <img v-for="item in urls" :key="item" :src="item"
           alt=""/>
    </n-carousel>

  </div>
</template>

<style lang="css" scoped>

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
