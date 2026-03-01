<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/auth.service'

import AppInput from 'src/shared/ui/base/AppInput.vue'
import AuthCard from '../components/AuthCard.vue'

const router = useRouter()

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
  <AuthCard>

    <div class="register-header">
      <h1>Criar conta</h1>
      <p>Monte seu inventário e comece a negociar</p>
    </div>

    <q-form @submit.prevent="onSubmit" class="register-form" greedy>

      <AppInput v-model="name" label="Nome" autocomplete="name" />

      <AppInput v-model="email" label="Email" type="email" autocomplete="email" />

      <AppInput v-model="password" label="Senha" type="password" autocomplete="new-password" />

      <q-btn label="Cadastrar" type="submit" color="primary" unelevated class="full-width q-mt-md" :loading="loading"
        :disable="!name || !email || !password" />

      <div v-if="errorMessage" class="register-error text-negative">
        {{ errorMessage }}
      </div>

      <q-separator class="q-my-md" dark />

      <q-btn flat label="Já tenho conta" to="/login" class="full-width" color="grey-5" />

    </q-form>

  </AuthCard>
</template>

<style scoped lang="scss">
.register-header {
  text-align: center;
  margin-bottom: 36px;
}

.register-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.register-header p {
  margin-top: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
}

.register-form {
  display: flex;
  flex-direction: column;
}

.register-error {
  margin-top: 14px;
  text-align: center;
  font-size: 13px;
}
</style>
