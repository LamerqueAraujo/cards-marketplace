<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import PageHeader from 'src/shared/ui/layout/PageHeader.vue'
import AppHeader from 'src/shared/layout/AppHeader.vue'
import AppSidebar from 'src/shared/layout/AppSidebar.vue'

const route = useRoute()
const $q = useQuasar()
const leftDrawerOpen = ref(false)
const isDesktop = computed(() => $q.screen.gt.sm)
const pageTitle = computed(() => (route.meta.title as string) || '')
const menuItems = [
  { label: 'Home', icon: 'home', route: 'home' },
  { label: 'Trades', icon: 'swap_horiz', route: 'trades' },
  { label: 'My Cards', icon: 'collections', route: 'my-cards' }
]

watch(isDesktop, (desktop) => {
  if (desktop) {
    leftDrawerOpen.value = true
  } else {
    leftDrawerOpen.value = false
  }
}, { immediate: true })

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

        <PageHeader v-if="pageTitle" :title="pageTitle" />

        <router-view />

      </div>
    </q-page-container>

  </q-layout>
</template>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  background:
    radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.15), transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(30, 144, 255, 0.08), transparent 40%),
    $dark;
}
</style>
