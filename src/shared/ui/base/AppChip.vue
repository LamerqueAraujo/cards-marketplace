<script setup lang="ts">
import { computed, useAttrs } from 'vue'

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
type Size = 'sm' | 'md'

const props = withDefaults(defineProps<{
  label: string
  icon?: string
  variant?: Variant
  size?: Size
  clickable?: boolean
}>(), {
  variant: 'default',
  size: 'md',
  clickable: false
})

const emit = defineEmits<{
  (e: 'click', ev: Event): void
}>()

const attrs = useAttrs()

const sizeClass = computed(() => `app-chip--${props.size}`)
const variantClass = computed(() => `app-chip--${props.variant}`)
</script>

<template>
  <div v-bind="attrs" class="app-chip" :class="[sizeClass, variantClass, { 'app-chip--clickable': clickable }]"
    :role="clickable ? 'button' : undefined" :tabindex="clickable ? 0 : -1"
    @click="clickable ? emit('click', $event) : undefined" @keydown="(e) => {
      if (!clickable) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        emit('click', e)
      }
    }">
    <q-icon v-if="icon" :name="icon" class="app-chip__icon" />
    <span class="app-chip__label">{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
.app-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  border-radius: 999px;
  padding: 8px 12px;

  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(10px);

  color: rgba(255, 255, 255, 0.88);
  font-weight: 700;
  letter-spacing: 0.2px;

  transition:
    transform 180ms var(--ease-smooth),
    filter 180ms var(--ease-smooth),
    box-shadow 180ms var(--ease-smooth),
    border-color 180ms var(--ease-smooth),
    background-color 180ms var(--ease-smooth);
}

.app-chip--sm {
  padding: 6px 10px;
  font-size: 12px;
}

.app-chip--md {
  padding: 8px 12px;
  font-size: 13px;
}

.app-chip__icon {
  font-size: 16px;
  opacity: 0.95;
}

.app-chip--clickable {
  cursor: pointer;
}

.app-chip--clickable:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
  border-color: rgba(255, 255, 255, 0.16);
}

.app-chip--primary {
  border-color: rgba(139, 92, 246, 0.35);
  box-shadow: 0 0 16px rgba(139, 92, 246, 0.18);
}

.app-chip--success {
  border-color: rgba(34, 139, 34, 0.38);
  box-shadow: 0 0 14px rgba(34, 139, 34, 0.18);
}

.app-chip--warning {
  border-color: rgba(255, 215, 0, 0.38);
  box-shadow: 0 0 14px rgba(255, 215, 0, 0.16);
}

.app-chip--danger {
  border-color: rgba(239, 68, 68, 0.42);
  box-shadow: 0 0 14px rgba(239, 68, 68, 0.16);
}

.app-chip--info {
  border-color: rgba(30, 144, 255, 0.40);
  box-shadow: 0 0 14px rgba(30, 144, 255, 0.16);
}
</style>
