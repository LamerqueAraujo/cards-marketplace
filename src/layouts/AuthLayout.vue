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

<style scoped lang="scss">
.auth-layout {
  background: $dark-page;
}

.auth-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;

  background:
    radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.16) 0%, rgba(15, 15, 26, 0) 45%),
    radial-gradient(circle at 10% 90%, rgba(30, 144, 255, 0.10) 0%, rgba(15, 15, 26, 0) 55%),
    linear-gradient(135deg, #141429 0%, #0f0f1a 55%, #0b0b14 100%);
}

.auth-page::before {
  content: "";
  position: absolute;
  width: 820px;
  height: 820px;
  left: 50%;
  top: 44%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(139, 92, 246, 0.26) 0%, rgba(139, 92, 246, 0) 60%);
  filter: blur(10px);
  opacity: 0.95;
  pointer-events: none;
}

.auth-page::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(0deg,
      rgba(255, 255, 255, 0.018),
      rgba(255, 255, 255, 0.018) 1px,
      transparent 1px,
      transparent 3px);
  opacity: 0.08;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.auth-card-wrapper {
  position: relative;
  width: 100%;
  padding: var(--space-6);
  display: flex;
  justify-content: center;
}

@media (max-width: 600px) {
  .auth-card-wrapper {
    padding: var(--space-4);
  }
}

@media (prefers-reduced-motion: reduce) {

  .auth-page::before,
  .auth-page::after {
    display: none;
  }
}
</style>
