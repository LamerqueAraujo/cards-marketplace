<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
</script>

<template>
  <q-card class="q-pa-lg shadow-2">

    <q-card-section>
      <div class="text-h5 text-center">Register</div>
    </q-card-section>

    <q-card-section>
      <q-form>

        <q-input v-model="name" label="Nome" outlined dense class="q-mb-md" />

        <q-input v-model="email" label="Email" type="email" outlined dense class="q-mb-md" />

        <q-input v-model="password" label="Password" type="password" outlined dense class="q-mb-md" />

        <q-btn label="Cadastrar" color="primary" unelevated class="full-width q-mt-sm" type="submit" />

        <q-btn flat label="Já tenho conta" to="/login" class="full-width q-mt-sm" />

      </q-form>
    </q-card-section>

  </q-card>
</template>
