<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  subtitle?: string
  width?: string
}>(), {
  width: '1000px'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" transition-show="fade"
    transition-hide="fade">
    <div class="base-dialog" :style="{ width }">

      <!-- HEADER -->
      <div class="dialog-header">
        <div>
          <div v-if="title" class="dialog-title text-display">
            {{ title }}
          </div>

          <div v-if="subtitle" class="dialog-subtitle">
            {{ subtitle }}
          </div>
        </div>

        <q-btn flat round dense icon="close" @click="close" />
      </div>

      <!-- BODY -->
      <div class="dialog-body">
        <slot />
      </div>

      <!-- FOOTER -->
      <div v-if="$slots.footer" class="dialog-footer">
        <slot name="footer" />
      </div>

    </div>
  </q-dialog>
</template>

<style scoped lang="scss">
.base-dialog {
  max-width: 95vw;
  height: 80vh;

  display: flex;
  flex-direction: column;

  border-radius: var(--radius-lg);
  background: var(--surface-1);

  border: 1px solid var(--surface-border);

  box-shadow:
    0 40px 100px rgba(0, 0, 0, .85),
    0 0 40px var(--glow-primary);

  overflow: hidden;

  transition: box-shadow 220ms var(--ease-smooth);
}

/* HEADER */
.dialog-header {
  padding: var(--space-5) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: linear-gradient(to right,
      rgba(139, 92, 246, .15),
      rgba(30, 144, 255, .05));

  border-bottom: 1px solid var(--surface-border);
}

.dialog-title {
  font-size: var(--text-title);
  font-weight: 700;
}

.dialog-subtitle {
  margin-top: 4px;
  font-size: var(--text-caption);
  color: rgba(255, 255, 255, .6);
}

/* BODY */
.dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
}

.dialog-body::-webkit-scrollbar {
  width: 6px;
}

.dialog-body::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, .6);
  border-radius: 6px;
}

/* FOOTER */
.dialog-footer {
  padding: var(--space-5) var(--space-6);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-4);

  border-top: 1px solid var(--surface-border);
  background: rgba(0, 0, 0, .25);
}
</style>
