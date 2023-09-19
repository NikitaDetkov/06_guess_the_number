// Счетчик попыток отгадывания
let counterAttempts;
// Диапозон чисел для загадывания
let minNumber = 1;
let maxNumber = 100;
// Загаданное число
let hiddenNumber;
// Флаг четности числа
let isEven; 
// Флаг окончания игры
let isGameOver = false;
// Флаг ошибки диапазона
let isErrorRange = false;

// Догадка пользователя
const guess = document.querySelector('#guess');
// Кнопка проверки догадки
const btnCheck = document.querySelector('#btn-check');
// Кнопка для первого запуска игры
const btnStart = document.querySelector('#btn-start');
// Кнопка для перезапуска игры
const btnRestart = document.querySelector('#btn-restart');
// Кнопка для открытия настроек
const btnSettings = document.querySelector('#btn-settings');
// Кнопка для закрытия настроек
const btnCloseSettings = document.querySelector('#btn-close-settings');
// Кнопка для сохранения заданных настроек и перезапуска игры
const btnSaveSettings = document.querySelector('#btn-save-settings');

// Элемент с сообщением для подсказки о том, больше или меньше загаданное число
const messageHint = document.querySelector('#message-hint');
// Элемент с сообщением для подсказки о четности числа
const messageParity = document.querySelector('#message-parity');
// Элемент с сообщением для предупреждения о выходе за диапазон
const messageWarning = document.querySelector('#message-warning');
// Элемент с сообщением о ошибке ввода
const messageError = document.querySelector('#message-error');
// Контейнер для всех сообщений
const messagesContainer = document.querySelector('#message-container');
// Счетчик попыток отгадывания
const counterAttemptsHTML = document.querySelector('#counter-attempts');
// Игровое поле 
const gameField = document.querySelector('#game-field');
// Контейнер сообщения об окончании игры
const endGameMessageContainer = document.querySelector('#end-game-message-wrapper');
// Сообщение об окончании игры
const endGameMessage = document.querySelector('#end-game-message');;
// Меню настроек  
const settings = document.querySelector('#settings');
// Input Html-элементы интервала для загадываемого числа
const minNumberHtml = document.querySelector('#min');
const maxNumberHtml = document.querySelector('#max');
// 
const messageErrorRange = document.querySelector('#message-error-range');
// Информационные Html-элементы интервала для загадываемого числа
const maxInfo = document.querySelector('#max-info');
const minInfo = document.querySelector('#min-info');

// Контейнер для вращающихся чисел
const rotatingNumbers = document.querySelector('#rotating-numbers');

// Слушатели событий ========================================================

// Слушатель событий для кнопки проверки догадки
btnCheck.addEventListener('click', checkGuess);
// Слушатель событий для первого запуска игры
btnStart.addEventListener('click', firstStartGame)
// Слушатель событий для кнопки перезапуска игры
btnRestart.addEventListener('click', restratGame);
// Слушатель событий для кнопки открытия настроек
btnSettings.addEventListener('click', openSettinsgs)
// Слушатель событий для кнопки закртия настроек
btnCloseSettings.addEventListener('click', closeSettings)
// Слушатель событий для сохранения заданных настроек и перезапуска игры
btnSaveSettings.addEventListener('click', saveSettingsAndRestart)

// Функции ==================================================================

// Функция для первого запуска игры
function firstStartGame() {
    btnStart.classList.add('hide');
    gameField.classList.add('show');
    setRange();
    startGame();
};

// Функция для начала игры
// Задает начальные значения
function startGame() {
    // Отчистка поля вращающихся чисел
    rotatingNumbers.innerHTML = '';
    // Обнуление счетчика попыток 
    counterAttempts = 0;
    setCounterAttempts(counterAttempts);
    // Выбор загадываемого числа
    hiddenNumber = getRandomNumber(minNumber, maxNumber);
    // Установка флага четности
    isEven = !Boolean(hiddenNumber % 2);

    // Отчистка контейнера с сообщениями
    clearMessageFields();
}

// Функция для перезапуска игры
function restratGame() {
    // Если игра была завершена, закрыть окно с сообщением
    if (isGameOver) {
        endGameMessage.innerHTML = '';
        endGameMessageContainer.classList.remove('show');
        isGameOver = false;
    }

    // Отчистить поле ввода
    guess.value = '';

    // Начать игру
    startGame();
}

// Функция для получение случайного целого числа из заданного диапазона
// от min (включительно) до max (включительно)
function getRandomNumber(min, max) {
    // Округление чисел в случае, когда они дробные
    min = Math.ceil(min);
    max = Math.floor(max);

    const randomNumber = Math.random() * (max - min + 1) + min;
 
    return Math.floor(randomNumber);
}

// Функция проверки догадки
function checkGuess() {
    // Отчистить поля подсказок
    clearMessageFields();

    // Проверка на корректность входных данных   
    if (isNaN(Number(guess.value)) || guess.value === '') {
        showMessageError();
        return;
    } 

    // Увеличить счетчик догадок
    counterAttempts++;
    setCounterAttempts(counterAttempts);

    // Числовое значение догадки
    const guessNumber = Number(guess.value);
    guess.value = ''; // Сброс

    if (guessNumber === hiddenNumber) {
        endGame();
    } else {
        // Добавить вращающееся число на поле, если попыток меньше 21
        if (counterAttempts < 21) {
            addRotatingNumber(guessNumber)
        } 

        if (counterAttempts % 3 === 0) {
            showHintAboutParity();
        }
        if (guessNumber > maxNumber || guessNumber < minNumber) {
            showWarningOutOfRange();
        }
        showHint(guessNumber);
    } 

}

