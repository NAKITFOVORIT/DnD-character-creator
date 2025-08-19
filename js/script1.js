document.addEventListener('DOMContentLoaded', function() {
    const characterForm = document.getElementById('character-form');
    const characterPreview = document.getElementById('character-preview');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const steps = document.querySelectorAll('.step');
    
    let availablePoints = 10;
    const BASE_STAT_VALUE = 10;
    let currentStep = 1;
    
    // Описания рас
    const raceDescriptions = {
        'человек': 'Люди - самая разнообразная и амбициозная раса. Они быстро учатся и легко адаптируются.',
        'эльф': 'Эльфы - грациозные и долгоживущие существа, близкие к природе и магии.',
        'дварф': 'Дварфы - крепкие и выносливые подземные жители, известные своим мастерством в ремеслах.',
        'халфлинг': 'Халфлинги - маленькие и проворные существа, ценящие комфорт и простые радости жизни.',
        'драконорожденный': 'Драконорожденные - потомки драконов, обладающие внушительной внешностью и сильной волей.',
        'гном': 'Гномы - любознательные изобретатели и иллюзионисты, полные энергии и любопытства.',
        'тифлинг': 'Тифлинги - потомки демонов, часто сталкивающиеся с предрассудками из-за своей внешности.'
    };

    // Описания классов
    const classDescriptions = {
        'варвар': 'Мастер боя, специализирующийся на владении любым оружием и доспехами.',
        'бард': 'Артист и вдохновитель, чья магия проистекает из силы музыки и красноречия.',
        'жрец': 'Посланник божества, чья магия зависит от его веры и мировоззрения.',
        'друид': 'Служитель природы, способный принимать формы животных и управлять природной магией.',
        'воин': 'Мастер боя, специализирующийся на владении любым оружием и доспехами.',
        'монах': 'Мастер боевых искусств, использующий внутреннюю энергию ки для сверхчеловеческих подвигов.',
        'паладин': 'Святой воин, клянущийся защищать добро и справедливость с помощью божественной магии.',
        'следопыт': 'Охотник и следопыт, мастер выживания в дикой местности и боя с двумя оружиями.',
        'плут': 'Ловкий трикстер, специализирующийся на скрытности, ловкости рук и точных ударах.',
        'чародей': 'Обладатель врожденной магической силы, часто полученной от предков или магического события.',
        'колдун': 'Заклинатель, получивший магию через пакт с могущественным потусторонним существом.',
        'волшебник': 'Ученый-маг, использующий сложную систему заклинаний из своей книги заклинаний.'
    };

    // Важные характеристики для классов
    const classImportantStats = {
        'варвар': ['strength'],
        'бард': ['charisma'],
        'жрец': ['wisdom'],
        'друид': ['wisdom'],
        'воин': ['strength', 'dexterity'],
        'монах': ['dexterity', 'wisdom'],
        'паладин': ['strength', 'charisma'],
        'следопыт': ['dexterity', 'wisdom'],
        'плут': ['dexterity'],
        'чародей': ['charisma'],
        'колдун': ['charisma'],
        'волшебник': ['intelligence']
    };

    // Важные характеристики для рас
    const raceImportantStats = {
        'человек': [],
        'эльф': ['dexterity', 'wisdom'],
        'дварф': ['wisdom', 'strength'],
        'халфлинг': ['dexterity', 'intelligence'],
        'драконорожденный': ['strength', 'intelligence', 'wisdom'],
        'гном': ['dexterity', 'intelligence'],
        'тифлинг': ['intelligence', 'charisma']
    };

    // Снаряжение
    const equipment = {
        weapons: [
            {
                name: "Клинок Теней (короткий меч)",
                description: "Наносит дополнительный 1d6 урона тенью в темноте.",
                stats: "1d6+1d6 в темноте"
            },
            {
                name: "Лук Лесного Стража (длинный лук)",
                description: "+1 к попаданию, если стрелок скрыт.",
                stats: "1d8 +1 при скрытности"
            },
            {
                name: "Молот Горных Королей (боевой молот)",
                description: "Игнорирует сопротивление к дробящему урону.",
                stats: "1d8, игнорирует сопротивление"
            },
            {
                name: "Кинжал Шёпота (кинжал)",
                description: "Критический урон увеличивается (19-20).",
                stats: "1d4, крит 19-20"
            },
            {
                name: "Посох Пламени Феникса (посох)",
                description: "Можно выпустить огненный взрыв (1/день).",
                stats: "1d6, огненный взрыв 1/день"
            },
            {
                name: "Цепь Ледяного Хвата (боевая цепь)",
                description: "При попадании снижает скорость цели на 10 фт.",
                stats: "1d6, -10 фт скорости"
            },
            {
                name: "Арбалет Смертельного Шипа (арбалет)",
                description: "Пробивает броню (игнорирует 2 КД от доспехов).",
                stats: "1d10, игнорирует 2 КД"
            },
            {
                name: "Секира Вихря (двуручная секира)",
                description: "Раз в бой можно совершить круговую атаку.",
                stats: "1d12, круговая атака 1/бой"
            },
            {
                name: "Копьё Громового Рыка (копьё)",
                description: "При крите издаёт громовой хлопок (оглушение).",
                stats: "1d8, оглушение при крите"
            },
            {
                name: "Косарь Жнеца (коса)",
                description: "Увеличивает шанс крита (18-20).",
                stats: "1d6, крит 18-20"
            },
            {
                name: "Щит Непробиваемой Воли (щит)",
                description: "+1 к спасброскам против магии.",
                stats: "+1 к спасброскам"
            },
            {
                name: "Кулаки Каменной Горы (кастеты)",
                description: "Урон считается магическим.",
                stats: "1d6, магический урон"
            },
            {
                name: "Лезвие Вампира (рапира)",
                description: "Восстанавливает 1d4 ХП при крите.",
                stats: "1d8, лечение 1d4 при крите"
            },
            {
                name: "Лук Лунного Света (короткий лук)",
                description: "Стрелы светятся в темноте.",
                stats: "1d6, светящиеся стрелы"
            },
            {
                name: "Меч Драконьей Ярости (длинный меч)",
                description: "+1d6 урона стихией (выбор при создании).",
                stats: "1d8+1d6 стихийного"
            },
            {
                name: "Метательный Топор Бури (ручной топор)",
                description: "Возвращается в руку после броска.",
                stats: "1d6, возвращается"
            },
            {
                name: "Кнут Теневого Змея (кнут)",
                description: "Может обездвижить на 1 ход при успешном попадании.",
                stats: "1d4, обездвиживание"
            },
            {
                name: "Молот Священного Гнева (двуручный молот)",
                description: "+2 к урону против нежити.",
                stats: "1d12, +2 против нежити"
            },
            {
                name: "Клинок Шёпота Ветра (сабля)",
                description: "Дает +5 фт к скорости.",
                stats: "1d8, +5 фт скорости"
            },
            {
                name: "Артиллерийский Арбалет (тяжёлый арбалет)",
                description: "Пробивает несколько целей (урон делится).",
                stats: "1d10, пробивание"
            }
        ],
        armor: [
            {
                name: "Доспехи Драконьей Чешуи (средний)",
                description: "Сопротивление к одной стихии.",
                stats: "КД: 14 + сопротивление"
            },
            {
                name: "Плащ Теневого Бродяги (лёгкий)",
                description: "+2 к скрытности в темноте.",
                stats: "КД: 12 +2 скрытность"
            },
            {
                name: "Латный Доспех Гномьего Закала (тяжёлый)",
                description: "Игнорирует критический урон.",
                stats: "КД: 18, игнорирует криты"
            },
            {
                name: "Кольчуга Лесного Духа (средний)",
                description: "+1 к спасброскам от магии природы.",
                stats: "КД: 14, +1 против природы"
            },
            {
                name: "Роба Архимага (лёгкий)",
                description: "+1 к заклинаниям.",
                stats: "КД: 11, +1 к заклинаниям"
            },
            {
                name: "Щит Вечного Стража (щит)",
                description: "1/день можно блокировать магическую атаку.",
                stats: "+2 КД, блок магии 1/день"
            },
            {
                name: "Кожаный Доспех Теневого Лазутчика (лёгкий)",
                description: "Дает скрытое перемещение.",
                stats: "КД: 12, скрытое перемещение"
            },
            {
                name: "Полный Латный Доспех Непробиваемой Твердыни (тяжёлый)",
                description: "+1 к КД, но -5 фт скорости.",
                stats: "КД: 19, -5 скорости"
            },
            {
                name: "Нагрудник Ярости Берсерка (средний)",
                description: "+2 к урону в ближнем бою.",
                stats: "КД: 14, +2 к урону"
            },
            {
                name: "Мантия Феникса (лёгкий)",
                description: "Автоматически гасит огонь на владельце.",
                stats: "КД: 11, иммунитет к огню"
            },
            {
                name: "Доспехи Каменной Кожи (тяжёлый)",
                description: "Сопротивление дробящему урону.",
                stats: "КД: 17, сопротивление дробящему"
            },
            {
                name: "Панцирь Мантикоры (средний)",
                description: "Иммунитет к ядам.",
                stats: "КД: 15, иммунитет к ядам"
            },
            {
                name: "Плащ Невидимости (аксессуар)",
                description: "1/день можно стать невидимым на 1 ход.",
                stats: "Невидимость 1/день"
            },
            {
                name: "Броня Вечного Льда (тяжёлый)",
                description: "Сопротивление холоду.",
                stats: "КД: 16, сопротивление холоду"
            },
            {
                name: "Кольцо Защиты (аксессуар)",
                description: "+1 к КД.",
                stats: "+1 к КД"
            },
            {
                name: "Сапоги Странника (лёгкий)",
                description: "+10 фт к скорости.",
                stats: "КД: 11, +10 фт скорости"
            },
            {
                name: "Шлем Ясного Разума (шлем)",
                description: "Иммунитет к эффектам очарования.",
                stats: "Иммунитет к очарованию"
            },
            {
                name: "Перчатки Железного Кулака (аксессуар)",
                description: "+1 к урону в ближнем бою.",
                stats: "+1 к урону"
            },
            {
                name: "Пояс Великана (аксессуар)",
                description: "+1 к силе.",
                stats: "+1 к силе"
            },
            {
                name: "Амулет Жизни (аксессуар)",
                description: "1/день можно стабилизироваться при 0 ХП.",
                stats: "Спасение от смерти"
            }
        ],
        items: [
            {
                name: "Набор для взлома",
                description: "Содержит инструменты для взлома замков и ловушек.",
                stats: "+5 к проверкам взлома"
            },
            {
                name: "Аптечка",
                description: "Позволяет стабилизировать раненых союзников.",
                stats: "5 использований"
            },
            {
                name: "Фляга с зельем лечения",
                description: "Восстанавливает 2к4+2 хитов при употреблении.",
                stats: "1 использование"
            }
        ]
    };

    // Расовые способности
    const racialAbilities = {
        'человек': [
            { name: "Адаптируемость", description: "+1 к любому навыку на выбор." },
            { name: "Лидерство", description: "1/день может вдохновить союзника (бонус к атаке или спасброску)." },
            { name: "Тактический ум", description: "Может переставить двух союзников местами (1/бой)." },
            { name: "Выносливость", description: "+1 к максимальному HP за уровень." },
            { name: "Мастер на все руки", description: "Владение одним дополнительным инструментом или оружием." },
            { name: "Быстрое обучение", description: "Получает двойной опыт за изучение новых навыков." },
            { name: "Народный герой", description: "+2 к убеждению среди простых людей." },
            { name: "Решительность", description: "Может перебросить один проваленный спасбросок (1/день)." },
            { name: "Воля к победе", description: "При падении до 0 HP может совершить одно действие перед потерей сознания." },
            { name: "Дипломат", description: "Автоматическое знание одного дополнительного языка." },
            { name: "Стойкость", description: "Иммунитет к испугу 1/день." },
            { name: "Охотник за наградой", description: "+2 к слежке и выслеживанию." },
            { name: "Боевой опыт", description: "Критический урон увеличивается на +1d6 (1/бой)." },
            { name: "Ресурсfulness", description: "Может импровизировать предмет (например, сделать факел из подручных средств)." },
            { name: "Неудержимый", description: "Игнорирует штрафы к скорости от ранений." }
        ],
        'эльф': [
            { name: "Острое зрение", description: "Видит в сумерках как днём." },
            { name: "Магия предков", description: "Знает одно заклинание из списка друида." },
            { name: "Изящное уклонение", description: "+2 к Уклонению (DEX спасброски)." },
            { name: "Лунное благословение", description: "+1 к магическим атакам ночью." },
            { name: "Древние знания", description: "Автоматическое знание одного древнего языка." },
            { name: "Лесной следопыт", description: "Не оставляет следов в природной местности." },
            { name: "Фейская ловкость", description: "Может пройти через узкие пространства без штрафа." },
            { name: "Песня эльфов", description: "Может успокоить животных (1/день)." },
            { name: "Скороход", description: "+5 фт к скорости в лесу." },
            { name: "Зачарованное оружие", description: "Одно оружие считается магическим." },
            { name: "Сопротивление чарам", description: "Преимущество против очарования." },
            { name: "Природный целитель", description: "Может лечить 1d6 HP 1/день (как Лечение ран)." },
            { name: "Теневой шаг", description: "Может телепортироваться в тень (30 фт, 1/день)." },
            { name: "Вечный сон", description: "Не нуждается в сне, лишь в 4 часах медитации." },
            { name: "Дар пророчества", description: "Может перебросить инициативу (1/день)." }
        ],
        'дварф': [
            { name: "Каменная выносливость", description: "Сопротивление ядам." },
            { name: "Тёмное зрение", description: "Видит в темноте 60 фт." },
            { name: "Мастер подземелий", description: "+2 к поиску ловушек и скрытых дверей." },
            { name: "Кузнечное мастерство", description: "Может улучшить оружие (+1 к урону, 1/день)." },
            { name: "Горная стойкость", description: "Преимущество против толчков и опрокидывания." },
            { name: "Боевой топорник", description: "Владение всеми видами топоров." },
            { name: "Подземный инстинкт", description: "Чувствует вибрации в земле (обнаруживает скрытых врагов)." },
            { name: "Неутомимость", description: "Может идти без отдыха в 2 раза дольше." },
            { name: "Каменная кожа", description: "+1 к КД против дробящего урона." },
            { name: "Рудознание", description: "Определяет ценность камней и металлов на ощупь." },
            { name: "Горный рывок", description: "Может удвоить скорость на 1 ход (1/бой)." },
            { name: "Пивная стойкость", description: "+2 к спасброскам против опьянения." },
            { name: "Древние руны", description: "Может нанести руну на оружие (1/день, +1d6 урона)." },
            { name: "Непоколебимость", description: "Не может быть сдвинут против воли." },
            { name: "Клановая ярость", description: "При падении ниже 50% HP получает +2 к урону." }
        ],
        'драконорожденный': [
            { name: "Дыхание дракона", description: "Атака стихией (3d6, 1/день)." },
            { name: "Чешуйчатая броня", description: "+1 к КД." },
            { name: "Грозный рык", description: "Пугает врагов (радиус 10 фт, 1/день)." },
            { name: "Сопротивление стихии", description: "Зависит от предка (огонь, лёд, молния и т. д.)." },
            { name: "Крылья (опционально)", description: "Может планировать (на высоких уровнях - летать)." },
            { name: "Драконья ярость", description: "При критическом ударе добавляет 1d6 стихийного урона." },
            { name: "Аура власти", description: "+1 к запугиванию." },
            { name: "Острые когти", description: "Может атаковать без оружия (1d6)." },
            { name: "Магическая кровь", description: "Может использовать заклинание Определение магии 1/день." },
            { name: "Драконье чутьё", description: "Чувствует драконов в радиусе 1 мили." },
            { name: "Неукротимость", description: "Преимущество против страха." },
            { name: "Подавление магии", description: "1/день может подавить заклинание (как Антимагия)." },
            { name: "Драконье наследие", description: "Знает язык драконов и имеет родство с одним кланом." },
            { name: "Сокровищница предков", description: "Начинает с дополнительными 50 золотыми." },
            { name: "Пламенное сердце", description: "При смерти взрывается (1d6 урона огнём в радиусе 10 фт)." }
        ],
        'халфлинг': [
            { name: "Удачливый", description: "Может перебросить 1 куб за сцену." },
            { name: "Маленький и проворный", description: "+2 к скрытности." },
            { name: "Скрытная атака", description: "Если скрыт, первая атака в бою получает +1d6 урона." },
            { name: "Быстрые ноги", description: "+5 фт к скорости." },
            { name: "Прирождённый плут", description: "Владение воровскими инструментами." },
            { name: "Обаяние", description: "+1 к убеждению и обману." },
            { name: "Неуловимость", description: "Преимущество против попыток схватить или удержать." },
            { name: "Ловкость рук", description: "Может подобрать карман как бонусное действие." },
            { name: "Везунчик", description: "Один раз в день может превратить провал в успех (на удачу)." },
            { name: "Теневой шаг", description: "Может телепортироваться в тень (15 фт, 1/день)." },
            { name: "Быстрое восстановление", description: "Лечит 1 HP после каждого короткого отдыха." },
            { name: "Мастер побега", description: "Автоматически вырывается из оков." },
            { name: "Тихое передвижение", description: "Не вызывает шума при ходьбе." },
            { name: "Хитрый план", description: "Может дать совет союзнику (тот получает +1d4 к проверке)." },
            { name: "Дружелюбие", description: "+2 к проверкам обаяния среди мирных жителей." }
        ],
        'гном': [
            { name: "Иллюзионист", description: "Знает заклинание Малая иллюзия." },
            { name: "Изобретатель", description: "Может починить механизм 1/день." },
            { name: "Камневид", description: "Преимущество против магии иллюзий." },
            { name: "Гномья хитрость", description: "+1 к интеллекту и мудрости." },
            { name: "Механический гений", description: "Может создать простой механизм за 1 час." },
            { name: "Фейерверкер", description: "Может создать небольшой фейерверк (1/день, оглушает врагов)." },
            { name: "Подземный алхимик", description: "Знает рецепт одного зелья." },
            { name: "Усидчивость", description: "+2 к концентрации на заклинаниях." },
            { name: "Маленький, но крепкий", description: "+1 к телосложению." },
            { name: "Гномья смекалка", description: "Может найти нестандартное решение (1/день)." },
            { name: "Заводная игрушка", description: "Может создать механическую игрушку-разведчика." },
            { name: "Сопротивление хаосу", description: "Преимущество против хаотических эффектов." },
            { name: "Быстрое мышление", description: "Может использовать интеллект вместо ловкости для инициативы." },
            { name: "Мастер маскировки", description: "Может замаскироваться под ребёнка." },
            { name: "Гномья ярость", description: "При падении ниже 50% HP получает +2 к атаке." }
        ],
        'тифлинг': [
            { name: "Тёмное наследие", description: "Знает заклинание Тьма 1/день." },
            { name: "Огненный взгляд", description: "Может поджечь предмет взглядом (1/день)." },
            { name: "Дьявольская хитрость", description: "+2 к обману." },
            { name: "Сопротивление огню", description: "Иммунитет к слабому огню, сопротивление сильному." },
            { name: "Крылья (опционально)", description: "Может планировать, на высоких уровнях - летать." },
            { name: "Демонический рык", description: "Пугает врагов (1/день, радиус 15 фт)." },
            { name: "Теневой шаг", description: "Может телепортироваться в тень (30 фт, 1/день)." },
            { name: "Кровавая ярость", description: "При убийстве восстанавливает 1d6 HP." },
            { name: "Магия преисподней", description: "Знает заклинание Адское возмездие (1/день)." },
            { name: "Глаз дьявола", description: "Видит в магической тьме." },
            { name: "Проклятая кровь", description: "Может наложить проклятие (1/день, -1d4 к броскам врага)." },
            { name: "Страх перед смертью", description: "При падении до 0 HP может встать с 1 HP (1/день)." },
            { name: "Демоническая аура", description: "+1 к запугиванию." },
            { name: "Когти", description: "Атаки без оружия наносят 1d6 урона." },
            { name: "Пакт с тенью", description: "Может слиться с тенями (+2 к скрытности в темноте)." }
        ]
    };

    // Инициализация
    createCharacterForm(characterForm);
    showStep(currentStep);
    
    // Обработчики событий
    characterForm.addEventListener('input', function(e) {
        if (e.target.id === 'race' || e.target.id === 'class') {
            updateDescription(e.target.id, e.target.value);
            updateImportantStats();
        }
        if (e.target.classList.contains('stat-input')) {
            handleStatChange(e.target);
        }
        updateCharacterPreview();
    });

    characterForm.addEventListener('click', function(e) {
        if (e.target.classList.contains('equipment-item') || e.target.classList.contains('ability-item')) {
            e.target.classList.toggle('selected');
            updateCharacterPreview();
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    nextBtn.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            if (currentStep < 4) {
                currentStep++;
                showStep(currentStep);
            } else {
                saveCharacter();
            }
        }
    });

    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNum = parseInt(this.getAttribute('data-step'));
            if (validateStep(currentStep)) {
                currentStep = stepNum;
                showStep(currentStep);
            }
        });
    });

    function createCharacterForm(formElement) {
        // Шаг 1: Основы
        const step1 = document.createElement('div');
        step1.className = 'step-content active';
        step1.id = 'step-1';
        
        const fields = [
            { type: 'text', id: 'character-name', label: 'Имя персонажа', placeholder: 'Арагорн' },
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
                input.value = parseInt(input.value) - 1;
                availablePoints++;
                updatePointsDisplay();
                updateModifier(statId);
                updateCharacterPreview();
            });
        });
        
        // Инициализация
        updateDescription('race', 'человек');
        updateDescription('class', 'воин');
        updateImportantStats();
    }
    
    function showStep(stepNum) {
        // Обновляем активный шаг
        document.querySelectorAll('.step').forEach(step => {
            step.classList.toggle('active', parseInt(step.getAttribute('data-step')) === stepNum);
        });
        
        // Показываем соответствующий контент
        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.toggle('active', content.id === `step-${stepNum}`);
        });
        
        // Обновляем кнопки навигации
        prevBtn.disabled = stepNum === 1;
        nextBtn.textContent = stepNum === 4 ? 'Сохранить персонажа' : 'Далее';
        
        // Загружаем контент для текущего шага
        if (stepNum === 3) {
            loadEquipment();
        } else if (stepNum === 4) {
            loadRacialAbilities();
        }
        
        updateCharacterPreview();
    }
    
    function loadEquipment() {
        const step3 = document.getElementById('step-3');
        step3.innerHTML = '';

        // Броня
        const armorHeader = document.createElement('div');
        armorHeader.className = 'equipment-category';
        armorHeader.textContent = 'Броня (выберите 1)';
        step3.appendChild(armorHeader);

        const armorLimit = document.createElement('div');
        armorLimit.className = 'equipment-limits';
        armorLimit.textContent = 'Можно выбрать только один доспех';
        step3.appendChild(armorLimit);

        equipment.armor.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'equipment-item';
            itemElement.dataset.type = 'armor';
            itemElement.dataset.index = index;
            itemElement.innerHTML = `
                <strong>${item.name}</strong>
                <div class="equipment-description">${item.description}</div>
                <div><em>${item.stats}</em></div>
            `;
            step3.appendChild(itemElement);
        });

        // Оружие
        const weaponsHeader = document.createElement('div');
        weaponsHeader.className = 'equipment-category';
        weaponsHeader.textContent = 'Оружие (выберите 1-2)';
        step3.appendChild(weaponsHeader);

        const weaponsLimit = document.createElement('div');
        weaponsLimit.className = 'equipment-limits';
        weaponsLimit.textContent = 'Можно выбрать до двух единиц оружия';
        step3.appendChild(weaponsLimit);

        equipment.weapons.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'equipment-item';
            itemElement.dataset.type = 'weapon';
            itemElement.dataset.index = index;
            itemElement.innerHTML = `
                <strong>${item.name}</strong>
                <div class="equipment-description">${item.description}</div>
                <div><em>${item.stats}</em></div>
            `;
            step3.appendChild(itemElement);
        });

        // Обработчики выбора
        document.querySelectorAll('.equipment-item').forEach(item => {
            item.addEventListener('click', function() {
                const type = this.dataset.type;
                const maxSelection = type === 'armor' ? 1 : 2;
                
                // Снимаем выделение с других бронин, если выбрана новая
                if (type === 'armor') {
                    document.querySelectorAll('.equipment-item[data-type="armor"]').forEach(i => {
                        i.classList.remove('selected');
                    });
                }
                
                // Проверяем лимит выбора
                const selectedCount = document.querySelectorAll(`.equipment-item[data-type="${type}"].selected`).length;
                if (selectedCount < maxSelection || this.classList.contains('selected')) {
                    this.classList.toggle('selected');
                }
                
                updateCharacterPreview();
            });
        });
    }
    
    function loadRacialAbilities() {
        const step4 = document.getElementById('step-4');
        step4.innerHTML = '';
        
        const selectedRace = document.getElementById('race').value;
        const abilities = racialAbilities[selectedRace] || [];
        
        const header = document.createElement('h3');
        header.textContent = `Способности расы: ${capitalizeFirstLetter(selectedRace)} (выберите 2)`;
        step4.appendChild(header);
        
        const abilitiesLimit = document.createElement('div');
        abilitiesLimit.className = 'equipment-limits';
        abilitiesLimit.textContent = 'Можно выбрать две расовые способности';
        step4.appendChild(abilitiesLimit);
        
        abilities.forEach((ability, index) => {
            const abilityElement = document.createElement('div');
            abilityElement.className = 'ability-item';
            abilityElement.dataset.index = index;
            abilityElement.innerHTML = `
                <strong>${ability.name}</strong>
                <div class="ability-description">${ability.description}</div>
            `;
            step4.appendChild(abilityElement);
            
            abilityElement.addEventListener('click', function() {
                const selectedCount = document.querySelectorAll('.ability-item.selected').length;
                if (selectedCount < 2 || this.classList.contains('selected')) {
                    this.classList.toggle('selected');
                }
                updateCharacterPreview();
            });
        });
    }
    
    function validateStep(step) {
        if (step === 1) {
            const name = document.getElementById('character-name').value;
            if (!name || name.trim() === '') {
                alert('Пожалуйста, введите имя персонажа');
                return false;
            }
        } else if (step === 3) {
            const selectedArmor = document.querySelectorAll('.equipment-item[data-type="armor"].selected').length;
            const selectedWeapons = document.querySelectorAll('.equipment-item[data-type="weapon"].selected').length;
            
            if (selectedArmor === 0) {
                alert('Пожалуйста, выберите доспех');
                return false;
            }
            
            if (selectedWeapons === 0) {
                alert('Пожалуйста, выберите хотя бы одно оружие');
                return false;
            }
        } else if (step === 4) {
            const selectedAbilities = document.querySelectorAll('.ability-item.selected').length;
            const selectedRace = document.getElementById('race').value;
            
            if (racialAbilities[selectedRace].length > 0 && selectedAbilities < 2) {
                alert(`Пожалуйста, выберите две расовые способности для ${selectedRace}`);
                return false;
            }
        }
        return true;
    }
    
    function updateDescription(type, value) {
        const descriptionElement = document.getElementById(`${type}-description`);
        const descriptions = type === 'race' ? raceDescriptions : classDescriptions;
        descriptionElement.innerHTML = `<div class="description-text">${descriptions[value]}</div>`;
    }
    
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
    
    function updateModifier(statId) {
        const input = document.getElementById(statId);
        const value = parseInt(input.value);
        const modifier = Math.floor((value - 10) / 2);
        const modifierDisplay = document.querySelector(`.modifier-display[data-stat="${statId}"]`);
        
        modifierDisplay.textContent = modifier >= 0 ? `+${modifier}` : modifier;
    }
    
    function updatePointsDisplay() {
        document.getElementById('available-points').textContent = availablePoints;
        
        document.querySelectorAll('.stat-increase').forEach(button => {
            button.disabled = availablePoints <= 0;
        });
    }
    
    function resetStats() {
        availablePoints = 10;
        document.querySelectorAll('.stat-input').forEach(input => {
            input.value = BASE_STAT_VALUE;
            updateModifier(input.id);
        });
        updatePointsDisplay();
        updateCharacterPreview();
    }
    
    function updateCharacterPreview() {
        const formData = new FormData(characterForm);
        const data = Object.fromEntries(formData.entries());
        
        // Рассчитываем модификаторы
        const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        const modifiers = {};
        
        stats.forEach(stat => {
            const value = parseInt(data[stat]) || BASE_STAT_VALUE;
            modifiers[stat] = Math.floor((value - 10) / 2);
        });
        
        // Получаем выбранное оружие и броню
        const selectedWeapons = [];
        const selectedArmor = [];
        
        document.querySelectorAll('.equipment-item.selected').forEach(item => {
            const type = item.dataset.type;
            const index = item.dataset.index;
            const equipmentList = type === 'weapon' ? equipment.weapons : equipment.armor;
            
            if (type === 'weapon') selectedWeapons.push(equipmentList[index]);
            if (type === 'armor') selectedArmor.push(equipmentList[index]);
        });
        
        // Получаем выбранные способности
        const selectedAbilities = [];
        const selectedRace = document.getElementById('race').value;
        document.querySelectorAll('.ability-item.selected').forEach(item => {
            const index = item.dataset.index;
            selectedAbilities.push(racialAbilities[selectedRace][index]);
        });
        
        characterPreview.innerHTML = `
            <div class="character-card">
                <h2>${data['character-name'] || 'Безымянный'}</h2>
                <p><strong>${capitalizeFirstLetter(data.race || 'человек')} ${capitalizeFirstLetter(data.class || 'воин')}</strong>, уровень ${data.level || '1'}</p>
                
                <div class="race-class-description">
                    <p><strong>${capitalizeFirstLetter(data.race || 'человек')}:</strong> ${raceDescriptions[data.race || 'человек']}</p>
                    <p><strong>${capitalizeFirstLetter(data.class || 'воин')}:</strong> ${classDescriptions[data.class || 'воин']}</p>
                </div>
                
                <h3>Характеристики (Очков осталось: ${availablePoints})</h3>
                <div class="stats-grid">
                    <div class="stat-block">
                        <div>Сила</div>
                        <div class="stat-value">${data.strength || BASE_STAT_VALUE}</div>
                        <div class="stat-modifier">${modifiers.strength >= 0 ? '+' : ''}${modifiers.strength}</div>
                    </div>
                    <div class="stat-block">
                        <div>Ловкость</div>
                        <div class="stat-value">${data.dexterity || BASE_STAT_VALUE}</div>
                        <div class="stat-modifier">${modifiers.dexterity >= 0 ? '+' : ''}${modifiers.dexterity}</div>
                    </div>
                    <div class="stat-block">
                        <div>Телосложение</div>
                        <div class="stat-value">${data.constitution || BASE_STAT_VALUE}</div>
                        <div class="stat-modifier">${modifiers.constitution >= 0 ? '+' : ''}${modifiers.constitution}</div>
                    </div>
                    <div class="stat-block">
                        <div>Интеллект</div>
                        <div class="stat-value">${data.intelligence || BASE_STAT_VALUE}</div>
                        <div class="stat-modifier">${modifiers.intelligence >= 0 ? '+' : ''}${modifiers.intelligence}</div>
                    </div>
                    <div class="stat-block">
                        <div>Мудрость</div>
                        <div class="stat-value">${data.wisdom || BASE_STAT_VALUE}</div>
                        <div class="stat-modifier">${modifiers.wisdom >= 0 ? '+' : ''}${modifiers.wisdom}</div>
                    </div>
                    <div class="stat-block">
                        <div>Харизма</div>
                        <div class="stat-value">${data.charisma || BASE_STAT_VALUE}</div>
                        <div class="stat-modifier">${modifiers.charisma >= 0 ? '+' : ''}${modifiers.charisma}</div>
                    </div>
                </div>
                
                ${selectedArmor.length > 0 ? `
                <h3>Броня</h3>
                <ul>
                    ${selectedArmor.map(armor => `
                        <li>
                            <strong>${armor.name}</strong>: ${armor.description} (${armor.stats})
                        </li>
                    `).join('')}
                </ul>
                ` : ''}
                
                ${selectedWeapons.length > 0 ? `
                <h3>Оружие</h3>
                <ul>
                    ${selectedWeapons.map(weapon => `
                        <li>
                            <strong>${weapon.name}</strong>: ${weapon.description} (${weapon.stats})
                        </li>
                    `).join('')}
                </ul>
                ` : ''}
                
                ${selectedAbilities.length > 0 ? `
                <h3>Способности</h3>
                <ul>
                    ${selectedAbilities.map(ability => `
                        <li>
                            <strong>${ability.name}</strong>: ${ability.description}
                        </li>
                    `).join('')}
                </ul>
                ` : ''}
            </div>
        `;
    }
    
    function saveCharacter() {
        const characterName = document.getElementById('character-name').value || 'Безымянный';
        alert(`Персонаж "${characterName}" успешно создан и сохранен!`);
        // Здесь можно добавить логику сохранения в localStorage или отправки на сервер
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});