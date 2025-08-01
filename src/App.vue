<script>
export default {
  data() {
    return {
      tg: null,
    };
  },
  mounted() {
    // Проверяем наличие Telegram WebApp API
    if (window.Telegram && window.Telegram.WebApp) {
      this.tg = window.Telegram.WebApp;

      console.log("Telegram WebApp найден ✅");
      this.tg.ready(); // Обязательно!
      this.tg.expand(); // Растянуть на весь экран

      if (!this.tg.initData || !this.tg.initDataUnsafe?.user) {
        console.warn("⚠️ WebApp запущен вне Telegram или initData пустой");
      }
    } else {
      console.warn("❌ Telegram WebApp не найден. Возможно вы открыли ссылку напрямую в браузере");
    }
  },
  methods: {
    exit() {
      if (this.tg) {
        this.tg.close(); // Закрыть WebApp
      } else {
        console.warn("❌ Не удалось закрыть WebApp, tg не инициализирован");
      }
    }
  },
};
</script>

<template>
  <div class="app flex flex-col items-center justify-center min-h-screen bg-violet-100">
    <h1 class="text-3xl text-inherit underline p-8">
      Название будет
    </h1>

    <div class="menu">
      <div class="menu-item flex items-center justify-center cursor-pointer">
        Профиль
      </div>
      <div class="menu-item flex items-center justify-center cursor-pointer">
        Копить бонусы
      </div>
      <div class="menu-item flex items-center justify-center cursor-pointer">
        Потратить бонусы
      </div>
      <div class="menu-item flex items-center justify-center cursor-pointer">
        Зайти в игру
      </div>
      <div class="menu-item flex items-center justify-center cursor-pointer" @click="exit">
        Выйти
      </div>
    </div>
  </div>
</template>

<style>
.app {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.menu-item {
  padding: 18px;
  margin: 6px 0;
  background: #f0f0f0;
  cursor: pointer;
  border-radius: 6px;
}

.menu-item:hover {
  background: #e0e0e0;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.cart {
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
</style>