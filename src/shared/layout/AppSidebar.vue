<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/modules/auth/store/auth.store'
import SidebarBanner from './SidebarBanner.vue'

const props = defineProps<{
  modelValue: boolean
  menuItems: {
    label: string
    icon: string
    route: string
  }[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const isMobile = computed(() => $q.screen.lt.md)
const userName = computed(() => authStore.userName || 'Conta')
const userEmail = computed(() => authStore.userEmail || '')

function updateDrawer(value: boolean) {
  emit('update:modelValue', value)
}

function closeDrawer() {
  updateDrawer(false)
}

function onNavigate(routeName: string) {
  void router.push({ name: routeName })
  if (isMobile.value) closeDrawer()
}

function logout() {
  authStore.logout()
  void router.push({ name: 'login' })
  if (isMobile.value) closeDrawer()
}
</script>

<template>
  <q-drawer :model-value="props.modelValue" @update:model-value="updateDrawer" :overlay="isMobile"
    :behavior="isMobile ? 'mobile' : 'desktop'" :width="280" bordered dark class="app-drawer">
    <div class="drawer">
      <div class="drawer__top">

        <SidebarBanner title="Duel Market" subtitle="Troque. Colecione. Domine." :closable="isMobile"
          @close="updateDrawer(false)" />
      </div>

      <div class="drawer__menu">
        <q-list padding>
          <q-item v-for="item in props.menuItems" :key="item.route" clickable v-ripple
            :active="route.name === item.route" active-class="drawer-item--active" class="drawer-item"
            @click="onNavigate(item.route)">
            <q-item-section avatar>
              <q-icon :name="item.icon" size="20px" />
            </q-item-section>

            <q-item-section>
              {{ item.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="drawer__bottom">
        <div class="account">
          <div class="account__meta">
            <div class="account__name">{{ userName }}</div>
            <div v-if="userEmail" class="account__email">{{ userEmail }}</div>
          </div>

          <q-btn unelevated class="account__logout" icon="logout" label="Sair" @click="logout" />
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<style scoped lang="scss">
.app-drawer {
  background: rgba(15, 15, 26, 0.92);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer__top {
  padding-top: 0px;
}

.drawer__close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.drawer__menu {
  flex: 1;
  overflow: auto;
  padding: 10px 0;
}

.drawer-item {
  border-radius: 10px;
  margin: 6px 12px;
  transition: background 0.2s ease, transform 0.15s ease;
}

.drawer-item {
  border-radius: 12px;
  margin: 6px 12px;
  padding: 10px 12px;

  color: rgba(255, 255, 255, 0.72);

  transition:
    background 180ms ease,
    transform 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease;
}

.drawer-item :deep(i) {
  color: rgba(255, 255, 255, 0.60);
  transition: color 180ms ease;
}

.drawer-item:hover {
  background: rgba(139, 92, 246, 0.12);
  transform: translateX(3px);
  color: rgba(255, 255, 255, 0.92);
}

.drawer-item:hover :deep(i) {
  color: rgba(255, 255, 255, 0.92);
}

.drawer-item--active {
  background:
    linear-gradient(90deg,
      rgba(139, 92, 246, 0.35),
      rgba(139, 92, 246, 0.15));

  border: 1px solid rgba(139, 92, 246, 0.35);

  color: #fff;

  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.25),
    0 0 18px rgba(139, 92, 246, 0.18);
}

.drawer-item--active :deep(i) {
  color: #fff;
}

.drawer__bottom {
  padding: 12px 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(to top, rgba(15, 15, 26, 0.95), rgba(15, 15, 26, 0.65));
}

.account {
  border-radius: 18px;
  padding: 14px;

  background:
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.02));

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(139, 92, 246, 0.08);
}

.account__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.account__name {
  font-weight: 800;
  font-size: 14px;
  color: #ffffff;
  letter-spacing: 0.02em;
}

.account__email {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.60);
  word-break: break-word;
}

.account__logout {
  width: 100%;
  border-radius: 14px;

  background: linear-gradient(90deg,
      rgba(139, 92, 246, 0.35),
      rgba(139, 92, 246, 0.15));
  border: 1px solid rgba(139, 92, 246, 0.25);
  color: #fff;

  transition:
    transform 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;
}

.account__logout:hover {
  transform: translateY(-2px);
  background: rgba(139, 92, 246, 0.22);

  box-shadow:
    0 12px 30px rgba(139, 92, 246, 0.18);
}
</style>
