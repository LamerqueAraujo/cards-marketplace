<script setup lang="ts"></script>

<template>
  <q-layout view="lHh Lpr lFf" class="auth-layout">
    <q-page-container>
      <q-page class="auth-page flex flex-center">
        <div class="auth-card-wrapper">
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.auth-layout {
  background: var(--q-dark-page);
}

.auth-page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1a1a2e 0%, #0f0f1a 60%);
}

.auth-card-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 24px;
}

/* responsive */
@media (max-width: 600px) {
  .auth-card-wrapper {
    padding: 16px;
  }
}
</style>
