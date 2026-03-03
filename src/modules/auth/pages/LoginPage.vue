<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

import AppInput from 'src/shared/ui/base/AppInput.vue'
import AppButton from 'src/shared/ui/base/AppButton.vue'
import AppSeparator from 'src/shared/ui/base/AppSeparator.vue'
import AuthCard from '../components/AuthCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const isFocused = ref(false)

function onFocus() {
  isFocused.value = true
}

function onBlur() {
  isFocused.value = false
}

async function onSubmit() {
  if (!email.value || !password.value) return

  try {
    loading.value = true
    errorMessage.value = ''

    const response = await login({
      email: email.value,
      password: password.value
    })

    authStore.setSession({
      token: response.token,
      userId: response.user.id,
      name: response.user.name,
      email: response.user.email
    })
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
  <AuthCard :class="{ 'auth-card--focus': isFocused }">
    <div class="login-brand">
      <div class="brand-orb" aria-hidden="true">
        <q-icon name="auto_awesome" />
      </div>
    </div>

    <div class="login-header">
      <h1 class="text-display title-gradient">Duel Market</h1>
      <p>Negocie cartas como um profissional</p>
    </div>

    <q-form @submit.prevent="onSubmit" greedy class="login-form">
      <AppInput v-model="email" label="Email" type="email" autocomplete="email" @focus="onFocus" @blur="onBlur" />
      <AppInput v-model="password" label="Senha" type="password" autocomplete="current-password" @focus="onFocus"
        @blur="onBlur" />

      <div v-if="errorMessage" class="login-alert" role="alert">
        <q-icon name="error_outline" />
        <span>{{ errorMessage }}</span>
      </div>

      <div class="login-actions">
        <AppButton label="Entrar" icon="login" type="submit" :loading="loading" :disabled="!email || !password" block />

        <AppSeparator />

        <AppButton label="Criar conta" variant="ghost" icon="person_add" to="/register" block />
      </div>

      <p class="login-footnote">
        Acesso seguro • Sessão persistente
      </p>
    </q-form>
  </AuthCard>
</template>

<style scoped lang="scss">
.login-brand {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-4);
}

.brand-orb {
  width: 54px;
  height: 54px;
  border-radius: 999px;
  display: grid;
  place-items: center;

  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.28);
  box-shadow: 0 0 26px rgba(139, 92, 246, 0.18);
}

.brand-orb :deep(i) {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.92);
}

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

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.login-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.login-alert {
  display: flex;
  align-items: center;
  gap: var(--space-2);

  padding: var(--space-3);
  border-radius: var(--radius-md);

  background: rgba(239, 68, 68, 0.10);
  border: 1px solid rgba(239, 68, 68, 0.18);
  color: rgba(255, 255, 255, 0.90);

  font-size: var(--text-caption);
}

.login-alert :deep(i) {
  opacity: 0.9;
}

.login-footnote {
  margin: var(--space-3) 0 0;
  text-align: center;
  font-size: var(--text-caption);
  color: var(--text-muted);
  opacity: 0.9;
}
</style>
