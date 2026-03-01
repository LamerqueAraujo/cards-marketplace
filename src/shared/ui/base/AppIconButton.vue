<script setup lang="ts">
import { computed, useAttrs } from 'vue'

type Variant = 'default' | 'primary' | 'danger' | 'ghost'

const props = withDefaults(defineProps<{
  icon: string
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  (e: 'click', ev: Event): void
}>()

const attrs = useAttrs()

const quasarColor = computed(() => {
  if (props.variant === 'primary') return 'primary'
  if (props.variant === 'danger') return 'negative'
  return undefined
})

const qBtnProps = computed(() => {
  const base = {
    ...attrs,
    round: true,
    dense: true,
    flat: true
  }

  if (props.variant === 'ghost') return base
  if (props.variant === 'default') return base

  return { ...base, color: quasarColor.value }
})

const sizeClass = computed(() => `app-icon-btn--${props.size}`)
const variantClass = computed(() => `app-icon-btn--${props.variant}`)
</script>

<template>
  <q-btn v-bind="qBtnProps" :icon="icon" :loading="loading" :disable="disabled"
    :class="['app-icon-btn', sizeClass, variantClass]" @click="emit('click', $event)" />
</template>

<style scoped lang="scss">
.app-icon-btn {
  border-radius: 999px;
  transition:
    transform 180ms var(--ease-smooth),
    filter 180ms var(--ease-smooth),
    box-shadow 180ms var(--ease-smooth),
    background-color 180ms var(--ease-smooth);
}

.app-icon-btn:not(.q-btn--disabled):hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
}

/* sizes */
.app-icon-btn--sm {
  width: 30px;
  height: 30px;
}

.app-icon-btn--md {
  width: 36px;
  height: 36px;
}

.app-icon-btn--lg {
  width: 42px;
  height: 42px;
}

/* variants */
.app-icon-btn--default {
  background: rgba(255, 255, 255, 0.04);
}

.app-icon-btn--ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.10);
}

.app-icon-btn--primary {
  background: rgba(139, 92, 246, 0.14);
  box-shadow: 0 0 14px var(--glow-primary);
}

.app-icon-btn--danger {
  background: rgba(239, 68, 68, 0.14);
  box-shadow: 0 0 14px rgba(239, 68, 68, 0.22);
}
</style>
