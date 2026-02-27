<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title?: string | undefined
  subtitle?: string | undefined
  width?: string | undefined
}>()

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
    <div class="base-dialog" :style="{ width: width || '1000px' }">

      <!-- HEADER -->
      <div class="dialog-header">
        <div>
          <div class="dialog-title">{{ title }}</div>
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

  border-radius: 20px;
  background: #14142a;

  box-shadow:
    0 40px 100px rgba(0, 0, 0, .9),
    inset 0 0 0 1px rgba(255, 255, 255, .04);

  overflow: hidden;
}

/* HEADER */
.dialog-header {
  padding: 22px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: linear-gradient(to right,
      rgba(75, 0, 130, .15),
      rgba(30, 144, 255, .05));

  border-bottom: 1px solid rgba(255, 255, 255, .05);
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.dialog-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, .6);
}

/* BODY */
.dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}

.dialog-body::-webkit-scrollbar {
  width: 6px;
}

.dialog-body::-webkit-scrollbar-thumb {
  background: rgba(138, 43, 226, .6);
  border-radius: 6px;
}

/* FOOTER */
.dialog-footer {
  padding: 18px 28px;
  display: flex;
  justify-content: flex-end;
  gap: 14px;

  border-top: 1px solid rgba(255, 255, 255, .05);
  background: rgba(0, 0, 0, .25);
}
</style>
