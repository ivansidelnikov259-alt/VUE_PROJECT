<template>
  <div class="palette-card">
    <div class="palette-header">
      <h4>{{ palette.name }}</h4>
      <div class="palette-date">
        {{ formatDate(palette.createdAt) }}
      </div>
    </div>
    
    <div class="palette-colors">
      <div 
        v-for="(color, index) in palette.colors" 
        :key="index"
        class="palette-color"
        :style="{ backgroundColor: color }"
        :title="color"
      />
    </div>
    
    <div class="palette-actions">
      <button @click="$emit('use')" class="action-btn use-btn">
        Использовать
      </button>
      <button @click="$emit('export')" class="action-btn export-btn">
        Экспорт
      </button>
      <button @click="$emit('delete')" class="action-btn delete-btn">
        Удалить
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaletteCard',
  
  props: {
    palette: {
      type: Object,
      required: true
    }
  },
  
  emits: ['use', 'export', 'delete'],
  
  setup() {
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
    
    return {
      formatDate
    }
  }
}
</script>

<style scoped>
/* Стили уже в theme.css */
</style>