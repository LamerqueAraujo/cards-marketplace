<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'

import AppHeader from 'src/shared/layout/AppHeader.vue'
import AppSidebar from 'src/shared/layout/AppSidebar.vue'

const $q = useQuasar()

const leftDrawerOpen = ref(false)
const isDesktop = computed(() => $q.screen.gt.sm)

const menuItems = [
  { label: 'Home', icon: 'home', route: 'home' },
  { label: 'Trades', icon: 'swap_horiz', route: 'trades' },
  { label: 'My Cards', icon: 'collections', route: 'my-cards' }
]

watch(
  isDesktop,
  (desktop) => {
    leftDrawerOpen.value = desktop
  },
  { immediate: true }
)

function toggleMenu() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <AppHeader @toggle-menu="toggleMenu" />
    <AppSidebar v-model="leftDrawerOpen" :menu-items="menuItems" />

    <q-page-container class="page-container">
      <div class="page-wrapper">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  background:
    radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.16), transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(30, 144, 255, 0.10), transparent 42%),
    var(--q-dark-page);
}

.page-container {
  padding: 0;
}

.page-wrapper {
  width: 100%;
  min-height: calc(100vh - 64px);
}
</style>
