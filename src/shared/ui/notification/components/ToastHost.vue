<template>
  <div class="toast-host" aria-live="polite" aria-relevant="additions removals" @keydown.esc="clearAll" tabindex="-1"
    ref="hostRef">
    <TransitionGroup name="toast" tag="div" class="toast-stack">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="`toast--${t.variant}`"
        :role="t.variant === 'error' ? 'alert' : 'status'" :aria-live="t.variant === 'error' ? 'assertive' : 'polite'"
        @pointerdown="onPointerDown($event, t.id)" @pointerup="onPointerUp($event, t.id)"
        @pointercancel="onPointerCancel(t.id)">
        <div class="toast__chrome" aria-hidden="true"></div>

        <div class="toast__content">
          <div class="toast__icon" aria-hidden="true">
            <q-icon :name="iconByVariant[t.variant]" />
          </div>

          <div class="toast__body">
            <div class="toast__header">
              <strong v-if="t.title" class="toast__title">{{ t.title }}</strong>

              <button class="toast__close" type="button" aria-label="Fechar notificação" @click="remove(t.id)">
                ✕
              </button>
            </div>

            <div class="toast__message">
              {{ t.message }}
            </div>

            <div class="toast__meta" aria-hidden="true">
              <div class="toast__progress" :style="progressStyle(t)"></div>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToastStore } from '../stores/toast.store'
import type { ToastVariant } from '../types/toast.types'

const store = useToastStore()
const { toasts } = storeToRefs(store)

const hostRef = ref<HTMLElement | null>(null)

const iconByVariant: Record<ToastVariant, string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
  warning: 'warning',
}

function remove(id: string) {
  store.remove(id)
}

function clearAll() {
  store.clear()
}

function progressStyle(t: { createdAt: number; duration: number }) {
  const elapsed = Math.max(0, Date.now() - t.createdAt)
  const pct = Math.min(100, (elapsed / t.duration) * 100)
  return { width: `${100 - pct}%` }
}

const pointerState = ref<Record<string, { x: number; y: number; active: boolean }>>({})

function onPointerDown(e: PointerEvent, id: string) {
  pointerState.value = {
    ...pointerState.value,
    [id]: { x: e.clientX, y: e.clientY, active: true },
  }
}

function onPointerUp(e: PointerEvent, id: string) {
  const s = pointerState.value[id]
  if (!s?.active) return

  const dx = e.clientX - s.x
  const dy = e.clientY - s.y

  const isHorizontalSwipe = Math.abs(dx) > 70 && Math.abs(dy) < 40
  if (isHorizontalSwipe) remove(id)

  const next = { ...pointerState.value }
  delete next[id]
  pointerState.value = next
}

function onPointerCancel(id: string) {
  const next = { ...pointerState.value }
  delete next[id]
  pointerState.value = next
}

onMounted(() => {
  hostRef.value?.focus()
  const tick = window.setInterval(() => {
    if (toasts.value.length) {
      // força recalcular a progress bar via re-render mínimo
      // (não mexe na store)
    }
  }, 120)

  window.addEventListener('beforeunload', () => window.clearInterval(tick), { once: true })
})
</script>

<style scoped lang="scss">
.toast-host {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  outline: none;
}

.toast-stack {
  position: absolute;
  top: calc(16px + env(safe-area-inset-top, 0px));
  right: calc(16px + env(safe-area-inset-right, 0px));

  display: grid;
  gap: 12px;
  width: min(440px, calc(100vw - 32px));
}

@media (max-width: 480px) {
  .toast-stack {
    left: 16px;
    right: 16px;
    width: auto;
  }
}

.toast {
  pointer-events: auto;
  position: relative;
  border-radius: 14px;
  padding: 12px;
  background: rgba(16, 16, 26, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(14px);

  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.42),
    0 0 24px rgba(139, 92, 246, 0.16);

  overflow: hidden;
}

.toast__chrome {
  position: absolute;
  inset: -1px;
  border-radius: 14px;
  pointer-events: none;
  opacity: 0.85;

  background:
    radial-gradient(circle at 20% 0%, rgba(139, 92, 246, 0.28), transparent 60%),
    radial-gradient(circle at 90% 30%, rgba(30, 144, 255, 0.16), transparent 55%),
    linear-gradient(to right, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.00));

  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  padding: 1px;
  box-sizing: border-box;
}

.toast__content {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 10px;
  align-items: start;
}

.toast__icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
}

.toast__body {
  min-width: 0;
  display: grid;
  gap: 8px;
}

.toast__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.toast__title {
  font-weight: 900;
  letter-spacing: 0.2px;
  font-size: 0.95rem;
}

.toast__message {
  opacity: 0.92;
  line-height: 1.35;
  font-size: 0.95rem;
}

.toast__close {
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.85;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 10px;
  transition: opacity 160ms var(--ease-smooth, ease), background 160ms var(--ease-smooth, ease);
}

.toast__close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.06);
}

.toast__close:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.25);
}

.toast__meta {
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.toast__progress {
  height: 100%;
  border-radius: 999px;
  transition: width 120ms linear;
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.95), rgba(30, 144, 255, 0.75));
}

.toast--success {
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.42),
    0 0 28px rgba(34, 139, 34, 0.18);
}

.toast--error {
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.42),
    0 0 28px rgba(255, 69, 0, 0.18);
}

.toast--info {
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.42),
    0 0 28px rgba(30, 144, 255, 0.18);
}

.toast--warning {
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.42),
    0 0 28px rgba(255, 215, 0, 0.16);
}

/* Transition */
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 220ms var(--ease-smooth, ease);
}
</style>
