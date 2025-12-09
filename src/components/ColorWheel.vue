<template>
  <div class="color-wheel-section">
    <div class="section-header">
      <h3><span class="icon">🎨</span> Цветовой круг</h3>
      <p>Интерактивный инструмент для выбора цветов по гармоничным схемам</p>
    </div>
    
    <div class="color-wheel-controls">
      <div class="color-picker-group">
        <label>Выберите базовый цвет:</label>
        <div class="color-input-group">
          <input 
            type="color" 
            v-model="selectedColor"
            @change="updateColorWheel"
            class="color-input"
          />
          <input 
            type="text" 
            v-model="selectedColor"
            @input="updateColorFromText"
            class="color-text-input"
            placeholder="#RRGGBB"
          />
        </div>
      </div>
      
      <div class="harmony-selector">
        <label>Тип гармонии:</label>
        <div class="harmony-buttons">
          <button 
            v-for="harmony in harmonyTypes" 
            :key="harmony.id"
            @click="selectHarmony(harmony.id)"
            :class="{ active: selectedHarmony === harmony.id }"
            class="harmony-btn"
          >
            {{ harmony.name }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="color-wheel-container">
      <!-- Здесь будет цветовой круг -->
      <div class="wheel-visualization">
        <div class="wheel-placeholder">
          <div class="wheel-circle">
            <div 
              v-for="(color, index) in harmonyColors" 
              :key="index"
              class="color-segment"
              :style="{
                backgroundColor: color,
                transform: `rotate(${index * (360 / harmonyColors.length)}deg) translateY(-120px)`
              }"
              @click="selectColorFromWheel(color)"
              :title="color"
            >
              <span class="color-label">{{ color }}</span>
            </div>
            <div class="wheel-center">
              <div 
                class="center-color"
                :style="{ backgroundColor: selectedColor }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="color-palette-preview">
        <h4>Гармоничная палитра:</h4>
        <div class="palette-colors">
          <div 
            v-for="(color, index) in harmonyColors" 
            :key="index"
            class="palette-color"
            :style="{ backgroundColor: color }"
            @click="applyColorToGenerator(color)"
            :title="`Нажмите, чтобы использовать ${color}`"
          >
            <span class="color-index">{{ index + 1 }}</span>
            <span class="color-value">{{ color }}</span>
          </div>
        </div>
        
        <div class="palette-actions">
          <button @click="applyPaletteToGenerator" class="apply-palette-btn">
            Применить всю палитру
          </button>
          <button @click="copyPalette" class="copy-palette-btn">
            Копировать палитру
          </button>
        </div>
      </div>
    </div>
    
    <div class="harmony-info">
      <h4>О гармониях:</h4>
      <div class="info-grid">
        <div class="info-item">
          <h5>Аналогичная</h5>
          <p>Цвета рядом на круге (±30°). Естественные сочетания.</p>
        </div>
        <div class="info-item">
          <h5>Комплементарная</h5>
          <p>Противоположные цвета (180°). Максимальный контраст.</p>
        </div>
        <div class="info-item">
          <h5>Триада</h5>
          <p>Три равноудаленных цвета (120°). Баланс и контраст.</p>
        </div>
        <div class="info-item">
          <h5>Тетрада</h5>
          <p>Две комплементарные пары. Богатые сочетания.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { hexToHsl, hslToHex, generateAnalogousPalette, generateComplementaryPalette, generateTriadicPalette } from '../utils/colorUtils'

