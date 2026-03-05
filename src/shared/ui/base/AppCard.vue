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
  background: rgba(18, 18, 30, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  overflow: hidden;

  transition:
    transform 220ms var(--ease-smooth),
    box-shadow 220ms var(--ease-smooth),
    border-color 220ms var(--ease-smooth),
    background-color 220ms var(--ease-smooth),
    filter 220ms var(--ease-smooth);
}

.app-card::before {
  content: "";
  position: absolute;
  inset: -1px;
  background:
    radial-gradient(circle at 20% 0%, rgba(139, 92, 246, 0.16), transparent 55%),
    radial-gradient(circle at 90% 30%, rgba(30, 144, 255, 0.10), transparent 55%);
  opacity: 0.65;
  pointer-events: none;
  transition: opacity 220ms var(--ease-smooth);
}

.app-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom,
      rgba(255, 255, 255, 0.04),
      rgba(255, 255, 255, 0.00) 40%,
      rgba(0, 0, 0, 0.10));
  opacity: 0.55;
  pointer-events: none;
}

.app-card--variant-default {
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.32),
    0 0 18px rgba(139, 92, 246, 0.14);
}

.app-card--variant-elevated {
  box-shadow:
    0 18px 42px rgba(0, 0, 0, 0.44),
    0 0 26px var(--glow-primary);
}

.app-card--variant-subtle {
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.22);
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
  user-select: none;
}

.app-card--clickable:hover {
  transform: translateY(-3px);
  border-color: rgba(139, 92, 246, 0.45);
  filter: brightness(1.03);
}

.app-card--clickable:hover::before {
  opacity: 0.92;
}

.app-card--variant-default.app-card--clickable:hover {
  box-shadow:
    0 22px 50px rgba(0, 0, 0, 0.42),
    0 0 26px rgba(139, 92, 246, 0.22);
}

.app-card--variant-elevated.app-card--clickable:hover {
  box-shadow:
    0 26px 62px rgba(0, 0, 0, 0.50),
    0 0 34px var(--glow-primary);
}

.app-card--variant-subtle.app-card--clickable:hover {
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.30);
}

.app-card--clickable:active {
  transform: translateY(-1px);
}

.app-card--clickable:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px rgba(139, 92, 246, 0.35),
    0 0 24px rgba(139, 92, 246, 0.24);
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
