<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/modules/auth/store/auth.store'

const router = useRouter()
const authStore = useAuthStore()

async function logout() {
  authStore.clearToken()
  await router.push({ name: 'login' })
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense icon="logout" label="Sair" @click="logout" />
        <q-toolbar-title>
          Cards Marketplace
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
