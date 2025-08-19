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
        'Магические аксессуары': [
            { name: "Кольцо Теневого Шага", description: "Позволяет телепортироваться в тень в пределах 30 футов (3 раза в день).", stats: "Телепортация 3/день" },
            { name: "Ожерелье Говорящего с Духами", description: "Даёт возможность задать один вопрос умершему (1 раз в неделю).", stats: "Общение с духами 1/неделя" },
            { name: "Перчатки Паука", description: "Позволяют карабкаться по стенам без проверок.", stats: "Лазание без проверок" },
            { name: "Плащ Фантома", description: "Делает владельца полупрозрачным в сумерках (+5 к скрытности).", stats: "+5 к скрытности" },
            { name: "Браслет Хранителя Времени", description: "Замедляет время на 6 секунд (1 раз в день).", stats: "Замедление времени 1/день" }
        ],
        'Боевые артефакты': [
            { name: "Клинок Проклятых Душ", description: "При убийстве поглощает душу врага (накопленные души дают +1d6 урона).", stats: "Поглощение душ" },
            { name: "Щит Отражения", description: "1/день может отразить заклинание обратно в кастера.", stats: "Отражение заклинаний 1/день" },
            { name: "Лук Небесной Казни", description: "Стрелы светятся и наносят дополнительно 1d8 урона молнией.", stats: "+1d8 урона молнией" },
            { name: "Молот Разрушения", description: "Критический урон сносит дверь/стену (если КД меньше 20).", stats: "Разрушение препятствий" },
            { name: "Кинжал Фазового Сдвига", description: "Может проходить сквозь доспехи (игнорирует 50% КД).", stats: "Игнорирует 50% КД" }
        ],
        'Мистические артефакты': [
            { name: "Глаз Древнего Бога", description: "Позволяет видеть невидимое, но иногда показывает кошмары.", stats: "Видеть невидимое" },
            { name: "Сфера Хаоса", description: "При активации случайный эффект (огонь/лёд/молния в радиусе 20 фт).", stats: "Случайные эффекты" },
            { name: "Книга Забытых Заклинаний", description: "Содержит 1d4 случайных запретных заклинаний (но за каждое прочтение — проклятие).", stats: "Запретные заклинания" },
            { name: "Маска Тысячи Лиц", description: "Меняет внешность (но может 'застрять' на случайном облике).", stats: "Смена облика" },
            { name: "Зеркало Двойника", description: "Создаёт иллюзорную копию владельца (1/день).", stats: "Создание копии 1/день" }
        ],
        'Полезные безделушки': [
            { name: "Кошелек Бесконечных Монет", description: "Каждый день внутри появляется 1d10 медяков.", stats: "1d10 монет/день" },
            { name: "Карта Проклятого Сокровища", description: "Ведущая к кладу... или ловушке (50/50).", stats: "Поиск сокровищ" },
            { name: "Курительная Трубка Видений", description: "Дым принимает формы ответов на вопросы.", stats: "Гадание по дыму" },
            { name: "Вечный Факел", description: "Горит без топлива, но иногда мигает в такт речи владельца.", stats: "Вечный свет" },
            { name: "Кубик Судьбы", description: "При броске может изменить реальность (1 раз в игре, эффект на усмотрение ДМ).", stats: "Изменение реальности" }
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
        
        // Кнопка сброса характеристик
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'form-group button-group';
        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.textContent = 'Сбросить характеристики';
        resetButton.addEventListener('click', resetStats);
        buttonGroup.appendChild(resetButton);
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
        magicHeader.textContent = 'Магические предметы (выберите 3)';
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
                        if (selectedEquipment.accessories.length < 3) {
                            selectedEquipment.accessories.push(accessory);
                            this.classList.add('selected');
                        } else {
                            alert('Можно выбрать только три магических предмета');
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
        const abilities = racialAbilities[selectedRace] || [];
        
        const header = document.createElement('h3');
        header.textContent = `Способности расы: ${capitalizeFirstLetter(selectedRace)} (выберите 2)`;
        step4.appendChild(header);

        const abilitiesGrid = document.createElement('div');
        abilitiesGrid.className = 'abilities-grid';
        step4.appendChild(abilitiesGrid);
        
        abilities.forEach((ability, index) => {
            const isSelected = selectedAbilities.some(a => a.name === ability.name);
            const abilityElement = document.createElement('div');
            abilityElement.className = `ability-icon ${isSelected ? 'selected' : ''}`;
            abilityElement.dataset.index = index;
            abilityElement.innerHTML = `
                <div class="ability-name">${ability.name}</div>
                <div class="ability-desc">${ability.description}</div>
            `;
            abilitiesGrid.appendChild(abilityElement);
            
            abilityElement.addEventListener('click', function() {
                const ability = racialAbilities[selectedRace][index];
                const abilityIndex = selectedAbilities.findIndex(a => a.name === ability.name);
                
                if (abilityIndex >= 0) {
                    selectedAbilities.splice(abilityIndex, 1);
                    this.classList.remove('selected');
                } else {
                    if (selectedAbilities.length < 2) {
                        selectedAbilities.push(ability);
                        this.classList.add('selected');
                    } else {
                        alert('Можно выбрать только две способности');
                    }
                }
                updateCharacterPreview();
            });
        });
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
            
            if (selectedEquipment.accessories.length < 3) {
                alert('Пожалуйста, выберите три магических предмета');
                return false;
            }
        } else if (step === 4) {
            const selectedRace = document.getElementById('race').value;
            
            if (racialAbilities[selectedRace] && racialAbilities[selectedRace].length > 0 && selectedAbilities.length < 2) {
                alert(`Пожалуйста, выберите две расовые способности для ${selectedRace}`);
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
                    
                    ${selectedAbilities.length > 0 ? `
                    <h3>Способности</h3>
                    <div class="abilities-grid">
                        ${selectedAbilities.map(ability => `
                            <div class="ability-icon">
                                <div class="ability-name">${ability.name}</div>
                                <div class="ability-desc">${ability.description}</div>
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