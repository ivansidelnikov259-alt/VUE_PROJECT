<template>
  <div class="palette-generator">
    <!-- Заголовок -->
    <header class="header">
      <h1>🎨 Генератор цветовых палитр</h1>
      <p>Создавайте гармоничные цветовые схемы для ваших проектов</p>
    </header>
    
    <!-- Управление -->
    <div class="controls">
      <div class="control-group">
        <label>Количество цветов:</label>
        <select v-model="colorCount" @change="generatePalette" class="select">
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="7">7</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Формат:</label>
        <div class="format-toggle">
          <button 
            @click="format = 'hex'" 
            :class="{ active: format === 'hex' }"
            class="format-btn"
          >
            HEX
          </button>
          <button 
            @click="format = 'rgb'" 
            :class="{ active: format === 'rgb' }"
            class="format-btn"
          >
            RGB
          </button>
        </div>
      </div>
      
      <div class="control-group">
        <label>Тип палитры:</label>
        <select v-model="paletteType" @change="handlePaletteTypeChange" class="select">
          <option value="harmonious">Гармоничная</option>
          <option value="monochromatic">Монохромная</option>
          <option value="analogous">Аналогичная</option>
          <option value="triadic">Триада</option>
          <option value="complementary">Комплементарная</option>
          <option value="mood">По настроению</option>
        </select>
      </div>
      
      <!-- Переключатель базового цвета (показывается для всех типов) -->
      <div class="control-group toggle-group">
        <label class="toggle-label">
          <input 
            type="checkbox" 
            v-model="useBaseColor" 
            @change="handleBaseColorToggle"
            class="toggle-checkbox"
          />
          <span class="toggle-slider"></span>
          Использовать базовый цвет
        </label>
      </div>
      
      <!-- Выбор базового цвета (показывается при включенном переключателе) -->
      <div class="control-group" v-if="useBaseColor">
        <label>Базовый цвет:</label>
        <div class="base-color-picker">
          <input type="color" v-model="baseColor" @change="generatePalette" />
          <input type="text" v-model="baseColor" class="color-text" @change="generatePalette" />
          <button @click="generateRandomBaseColor" class="random-color-btn" title="Случайный цвет">
            🎲
          </button>
        </div>
      </div>
      
      <!-- Выбор настроения (только для типа "mood") -->
      <div class="control-group" v-if="paletteType === 'mood'">
        <label>Настроение:</label>
        <select v-model="selectedMood" class="select" @change="generatePalette">
          <option value="calm">Спокойные</option>
          <option value="energetic">Энергичные</option>
          <option value="professional">Профессиональные</option>
          <option value="creative">Креативные</option>
          <option value="random">Случайное</option>
        </select>
      </div>
      
      <div class="action-buttons">
        <button @click="generatePalette" class="generate-btn">
          🎲 {{ useBaseColor ? 'Создать палитру' : 'Случайная палитра' }}
        </button>
        
        <button @click="saveCurrentPalette" class="save-btn">
          💾 Сохранить палитру
        </button>
      </div>
    </div>
    
    <!-- Палитра -->
    <div class="palette-container">
      <ColorCard
        v-for="(color, index) in colors" 
        :key="index"
        :color="color"
        :format="format"
        :show-pin="true"
        :is-pinned="pinnedColors.includes(color)"
        :show-contrast="false"
        @click="copyColor(color, index)"
        @toggle-pin="togglePinColor(color)"
        @copy="copyColor(color, index)"
      />
    </div>
    
    <!-- Статус -->
    <div class="status">
      <p>Закреплено цветов: {{ pinnedColors.length }}</p>
      <p v-if="savedPalettes.length > 0">
        Сохраненных палитр: {{ savedPalettes.length }}
      </p>
      <p>Текущая тема: {{ isDarkTheme ? '🌙 Тёмная' : '☀️ Светлая' }}</p>
      <p>Тип палитры: {{ getPaletteTypeName(paletteType) }}</p>
      <p v-if="useBaseColor">Базовый цвет: {{ baseColor }}</p>
      <p v-if="paletteType === 'mood'">Настроение: {{ getMoodName(selectedMood) }}</p>
    </div>
    
    <!-- Mockup превью -->
    <div class="mockup-preview">
      <h3>Превью интерфейса:</h3>
      <div class="mockup">
        <div class="mockup-header" :style="{ backgroundColor: colors[0] || '#667eea' }">
          <h4 :style="{ color: getContrastColor(colors[0] || '#667eea') }">
            Заголовок
          </h4>
        </div>
        <div class="mockup-content" :style="{ backgroundColor: colors[1] || '#f8f9fa' }">
          <p :style="{ color: getContrastColor(colors[1] || '#f8f9fa') }">
            Текст контента с примером использования цветов
          </p>
          <button 
            class="mockup-btn"
            :style="{ 
              backgroundColor: colors[2] || '#007bff',
              color: getContrastColor(colors[2] || '#007bff')
            }"
          >
            Кнопка
          </button>
        </div>
        <div class="mockup-footer" :style="{ backgroundColor: colors[3] || '#343a40' }">
          <p :style="{ color: getContrastColor(colors[3] || '#343a40') }">
            Футер
          </p>
        </div>
      </div>
    </div>
    
    <!-- Компонент проверки контраста -->
    <div class="contrast-section">
      <h3>🔍 Проверка контраста</h3>
      <ContrastChecker />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useColorPalette } from '../composables/useColorPalette'
