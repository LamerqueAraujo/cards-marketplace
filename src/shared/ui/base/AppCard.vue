<script setup lang="ts">
withDefaults(defineProps<{
  clickable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  disabled?: boolean
  variant?: 'default' | 'elevated' | 'subtle'
}>(), {
  padding: 'md',
  clickable: false,
  disabled: false,
  variant: 'default'
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
</script>

<template>
  <div class="surface-card" :class="[
    `surface-padding-${padding}`,
    `surface-variant-${variant}`,
    {
      'surface-clickable': clickable && !disabled,
      'surface-disabled': disabled
    }
  ]" :aria-disabled="disabled ? 'true' : 'false'" :role="clickable && !disabled ? 'button' : undefined"
    :tabindex="clickable && !disabled ? 0 : -1" @click="clickable && !disabled ? emit('click', $event) : undefined"
    @keydown="clickable && !disabled ? onKeydown($event) : undefined">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.surface-card {
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

/* Variants */
.surface-variant-default {
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.28),
    0 0 14px rgba(139, 92, 246, 0.14);
}

.surface-variant-elevated {
  box-shadow:
    0 18px 42px rgba(0, 0, 0, 0.40),
    0 0 22px var(--glow-primary);
}

.surface-variant-subtle {
  box-shadow:
    0 10px 22px rgba(0, 0, 0, 0.20);
}

/* Padding */
.surface-padding-none {
  padding: 0;
}

.surface-padding-sm {
  padding: var(--space-3);
}

.surface-padding-md {
  padding: var(--space-6);
}

.surface-padding-lg {
  padding: calc(var(--space-6) + var(--space-2));
}

/* Clickable */
.surface-clickable {
  cursor: pointer;
}

.surface-clickable:hover {
  transform: translateY(-2px);
  border-color: rgba(139, 92, 246, 0.55);
}

.surface-variant-default.surface-clickable:hover {
  box-shadow:
    0 18px 36px rgba(0, 0, 0, 0.38),
    0 0 20px rgba(139, 92, 246, 0.22);
}

.surface-variant-elevated.surface-clickable:hover {
  box-shadow:
    0 22px 50px rgba(0, 0, 0, 0.46),
    0 0 28px var(--glow-primary);
}

.surface-variant-subtle.surface-clickable:hover {
  box-shadow:
    0 14px 30px rgba(0, 0, 0, 0.26);
}

.surface-clickable:active {
  transform: translateY(-1px);
}

.surface-clickable:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px rgba(139, 92, 246, 0.35),
    0 0 22px var(--glow-primary);
}

/* Disabled */
.surface-disabled {
  opacity: 0.72;
  filter: saturate(0.85);
  pointer-events: none;
}
</style>
