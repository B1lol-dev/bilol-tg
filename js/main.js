const API_URL = 'https://f0ce305c-4365-4d9e-8d96-80da0b73e5ce-00-rin38d6ff602.sisko.replit.dev';

// Функция для получения имени пользователя из Telegram
function getTelegramUsername() {
    const tg = window.Telegram.WebApp;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        return tg.initDataUnsafe.user.username || tg.initDataUnsafe.user.first_name;
    }
    return 'Unknown';
}

// Функция для загрузки данных пользователя из API
function loadUserData() {
    const username = getTelegramUsername();

    fetch(`${API_URL}/get-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    })
    .then(response => response.json())
    .then(data => {
        if (data.coin_number !== undefined) {
            coin_number.innerText = data.coin_number;
        } else {
            // Создаем нового пользователя, если не найден
            fetch(`${API_URL}/add-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, coin_number: 0 })
            })
            .then(response => response.json())
            .then(() => {
                coin_number.innerText = 0;
            });
        }
    });
}

// Функция для обновления данных пользователя через API
function updateUserCoinNumber(newCoinNumber) {
    const username = getTelegramUsername();

    fetch(`${API_URL}/update-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, coin_number: newCoinNumber })
    })
    .then(response => response.json())
    .then(data => {
        console.log('User data updated', data);
    });
}

// Функция для обновления топа пользователей
function updateTopUsers() {
    fetch(`${API_URL}/top-users`)
    .then(response => response.json())
    .then(users => {
        let topUsersDiv = document.getElementById('top_users_open_users');
        topUsersDiv.innerHTML = '';

        users.forEach((user, index) => {
            let userDiv = document.createElement('div');
            userDiv.innerText = `#${index + 1}. @${user.username} - ${user.coin_number}`;
            topUsersDiv.appendChild(userDiv);
        });
    });
}

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

let top_users = document.getElementById('top_users');
let top_users_open = document.getElementById('top_users_open');

let buttons = [b_b_home, b_b_ref, b_b_earn, top_users];

b_b_home.style.border = '1px solid lime';

// Функция для сброса всех кнопок
function resetButtons() {
    buttons.forEach(button => {
        button.style.border = '1px solid white';
        top_users.style.border='none';
    });
}

