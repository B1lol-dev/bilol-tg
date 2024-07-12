const main_coin = document.getElementById('main_coin');
let count_span = document.getElementById('count_span');
let count_span2 = document.getElementById('count_span2');
let coin_number = document.getElementById('coin_number');

let maxCountSpan = 1000; // Изначальное значение, можно изменить

let current_number = 1;
let restore_interval = 1000; // Интервал восстановления (1 секунда)
let restore_amount = 1; // Количество восстановления каждую секунду

let b_b_home = document.getElementById('b_b_home');
let b_b_ref = document.getElementById('b_b_ref');
let b_b_earn = document.getElementById('b_b_earn');


let ref_open = document.getElementById('ref_open');
let earn_open = document.getElementById('earn_open');

let buttons = [b_b_home, b_b_ref, b_b_earn];

b_b_home.style.border = '1px solid lime';

// Функция для сброса всех кнопок
function resetButtons() {
    buttons.forEach(button => {
        button.style.border = '1px solid white';
    });
}

// Функция для установки активного стиля
function setActiveButton(button) {
    resetButtons();
    button.style.border = '1px solid lime';
}

// Добавляем обработчики кликов для каждой кнопки
b_b_home.addEventListener('click', () => setActiveButton(b_b_home));
b_b_ref.addEventListener('click', () => setActiveButton(b_b_ref));
b_b_earn.addEventListener('click', () => setActiveButton(b_b_earn));

let bonus_road = document.getElementById('bonus_road');
let bonus_span = document.getElementById('bonus_span');
let bonus_span2 = document.getElementById('bonus_span2');
let bonus_info_i = document.getElementById('bonus_info_i');

let bonus_init = 1000;

// Функция для загрузки данных из localStorage
function loadFromLocalStorage() {
    const savedCount = localStorage.getItem('count_span');
    const savedCount2 = localStorage.getItem('count_span2');
    const savedCoin = localStorage.getItem('coin_number');

    const savedBonus_span = localStorage.getItem('bonus_span');
    const savedBonus_span2 = localStorage.getItem('bonus_span2');

    if (savedCount !== null) {
        count_span.innerText = savedCount;
    } else {
        count_span.innerText = maxCountSpan; // Используем maxCountSpan по умолчанию
    }

    if (savedCount2 !== null) {
        count_span2.innerText = savedCount2;
    } else {
        count_span2.innerText = maxCountSpan; // Используем maxCountSpan по умолчанию
    }

    if (savedCoin !== null) {
        coin_number.innerText = savedCoin;
    } else {
        coin_number.innerText = 0; // Начальное значение
    }

    if (savedBonus_span !== null) {
        bonus_span.innerText = savedBonus_span;
    } else {
        bonus_span.innerText = 0; // Начальное значение
    }

    if (savedBonus_span2 !== null) {
        bonus_span2.innerText = savedBonus_span2;
    } else {
        bonus_span2.innerText = parseInt(bonus_init);
    }

    updateBonusRoad(); // Обновляем состояние bonus_road и bonus_info
}

// Функция для сохранения данных в localStorage
function saveToLocalStorage() {
    localStorage.setItem('count_span', count_span.innerText);
    localStorage.setItem('count_span2', count_span2.innerText);
    localStorage.setItem('coin_number', coin_number.innerText);
    localStorage.setItem('bonus_span', bonus_span.innerText);
    localStorage.setItem('bonus_span2', bonus_span2.innerText);
}

// Функция для восстановления count_span
function restoreCount() {
    let currentCount = parseInt(count_span.innerText, 10);
    let maxCount2 = parseInt(count_span2.innerText, 10);
    
    if (currentCount < maxCount2) {
        count_span.innerText = currentCount + restore_amount;
        if (parseInt(count_span.innerText, 10) > maxCount2) {
            count_span.innerText = maxCount2; // Ограничиваем значение до count_span2
        }
        saveToLocalStorage(); // Сохраняем обновленное значение в localStorage
    }
}

