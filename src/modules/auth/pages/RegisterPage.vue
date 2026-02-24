<template>
  <q-card class="q-pa-lg shadow-2">
    <q-card-section>
      <div class="text-h5 text-center">Register</div>
    </q-card-section>

    <q-card-section>
      <q-input v-model="name"
      label="Nome"
      outlined class="q-mb-md" />
      <q-input
        v-model="email"
        label="Email"
        type="email"
        outlined
      />
      <q-input v-model="password" label="Password" type="password" outlined />
    </q-card-section>

    <q-card-actions vertical>
      <q-btn label="Cadastrar" color="primary" unelevated />
      <q-btn
        flat
        label="Já tenho conta"
        to="/login"
        class="q-mt-sm"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const name = ref('')
const password = ref('')
</script>