// Функция для установки активного стиля
function setActiveButton(button) {
    resetButtons();
    button.style.border = '1px solid lime';
    top_users_open.style.border='none';
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

// Ключ для времени последнего выхода
let lastExitTimeKey = 'last_exit_time';

// Функция для загрузки данных из localStorage
function loadFromLocalStorage() {
    const savedCount = localStorage.getItem('count_span');
    const savedCount2 = localStorage.getItem('count_span2');
    const savedCoin = localStorage.getItem('coin_number');
    const savedBonus_span = localStorage.getItem('bonus_span');
    const savedBonus_span2 = localStorage.getItem('bonus_span2');
    const lastExitTime = localStorage.getItem(lastExitTimeKey);

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

    // Если время последнего выхода доступно, восстанавливаем count_span
    if (lastExitTime) {
        restoreCountBasedOnTime(parseInt(lastExitTime, 10));
    } else {
        updateBonusRoad(); // Обновляем бонусную дорогу сразу при первой загрузке
    }
}

// Функция для сохранения данных в localStorage
function saveToLocalStorage() {
    localStorage.setItem('count_span', count_span.innerText);
    localStorage.setItem('count_span2', count_span2.innerText);
    localStorage.setItem('coin_number', coin_number.innerText);
    localStorage.setItem('bonus_span', bonus_span.innerText);
    localStorage.setItem('bonus_span2', bonus_span2.innerText);

    // Сохраняем текущее время в миллисекундах
    localStorage.setItem(lastExitTimeKey, Date.now().toString());
}

// Функция для восстановления count_span на основе времени
function restoreCountBasedOnTime(lastExitTime) {
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastExitTime; // Время в миллисекундах
    const secondsElapsed = Math.floor(timeElapsed / 1000); // Преобразуем в секунды

    // Вычисляем восстановленное значение count_span
    const restoreCount = Math.min(maxCountSpan, parseInt(count_span.innerText, 10) + restore_amount * secondsElapsed);

    // Ограничиваем значение до count_span2
    count_span.innerText = Math.min(parseInt(count_span2.innerText, 10), restoreCount);

    // Сохраняем обновленные значения
    saveToLocalStorage();
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
    let bonusSpan2 = parseInt(bonus_span2.innerText, 10);
    let bonusRoadWidth = (currentBonus / bonus_init) * 250; // Ширина пропорциональна значению bonus_span


    // Обновляем ширину bonus_road только если currentBonus < bonusSpan2
    if (currentBonus < bonusSpan2) {
        bonus_road.style.width = `${bonusRoadWidth}px`;
    } else {
        bonus_road.style.width = '250px'; // Устанавливаем максимальную ширину, если bonus_span достиг bonus_span2
    }

    // Обновляем стиль bonus_info
    if (currentBonus >= bonus_init) {
        document.querySelector('.bonus_info').style.border = '1px solid lime';
        bonus_info_i.style.color = 'lime';
    } else {
        document.querySelector('.bonus_info').style.border = '1px solid white';
        bonus_info_i.style.color = 'white';
    }
}

// Обработчик клика на main_coin
main_coin.addEventListener('click', (event) => {
    let currentCount = parseInt(count_span.innerText, 10);
    let currentCoinNumber = parseInt(coin_number.innerText, 10);
    let currentBonus = parseInt(bonus_span.innerText, 10);

    if (currentCount >= current_number) {
        let newCount = currentCount - current_number;
        if (newCount < 0) {
            newCount = 0;
        }
        count_span.innerText = newCount;

        coin_number.innerText = currentCoinNumber + current_number;

        let newBonus = Math.min(currentBonus + current_number, parseInt(bonus_span2.innerText, 10));
        bonus_span.innerText = newBonus;

        updateBonusRoad();

        saveToLocalStorage();
        updateUserCoinNumber(parseInt(coin_number.innerText, 10)); // Обновляем данные пользователя через API

        const popUpText = document.createElement('div');
        popUpText.className = 'pop-up-text';
        popUpText.innerText = '+' + current_number;
        document.body.appendChild(popUpText);

        const rect = main_coin.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        popUpText.style.left = `${rect.left + x}px`;
        popUpText.style.top = `${rect.top + y}px`;

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
        bonus_info_i.style.color = 'white';

        // Обновляем данные пользователя через API
        updateUserCoinNumber(parseInt(coin_number.innerText, 10));

        // Сохраняем обновленные значения в localStorage
        saveToLocalStorage();
    }
});

// Обработчик кликов для кнопок
b_b_home.addEventListener('click', () => {
    setActiveButton(b_b_home);
    ref_open.style.display = 'none'; // Прячем ref_open
    earn_open.style.display = 'none'; // Прячем earn_open
    top_users_open.style.display = 'none'; // Прячем top_users_open
});

b_b_ref.addEventListener('click', () => {
    setActiveButton(b_b_ref);
    ref_open.style.display = 'flex'; // Показываем ref_open
    earn_open.style.display = 'none'; // Прячем earn_open
    top_users_open.style.display = 'none'; // Прячем top_users_open
});

b_b_earn.addEventListener('click', () => {
    setActiveButton(b_b_earn);
    ref_open.style.display = 'none'; // Прячем ref_open
    earn_open.style.display = 'flex'; // Показываем earn_open
    top_users_open.style.display = 'none'; // Прячем top_users_open 
});

top_users.addEventListener('click', () => {
    setActiveButton(top_users_open);
    ref_open.style.display = 'none'; // Прячем ref_open
    earn_open.style.display = 'none'; // Прячем earn_open
    top_users_open.style.display = 'block'; // Показываем top_users_open
    updateTopUsers(); // Обновляем список топ пользователей
});


// Запускаем восстановление count_span каждые 1 секунду
setInterval(restoreCount, restore_interval);

// Загрузка данных из localStorage при загрузке страницы
loadFromLocalStorage();
loadUserData(); // Загрузка данных пользователя из API

// Сохраняем данные перед закрытием страницы
window.addEventListener('beforeunload', saveToLocalStorage);

// Инициализация Telegram Web Apps API
const tg = window.Telegram.WebApp;

// Убедитесь, что Telegram Web Apps API загружен
if (tg) {
    tg.ready(); // Готовим API к использованию

    // Получаем данные пользователя и обновляем элемент
    const user_name = document.getElementById('user_name');
    const user_img = document.getElementById('user_img');
    
    // Убедитесь, что пользовательский объект доступен
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const firstName = tg.initDataUnsafe.user.first_name;
        user_name.innerText = firstName;
        // Допустим, что у вас есть URL аватара пользователя
        // user_img.src = tg.initDataUnsafe.user.photo_url || './img/main_img.jpg';

        // Проверяем имя пользователя и изменяем значения, если это B1lol_dev
        if (firstName === 'B1lol_dev') {
            current_number = 100;          // Новое значение для current_number
            restore_interval = 10;        // Новый интервал восстановления (в миллисекундах)
            restore_amount = 1000;          // Новое значение восстановления каждую секунду
        }
    } else {
        user_name.innerText = 'User'; // Значение по умолчанию
    }
} else {
    console.error('Telegram Web Apps API is not available.');
}