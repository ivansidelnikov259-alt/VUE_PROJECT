<template>
  <div class="generator-view">
    <!-- Основной генератор палитр -->
    <section class="main-generator">
      <PaletteGenerator :key="paletteKey" />
    </section>
    
    <!-- Дополнительные инструменты -->
    <section class="advanced-tools">
      <header class="tools-header">
        <h2><span class="icon">🎨</span> Дополнительные инструменты</h2>
        <p class="tools-subtitle">Расширенные возможности для профессиональной работы с цветом</p>
      </header>
      
      <!-- Генерация по настроению -->
      <div class="tool-section">
        <div class="section-header">
          <h3><span class="icon">🎭</span> Генерация по настроению</h3>
          <p>Создавайте палитры под определенную атмосферу и эмоции</p>
        </div>
        
        <MoodSelector 
          @palette-generated="handleMoodPalette" 
          @generate-random-palette="generateRandomMoodPalette"
        />
        
        <div class="mood-examples">
          <!-- Первый ряд -->
          <div class="example-row">
            <div class="example-card" @click="generateMoodPalette('calm')">
              <div class="example-colors">
                <div class="color-sample" style="background-color: #a8d8ea;"></div>
                <div class="color-sample" style="background-color: #aa96da;"></div>
                <div class="color-sample" style="background-color: #fcbad3;"></div>
              </div>
              <div class="example-info">
                <h4>Спокойные тона</h4>
                <p>Для медитативных и расслабляющих проектов</p>
              </div>
            </div>
            
            <div class="example-card" @click="generateMoodPalette('professional')">
              <div class="example-colors">
                <div class="color-sample" style="background-color: #2d4059;"></div>
                <div class="color-sample" style="background-color: #ea5455;"></div>
                <div class="color-sample" style="background-color: #f07b3f;"></div>
              </div>
              <div class="example-info">
                <h4>Профессиональные</h4>
                <p>Для корпоративных сайтов и приложений</p>
              </div>
            </div>
          </div>
          
          <!-- Второй ряд -->
          <div class="example-row">
            <div class="example-card" @click="generateMoodPalette('energetic')">
              <div class="example-colors">
                <div class="color-sample" style="background-color: #ff165d;"></div>
                <div class="color-sample" style="background-color: #ff9a00;"></div>
                <div class="color-sample" style="background-color: #ffde00;"></div>
              </div>
              <div class="example-info">
                <h4>Энергичные цвета</h4>
                <p>Для динамичных и активных интерфейсов</p>
              </div>
            </div>
            
            <div class="example-card" @click="generateMoodPalette('creative')">
              <div class="example-colors">
                <div class="color-sample" style="background-color: #6a0572;"></div>
                <div class="color-sample" style="background-color: #ab83a1;"></div>
                <div class="color-sample" style="background-color: #d4a5a5;"></div>
              </div>
              <div class="example-info">
                <h4>Креативные цвета</h4>
                <p>Для артистичных и нестандартных решений</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      <!-- Информация о гармониях -->
      <div class="harmony-guide">
        <div class="guide-header">
          <h3><span class="icon">📊</span> Типы цветовых гармоний</h3>
          <p>Правила создания гармоничных цветовых сочетаний</p>
        </div>
        
        <div class="harmony-types">
          <div class="harmony-type">
            <div class="harmony-visual">
              <div class="visual-circle">
                <div class="segment" style="background-color: #ff6b6b;"></div>
                <div class="segment" style="background-color: #ff8e6b;"></div>
                <div class="segment" style="background-color: #ffb26b;"></div>
              </div>
            </div>
            <div class="harmony-info">
              <h4>Аналогичная гармония</h4>
              <p>Цвета, расположенные рядом на цветовом круге (30° разница). Создает спокойные и естественные сочетания.</p>
              <ul>
                <li>Идеально для фонов и градиентов</li>
                <li>Создает мягкий, ненавязчивый контраст</li>
                <li>Легко воспринимается глазом</li>
              </ul>
            </div>
          </div>
          
          <div class="harmony-type">
            <div class="harmony-visual">
              <div class="visual-circle">
                <div class="segment" style="background-color: #ff6b6b;"></div>
                <div class="segment" style="background-color: #6b8eff;"></div>
              </div>
            </div>
            <div class="harmony-info">
              <h4>Комплементарная гармония</h4>
              <p>Противоположные цвета на цветовом круге (180° разница). Обеспечивает максимальный контраст.</p>
              <ul>
                <li>Привлекает внимание</li>
                <li>Идеально для CTA-элементов</li>
                <li>Создает динамичные интерфейсы</li>
              </ul>
            </div>
          </div>
          
          <div class="harmony-type">
            <div class="harmony-visual">
              <div class="visual-circle">
                <div class="segment" style="background-color: #ff6b6b;"></div>
                <div class="segment" style="background-color: #6bff8e;"></div>
                <div class="segment" style="background-color: #6b8eff;"></div>
              </div>
            </div>
            <div class="harmony-info">
              <h4>Триада</h4>
              <p>Три равноудаленных цвета (120° разница). Создает сбалансированные и контрастные сочетания.</p>
              <ul>
                <li>Баланс между гармонией и контрастом</li>
                <li>Подходит для сложных интерфейсов</li>
                <li>Обеспечивает визуальную иерархию</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Интеграция с остальными страницами -->
      <div class="integration-section">
        <h3><span class="icon">🔗</span> Интеграция с проектом</h3>
        <p>Созданные палитры можно сохранить и использовать в других разделах</p>
        
        <div class="integration-cards">
          <router-link to="/library" class="integration-card">
            <div class="card-icon">📚</div>
            <h4>Библиотека палитр</h4>
            <p>Сохраняйте понравившиеся палитры и организуйте их в коллекции</p>
          </router-link>
          
          <router-link to="/export" class="integration-card">
            <div class="card-icon">📤</div>
            <h4>Экспорт цветов</h4>
            <p>Экспортируйте палитры в CSS, SCSS, Tailwind и другие форматы</p>
          </router-link>
          
          <div class="integration-card info-card">
            <div class="card-icon">💡</div>
            <h4>Советы по использованию</h4>
            <p>Используйте контрастность и гармонию для создания доступных интерфейсов</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, provide, readonly } from 'vue'
