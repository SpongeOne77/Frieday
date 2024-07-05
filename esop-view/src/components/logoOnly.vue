<script setup>
import trama from '/src/assets/trama.jpg'
</script>
<template>
  <img :src="trama" alt="" />
</template>
<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>