// Функция для обновления ширины bonus_road и стиля bonus_info
function updateBonusRoad() {
    let currentBonus = parseInt(bonus_span.innerText, 10);
    let bonusRoadWidth = (currentBonus / bonus_init) * 250; // Ширина пропорциональна значению bonus_span
    bonus_road.style.width = `${bonusRoadWidth}px`;

    // Обновляем стиль bonus_info
    if (currentBonus >= bonus_init) {
        document.querySelector('.bonus_info').style.border = '1px solid lime';
        bonus_info_i.style.color='lime'
    } else {
        document.querySelector('.bonus_info').style.border = '1px solid white';
        bonus_info_i.style.color='white'
    }
}

// Обработчик клика на main_coin
main_coin.addEventListener('click', (event) => {
    // Преобразуем текстовые значения в числа
    let currentCount = parseInt(count_span.innerText, 10);
    let currentCoinNumber = parseInt(coin_number.innerText, 10);
    let currentBonus = parseInt(bonus_span.innerText, 10);

    // Проверяем, можно ли уменьшить count_span и увеличить coin_number
    if (currentCount >= current_number) {
        // Уменьшаем значение счетчика
        let newCount = currentCount - current_number;
        if (newCount < 0) {
            newCount = 0; // Устанавливаем значение в 0, если оно меньше 0
        }
        count_span.innerText = newCount;

        // Увеличиваем значение coin_number
        coin_number.innerText = currentCoinNumber + current_number;

        // Увеличиваем значение bonus_span
        bonus_span.innerText = currentBonus + current_number;

        // Обновляем состояние bonus_road и bonus_info
        updateBonusRoad();

        // Сохраняем обновленные значения в localStorage
        saveToLocalStorage();

        // Создаем и стилизуем текстовый элемент
        const popUpText = document.createElement('div');
        popUpText.className = 'pop-up-text';
        popUpText.innerText = '+' + current_number;
        document.body.appendChild(popUpText);

        // Определяем позицию, где был клик
        const rect = main_coin.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        popUpText.style.left = `${rect.left + x}px`;
        popUpText.style.top = `${rect.top + y}px`;

        // Удаляем текст через 1 секунду
        setTimeout(() => {
            popUpText.remove();
        }, 1000);
    }
});

// Обработчик клика на bonus_info
document.querySelector('.bonus_info').addEventListener('click', () => {
    let currentBonus = parseInt(bonus_span.innerText, 10);
    if (currentBonus >= bonus_init) {
        bonus_span.innerText = 0; // Сбрасываем значение bonus_span
        coin_number.innerText = parseInt(coin_number.innerText, 10) + 500; // Добавляем 500 к coin_number
        bonus_road.style.width = '0px'; // Сбрасываем ширину bonus_road
        document.querySelector('.bonus_info').style.border = '1px solid white'; // Сбрасываем border

        // Сохраняем обновленные значения в localStorage
        saveToLocalStorage();
    }
});

// Обработчик кликов для кнопок
b_b_home.addEventListener('click', () => {
    setActiveButton(b_b_home);
    ref_open.style.display = 'none'; // Прячем ref_open
    earn_open.style.display = 'none'; // Прячем earn_open
});

b_b_ref.addEventListener('click', () => {
    setActiveButton(b_b_ref);
    ref_open.style.display = 'flex'; // Показываем ref_open
    earn_open.style.display = 'none'; // Прячем earn_open
});

b_b_earn.addEventListener('click', () => {
    setActiveButton(b_b_earn);
    ref_open.style.display = 'none'; // Прячем ref_open
    earn_open.style.display = 'flex'; // Показываем earn_open
});

// Запускаем восстановление count_span каждые 1 секунду
setInterval(restoreCount, restore_interval);

// Загрузка данных из localStorage при загрузке страницы
loadFromLocalStorage();

let user_name = document.getElementById('user_name');
user_name.innerText = `${tg.initDataUnsafe.user.first_name}`;
