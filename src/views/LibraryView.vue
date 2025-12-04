<template>
  <div class="library-view">
    <div class="library-header">
      <h2>📚 Библиотека палитр</h2>
      <div class="search-controls">
        <input 
          v-model="searchQuery"
          placeholder="Поиск по названию..."
          class="search-input"
        />
        <button @click="clearSearch" class="clear-btn">
          Очистить
        </button>
      </div>
    </div>
    
    <div v-if="filteredPalettes.length === 0" class="empty-library">
      <p>Сохраненных палитр пока нет.</p>
      <router-link to="/generator" class="cta-link">
        Создать первую палитру →
      </router-link>
    </div>
    
    <div v-else class="palettes-grid">
      <PaletteCard
        v-for="palette in filteredPalettes"
        :key="palette.id"
        :palette="palette"
        @use="usePalette(palette)"
        @export="exportPalette(palette)"
        @delete="deletePalette(palette.id)"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useColorPalette } from '../composables/useColorPalette'
import PaletteCard from '../components/PaletteCard.vue'

export default {
  name: 'LibraryView',
  
  components: {
    PaletteCard
  },
  
  setup() {
    const { savedPalettes, deletePalette } = useColorPalette()
    const searchQuery = ref('')
    
    const filteredPalettes = computed(() => {
      if (!searchQuery.value) return savedPalettes.value
      
      return savedPalettes.value.filter(palette =>
        palette.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })
    
    const usePalette = (palette) => {
      localStorage.setItem('currentPalette', JSON.stringify(palette.colors))
      alert(`Палитра "${palette.name}" загружена! Перейдите во вкладку "Генератор"`)
    }
    
    const exportPalette = (palette) => {
      const json = JSON.stringify(palette, null, 2)
      navigator.clipboard.writeText(json)
      alert(`Палитра "${palette.name}" скопирована в формате JSON!`)
    }
    
    const clearSearch = () => {
      searchQuery.value = ''
    }
    
    return {
      savedPalettes,
      searchQuery,
      filteredPalettes,
      usePalette,
      exportPalette,
      deletePalette,
      clearSearch
    }
  }
}
</script>

<style scoped>
.library-view {
  max-width: 1200px;
  margin: 0 auto;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.search-controls {
  display: flex;
  gap: 10px;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
</style>