<script setup lang="ts">
import { computed } from 'vue'
import AppCard from './AppCard.vue'
import AppIconButton from './AppIconButton.vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  subtitle?: string
  width?: string
  maxHeight?: string
  showClose?: boolean
}>(), {
  width: '960px',
  maxHeight: '86vh',
  showClose: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'close'): void
}>()

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
  <q-dialog v-model="model" transition-show="fade" transition-hide="fade">
    <AppCard class="base-dialog" padding="none" variant="elevated" :style="{ width, maxHeight }">
      <!-- HEADER -->
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

      <!-- BODY -->
      <div class="dialog-body">
        <slot />
      </div>

      <!-- FOOTER -->
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

.dialog-close {
  flex: 0 0 auto;
}

.dialog-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: var(--space-6);
}

.dialog-body::-webkit-scrollbar {
  width: 6px;
}

.dialog-body::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.55);
  border-radius: 6px;
}

.dialog-footer {
  padding: var(--space-5) var(--space-6);
  border-top: 1px solid var(--surface-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  background: rgba(0, 0, 0, 0.22);
}
</style>
