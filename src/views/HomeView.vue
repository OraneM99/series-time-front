<template>
  <main>
    <Navbar />
    <HeroCarousel />
    <Top10Section />
  </main>
</template>

<script setup>
import HeroCarousel from '@/views/components/HeroCarousel.vue'
import Top10Section from '@/views/components/Top10Section.vue'
import Navbar from "@/views/components/Navbar.vue";
</script>

<style scoped>
main {
  background: var(--bg-main);
}
</style>
