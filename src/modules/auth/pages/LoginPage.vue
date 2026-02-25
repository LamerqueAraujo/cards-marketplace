<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const authStore = useAuthStore()

async function onSubmit() {
  try {
    loading.value = true
    errorMessage.value = ''

    const response = await login({
      email: email.value,
      password: password.value
    })

    authStore.setToken(response.token, response.user.id)

    await router.push({ name: 'home' })

  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      errorMessage.value = 'Email ou senha inválidos'
    } else {
      errorMessage.value = 'Erro ao fazer login. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <q-card class="q-pa-lg shadow-2">

    <q-card-section>
      <div class="text-h5 text-center">Login</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onSubmit">

        <q-input v-model="email" label="Email" type="email" outlined dense class="q-mb-md" />

        <q-input v-model="password" label="Password" type="password" outlined dense class="q-mb-md" />

        <q-btn label="Entrar" color="primary" unelevated class="full-width q-mt-sm" type="submit" :loading="loading" />

        <div v-if="errorMessage" class="text-negative text-caption q-mt-sm">
          {{ errorMessage }}
        </div>

        <q-btn flat label="Criar conta" to="/register" class="full-width q-mt-sm" />

      </q-form>
    </q-card-section>

  </q-card>
</template>
