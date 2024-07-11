<script setup>
import trama from '/src/assets/trama.jpg'
</script>
<template>
  <div class="logo"></div>
<!--  <img :src="trama" alt="" />-->
</template>
<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  overflow-y: hidden;
}

.logo {
  height: 100%;
  width: 100%;
  background: url("../assets/trama.jpg") no-repeat center center;
  background-size: contain;
}
</style>