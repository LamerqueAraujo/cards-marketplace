<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/auth.service'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function onSubmit() {
  try {
    loading.value = true
    errorMessage.value = ''

    await register({
      name: name.value,
      email: email.value,
      password: password.value
    })

    // após registrar → volta para login
    await router.push({ name: 'login' })

  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'EMAIL_ALREADY_EXISTS') {
      errorMessage.value = 'Email já cadastrado'
    } else {
      errorMessage.value = 'Erro ao cadastrar usuário'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <q-card class="q-pa-lg shadow-2">

    <q-card-section>
      <div class="text-h5 text-center">Register</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onSubmit">

        <q-input v-model="name" label="Nome" outlined dense class="q-mb-md" />

        <q-input v-model="email" label="Email" type="email" outlined dense class="q-mb-md" />

        <q-input v-model="password" label="Password" type="password" outlined dense class="q-mb-md" />

        <q-btn label="Cadastrar" color="primary" unelevated class="full-width q-mt-sm" type="submit"
          :loading="loading" />

        <div v-if="errorMessage" class="text-negative text-caption q-mt-sm">
          {{ errorMessage }}
        </div>

        <q-btn flat label="Já tenho conta" to="/login" class="full-width q-mt-sm" />

      </q-form>
    </q-card-section>

  </q-card>
</template>
