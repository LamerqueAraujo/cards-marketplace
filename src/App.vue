<script setup lang="ts">
import ToastHost from 'src/shared/ui/notification/components/ToastHost.vue'
</script>

<template>
  <div id="q-app" class="theme-duel">
    <router-view />
    <ToastHost />
  </div>
</template>
