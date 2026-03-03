<script setup lang="ts">
type Padding = 'none' | 'sm' | 'md' | 'lg'
type Variant = 'default' | 'elevated' | 'subtle'

const props = withDefaults(defineProps<{
  clickable?: boolean
  padding?: Padding
  disabled?: boolean
  variant?: Variant
  noTopBorder?: boolean
}>(), {
  padding: 'md',
  clickable: false,
  disabled: false,
  variant: 'default',
  noTopBorder: false
})

const emit = defineEmits<{
  (e: 'click', ev: Event): void
}>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('click', e)
  }
}

function onClick(ev: Event) {
  if (!props.clickable || props.disabled) return
  emit('click', ev)
}
</script>

<template>
  <div class="app-card" :class="[
    `app-card--pad-${padding}`,
    `app-card--variant-${variant}`,
    {
      'app-card--clickable': clickable && !disabled,
      'app-card--disabled': disabled,
      'app-card--no-top-border': noTopBorder
    }
  ]" :aria-disabled="disabled ? 'true' : 'false'" :role="clickable && !disabled ? 'button' : undefined"
    :tabindex="clickable && !disabled ? 0 : -1" @click="onClick"
    @keydown="clickable && !disabled ? onKeydown($event) : undefined">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.app-card {
  position: relative;
  border-radius: var(--radius-lg);
  background: var(--surface-2);
  border: 1px solid var(--surface-border);
  backdrop-filter: blur(10px);

  transition:
    transform 220ms var(--ease-smooth),
    box-shadow 220ms var(--ease-smooth),
    border-color 220ms var(--ease-smooth),
    background-color 220ms var(--ease-smooth);
}

.app-card--variant-default {
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.28),
    0 0 14px rgba(139, 92, 246, 0.14);
}

.app-card--variant-elevated {
  box-shadow:
    0 18px 42px rgba(0, 0, 0, 0.40),
    0 0 22px var(--glow-primary);
}

.app-card--variant-subtle {
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.20);
}

.app-card--pad-none {
  padding: 0;
}

.app-card--pad-sm {
  padding: var(--space-3);
}

.app-card--pad-md {
  padding: var(--space-6);
}

.app-card--pad-lg {
  padding: calc(var(--space-6) + var(--space-2));
}

.app-card--clickable {
  cursor: pointer;
}

.app-card--clickable:hover {
  transform: translateY(-2px);
  border-color: rgba(139, 92, 246, 0.55);
}

.app-card--variant-default.app-card--clickable:hover {
  box-shadow:
    0 18px 36px rgba(0, 0, 0, 0.38),
    0 0 20px rgba(139, 92, 246, 0.22);
}

.app-card--variant-elevated.app-card--clickable:hover {
  box-shadow:
    0 22px 50px rgba(0, 0, 0, 0.46),
    0 0 28px var(--glow-primary);
}

.app-card--variant-subtle.app-card--clickable:hover {
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.26);
}

.app-card--clickable:active {
  transform: translateY(-1px);
}

.app-card--clickable:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px rgba(139, 92, 246, 0.35),
    0 0 22px var(--glow-primary);
}

.app-card--disabled {
  opacity: 0.72;
  filter: saturate(0.85);
  pointer-events: none;
}

.app-card--no-top-border {
  border-top-color: transparent;
}
</style>
