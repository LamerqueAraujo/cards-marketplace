<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import AppSidebar from 'src/shared/layout/AppSidebar.vue'

const $q = useQuasar()

const leftDrawerOpen = ref(false)
const isDesktop = computed(() => $q.screen.gt.sm)
const isMobile = computed(() => $q.screen.lt.md)

const menuItems = [
  { label: 'Início', icon: 'home', route: 'home' },
  { label: 'Trocas', icon: 'swap_horiz', route: 'trades' },
  { label: 'Minhas Cartas', icon: 'collections', route: 'my-cards' }
]

watch(isDesktop, (desktop) => {
  leftDrawerOpen.value = desktop
}, { immediate: true })

function toggleDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <q-header v-if="isMobile" class="mobile-header">
      <div class="mobile-header__inner">
        <q-btn flat round :icon="leftDrawerOpen ? 'close' : 'menu'" class="mobile-header__btn"
          aria-label="Abrir/Fechar menu" @click="toggleDrawer" />

        <div class="mobile-header__brand">
          <div class="mobile-header__title">Duel Market</div>
          <div class="mobile-header__subtitle">Trade. Build. Dominate.</div>
        </div>
      </div>
    </q-header>

    <AppSidebar v-model="leftDrawerOpen" :menu-items="menuItems" />

    <q-page-container class="page-container">
      <router-view />
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

.mobile-header {
  height: 62px;
  background:
    linear-gradient(to bottom,
      rgba(15, 15, 26, 0.78),
      rgba(15, 15, 26, 0.56));
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(18px);
}

.mobile-header__inner {
  height: 62px;
  padding: 0 var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.mobile-header__btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
}

.mobile-header__brand {
  display: flex;
  flex-direction: column;
  line-height: 1.08;
  min-width: 0;
}

.mobile-header__title {
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #fff;
  font-size: 14px;
}

.mobile-header__subtitle {
  margin-top: 2px;
  font-size: var(--text-caption);
  color: rgba(255, 255, 255, 0.58);
}
</style>
