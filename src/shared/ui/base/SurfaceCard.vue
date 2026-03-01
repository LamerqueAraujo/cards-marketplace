<script setup lang="ts">
withDefaults(defineProps<{
  clickable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  disabled?: boolean
}>(), {
  padding: 'md',
  clickable: false,
  disabled: false
})
</script>

<template>
  <div class="surface-card" :class="[
    `surface-padding-${padding}`,
    {
      'surface-clickable': clickable && !disabled,
      'surface-disabled': disabled
    }
  ]" :aria-disabled="disabled ? 'true' : 'false'">
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

  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.28),
    0 0 18px var(--glow-primary);

  transition:
    transform 220ms var(--ease-smooth),
    box-shadow 220ms var(--ease-smooth),
    border-color 220ms var(--ease-smooth),
    background-color 220ms var(--ease-smooth);
}

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

.surface-clickable {
  cursor: pointer;
}

.surface-clickable:hover {
  transform: translateY(-2px);
  border-color: rgba(139, 92, 246, 0.55);
  box-shadow:
    0 18px 36px rgba(0, 0, 0, 0.38),
    0 0 26px var(--glow-primary);
}

.surface-clickable:active {
  transform: translateY(-1px);
}

.surface-disabled {
  opacity: 0.72;
  filter: saturate(0.85);
}
</style>