import { useColorPalette } from '../composables/useColorPalette'
import PaletteGenerator from '../components/PaletteGenerator.vue'
import MoodSelector from '../components/MoodSelector.vue'

export default {
  name: 'GeneratorView',
  
  components: {
    PaletteGenerator,
    MoodSelector
  },
  
  setup() {
    const { colors, updatePalette } = useColorPalette()
    const paletteKey = ref(0) // Ключ для форсирования обновления PaletteGenerator
    
    const handleMoodPalette = (newColors) => {
      // Обновляем палитру через composable
      updatePalette(newColors)
      
      // Форсируем обновление компонента PaletteGenerator
      paletteKey.value++
      
      try {
        localStorage.setItem('currentPalette', JSON.stringify(newColors))
        localStorage.setItem('paletteType', 'mood')
      } catch (error) {
        console.error('Error saving mood palette:', error)
      }
    }
    
    // Генерация палитры по типу настроения
    const generateMoodPalette = (moodType) => {
      let palette = []
      
      switch(moodType) {
        case 'calm':
          // Спокойные тона - пастельные, мягкие цвета
          palette = generateCalmPalette()
          break
        case 'energetic':
          // Энергичные - яркие, насыщенные цвета
          palette = generateEnergeticPalette()
          break
        case 'professional':
          // Профессиональные - сдержанные, контрастные
          palette = generateProfessionalPalette()
          break
        case 'creative':
          // Креативные - необычные, экспериментальные
          palette = generateCreativePalette()
          break
        default:
          palette = generateRandomPalette()
      }
      
      handleMoodPalette(palette)
    }
    
    // Генерация случайной палитры на основе настроения
    const generateRandomMoodPalette = () => {
      const moods = ['calm', 'energetic', 'professional', 'creative']
      const randomMood = moods[Math.floor(Math.random() * moods.length)]
      generateMoodPalette(randomMood)
    }
    
    // Функция для генерации случайной палитры
    const generateRandomPalette = () => {
      return Array.from({ length: 5 }, () => {
        const hue = Math.floor(Math.random() * 360)
        const saturation = 30 + Math.random() * 70
        const lightness = 30 + Math.random() * 40
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`
      })
    }
    
    // Генераторы палитр для разных настроений
    const generateCalmPalette = () => {
      const hues = [180, 210, 240, 270] // Холодные тона
      return Array.from({ length: 5 }, () => {
        const hue = hues[Math.floor(Math.random() * hues.length)]
        const saturation = 30 + Math.random() * 40 // Низкая-средняя насыщенность
        const lightness = 60 + Math.random() * 25 // Светлые тона
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`
      })
    }
    
    const generateEnergeticPalette = () => {
      const hues = [0, 30, 60, 90] // Теплые, яркие тона
      return Array.from({ length: 5 }, () => {
        const hue = hues[Math.floor(Math.random() * hues.length)]
        const saturation = 70 + Math.random() * 25 // Высокая насыщенность
        const lightness = 40 + Math.random() * 30 // Средняя яркость
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`
      })
    }
    
    const generateProfessionalPalette = () => {
      const baseHue = Math.random() * 60 // Синие, серые, темные тона
      return Array.from({ length: 5 }, (_, i) => {
        const hue = baseHue + (i * 15)
        const saturation = 20 + Math.random() * 40
        const lightness = i === 0 ? 20 : i === 4 ? 80 : 30 + i * 10
        return `hsl(${hue % 360}, ${saturation}%, ${lightness}%)`
      })
    }
    
    const generateCreativePalette = () => {
      // Креативные - необычные сочетания
      const unusualHues = [280, 320, 140, 200, 30] // Фиолетовые, розовые, салатовые
      return Array.from({ length: 5 }, () => {
        const hue = unusualHues[Math.floor(Math.random() * unusualHues.length)]
        const saturation = 50 + Math.random() * 40
        const lightness = 40 + Math.random() * 40
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`
      })
    }
    
    // Предоставляем функцию обновления палитры для дочерних компонентов
    provide('updatePalette', handleMoodPalette)
    
    return {
      handleMoodPalette,
      generateMoodPalette,
      generateRandomMoodPalette,
      paletteKey
    }
  }
}
</script>

