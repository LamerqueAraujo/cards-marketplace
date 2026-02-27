<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/modules/auth/store/auth.store'

const emit = defineEmits(['toggle-menu'])

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const isMobile = computed(() => $q.screen.lt.md)

async function logout() {
  authStore.clearToken()
  await router.push({ name: 'login' })
}
</script>

<template>
  <q-header class="app-header">

    <q-toolbar class="toolbar">

      <q-btn v-if="isMobile" flat dense round icon="menu" class="menu-btn" @click="emit('toggle-menu')" />

      <q-toolbar-title class="app-title">
        <span class="title-text">
          Duel Market
        </span>
      </q-toolbar-title>

      <q-space />

      <q-btn flat dense icon="logout" class="logout-btn" @click="logout">
        <span class="logout-text">Sair</span>
      </q-btn>

    </q-toolbar>

  </q-header>
</template>

<style scoped lang="scss">
.app-header {
  background: rgba(15, 15, 26, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.toolbar {
  padding: 0 24px;
  height: 64px;
}

.app-title {
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #ffffff;
}

.title-text {
  background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.7));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.menu-btn {
  margin-right: 8px;
}

.logout-btn {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s ease;
}

.logout-btn:hover {
  color: #ffffff;
}

.logout-text {
  margin-left: 6px;
  font-size: 13px;
}
</style>
