<script setup lang="ts">
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import AppCard from './AppCard.vue'
import AppIconButton from './AppIconButton.vue'

const $q = useQuasar()

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  subtitle?: string
  width?: string
  maxHeight?: string
  showClose?: boolean
  bodyScrollable?: boolean
}>(), {
  width: '960px',
  maxHeight: '86vh',
  showClose: true,
  bodyScrollable: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'close'): void
}>()

const isMobile = computed(() => $q.screen.lt.sm)

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

function close() {
  model.value = false
  emit('close')
}
</script>

<template>
  <q-dialog v-model="model" transition-show="fade" transition-hide="fade" :maximized="isMobile">
    <AppCard class="base-dialog" padding="none" variant="elevated" :class="[
      { 'base-dialog--mobile': isMobile },
      { 'base-dialog--no-body-scroll': !bodyScrollable }
    ]" :style="isMobile ? undefined : { width: props.width, height: props.maxHeight }">
      <div v-if="title || subtitle || $slots.header || showClose" class="dialog-header">
        <div class="dialog-titles">
          <slot name="header">
            <div v-if="title" class="dialog-title text-display">{{ title }}</div>
            <div v-if="subtitle" class="dialog-subtitle">{{ subtitle }}</div>
          </slot>
        </div>

        <div v-if="showClose" class="dialog-close">
          <AppIconButton icon="close" variant="ghost" size="md" @click="close" />
        </div>
      </div>

      <div class="dialog-body">
        <div class="dialog-scroller app-scroll">
          <slot />
        </div>
      </div>

      <div v-if="$slots.footer" class="dialog-footer">
        <slot name="footer" />
      </div>
    </AppCard>
  </q-dialog>
</template>

<style scoped lang="scss">
.base-dialog {
  max-width: 95vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dialog-header,
.dialog-footer {
  flex: 0 0 auto;
}

.base-dialog--mobile {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  border-radius: 0;
}

.dialog-header {
  padding: var(--space-5) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);

  background: linear-gradient(to right,
      rgba(139, 92, 246, 0.14),
      rgba(30, 144, 255, 0.05));
  border-bottom: 1px solid var(--surface-border);
}

.dialog-titles {
  min-width: 0;
}

.dialog-title {
  font-size: var(--text-title);
  font-weight: 800;
  margin: 0;
}

.dialog-subtitle {
  margin-top: var(--space-2);
  font-size: var(--text-body);
  color: var(--text-muted);
}

.dialog-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding: var(--space-6);
}

.dialog-scroller {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.base-dialog--no-body-scroll .dialog-scroller {
  overflow: hidden;
  padding-right: 0;
}

.app-scroll::-webkit-scrollbar {
  width: 7px;
}

.app-scroll::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.55);
  border-radius: 999px;
}

.app-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.04);
}

.app-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 92, 246, 0.55) rgba(255, 255, 255, 0.04);
}

.dialog-footer {
  padding: var(--space-5) var(--space-6);
  border-top: 1px solid var(--surface-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  background: rgba(0, 0, 0, 0.22);
}

@media (max-width: 599px) {
  .dialog-header {
    padding: var(--space-4);
  }

  .dialog-title {
    font-size: 22px;
    letter-spacing: 0.04em;
  }

  .dialog-body {
    padding: var(--space-4);
  }

  .dialog-footer {
    padding: var(--space-4);
  }
}
</style>
