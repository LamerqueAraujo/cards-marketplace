<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import SidebarBanner from './SidebarBanner.vue'

defineProps<{
  modelValue: boolean
  menuItems: {
    label: string
    icon: string
    route: string
  }[]
}>()

const emit = defineEmits(['update:modelValue'])

const route = useRoute()
const $q = useQuasar()

const isMobile = computed(() => $q.screen.lt.md)

function updateDrawer(value: boolean) {
  emit('update:modelValue', value)
}
</script>

<template>
  <q-drawer :model-value="modelValue" @update:model-value="updateDrawer" :overlay="isMobile"
    :behavior="isMobile ? 'mobile' : 'desktop'" :width="260" bordered dark class="app-drawer">
    <div class="drawer-content">

      <SidebarBanner title="Duel Market" subtitle="Trade. Build. Dominate." />

      <q-list padding>

        <q-item v-for="item in menuItems" :key="item.route" clickable v-ripple :to="{ name: item.route }"
          :active="route.name === item.route" active-class="drawer-active" class="drawer-item">
          <q-item-section avatar>
            <q-icon :name="item.icon" size="20px" />
          </q-item-section>

          <q-item-section>
            {{ item.label }}
          </q-item-section>
        </q-item>

      </q-list>

    </div>
  </q-drawer>
</template>

<style scoped lang="scss">
.app-drawer {
  background: rgba(15, 15, 26, 0.95);
  backdrop-filter: blur(8px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-brand {
  position: relative;
  padding: 24px 20px 16px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #ffffff;
}

.brand-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%,
      rgba(75, 0, 130, 0.2),
      transparent 60%);
  pointer-events: none;
}

.brand-text {
  position: relative;
  z-index: 1;
}

.drawer-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: background 0.2s ease, transform 0.15s ease;
}

.drawer-item:hover {
  background: rgba(75, 0, 130, 0.12);
  transform: translateX(2px);
}

.drawer-active {
  background: rgba(75, 0, 130, 0.2);
  color: #ffffff;
  border-left: 3px solid $primary;
}
</style>