<style scoped>
.generator-view {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-generator {
  margin-bottom: 3rem;
}

.advanced-tools {
  padding-top: 2rem;
  border-top: 2px solid var(--border);
}

.tools-header {
  text-align: center;
  margin-bottom: 3rem;
}

.tools-header h2 {
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.tools-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.icon {
  font-size: 1.2em;
}

.tool-section {
  margin-bottom: 3rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-header p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.95rem;
}

/* Обновленный макет для карточек примеров */
.mood-examples {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.example-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .example-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

.example-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--border);
  display: flex;
  gap: 1.25rem;
  align-items: center;
  transition: all var(--transition-normal);
  cursor: pointer;
}

.example-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-default);
  border-color: var(--primary-light);
}

.example-colors {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-sample {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-md);
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.example-info h4 {
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.example-info p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
}

/* Стили для кнопки генерации */
.generate-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.generate-button {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: var(--shadow-default);
}

.generate-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  background: linear-gradient(135deg, var(--primary-light), var(--primary));
}

.generate-button:active {
  transform: translateY(0);
}

.button-icon {
  font-size: 1.2rem;
}

.button-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.75rem;
  text-align: center;
  max-width: 400px;
}

.harmony-guide {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  border: 1px solid var(--border);
  margin-bottom: 3rem;
  box-shadow: var(--shadow-default);
}

.guide-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.guide-header h3 {
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.guide-header p {
  color: var(--text-secondary);
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.harmony-types {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.harmony-type {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 2rem;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

@media (max-width: 768px) {
  .harmony-type {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.harmony-visual {
  display: flex;
  justify-content: center;
}

.visual-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #ff6b6b 0deg, #ff8e6b 90deg, #ffb26b 180deg,
    #ffd56b 270deg, #ff6b6b 360deg
  );
  position: relative;
  border: 3px solid var(--border);
}

.segment {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.harmony-info h4 {
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.harmony-info p {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.harmony-info ul {
  color: var(--text-secondary);
  padding-left: 1.25rem;
  margin: 0;
  font-size: 0.9rem;
}

.harmony-info li {
  margin-bottom: 0.5rem;
}

.harmony-info li:last-child {
  margin-bottom: 0;
}

.integration-section {
  text-align: center;
  padding: 2rem;
  background: var(--bg-tertiary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
}

.integration-section h3 {
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.integration-section p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.integration-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.integration-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 2px solid var(--border);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.integration-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}

.integration-card.router-link-active {
  border-color: var(--primary);
  background: rgba(59, 130, 246, 0.05);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.integration-card h4 {
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
}

.integration-card p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.info-card {
  border-style: dashed;
  border-color: var(--border);
}

.info-card:hover {
  border-style: solid;
}
</style>