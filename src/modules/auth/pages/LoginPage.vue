<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

import AppInput from 'src/shared/ui/components/AppInput.vue'
import AuthCard from '../components/AuthCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function onSubmit() {
  if (!email.value || !password.value) return

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
  <AuthCard>

    <div class="login-header">
      <h1>Duel Market</h1>
      <p>Negocie cartas como um profissional</p>
    </div>

    <q-form @submit.prevent="onSubmit" class="login-form" greedy>

      <AppInput v-model="email" label="Email" type="email" autocomplete="email" />

      <AppInput v-model="password" label="Senha" type="password" autocomplete="current-password" />

      <q-btn label="Entrar" type="submit" color="primary" unelevated class="full-width q-mt-md" :loading="loading"
        :disable="!email || !password" />

      <div v-if="errorMessage" class="login-error text-negative">
        {{ errorMessage }}
      </div>

      <q-separator class="q-my-md" dark />

      <q-btn flat label="Criar conta" to="/register" class="full-width" color="grey-5" />

    </q-form>

  </AuthCard>
</template>

<style scoped lang="scss">
.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.login-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.login-header p {
  margin-top: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-error {
  margin-top: 14px;
  text-align: center;
  font-size: 13px;
}
</style>
