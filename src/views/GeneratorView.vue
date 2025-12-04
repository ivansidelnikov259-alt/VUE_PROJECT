<template>
  <div class="generator-view">
    <PaletteGenerator />
  </div>
</template>

<script>
import PaletteGenerator from '../components/PaletteGenerator.vue'

export default {
  name: 'GeneratorView',
  components: {
    PaletteGenerator
  }
}
</script>

<style scoped>
.generator-view {
  width: 100%;
}
</style>