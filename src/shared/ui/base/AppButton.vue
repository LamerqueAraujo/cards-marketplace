<script setup lang="ts">
import { computed, useAttrs } from 'vue'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  label?: string
  icon?: string
  iconRight?: string
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
  block: false
})

const emit = defineEmits<{
  (e: 'click', ev: Event): void
}>()

const attrs = useAttrs()

const sizeClass = computed(() => `app-btn--${props.size}`)
const variantClass = computed(() => `app-btn--${props.variant}`)

const quasarColor = computed(() => {
  if (props.variant === 'secondary') return 'secondary'
  if (props.variant === 'danger') return 'negative'
  return 'primary'
})

const qBtnProps = computed(() => {
  // ghost: flat e sem color (vamos estilizar via CSS)
  if (props.variant === 'ghost') {
    return {
      ...attrs,
      flat: true
    }
  }

  // default: unelevated com color
  return {
    ...attrs,
    unelevated: true,
    color: quasarColor.value
  }
})
</script>

<template>
  <q-btn v-bind="qBtnProps" :type="type" :label="label" :icon="icon" :icon-right="iconRight" :loading="loading"
    :disable="disabled" no-caps :class="['app-btn', sizeClass, variantClass, { 'app-btn--block': block }]"
    @click="emit('click', $event)" />
</template>

<style scoped lang="scss">
.app-btn {
  font-weight: 600;
  letter-spacing: 0.4px;
  border-radius: var(--radius-md);

  transition:
    transform 180ms var(--ease-smooth),
    filter 180ms var(--ease-smooth),
    box-shadow 180ms var(--ease-smooth),
    border-color 180ms var(--ease-smooth),
    background-color 180ms var(--ease-smooth);
}

.app-btn--block {
  width: 100%;
}

.app-btn--sm {
  padding: 6px 14px;
  font-size: 13px;
}

.app-btn--md {
  padding: 10px 18px;
  font-size: 14px;
}

.app-btn--lg {
  padding: 14px 24px;
  font-size: 16px;
}

.app-btn:not(.q-btn--disabled):hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
}

.app-btn--primary.bg-primary {
  box-shadow: 0 0 18px var(--glow-primary);
}

.app-btn--secondary.bg-secondary {
  box-shadow: 0 0 16px rgba(30, 144, 255, 0.28);
}

.app-btn--danger.bg-negative {
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.35);
}

.app-btn--ghost {
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.10);
  color: rgba(255, 255, 255, 0.88);
}

.app-btn--ghost:not(.q-btn--disabled):hover {
  border-color: rgba(139, 92, 246, 0.45);
  background: rgba(139, 92, 246, 0.06) !important;
  box-shadow: 0 0 14px rgba(139, 92, 246, 0.22);
}
</style>