// Функция завершения игры
function endGame() {
    isGameOver = true;
    endGameMessage.innerHTML = `<span class="answer">You've won! The hidden number is 
        <span class="number">${hiddenNumber}</span>!</span><br>
        Number of attempts: <span class="counter">${counterAttempts}</span>.`;
    endGameMessageContainer.classList.add('show');
}

// Функция для отображения подсказки, большее или меньшее число
// было введено
// Принимает: число-догадку
function showHint(guessNumber) {
    if (guessNumber > hiddenNumber) {
        messageHint.innerHTML = `The hidden number is less than ${guessNumber}!`;
    } else {
        messageHint.innerHTML = `The hidden number is bigger than ${guessNumber}!`;
    }
    messageHint.classList.add('show');
}

// Функция для отображения подсказки о четности числа
function showHintAboutParity() {
    if (isEven) {
        messageParity.innerHTML = 'The hidden number is even!';
    } else {
        messageParity.innerHTML = 'The hidden number is odd!';
    }
    messageParity.classList.add('show');
}   

// Функция для отображения предупреждения о выходе за диапазон
function showWarningOutOfRange() {
    messageWarning.innerHTML =  `The hidden number is in the range: ${minNumber} - ${maxNumber}!`;
    messageWarning.classList.add('show');
}

// Функция для скрытия всех сообщений
function clearMessageFields() {
    messageHint.innerHTML = '';
    messageHint.classList.remove('show');
    messageParity.innerHTML = '';
    messageParity.classList.remove('show');
    messageWarning.innerHTML = '';
    messageWarning.classList.remove('show');
    messageError.innerHTML = '';
    messageError.classList.remove('show');
}

// Функция для отображения ошибки ввода
function showMessageError() {
    messageError.innerHTML = 'Input error!';
    messageError.classList.add('show');
}

// Функция для установки значения счетчика попытов в HTML-документ
function setCounterAttempts(counter) {
    counterAttemptsHTML.innerHTML = counter;
}

// Функция для открытия меню настроек
function openSettinsgs() {
    settings.classList.add('show');
}

// Функция для закрытия меню настроек
function closeSettings() {
    // Возвращаем значения к прежним
    maxNumberHtml.value = maxNumber;
    minNumberHtml.value = minNumber;
    // Скрываем окно
    settings.classList.remove('show');
    // Скрыть сообщение об ошибке диапазона
    if (isErrorRange) {
        messageErrorRange.classList.remove('show');
        isErrorRange = false;
    }
}

// Функция для сохранения заданных настроек и перезапуска игры
function saveSettingsAndRestart() {
    // Если диапазон валидный, то установить
    if ( isValideRange() ) {
        // Установить интервал
        setRange();

        // Скрыть меню настроек
        settings.classList.remove('show');
        // Скрыть сообщение об ошибке диапазона
        if (isErrorRange) {
            messageErrorRange.classList.remove('show');
            isErrorRange = false;
        }

        // Перезапуск игры с новыми настройками
        restratGame();
    } else {
        // Показать сообщение об ошибке диапазона
        if (!isErrorRange) {
            messageErrorRange.classList.add('show');
            isErrorRange = true; 
        }
    }
}

// Функция для установки интервала в переменные и 
// в информационное поле
function setRange() {
    maxNumber = Number(maxNumberHtml.value);
    minNumber = Number(minNumberHtml.value);

    maxInfo.innerHTML = maxNumber;
    minInfo.innerHTML = minNumber;
}

// Функция проверки валидности диапазона 
function isValideRange() {
    const maxNumber = Number(maxNumberHtml.value);
    const minNumber = Number(minNumberHtml.value);

    if (isNaN(maxNumber) || isNaN(minNumber)) return false;
    if (maxNumber < minNumber) return false;
    if (maxNumber < 0 || minNumber < 0) return false;

    return true;
}   

// Функция для добавления вращающего числа
function addRotatingNumber(num) {
    // Новое вращающееся число
    const rotatingNumber = document.createElement('div');
    rotatingNumber.innerHTML = num;
    rotatingNumber.classList.add('rotating-numbers__elem');

    // Получить случайную позицию числа
    const position = randomPositionRotatingNumber();
    rotatingNumber.style.top = position.top + 'px';
    rotatingNumber.style.left = position.left + 'px';

    // Размер шрифта от 12px до 32px
    rotatingNumber.style.fontSize = Math.random() * (32 - 18) + 18 + 'px';

    rotatingNumbers.append(rotatingNumber);
}

// Функция для вычислени позиции для вращающегося числа
function randomPositionRotatingNumber() {
    // Поле для вращающихся чисел
    const height = rotatingNumbers.offsetHeight;
    const width = rotatingNumbers.offsetWidth;
    // Игровое поле
    const game = document.querySelector('#game');
    const gameWidth = game.offsetWidth;
    const gameLeft = game.offsetLeft;

    // Позиция слева от игрового поля
    const leftRandom1 = Math.floor(Math.random() * (gameLeft - 150));
    // Позиция справа от игрового поля
    const leftRandom2 = Math.floor(Math.random() * (width - gameLeft - gameWidth - 150)) + (gameLeft + gameWidth);
    const leftRandomArray = [leftRandom1, leftRandom2];

    // Положение по вертикали
    const top =  Math.floor(Math.random() * height);
    // Положение по горизонтали 
    const left = leftRandomArray[Math.round(Math.random())]; // Либо справа либо слева

    return {top, left};
}

