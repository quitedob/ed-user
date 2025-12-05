<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
  useHead({
    script: [{ src: 'https://player.polyv.net/resp/vod-player/latest/player.js' }]
  })
</script>
