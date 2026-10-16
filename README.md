# Encryption Project

Веб-приложение для демонстрации методов шифрования и дешифрования текста на базе **React**, **TypeScript** и **Vite** с архитектурой **Feature-Sliced Design (FSD)**

---

## Технологический стек

* **Фреймворк:** React 19
* **Язык:** TypeScript
* **Сборщик:** Vite
* **Стейт-менеджмент:** Zustand

---

## Быстрый старт

### Установка зависимостей:
```bash
npm install
```

### Запуск сервера разработки:
```bash
npm run dev
```

---

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка проекта |
| `npm run lint` | Линтинг проекта |
| `npm run preview` | Предпросмотр собранного проекта |

## Архитектура и структура проекта

Проект организован по модульному принципу в директории src:

* **model/ (Слой состояния и типов):**
    - types.ts — базовые интерфейсы (Cipher, CryptoState, HistoryItem) и типы доступных методов;
    - store.ts — централизованное хранилище состояния приложения на базе библиотеки Zustand (useCryptoStore);
* **lib/ (Криптографический слой / Бизнес-логика):**
    - common.ts — вспомогательные функции фильтрации и проверки входного текста по алфавиту (filterByAlphabet, isTextInAlphabet);
    - substitution/ (substitution.ts) — блочный шифр подстановки (SubstitutionCipher);
    - transposition/ (transposition.ts) — блочный шифр перестановки (TranspositionCipher);
    - gamma/ (gamma.ts) — шифрование гаммированием (GammaCipher);
    - des-ecb/ (des.ts) — реализация классического алгоритма DES в режиме ECB (DESCipher);
* **ui/ (Пользовательский интерфейс):**
    - Компоненты выбора метода (MethodSelect), формы ввода текста и ключа (CryptoForm), вывода результатов (ResultDisplay) и отображения истории операций (CryptoHistory);
    - Базовые UI-элементы (Button, Select, TextArea, ActionButton) и соответствующие CSS-модули;

## Как всё устроено

В model/types.ts объявлен базовый интерфейс Cipher - каждый класс (метод) криптосистемы реализует все методы базового интерфейса

