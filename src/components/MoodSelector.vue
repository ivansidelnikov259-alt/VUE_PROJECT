<template>
  <div class="mood-selector">
    <div class="mood-header">
      <h3>🎭 Генерация по настроению</h3>
      <p>Выберите настроение для генерации палитры</p>
    </div>
    
    <div class="mood-options">
      <div 
        v-for="mood in moodOptions" 
        :key="mood.id"
        class="mood-option"
        :class="{ active: selectedMood === mood.id }"
        @click="selectMood(mood.id)"
      >
        <div class="mood-icon">{{ mood.icon }}</div>
        <div class="mood-name">{{ mood.name }}</div>
      </div>
    </div>
    
    
    <div class="mood-info" v-if="selectedMoodInfo">
      <p>{{ selectedMoodInfo.description }}</p>
      <div class="preview-colors">
        <div 
          v-for="(color, index) in selectedMoodInfo.previewColors" 
          :key="index"
          class="preview-color"
          :style="{ backgroundColor: color }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { generateMoodPalette } from '../utils/colorUtils'

export default {
  name: 'MoodSelector',
  
  emits: ['palette-generated'],
  
  setup(props, { emit }) {
    const moodOptions = ref([
      {
        id: 'calm',
        name: 'Спокойные',
        icon: '😌',
        description: 'Мягкие, пастельные тона для расслабляющей атмосферы',
        previewColors: ['#a8d8ea', '#aa96da', '#fcbad3', '#ffffd2']
      },
      {
        id: 'energetic',
        name: 'Энергичные',
        icon: '⚡',
        description: 'Яркие, насыщенные цвета для динамичных проектов',
        previewColors: ['#ff165d', '#ff9a00', '#ffde00', '#08ffc8']
      },
      {
        id: 'professional',
        name: 'Профессиональные',
        icon: '💼',
        description: 'Сдержанные, деловые тона для корпоративного стиля',
        previewColors: ['#2d4059', '#ea5455', '#f07b3f', '#ffd460']
      },
      {
        id: 'creative',
        name: 'Креативные',
        icon: '🎨',
        description: 'Неожиданные сочетания для творческих проектов',
        previewColors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#1a535c']
      }
    ])
    
    const selectedMood = ref('calm')
    
    const selectedMoodInfo = computed(() => {
      return moodOptions.value.find(m => m.id === selectedMood.value)
    })
    
    const selectMood = (moodId) => {
      selectedMood.value = moodId
    }
    
    const generatePalette = () => {
      const colors = generateMoodPalette(selectedMood.value, 5)
      emit('palette-generated', colors)
      
      // Сохраняем выбранное настроение
      try {
        localStorage.setItem('selectedMood', selectedMood.value)
      } catch (error) {
        console.error('Error saving mood:', error)
      }
    }
    
    return {
      moodOptions,
      selectedMood,
      selectedMoodInfo,
      selectMood,
      generatePalette
    }
  }
}
</script>

<style scoped>
.mood-selector {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-default);
  margin: 1.5rem 0;
}

.mood-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.mood-header h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.mood-header p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
}

.mood-options {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.mood-option {
  background: var(--bg-tertiary);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 90px;
}

.mood-option:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-default);
  border-color: var(--primary-light);
}

.mood-option.active {
  border-color: var(--primary);
  background: rgba(59, 130, 246, 0.1);
  box-shadow: var(--shadow-default);
}

.mood-icon {
  font-size: 1.5rem;
}

.mood-name {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

.generate-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all var(--transition-normal);
  margin-bottom: 1.5rem;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  opacity: 0.9;
}

.mood-info {
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 1rem;
  border: 1px solid var(--border);
}

.mood-info p {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.preview-colors {
  display: flex;
  gap: 0.5rem;
}

.preview-color {
  flex: 1;
  height: 30px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Адаптивность */
@media (max-width: 768px) {
  .mood-options {
    gap: 0.5rem;
  }
  
  .mood-option {
    min-width: 80px;
    padding: 0.5rem 0.75rem;
  }
  
  .mood-icon {
    font-size: 1.25rem;
  }
  
  .mood-name {
    font-size: 0.75rem;
  }
}
</style>