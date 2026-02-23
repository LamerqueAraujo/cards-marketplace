<script setup lang="ts">
import { onMounted } from 'vue'
import { api } from 'boot/axios'

onMounted(async () => {
  try {
    const res = await api.get('/cards?rpp=1&page=1')
    console.log('API OK:', res.data)
  } catch (err) {
    console.error('API ERROR:', err)
  }
})
</script>
