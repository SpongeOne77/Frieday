<script setup>
import {onMounted, ref} from "vue";
import customWebSocket from "../utils/websocket.js";
import request from '../utils/request.js'
// const serverAddress = '192.168.8.43:9100'
const serverAddress = '150.158.148.22'
const altPicAddress = '/src/assets/trama.jpg'
const url = ref(altPicAddress);
const {createWebsocket, connectionStatus} = customWebSocket({
  url: `ws://${serverAddress}/channel/echo`,
  onMessage: (data) => {
    if (data && data !== 'The heartbeat packets') {
      url.value = `http://${serverAddress}/esop/${data}`
    } else {
      url.value = altPicAddress
    }
  },
})

const {startup} = request();

onMounted(() => {
  startup(serverAddress).then(function (response) {
    console.log(response.data);
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
    <img :src="url"
        alt=""/>
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
