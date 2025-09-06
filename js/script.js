// [file name]: script.js
// [file content begin]
document.addEventListener('DOMContentLoaded', function() {
    const characterForm = document.getElementById('character-form');
    const characterPreview = document.getElementById('character-preview');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const steps = document.querySelectorAll('.step');
    
    let availablePoints = 10;
    const BASE_STAT_VALUE = 10;
    let currentStep = 1;
    let selectedAbilities = [];
    let selectedEquipment = {
        armor: null,
        weapons: [],
        accessories: []
    };
    
    // Магические предметы
    const magicItems = {
        'Оружие': [
            { 
                name: "Меч +1", 
                description: "Волшебное оружие, дающее +1 к броскам атаки и урона.", 
                stats: "+1 к атаке и урону" 
            },
            { 
                name: "Лук точности", 
                description: "Дает преимущество на первый выстрел в каждом бою.", 
                stats: "Преимущество на первую атаку" 
            },
            { 
                name: "Клинок вампира", 
                description: "Восстанавливает 1d6 ХП при критическом попадании.", 
                stats: "Лечение 1d6 при крите" 
            }
        ],
        'Броня': [
            { 
                name: "Кольчуга +1", 
                description: "Волшебная кольчуга, дающая +1 к КД.", 
                stats: "КД: 14 + мод. Ловкости +1" 
            },
            { 
                name: "Щит отражения", 
                description: "Может отразить заклинание 1 раз в день.", 
                stats: "Отражение заклинания 1/день" 
            },
            { 
                name: "Плащ защиты", 
                description: "Дает +1 к всем спасброскам.", 
                stats: "+1 к спасброскам" 
            }
        ],
        'Артефакты': [
            { 
                name: "Кольцо невидимости", 
                description: "Позволяет становиться невидимым на 1 час в день.", 
                stats: "Невидимость 1 час/день" 
            },
            { 
                name: "Амулет здоровья", 
                description: "Увеличивает максимальное ХП на 10.", 
                stats: "+10 к максимальным ХП" 
            },
            { 
                name: "Сапоги стремительности", 
                description: "Удваивают скорость на 1 минуту в день.", 
                stats: "Удвоенная скорость 1 мин/день" 
            }
        ],
        'Свитки': [
            { 
                name: "Свиток огненного шара", 
                description: "Позволяет произнести заклинание Огненный шар 1 раз.", 
                stats: "Огненный шар (8d6 урона)" 
            },
            { 
                name: "Свиток лечения", 
                description: "Восстанавливает 3d8+5 ХП при использовании.", 
                stats: "Лечение 3d8+5" 
            },
            { 
                name: "Свиток телепортации", 
                description: "Телепортирует на расстояние до 1 мили.", 
                stats: "Телепортация 1 миля" 
            }
        ]
    };

    // Инициализация формы
    function createCharacterForm(formElement) {
        // Шаг 1: Основы
        const step1 = document.createElement('div');
        step1.className = 'step-content active';
        step1.id = 'step-1';
        
        const fields = [
            { type: 'text', id: 'character-name', label: 'Имя персонажа', placeholder: 'Арагорн' },
            { type: 'textarea', id: 'character-description', label: 'Описание персонажа', placeholder: 'Опишите внешность, характер и историю вашего персонажа...' },
            { type: 'select', id: 'race', label: 'Раса', options: Object.keys(raceDescriptions) },
            { type: 'select', id: 'class', label: 'Класс', options: Object.keys(classDescriptions) },
            { type: 'number', id: 'level', label: 'Уровень', min: 1, max: 20, value: 1 }
        ];
        
        fields.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';
            
            const label = document.createElement('label');
            label.htmlFor = field.id;
            label.textContent = field.label;
            
            let input;
            
            if (field.type === 'select') {
                input = document.createElement('select');
                input.id = field.id;
                input.name = field.id;
                
                field.options.forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText;
                    option.textContent = capitalizeFirstLetter(optionText);
                    input.appendChild(option);
                });
            } else if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.id = field.id;
                input.name = field.id;
                input.className = 'form-control';
                input.rows = 3;
                if (field.placeholder) input.placeholder = field.placeholder;
            } else {
                input = document.createElement('input');
                input.type = field.type;
                input.id = field.id;
                input.name = field.id;
                input.className = 'form-control';
                
                if (field.placeholder) input.placeholder = field.placeholder;
                if (field.min) input.min = field.min;
                if (field.max) input.max = field.max;
                if (field.value) input.value = field.value;
            }
            
            group.appendChild(label);
            group.appendChild(input);
            step1.appendChild(group);
            
            if (field.type === 'select') {
                const desc = document.createElement('div');
                desc.id = `${field.id}-description`;
                desc.className = 'description';
                step1.appendChild(desc);
            }
        });
        
        formElement.appendChild(step1);
        
        // Шаг 2: Характеристики
        const step2 = document.createElement('div');
        step2.className = 'step-content';
        step2.id = 'step-2';
        
        const pointsGroup = document.createElement('div');
        pointsGroup.className = 'form-group points-display';
        pointsGroup.innerHTML = `
            <label>Очки характеристик</label>
            <div class="points-value">Доступно: <span id="available-points">${availablePoints}</span></div>
        `;
        step2.appendChild(pointsGroup);
        
        const stats = [
            { id: 'strength', label: 'Сила' },
            { id: 'dexterity', label: 'Ловкость' },
            { id: 'constitution', label: 'Телосложение' },
            { id: 'intelligence', label: 'Интеллект' },
            { id: 'wisdom', label: 'Мудрость' },
            { id: 'charisma', label: 'Харизма' }
        ];
        
        stats.forEach(stat => {
            const group = document.createElement('div');
            group.className = 'form-group stat-group';
            
            group.innerHTML = `
                <label for="${stat.id}">${stat.label}</label>
                <div class="stat-controls">
                    <button type="button" class="stat-decrease" data-stat="${stat.id}">-</button>
                    <input type="number" id="${stat.id}" name="${stat.id}" class="stat-input" 
                           value="${BASE_STAT_VALUE}" readonly>
                    <button type="button" class="stat-increase" data-stat="${stat.id}">+</button>
                    <div class="modifier-display" data-stat="${stat.id}">+0</div>
                </div>
            `;
            
            step2.appendChild(group);
        });
        
        formElement.appendChild(step2);
        
        // Шаг 3: Снаряжение
        const step3 = document.createElement('div');
        step3.className = 'step-content';
        step3.id = 'step-3';
        formElement.appendChild(step3);
        
        // Шаг 4: Способности
        const step4 = document.createElement('div');
        step4.className = 'step-content';
        step4.id = 'step-4';
        formElement.appendChild(step4);
        
        // Кнопки управления
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'form-group button-group';
        
        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.textContent = 'Сбросить характеристики';
        resetButton.addEventListener('click', resetStats);
        
        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.textContent = 'Сохранить персонажа';
        saveButton.addEventListener('click', saveCharacter);
        
        const loadButton = document.createElement('button');
        loadButton.type = 'button';
        loadButton.textContent = 'Загрузить персонажа';
        loadButton.addEventListener('click', loadCharacter);
        
        buttonGroup.appendChild(resetButton);
        buttonGroup.appendChild(saveButton);
        buttonGroup.appendChild(loadButton);
        formElement.appendChild(buttonGroup);
        
        // Обработчики для кнопок +/-
        document.querySelectorAll('.stat-increase').forEach(button => {
            button.addEventListener('click', function() {
                const statId = this.getAttribute('data-stat');
                const input = document.getElementById(statId);
                if (availablePoints > 0) {
                    input.value = parseInt(input.value) + 1;
                    availablePoints--;
                    updatePointsDisplay();
                    updateModifier(statId);
                    updateCharacterPreview();
                }
            });
        });
        
        document.querySelectorAll('.stat-decrease').forEach(button => {
            button.addEventListener('click', function() {
                const statId = this.getAttribute('data-stat');
                const input = document.getElementById(statId);
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                    availablePoints++;
                    updatePointsDisplay();
                    updateModifier(statId);
                    updateCharacterPreview();
                }
            });
        });
        
        // Обработчики изменений в форме
        document.getElementById('character-name').addEventListener('input', updateCharacterPreview);
        document.getElementById('character-description').addEventListener('input', updateCharacterPreview);
        document.getElementById('race').addEventListener('change', function() {
            updateDescription('race', this.value);
            updateImportantStats();
            updateCharacterPreview();
            if (currentStep === 4) loadRacialAbilities();
        });
        document.getElementById('class').addEventListener('change', function() {
            updateDescription('class', this.value);
            updateImportantStats();
            updateCharacterPreview();
        });
        document.getElementById('level').addEventListener('change', updateCharacterPreview);
        
        // Инициализация
        updateDescription('race', 'человек');
        updateDescription('class', 'воин');
        updateImportantStats();
    }
    
    // Показываем нужный шаг
    function showStep(stepNum) {
        currentStep = stepNum;
        
        // Обновляем активный шаг в навигации
        steps.forEach(step => {
            if (parseInt(step.getAttribute('data-step')) === stepNum) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Показываем соответствующий контент
        document.querySelectorAll('.step-content').forEach(content => {
            if (content.id === `step-${stepNum}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Обновляем кнопки навигации
        prevBtn.disabled = stepNum === 1;
        nextBtn.textContent = stepNum === 4 ? 'Завершить' : 'Далее';
        
        // Загружаем контент для текущего шага
        if (stepNum === 3) {
            loadEquipment();
        } else if (stepNum === 4) {
            loadRacialAbilities();
        }
        
        updateCharacterPreview();
    }
    
    // Обработчики кнопок навигации
    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });

    nextBtn.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            if (currentStep < 4) {
                showStep(currentStep + 1);
            } else {
                // Завершение создания персонажа
                addDownloadButton();
            }
        }
    });
    
    // Загрузка снаряжения
    function loadEquipment() {
        const step3 = document.getElementById('step-3');
        step3.innerHTML = '';

        // Броня
        const armorHeader = document.createElement('h3');
        armorHeader.className = 'equipment-category';
        armorHeader.textContent = 'Броня (выберите 1)';
        step3.appendChild(armorHeader);

        const armorGrid = document.createElement('div');
        armorGrid.className = 'equipment-grid';
        step3.appendChild(armorGrid);

        equipment.armor.forEach((item, index) => {
            const isSelected = selectedEquipment.armor?.name === item.name;
            const itemElement = document.createElement('div');
            itemElement.className = `equipment-icon ${isSelected ? 'selected' : ''}`;
            itemElement.dataset.type = 'armor';
            itemElement.dataset.index = index;
            itemElement.innerHTML = `
                <div class="equipment-name">${item.name}</div>
                <div class="equipment-desc">${item.description}</div>
                <div class="equipment-stats">${item.stats}</div>
            `;
            armorGrid.appendChild(itemElement);

            itemElement.addEventListener('click', function() {
                document.querySelectorAll('.equipment-icon[data-type="armor"]').forEach(i => {
                    i.classList.remove('selected');
                });
                this.classList.add('selected');
                selectedEquipment.armor = equipment.armor[index];
                updateCharacterPreview();
            });
        });

        // Оружие
        const weaponsHeader = document.createElement('h3');
        weaponsHeader.className = 'equipment-category';
        weaponsHeader.textContent = 'Оружие (выберите 1-2)';
        weaponsHeader.style.marginTop = '30px';
        step3.appendChild(weaponsHeader);

        const weaponsGrid = document.createElement('div');
        weaponsGrid.className = 'equipment-grid';
        step3.appendChild(weaponsGrid);

        equipment.weapons.forEach((item, index) => {
            const isSelected = selectedEquipment.weapons.some(w => w.name === item.name);
            const itemElement = document.createElement('div');
            itemElement.className = `equipment-icon ${isSelected ? 'selected' : ''}`;
            itemElement.dataset.type = 'weapon';
            itemElement.dataset.index = index;
            itemElement.innerHTML = `
                <div class="equipment-name">${item.name}</div>
                <div class="equipment-desc">${item.description}</div>
                <div class="equipment-stats">${item.stats}</div>
            `;
            weaponsGrid.appendChild(itemElement);

            itemElement.addEventListener('click', function() {
                const weapon = equipment.weapons[index];
                const weaponIndex = selectedEquipment.weapons.findIndex(w => w.name === weapon.name);
                
                if (weaponIndex >= 0) {
                    selectedEquipment.weapons.splice(weaponIndex, 1);
                    this.classList.remove('selected');
                } else {
                    if (selectedEquipment.weapons.length < 2) {
                        selectedEquipment.weapons.push(weapon);
                        this.classList.add('selected');
                    } else {
                        alert('Можно выбрать только два оружия');
                    }
                }
                updateCharacterPreview();
            });
        });

        // Магические предметы
        const magicHeader = document.createElement('h3');
        magicHeader.className = 'equipment-category';
        magicHeader.textContent = 'Магические предметы (выберите 2)';
        magicHeader.style.marginTop = '30px';
        step3.appendChild(magicHeader);

        Object.entries(magicItems).forEach(([category, items]) => {
            const categoryHeader = document.createElement('h4');
            categoryHeader.textContent = category;
            categoryHeader.style.marginTop = '15px';
            step3.appendChild(categoryHeader);

            const magicGrid = document.createElement('div');
            magicGrid.className = 'equipment-grid';
            step3.appendChild(magicGrid);

            items.forEach((item, index) => {
                const isSelected = selectedEquipment.accessories.some(a => a.name === item.name);
                const itemElement = document.createElement('div');
                itemElement.className = `equipment-icon ${isSelected ? 'selected' : ''}`;
                itemElement.dataset.type = 'accessory';
                itemElement.dataset.category = category;
                itemElement.dataset.index = index;
                itemElement.innerHTML = `
                    <div class="equipment-name">${item.name}</div>
                    <div class="equipment-desc">${item.description}</div>
                    <div class="equipment-stats">${item.stats}</div>
                `;
                magicGrid.appendChild(itemElement);

                itemElement.addEventListener('click', function() {
                    const accessory = magicItems[category][index];
                    const accessoryIndex = selectedEquipment.accessories.findIndex(a => a.name === accessory.name);
                    
                    if (accessoryIndex >= 0) {
                        selectedEquipment.accessories.splice(accessoryIndex, 1);
                        this.classList.remove('selected');
                    } else {
                        if (selectedEquipment.accessories.length < 2) {
                            selectedEquipment.accessories.push(accessory);
                            this.classList.add('selected');
                        } else {
                            alert('Можно выбрать только два магических предмета');
                        }
                    }
                    updateCharacterPreview();
                });
            });
        });
    }
    
    // Загрузка способностей
    function loadRacialAbilities() {
        const step4 = document.getElementById('step-4');
        step4.innerHTML = '';
        
        const selectedRace = document.getElementById('race').value;
        const selectedClass = document.getElementById('class').value;
        const abilities = racialAbilities[selectedRace] || [];
        const features = classFeatures[selectedClass] || [];
        
        // Расовые способности
        const raceHeader = document.createElement('h3');
        raceHeader.textContent = `Способности расы: ${capitalizeFirstLetter(selectedRace)} (выберите 1)`;
        step4.appendChild(raceHeader);

        const abilitiesGrid = document.createElement('div');
        abilitiesGrid.className = 'abilities-grid';
        step4.appendChild(abilitiesGrid);
        
        abilities.forEach((ability, index) => {
            const isSelected = selectedAbilities.some(a => a.name === ability.name && a.type === 'racial');
            const abilityElement = document.createElement('div');
            abilityElement.className = `ability-icon ${isSelected ? 'selected' : ''}`;
            abilityElement.dataset.type = 'racial';
            abilityElement.dataset.index = index;
            abilityElement.innerHTML = `
                <div class="ability-name">${ability.name}</div>
                <div class="ability-desc">${ability.description}</div>
            `;
            abilitiesGrid.appendChild(abilityElement);
            
            abilityElement.addEventListener('click', function() {
                const ability = racialAbilities[selectedRace][index];
                const abilityIndex = selectedAbilities.findIndex(a => a.name === ability.name && a.type === 'racial');
                
                if (abilityIndex >= 0) {
                    selectedAbilities.splice(abilityIndex, 1);
                    this.classList.remove('selected');
                } else {
                    // Удаляем предыдущую расовую способность если выбрана новая
                    const existingRacial = selectedAbilities.findIndex(a => a.type === 'racial');
                    if (existingRacial >= 0) {
                        selectedAbilities.splice(existingRacial, 1);
                        document.querySelectorAll('.ability-icon[data-type="racial"].selected').forEach(el => {
                            el.classList.remove('selected');
                        });
                    }
                    
                    selectedAbilities.push({...ability, type: 'racial'});
                    this.classList.add('selected');
                }
                updateCharacterPreview();
            });
        });
        
        // Особенности класса
        const classHeader = document.createElement('h3');
        classHeader.textContent = `Особенности класса: ${capitalizeFirstLetter(selectedClass)} (выберите 1)`;
        classHeader.style.marginTop = '30px';
        step4.appendChild(classHeader);

        const featuresGrid = document.createElement('div');
        featuresGrid.className = 'abilities-grid';
        step4.appendChild(featuresGrid);
        
        features.forEach((feature, index) => {
            const isSelected = selectedAbilities.some(a => a.name === feature.name && a.type === 'class');
            const featureElement = document.createElement('div');
            featureElement.className = `ability-icon ${isSelected ? 'selected' : ''}`;
            featureElement.dataset.type = 'class';
            featureElement.dataset.index = index;
            featureElement.innerHTML = `
                <div class="ability-name">${feature.name}</div>
                <div class="ability-desc">${feature.description}</div>
            `;
            featuresGrid.appendChild(featureElement);
            
            featureElement.addEventListener('click', function() {
                const feature = classFeatures[selectedClass][index];
                const featureIndex = selectedAbilities.findIndex(a => a.name === feature.name && a.type === 'class');
                
                if (featureIndex >= 0) {
                    selectedAbilities.splice(featureIndex, 1);
                    this.classList.remove('selected');
                } else {
                    // Удаляем предыдущую особенность класса если выбрана новая
                    const existingClass = selectedAbilities.findIndex(a => a.type === 'class');
                    if (existingClass >= 0) {
                        selectedAbilities.splice(existingClass, 1);
                        document.querySelectorAll('.ability-icon[data-type="class"].selected').forEach(el => {
                            el.classList.remove('selected');
                        });
                    }
                    
                    selectedAbilities.push({...feature, type: 'class'});
                    this.classList.add('selected');
                }
                updateCharacterPreview();
            });
        });
    }
    
    // Сохранение персонажа в JSON
    function saveCharacter() {
        const formData = new FormData(characterForm);
        const data = Object.fromEntries(formData.entries());
        
        const characterData = {
            metadata: {
                version: "1.0",
                created: new Date().toISOString(),
                generator: "D&D Character Generator"
            },
            basicInfo: {
                name: data['character-name'],
                description: data['character-description'],
                race: data.race,
                class: data.class,
                level: parseInt(data.level)
            },
            stats: {
                strength: parseInt(data.strength),
                dexterity: parseInt(data.dexterity),
                constitution: parseInt(data.constitution),
                intelligence: parseInt(data.intelligence),
                wisdom: parseInt(data.wisdom),
                charisma: parseInt(data.charisma),
                availablePoints: availablePoints
            },
            equipment: selectedEquipment,
            abilities: selectedAbilities,
            modifiers: calculateModifiers()
        };
        
        const jsonString = JSON.stringify(characterData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `dnd_character_${data['character-name'] || 'unknown'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Сохранение в localStorage для быстрой загрузки
        localStorage.setItem('lastSavedCharacter', jsonString);
        
        alert('Персонаж успешно сохранен!');
    }
    
    // Загрузка персонажа из JSON
    function loadCharacter() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const characterData = JSON.parse(e.target.result);
                    loadCharacterData(characterData);
                    alert('Персонаж успешно загружен!');
                } catch (error) {
                    alert('Ошибка при загрузке файла: ' + error.message);
                }
            };
            reader.readAsText(file);
        });
        
        input.click();
    }
    
    // Загрузка данных персонажа в форму
    function loadCharacterData(characterData) {
        // Основная информация
        document.getElementById('character-name').value = characterData.basicInfo.name || '';
        document.getElementById('character-description').value = characterData.basicInfo.description || '';
        document.getElementById('race').value = characterData.basicInfo.race || 'человек';
        document.getElementById('class').value = characterData.basicInfo.class || 'воин';
        document.getElementById('level').value = characterData.basicInfo.level || 1;
        
        // Характеристики
        document.getElementById('strength').value = characterData.stats.strength || BASE_STAT_VALUE;
        document.getElementById('dexterity').value = characterData.stats.dexterity || BASE_STAT_VALUE;
        document.getElementById('constitution').value = characterData.stats.constitution || BASE_STAT_VALUE;
        document.getElementById('intelligence').value = characterData.stats.intelligence || BASE_STAT_VALUE;
        document.getElementById('wisdom').value = characterData.stats.wisdom || BASE_STAT_VALUE;
        document.getElementById('charisma').value = characterData.stats.charisma || BASE_STAT_VALUE;
        
        availablePoints = characterData.stats.availablePoints || 10;
        
        // Снаряжение и способности
        selectedEquipment = characterData.equipment || { armor: null, weapons: [], accessories: [] };
        selectedAbilities = characterData.abilities || [];
        
        // Обновляем модификаторы и отображение
        updatePointsDisplay();
        ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(stat => {
            updateModifier(stat);
        });
        
        updateDescription('race', characterData.basicInfo.race);
        updateDescription('class', characterData.basicInfo.class);
        updateImportantStats();
        
        // Перезагружаем текущий шаг
        if (currentStep === 3) loadEquipment();
        if (currentStep === 4) loadRacialAbilities();
        
        updateCharacterPreview();
    }
    
    // Расчет модификаторов
    function calculateModifiers() {
        const modifiers = {};
        const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        
        stats.forEach(stat => {
            const value = parseInt(document.getElementById(stat).value) || BASE_STAT_VALUE;
            modifiers[stat] = Math.floor((value - 10) / 2);
        });
        
        return modifiers;
    }
    
    // Добавление кнопки скачивания
    function addDownloadButton() {
        const oldBtn = document.querySelector('.download-card-btn');
        if (oldBtn) oldBtn.remove();
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-card-btn';
        downloadBtn.textContent = 'Скачать карточку персонажа';
        downloadBtn.addEventListener('click', downloadCharacterCard);
        characterPreview.appendChild(downloadBtn);
        
        const saveJsonBtn = document.createElement('button');
        saveJsonBtn.className = 'download-card-btn';
        saveJsonBtn.textContent = 'Сохранить в JSON';
        saveJsonBtn.style.marginTop = '10px';
        saveJsonBtn.addEventListener('click', saveCharacter);
        characterPreview.appendChild(saveJsonBtn);
    }
    
    // Скачивание карточки персонажа
    function downloadCharacterCard() {
        const cardContainer = document.querySelector('.character-card-container');
        const cardClone = cardContainer.cloneNode(true);
        
        // Применяем стили для клона
        cardClone.style.backgroundColor = 'white';
        cardClone.style.padding = '20px';
        cardClone.style.borderRadius = '10px';
        cardClone.style.border = '2px solid #8B4513';
        
        // Создаем временный контейнер
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '0';
        tempDiv.style.top = '0';
        tempDiv.style.width = '100%';
        tempDiv.style.height = '100%';
        tempDiv.style.display = 'flex';
        tempDiv.style.justifyContent = 'center';
        tempDiv.style.alignItems = 'center';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.zIndex = '9999';
        tempDiv.style.padding = '20px';
        
        // Добавляем клон в контейнер
        tempDiv.appendChild(cardClone);
        document.body.appendChild(tempDiv);
        
        // Используем html2canvas с правильными настройками
        html2canvas(cardClone, {
            backgroundColor: null,
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            // Создаем ссылку для скачивания
            const link = document.createElement('a');
            link.download = 'dnd-character-card.png';
            link.href = canvas.toDataURL('image/png');
            
            // Программно кликаем по ссылке
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Удаляем временный контейнер
            document.body.removeChild(tempDiv);
        }).catch(err => {
            console.error('Ошибка при создании изображения:', err);
            alert('Произошла ошибка при создании карточки. Попробуйте еще раз.');
            document.body.removeChild(tempDiv);
        });
    }
    
    // Валидация шага
    function validateStep(step) {
        if (step === 1) {
            const name = document.getElementById('character-name').value;
            if (!name || name.trim() === '') {
                alert('Пожалуйста, введите имя персонажа');
                return false;
            }
        } else if (step === 3) {
            if (!selectedEquipment.armor) {
                alert('Пожалуйста, выберите доспех');
                return false;
            }
            
            if (selectedEquipment.weapons.length === 0) {
                alert('Пожалуйста, выберите хотя бы одно оружие');
                return false;
            }
            
            if (selectedEquipment.accessories.length < 2) {
                alert('Пожалуйста, выберите два магических предмета');
                return false;
            }
        } else if (step === 4) {
            const selectedRace = document.getElementById('race').value;
            const selectedClass = document.getElementById('class').value;
            
            const racialCount = selectedAbilities.filter(a => a.type === 'racial').length;
            const classCount = selectedAbilities.filter(a => a.type === 'class').length;
            
            if (racialAbilities[selectedRace] && racialAbilities[selectedRace].length > 0 && racialCount < 1) {
                alert(`Пожалуйста, выберите одну расовую способность для ${selectedRace}`);
                return false;
            }
            
            if (classFeatures[selectedClass] && classFeatures[selectedClass].length > 0 && classCount < 1) {
                alert(`Пожалуйста, выберите одну особенность класса для ${selectedClass}`);
                return false;
            }
        }
        return true;
    }
    
    // Обновление описания расы/класса
    function updateDescription(type, value) {
        const descriptionElement = document.getElementById(`${type}-description`);
        const descriptions = type === 'race' ? raceDescriptions : classDescriptions;
        descriptionElement.innerHTML = `<div class="description-text">${descriptions[value]}</div>`;
    }
    
    // Обновление важных характеристик
    function updateImportantStats() {
        document.querySelectorAll('.stat-group').forEach(group => {
            group.classList.remove('important-stat', 'race-stat', 'class-stat');
        });

        const selectedRace = document.getElementById('race').value;
        const selectedClass = document.getElementById('class').value;

        if (raceImportantStats[selectedRace]) {
            raceImportantStats[selectedRace].forEach(stat => {
                const statGroup = document.querySelector(`.stat-group input[id="${stat}"]`).closest('.stat-group');
                statGroup.classList.add('important-stat', 'race-stat');
            });
        }

        if (classImportantStats[selectedClass]) {
            classImportantStats[selectedClass].forEach(stat => {
                const statGroup = document.querySelector(`.stat-group input[id="${stat}"]`).closest('.stat-group');
                statGroup.classList.add('important-stat', 'class-stat');
            });
        }
    }
    
    // Обновление модификатора характеристики
    function updateModifier(statId) {
        const input = document.getElementById(statId);
        const value = parseInt(input.value);
        const modifier = Math.floor((value - 10) / 2);
        const modifierDisplay = document.querySelector(`.modifier-display[data-stat="${statId}"]`);
        modifierDisplay.textContent = modifier >= 0 ? `+${modifier}` : modifier;
    }
    
    // Обновление отображения очков
    function updatePointsDisplay() {
        document.getElementById('available-points').textContent = availablePoints;
        document.querySelectorAll('.stat-increase').forEach(button => {
            button.disabled = availablePoints <= 0;
        });
    }
    
    // Сброс характеристик
    function resetStats() {
        availablePoints = 10;
        document.querySelectorAll('.stat-input').forEach(input => {
            input.value = BASE_STAT_VALUE;
            updateModifier(input.id);
        });
        updatePointsDisplay();
        updateCharacterPreview();
    }
    
    // Обновление превью персонажа
    function updateCharacterPreview() {
        const formData = new FormData(characterForm);
        const data = Object.fromEntries(formData.entries());
        
        // Рассчитываем модификаторы характеристик
        const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        const modifiers = {};
        
        stats.forEach(stat => {
            const value = parseInt(data[stat]) || BASE_STAT_VALUE;
            modifiers[stat] = Math.floor((value - 10) / 2);
        });
        
        const racialAbilitiesList = selectedAbilities.filter(a => a.type === 'racial');
        const classFeaturesList = selectedAbilities.filter(a => a.type === 'class');
        
        characterPreview.innerHTML = `
            <div class="character-card-container">
                <div class="character-card">
                    <h2>${data['character-name'] || 'Безымянный'}</h2>
                    <p><strong>${capitalizeFirstLetter(data.race || 'человек')} ${capitalizeFirstLetter(data.class || 'воин')}</strong>, уровень ${data.level || '1'}</p>
                    
                    ${data['character-description'] ? `
                    <div class="character-description">
                        <h3>Описание</h3>
                        <p>${data['character-description'].replace(/\n/g, '<br>')}</p>
                    </div>
                    ` : ''}
                    
                    <div class="race-class-description">
                        <p><strong>${capitalizeFirstLetter(data.race || 'человек')}:</strong> ${raceDescriptions[data.race || 'человек']}</p>
                        <p><strong>${capitalizeFirstLetter(data.class || 'воин')}:</strong> ${classDescriptions[data.class || 'воин']}</p>
                    </div>
                    
                    <h3>Характеристики (Очков осталось: ${availablePoints})</h3>
                    <div class="stats-grid">
                        ${stats.map(stat => `
                            <div class="stat-block">
                                <div>${statLabels[stat]}</div>
                                <div class="stat-value">${data[stat] || BASE_STAT_VALUE}</div>
                                <div class="stat-modifier">${modifiers[stat] >= 0 ? '+' : ''}${modifiers[stat]}</div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Символ DND между характеристиками и снаряжением -->
                    <div class="dnd-symbol-section">
                        <div class="dnd-symbol-large">
                            <img src="images/dnd-symbol.png" alt="D&D Symbol">
                        </div>
                    </div>
                    
                    ${selectedEquipment.armor ? `
                    <h3>Броня</h3>
                    <div class="abilities-grid">
                        <div class="ability-icon">
                            <div class="ability-name">${selectedEquipment.armor.name}</div>
                            <div class="ability-desc">${selectedEquipment.armor.description}</div>
                            <div class="ability-stats">${selectedEquipment.armor.stats}</div>
                        </div>
                    </div>
                    ` : ''}
                    
                    ${selectedEquipment.weapons.length > 0 ? `
                    <h3>Оружие</h3>
                    <div class="abilities-grid">
                        ${selectedEquipment.weapons.map(weapon => `
                            <div class="ability-icon">
                                <div class="ability-name">${weapon.name}</div>
                                <div class="ability-desc">${weapon.description}</div>
                                <div class="ability-stats">${weapon.stats}</div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    ${selectedEquipment.accessories.length > 0 ? `
                    <h3>Магические предметы</h3>
                    <div class="abilities-grid">
                        ${selectedEquipment.accessories.map(item => `
                            <div class="ability-icon">
                                <div class="ability-name">${item.name}</div>
                                <div class="ability-desc">${item.description}</div>
                                <div class="ability-stats">${item.stats}</div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    ${racialAbilitiesList.length > 0 ? `
                    <h3>Расовые способности</h3>
                    <div class="abilities-grid">
                        ${racialAbilitiesList.map(ability => `
                            <div class="ability-icon">
                                <div class="ability-name">${ability.name}</div>
                                <div class="ability-desc">${ability.description}</div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    ${classFeaturesList.length > 0 ? `
                    <h3>Особенности класса</h3>
                    <div class="abilities-grid">
                        ${classFeaturesList.map(feature => `
                            <div class="ability-icon">
                                <div class="ability-name">${feature.name}</div>
                                <div class="ability-desc">${feature.description}</div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Вспомогательные функции
    const statLabels = {
        strength: 'Сила',
        dexterity: 'Ловкость',
        constitution: 'Телосложение',
        intelligence: 'Интеллект',
        wisdom: 'Мудрость',
        charisma: 'Харизма'
    };
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Инициализация при загрузке
    createCharacterForm(characterForm);
    showStep(currentStep);
});
// [file content end]