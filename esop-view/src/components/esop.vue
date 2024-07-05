<script setup>
import {onMounted, ref, computed} from "vue";
import customWebSocket from "../utils/websocket.js";
import request from '../utils/request.js'
import {NCarousel, NImage} from 'naive-ui'
import trama from '/src/assets/trama.jpg'
import LogoOnly from "./logoOnly.vue";
import {useNotification} from 'naive-ui'

// const serverAddress = '192.168.8.43:9100'
const serverAddress = '150.158.148.22'
// const serverAddress = '192.168.0.38'
const qStation = true;
// const qStation = false;
const urls = ref([]);


const notification = useNotification()
const notify = (content, type) => {
  notification[type]({
    content: content,
    duration: 2500,
  })
}
const localIp = ref(null);
const {createWebsocket, connectionStatus} = customWebSocket({
  url: `ws://${serverAddress}/channel/echo`,
  onMessage: (data) => {
    if (data === 'The heartbeat packets') return;
    if (data === '[]') {
      urls.value = [trama];
    } else {
      console.log(JSON.parse(data))
      notify('成功获取指导书，加载中')
      let pics = [];
      JSON.parse(data).forEach((item) => {
        pics.push(`http://${serverAddress}/esop/${item}`);
      })
      urls.value = pics
    }
  },
  onConnect: () => {
    notify('通道建立成功', 'success')
  },
  onClosed: () => {
    notify('通道连接失败, 正在重试', 'warning')
  }
})

const {startup} = request();

onMounted(() => {
  notify('服务器连接中', 'info')
  startup(serverAddress).then(function (response) {
    // console.log(response.data);
    localIp.value = response.data;
    createWebsocket(response.data);
  })
      .catch(function (error) {
        console.log(error);
        notify('服务器连接失败，请检查网络设置', 'error')
      });
})

const isDisplayLogo = computed(() => {
  return urls.value.length === 0
})


</script>

<template>
  <logo-only v-if="isDisplayLogo"></logo-only>
  <n-carousel v-if="!isDisplayLogo" :autoplay="qStation === false" touchable :show-dots="false">
    <img style="object-fit: fill" v-if="qStation === false" v-for="item in urls" :key="item" :src="item"
         alt=""/>
    <n-image v-if="qStation === true" object-fit="fill" width="1920" height="1000" v-for="(item, index) in urls" :key="item + index"
             :src="item"/>
  </n-carousel>
</template>

<style lang="css" scoped>

img {
  width: 100%;
  height: 100%;
}
</style>
