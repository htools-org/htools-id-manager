<template>
  <div class="relative min-h-screen bg-indigo-900 text-gray-50">
    <Header class="h-12" />
    <router-view class="pt-12" />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  components: { Header },
};
</script>
