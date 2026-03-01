<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

import AppInput from 'src/shared/ui/base/AppInput.vue'
import AppButton from 'src/shared/ui/base/AppButton.vue'
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
      <h1 class="text-display title-gradient">Duel Market</h1>
      <p>Negocie cartas como um profissional</p>
    </div>

    <q-form @submit.prevent="onSubmit" greedy>
      <div class="ds-form">
        <AppInput v-model="email" label="Email" type="email" autocomplete="email" />
        <AppInput v-model="password" label="Senha" type="password" autocomplete="current-password" />
      </div>

      <div v-if="errorMessage" class="login-error">
        {{ errorMessage }}
      </div>

      <div class="ds-form-actions">
        <AppButton label="Entrar" icon="login" type="submit" :loading="loading" :disabled="!email || !password" block />

        <div class="login-divider">
          <span />
        </div>

        <AppButton label="Criar conta" variant="ghost" icon="person_add" to="/register" block />
      </div>
    </q-form>
  </AuthCard>
</template>

<style scoped lang="scss">
.login-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.login-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
}

.login-header p {
  margin-top: var(--space-2);
  font-size: var(--text-body);
  color: var(--text-muted);
}

.login-error {
  margin-top: var(--space-4);
  text-align: center;
  font-size: var(--text-caption);
  color: #ff6b6b;
}

.login-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--space-3) 0;
}

.login-divider span {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.10);
}
</style>
