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
        <select v-model="paletteType" class="select">
          <option value="harmonious">Гармоничная</option>
          <option value="monochromatic">Монохромная</option>
        </select>
      </div>
      
      <button @click="generatePalette" class="generate-btn">
        🎲 Случайная палитра
      </button>
      
      <button @click="saveCurrentPalette" class="save-btn">
        💾 Сохранить палитру
      </button>
    </div>
    
    <!-- Палитра -->
    <div class="palette-container">
      <div 
        v-for="(color, index) in colors" 
        :key="index"
        class="color-card"
        :style="{ backgroundColor: color }"
        @click="copyColor(color, index)"
      >
        <div class="color-info">
          <div class="color-value">
            {{ format === 'hex' ? color : hexToRgbString(color) }}
          </div>
          <div class="color-actions">
            <button 
              @click.stop="togglePinColor(color)"
              :class="{ pinned: pinnedColors.includes(color) }"
              class="pin-btn"
              :title="pinnedColors.includes(color) ? 'Открепить' : 'Закрепить'"
            >
              📌
            </button>
            <button 
              @click.stop="copyColor(color, index)"
              class="copy-btn"
              title="Скопировать"
            >
              📋
            </button>
          </div>
        </div>
        
        <!-- Индикатор копирования -->
        <div v-if="copiedIndex === index" class="copied-notification">
          Скопировано!
        </div>
      </div>
    </div>
    
    <!-- Статус -->
    <div class="status">
      <p>Закреплено цветов: {{ pinnedColors.length }}</p>
      <p v-if="savedPalettes.length > 0">
        Сохраненных палитр: {{ savedPalettes.length }}
      </p>
      <p>Текущая тема: {{ isDarkTheme ? '🌙 Тёмная' : '☀️ Светлая' }}</p>
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
import { ref, computed } from 'vue'
import { useColorPalette } from '../composables/useColorPalette'
import { hexToRgb, getContrastRatio } from '../utils/colorUtils'
import ContrastChecker from './ContrastChecker.vue'
import { useTheme } from '../composables/useTheme'

export default {
  name: 'PaletteGenerator',
  
  components: {
    ContrastChecker
  },
  
  setup() {
    const {
      colors,
      pinnedColors,
      colorCount,
      format,
      savedPalettes,
      generatePalette,
      copyToClipboard,
      togglePinColor,
      savePalette
    } = useColorPalette()
    
    const { isDarkTheme } = useTheme()
    
    const copiedIndex = ref(-1)
    const paletteType = ref('harmonious')
    
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
    
    // Генерация палитры с учетом типа
    const generatePaletteWithType = () => {
      generatePalette(paletteType.value)
    }
    
    return {
      colors,
      pinnedColors,
      colorCount,
      format,
      savedPalettes,
      isDarkTheme,
      copiedIndex,
      paletteType,
      generatePalette: generatePaletteWithType,
      copyColor,
      togglePinColor,
      hexToRgbString,
      getContrastColor,
      saveCurrentPalette
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
  align-items: center;
  background: var(--bg-tertiary);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  color: var(--text-primary);
  font-weight: 500;
}

.select {
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  border-radius: 5px;
  background: var(--input-bg);
  color: var(--text-primary);
  cursor: pointer;
  min-width: 120px;
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
}

.format-btn:hover {
  background: var(--bg-tertiary);
}

.format-btn.active {
  background: var(--button-primary-bg);
  color: white;
  border-color: var(--button-primary-bg);
}

.generate-btn, .save-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.3s, opacity 0.3s;
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

.color-card {
  flex: 1;
  min-width: 180px;
  height: 200px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px var(--shadow-color);
}

.color-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px var(--shadow-color);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-value {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  user-select: all;
  font-weight: 500;
}

.color-actions {
  display: flex;
  gap: 5px;
}

.pin-btn, .copy-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  transition: transform 0.2s;
}

.pin-btn:hover, .copy-btn:hover {
  transform: scale(1.1);
}

.pin-btn.pinned {
  color: #ffd700;
}

.copied-notification {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--button-success-bg);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  animation: fadeInOut 2s;
  z-index: 10;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.status {
  background: var(--bg-tertiary);
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 30px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  border: 1px solid var(--border-color);
}

.status p {
  color: var(--text-primary);
  margin: 0;
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
  }
  
  .select, .format-btn, .generate-btn, .save-btn {
    width: 100%;
  }
  
  .format-toggle {
    width: 100%;
  }
  
  .format-btn {
    flex: 1;
  }
  
  .color-card {
    min-width: 150px;
    height: 180px;
  }
  
  .status {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .color-card {
    min-width: 100%;
    height: 160px;
  }
  
  .color-value {
    font-size: 12px;
  }
  
  .palette-container {
    gap: 8px;
  }
}
</style>