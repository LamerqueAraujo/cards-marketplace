<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/auth.service'

import AppInput from 'src/shared/ui/base/AppInput.vue'
import AppButton from 'src/shared/ui/base/AppButton.vue'
import AppSeparator from 'src/shared/ui/base/AppSeparator.vue'
import AuthCard from '../components/AuthCard.vue'

const router = useRouter()
const isFocused = ref(false)

function onFocus() {
  isFocused.value = true
}

function onBlur() {
  isFocused.value = false
}
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function onSubmit() {
  if (!name.value || !email.value || !password.value) return

  try {
    loading.value = true
    errorMessage.value = ''

    await register({
      name: name.value,
      email: email.value,
      password: password.value
    })

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
  <AuthCard :class="{ 'auth-card--focus': isFocused }">
    <div class="register-brand">
      <div class="brand-orb" aria-hidden="true">
        <q-icon name="person_add" />
      </div>
    </div>

    <div class="register-header">
      <h1 class="text-display title-gradient">Criar conta</h1>
      <p>Monte seu inventário e comece a negociar</p>
    </div>

    <q-form @submit.prevent="onSubmit" greedy class="register-form">
      <AppInput v-model="name" label="Nome" autocomplete="name" @focus="onFocus" @blur="onBlur" />
      <AppInput v-model="email" label="Email" type="email" autocomplete="email" @focus="onFocus" @blur="onBlur" />
      <AppInput v-model="password" label="Senha" type="password" autocomplete="new-password" @focus="onFocus"
        @blur="onBlur" />

      <div v-if="errorMessage" class="register-alert" role="alert">
        <q-icon name="error_outline" />
        <span>{{ errorMessage }}</span>
      </div>

      <div class="register-actions">
        <AppButton label="Cadastrar" icon="how_to_reg" type="submit" :loading="loading"
          :disabled="!name || !email || !password" block />

        <AppSeparator />

        <AppButton label="Já tenho conta" variant="ghost" icon="login" to="/login" block />
      </div>

      <p class="register-footnote">
        Cadastro rápido • Comece a negociar em minutos
      </p>
    </q-form>
  </AuthCard>
</template>

<style scoped lang="scss">
.register-brand {
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

.register-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.register-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
}

.register-header p {
  margin-top: var(--space-2);
  font-size: var(--text-body);
  color: var(--text-muted);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.register-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.register-alert {
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

.register-alert :deep(i) {
  opacity: 0.9;
}

.register-footnote {
  margin: var(--space-3) 0 0;
  text-align: center;
  font-size: var(--text-caption);
  color: var(--text-muted);
  opacity: 0.9;
}
</style>