import { hexToRgb, getContrastRatio, generateRandomColor } from '../utils/colorUtils'
import { 
  generateHarmoniousPalette, 
  generateMonochromatic,
  generateAnalogousPalette,
  generateTriadicPalette,
  generateComplementaryPalette,
  generateMoodPalette
} from '../utils/colorUtils'
import ContrastChecker from './ContrastChecker.vue'
import ColorCard from './ColorCard.vue'
import { useTheme } from '../composables/useTheme'

export default {
  name: 'PaletteGenerator',
  
  components: {
    ContrastChecker,
    ColorCard
  },
  
  setup() {
    const {
      colors,
      pinnedColors,
      colorCount,
      format,
      savedPalettes,
      generatePalette: baseGeneratePalette,
      copyToClipboard,
      togglePinColor,
      savePalette
    } = useColorPalette()
    
    const { isDarkTheme } = useTheme()
    
    const copiedIndex = ref(-1)
    const paletteType = ref('harmonious')
    const selectedMood = ref('calm')
    const baseColor = ref('#667eea')
    const useBaseColor = ref(false)
    
    // Преобразование HEX в RGB строку
    const hexToRgbString = (hex) => {
      const rgb = hexToRgb(hex)
      return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ''
    }
    
    // Копирование цвета
    const copyColor = async (color, index) => {
      const colorToCopy = format.value === 'hex' ? color : hexToRgbString(color)
      const success = await copyToClipboard(colorToCopy)
      
      if (success) {
        copiedIndex.value = index
        setTimeout(() => {
          copiedIndex.value = -1
        }, 2000)
      }
    }
    
    // Получение контрастного цвета для текста
    const getContrastColor = (backgroundColor) => {
      if (!backgroundColor) return '#000'
      
      const whiteContrast = getContrastRatio(backgroundColor, '#ffffff')
      const blackContrast = getContrastRatio(backgroundColor, '#000000')
      
      return whiteContrast > blackContrast ? '#ffffff' : '#000000'
    }
    
    // Сохранение текущей палитры
    const saveCurrentPalette = () => {
      const name = prompt('Введите название палитры:', `Palette ${savedPalettes.value.length + 1}`)
      if (name) {
        savePalette(name)
        alert(`Палитра "${name}" сохранена!`)
      }
    }
    
    // Обработка изменения типа палитры
    const handlePaletteTypeChange = () => {
      generatePalette()
    }
    
    // Обработка переключения базового цвета
    const handleBaseColorToggle = () => {
      if (useBaseColor.value && !baseColor.value) {
        baseColor.value = '#667eea'
      }
      generatePalette()
    }
    
    // Генерация случайного базового цвета
    const generateRandomBaseColor = () => {
      baseColor.value = generateRandomColor()
      generatePalette()
    }
    
    // Получение читаемого имени типа палитры
    const getPaletteTypeName = (type) => {
      const names = {
        harmonious: 'Гармоничная',
        monochromatic: 'Монохромная',
        analogous: 'Аналогичная',
        triadic: 'Триада',
        complementary: 'Комплементарная',
        mood: 'По настроению'
      }
      return names[type] || type
    }
    
    // Получение читаемого имени настроения
    const getMoodName = (mood) => {
      const names = {
        calm: 'Спокойные',
        energetic: 'Энергичные',
        professional: 'Профессиональные',
        creative: 'Креативные',
        random: 'Случайное'
      }
      return names[mood] || mood
    }
    
    // Генерация палитры с учетом типа
    const generatePalette = () => {
      let newColors
      
      if (useBaseColor.value && paletteType.value !== 'mood') {
        // Генерация на основе базового цвета
        switch(paletteType.value) {
          case 'monochromatic':
            newColors = generateMonochromatic(baseColor.value, colorCount.value)
            break
            
          case 'analogous':
            newColors = generateAnalogousPalette(baseColor.value, colorCount.value)
            break
            
          case 'triadic':
            newColors = generateTriadicPalette(baseColor.value, colorCount.value)
            break
            
          case 'complementary':
            newColors = generateComplementaryPalette(baseColor.value, colorCount.value)
            break
            
          default: // harmonious
            newColors = generateHarmoniousPalette(colorCount.value, baseColor.value)
            break
        }
      } else if (paletteType.value === 'mood') {
        // Генерация по настроению
        const mood = selectedMood.value === 'random' 
          ? ['calm', 'energetic', 'professional', 'creative'][Math.floor(Math.random() * 4)]
          : selectedMood.value
        newColors = generateMoodPalette(mood, colorCount.value)
      } else {
        // Случайная генерация без базового цвета
        newColors = generateHarmoniousPalette(colorCount.value)
      }
      
      // Сохраняем закрепленные цвета
      if (pinnedColors.value.length > 0) {
        pinnedColors.value.forEach((pinnedColor, index) => {
          if (index < newColors.length) {
            newColors[index] = pinnedColor
          }
        })
      }
      
      colors.value = newColors
      
      // Сохраняем настройки в localStorage
      saveSettings()
    }
    
    // Сохранение настроек
    const saveSettings = () => {
      try {
        localStorage.setItem('currentPalette', JSON.stringify(colors.value))
        localStorage.setItem('paletteType', paletteType.value)
        localStorage.setItem('useBaseColor', useBaseColor.value.toString())
        localStorage.setItem('baseColor', baseColor.value)
        if (paletteType.value === 'mood') {
          localStorage.setItem('selectedMood', selectedMood.value)
        }
      } catch (error) {
        console.error('Error saving settings:', error)
      }
    }
    
    // Загрузка сохраненных настроек
    const loadSettings = () => {
      try {
        const savedType = localStorage.getItem('paletteType')
        if (savedType) paletteType.value = savedType
        
        const savedUseBaseColor = localStorage.getItem('useBaseColor')
        if (savedUseBaseColor !== null) useBaseColor.value = savedUseBaseColor === 'true'
        
        const savedBaseColor = localStorage.getItem('baseColor')
        if (savedBaseColor) baseColor.value = savedBaseColor
        
        const savedMood = localStorage.getItem('selectedMood')
        if (savedMood) selectedMood.value = savedMood
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
    
    // Загружаем настройки при инициализации
    onMounted(() => {
      loadSettings()
      generatePalette()
    })
    
    return {
      colors,
      pinnedColors,
      colorCount,
      format,
      savedPalettes,
      isDarkTheme,
      copiedIndex,
      paletteType,
      selectedMood,
      baseColor,
      useBaseColor,
      generatePalette,
      copyColor,
      togglePinColor,
      hexToRgbString,
      getContrastColor,
      saveCurrentPalette,
      handlePaletteTypeChange,
      handleBaseColorToggle,
      generateRandomBaseColor,
      getPaletteTypeName,
      getMoodName
    }
  }
}
</script>

<style scoped>
.palette-generator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: var(--text-primary);
  margin-bottom: 10px;
}

.header p {
  color: var(--text-secondary);
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: flex-start;
  background: var(--bg-tertiary);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.control-group label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
}

.toggle-group {
  margin-top: 8px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  user-select: none;
}

.toggle-checkbox {
  display: none;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  background-color: var(--border-color);
  border-radius: 20px;
  transition: background-color 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  background-color: white;
  transition: transform 0.3s;
}

.toggle-checkbox:checked + .toggle-slider {
  background-color: var(--primary);
}

.toggle-checkbox:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.select {
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  border-radius: 5px;
  background: var(--input-bg);
  color: var(--text-primary);
  cursor: pointer;
  min-width: 160px;
}

.select:focus {
  outline: none;
  border-color: #667eea;
}

.format-toggle {
  display: flex;
  gap: 5px;
}

.format-btn {
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 5px;
  flex: 1;
}

.format-btn:hover {
  background: var(--bg-tertiary);
}

.format-btn.active {
  background: var(--button-primary-bg);
  color: white;
  border-color: var(--button-primary-bg);
}

.base-color-picker {
  display: flex;
  gap: 10px;
  align-items: center;
}

.base-color-picker input[type="color"] {
  width: 50px;
  height: 40px;
  border: 2px solid var(--border-color);
  border-radius: 5px;
  cursor: pointer;
}

.color-text {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  border-radius: 5px;
  background: var(--input-bg);
  color: var(--text-primary);
  min-width: 120px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.random-color-btn {
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.random-color-btn:hover {
  background: var(--bg-tertiary);
  transform: scale(1.05);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}

.generate-btn, .save-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.3s, opacity 0.3s;
  font-size: 0.95rem;
  min-width: 180px;
}

.generate-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.save-btn {
  background: var(--button-success-bg);
  color: white;
}

.generate-btn:hover, .save-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.palette-container {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.status {
  background: var(--bg-tertiary);
  padding: 15px 20px;
  border-radius: 5px;
  margin-bottom: 30px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  border: 1px solid var(--border-color);
  font-size: 0.9rem;
}

.status p {
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.mockup-preview {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px var(--shadow-color);
  margin-bottom: 30px;
  border: 1px solid var(--border-color);
}

.mockup-preview h3 {
  color: var(--text-primary);
  margin-bottom: 15px;
}

.mockup {
  border: 1px solid var(--border-color);
  border-radius: 5px;
  overflow: hidden;
  margin: 20px 0;
}

.mockup-header, .mockup-content, .mockup-footer {
  padding: 20px;
}

.mockup-header h4 {
  margin: 0;
  font-size: 20px;
}

.mockup-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mockup-content p {
  margin: 0;
  font-size: 14px;
}

.mockup-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: fit-content;
  font-weight: bold;
  transition: opacity 0.3s;
}

.mockup-btn:hover {
  opacity: 0.9;
}

.contrast-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.contrast-section h3 {
  color: var(--text-primary);
  margin-bottom: 15px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-group {
    width: 100%;
    min-width: unset;
  }
  
  .select, .format-btn, .generate-btn, .save-btn {
    width: 100%;
  }
  
  .format-toggle {
    width: 100%;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .base-color-picker {
    width: 100%;
    justify-content: flex-start;
  }
  
  .status {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .palette-container {
    gap: 8px;
  }
  
  .color-text {
    min-width: 100px;
  }
}
</style>