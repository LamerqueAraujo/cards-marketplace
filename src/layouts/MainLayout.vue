<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/modules/auth/store/auth.store'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const leftDrawerOpen = ref(true)

const pageTitle = computed(() => {
  return route.meta.title || ''
})

async function logout() {
  authStore.clearToken()
  await router.push({ name: 'login' })
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">

    <!-- HEADER -->
    <q-header elevated class="bg-dark text-white">
      <q-toolbar>

        <!-- Mobile menu -->
        <q-btn flat dense round icon="menu" class="q-mr-sm" @click="leftDrawerOpen = !leftDrawerOpen" />

        <!-- App Title -->
        <q-toolbar-title class="text-weight-bold">
          <span class="app-title">Duel Market</span>
        </q-toolbar-title>

        <!-- Logout -->
        <q-btn flat dense icon="logout" label="Sair" @click="logout" />
      </q-toolbar>
    </q-header>

    <!-- SIDEBAR -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-10 text-white">
      <q-list padding>

        <q-item clickable v-ripple :to="{ name: 'marketplace' }">
          <q-item-section avatar>
            <q-icon name="store" />
          </q-item-section>
          <q-item-section>
            Marketplace
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple :to="{ name: 'my-cards' }">
          <q-item-section avatar>
            <q-icon name="collections" />
          </q-item-section>
          <q-item-section>
            Minhas Cartas
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <!-- PAGE CONTENT -->
    <q-page-container>
      <div class="page-wrapper">
        <div class="page-title">
          {{ pageTitle }}
        </div>

        <router-view />
      </div>
    </q-page-container>

  </q-layout>
</template>

<style scoped>
.app-title {
  font-size: 1.1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.page-wrapper {
  padding: 24px;
}

.page-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 16px;
}
</style>
