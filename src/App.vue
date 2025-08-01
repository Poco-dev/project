<script>
export default {
  data() {
    return {
      tg: null,
      user: null,
      bonuses: 0, // пока захардкожено
    };
  },
  mounted() {
    if (window.Telegram && window.Telegram.WebApp) {
      this.tg = window.Telegram.WebApp;
      this.tg.ready();
      this.tg.expand();

      const unsafe = this.tg.initDataUnsafe;

      if (unsafe && unsafe.user) {
        this.user = unsafe.user;
        console.log("✅ Пользователь:", this.user);
      } else {
        console.warn("⚠️ Пользователь не определён");
      }
    } else {
      console.warn("❌ Telegram WebApp не найден");
    }
  },
  methods: {
    exit() {
      if (this.tg) {
        this.tg.close();
      } else {
        console.warn("❌ Не удалось закрыть WebApp, tg не инициализирован");
      }
    },
    profile() {
      alert(`👤 Имя: ${this.user?.first_name || "—"}
🆔 ID: ${this.user?.id || "—"}
💰 Бонусов: ${this.bonuses}`);
    },
    saveBonus() {
      if (this.tg) {
        this.tg.sendData(JSON.stringify({ action: "save" }));
      }
    },

    spendBonus() {
      if (this.tg) {
        this.tg.sendData(JSON.stringify({ action: "spend" }));
      }
    },

    playGame() {
      alert("🎮 Загрузка игры...");
    },
  },
};
</script>

<template>
  <div class="app flex flex-col items-center justify-center min-h-screen bg-violet-100">
    <h1 class="text-3xl font-bold mb-6 text-center">
      🌟 Добро пожаловать
    </h1>

    <div class="menu w-full max-w-md">
      <div class="menu-item" @click="profile">👤 Профиль</div>
      <div class="menu-item" @click="saveBonus">💎 Копить бонусы</div>
      <div class="menu-item" @click="spendBonus">🎁 Потратить бонусы</div>
      <div class="menu-item" @click="playGame">🎮 Зайти в игру</div>
      <div class="menu-item bg-red-100 text-red-700 hover:bg-red-200" @click="exit">🚪 Выйти</div>
    </div>
  </div>
</template>

<style scoped>
.app {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.menu-item {
  padding: 16px;
  margin: 6px 0;
  background: #f0f0f0;
  cursor: pointer;
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #e0e0e0;
}
</style>