export default {
  name: 'ColorWheel',
  
  emits: ['palette-selected'],
  
  setup(props, { emit }) {
    const selectedColor = ref('#667eea')
    const selectedHarmony = ref('analogous')
    
    const harmonyTypes = ref([
      { id: 'analogous', name: 'Аналогичная', colors: 5 },
      { id: 'complementary', name: 'Комплементарная', colors: 4 },
      { id: 'triadic', name: 'Триада', colors: 3 },
      { id: 'tetradic', name: 'Тетрада', colors: 4 }
    ])
    
    const harmonyColors = computed(() => {
      const baseColor = selectedColor.value
      
      switch(selectedHarmony.value) {
        case 'analogous':
          return generateAnalogousPalette(baseColor, 5)
        case 'complementary':
          return generateComplementaryPalette(baseColor, 4)
        case 'triadic':
          return generateTriadicPalette(baseColor, 3)
        case 'tetradic':
          // Для тетрады используем комбинацию
          const hsl = hexToHsl(baseColor)
          const colors = [baseColor]
          colors.push(hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l))
          colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l))
          colors.push(hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l))
          return colors
        default:
          return generateAnalogousPalette(baseColor, 5)
      }
    })
    
    const selectHarmony = (harmonyId) => {
      selectedHarmony.value = harmonyId
    }
    
    const updateColorWheel = () => {
      // Обновляем цветовой круг при изменении цвета
    }
    
    const updateColorFromText = () => {
      // Валидация HEX цвета
      if (/^#[0-9A-F]{6}$/i.test(selectedColor.value)) {
        updateColorWheel()
      }
    }
    
    const selectColorFromWheel = (color) => {
      selectedColor.value = color
    }
    
    const applyColorToGenerator = (color) => {
      emit('palette-selected', [color])
    }
    
    const applyPaletteToGenerator = () => {
      emit('palette-selected', harmonyColors.value)
    }
    
    const copyPalette = async () => {
      const paletteText = harmonyColors.value.join('\n')
      try {
        await navigator.clipboard.writeText(paletteText)
        alert('Палитра скопирована в буфер обмена!')
      } catch (err) {
        console.error('Ошибка копирования:', err)
      }
    }
    
    return {
      selectedColor,
      selectedHarmony,
      harmonyTypes,
      harmonyColors,
      selectHarmony,
      updateColorWheel,
      updateColorFromText,
      selectColorFromWheel,
      applyColorToGenerator,
      applyPaletteToGenerator,
      copyPalette
    }
  }
}
</script>

<style scoped>
.color-wheel-section {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-default);
  margin-bottom: 2rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-header p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
}

.icon {
  font-size: 1.2em;
}

.color-wheel-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.color-picker-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.color-picker-group label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
}

.color-input-group {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.color-input {
  width: 60px;
  height: 40px;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  background: transparent;
}

.color-text-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-input);
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.color-text-input:focus {
  outline: none;
  border-color: var(--primary);
}

.harmony-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.harmony-selector label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
}

.harmony-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.harmony-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all var(--transition-fast);
  flex: 1;
  min-width: 120px;
}

.harmony-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-light);
}

.harmony-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.color-wheel-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 900px) {
  .color-wheel-container {
    grid-template-columns: 1fr;
  }
}

.wheel-visualization {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wheel-placeholder {
  width: 300px;
  height: 300px;
  position: relative;
}

.wheel-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #ff0000 0deg, #ff8000 30deg, #ffff00 60deg, #80ff00 90deg,
    #00ff00 120deg, #00ff80 150deg, #00ffff 180deg, #0080ff 210deg,
    #0000ff 240deg, #8000ff 270deg, #ff00ff 300deg, #ff0080 330deg,
    #ff0000 360deg
  );
  position: relative;
  border: 3px solid var(--border);
}

.color-segment {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid white;
  cursor: pointer;
  transform-origin: 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
}

.color-segment:hover {
  transform: rotate(calc(var(--index) * (360deg / 5))) translateY(-120px) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.color-label {
  position: absolute;
  bottom: -25px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-family: 'Courier New', monospace;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
}

.color-segment:hover .color-label {
  opacity: 1;
}

.wheel-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  border: 3px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-color {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.color-palette-preview {
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--border);
}

.color-palette-preview h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.palette-colors {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.palette-color {
  height: 80px;
  border-radius: var(--radius-md);
  border: 2px solid var(--border);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.palette-color:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-default);
  border-color: var(--primary);
}

.color-index {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.color-value {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  text-align: center;
}

.palette-actions {
  display: flex;
  gap: 0.75rem;
}

.apply-palette-btn,
.copy-palette-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all var(--transition-normal);
}

.apply-palette-btn {
  background: var(--primary);
  color: white;
}

.copy-palette-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.apply-palette-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-default);
}

.copy-palette-btn:hover {
  background: var(--bg-tertiary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-default);
}

.harmony-info {
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--border);
}

.harmony-info h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 1rem;
  border: 1px solid var(--border);
}

.info-item h5 {
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
}

.info-item p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.4;
}
</style>