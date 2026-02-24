<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
</script>

<template>
  <q-card class="q-pa-lg shadow-2">
    <q-card-section>
      <div class="text-h5 text-center">Login</div>
    </q-card-section>

    <q-card-section>
      <q-input
        v-model="email"
        label="Email"
        type="email"
        outlined
        class="q-mb-md"
      />

      <q-input
        v-model="password"
        label="Password"
        type="password"
        outlined
      />
    </q-card-section>

    <q-card-actions vertical>
      <q-btn label="Entrar" color="primary" unelevated />

      <q-btn
        flat
        label="Criar conta"
        to="/register"
        class="q-mt-sm"
      />
    </q-card-actions>
  </q-card>
</template>
