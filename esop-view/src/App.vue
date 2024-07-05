<script setup>
import Esop from "./components/esop.vue";
import {NNotificationProvider} from 'naive-ui'
</script>

<template>
  <n-notification-provider>
    <esop></esop>
  </n-notification-provider>
</template>

<style scoped>
</style>
