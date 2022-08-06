<template>
  <div class="relative min-h-screen bg-indigo-900 text-gray-50">
    <HeaderComponent class="h-12" />
    <router-view class="pt-12" />
  </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';

export default {
  components: { HeaderComponent },
};
</script>
