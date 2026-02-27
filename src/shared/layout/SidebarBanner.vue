<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <div class="sidebar-banner">

    <div class="banner-background" />

    <div class="banner-content">
      <div v-if="title" class="banner-title">
        {{ title }}
      </div>

      <div v-if="subtitle" class="banner-subtitle">
        {{ subtitle }}
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.sidebar-banner {
  position: relative;
  padding: 20px;
  border-radius: 12px;
  margin: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.banner-background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 30%,
      rgba(75, 0, 130, 0.18),
      transparent 60%);
  opacity: 0.8;
}

.banner-content {
  position: relative;
  z-index: 1;
}

.banner-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.4px;
}

.banner-subtitle {
  font-size: 12px;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
