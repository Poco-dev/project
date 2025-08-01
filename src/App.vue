<template>
  <div class="webapp-container">
    <h1>Привет из Vue.js!</h1>
    <button @click="sendDataToBot" class="tg-button">
      Отправить данные боту
    </button>
    <div v-if="debugMode" class="debug-info">
      <pre>{{ webAppData }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      webAppData: null,
      debugMode: false // Включить для отладки вне Telegram
    }
  },
  mounted() {
    this.initTelegramWebApp();
  },
  methods: {
    initTelegramWebApp() {
      if (window.Telegram?.WebApp) {
        // Инициализация WebApp
        window.Telegram.WebApp.expand();
        this.webAppData = window.Telegram.WebApp.initDataUnsafe;

        // Для отладки в браузере
        if (import.meta.env.DEV) {
          this.debugMode = true;
          this.webAppData = {
            user: {
              id: 12345,
              first_name: "Dev_User",
              last_name: "Test",
              username: "test_user"
            },
            query_id: "test_query_id"
          };
        }
      }
    },
    sendDataToBot() {
      if (window.Telegram?.WebApp) {
        const data = JSON.stringify({
          action: "button_click",
          timestamp: new Date().toISOString(),
          user: this.webAppData?.user?.id
        });

        window.Telegram.WebApp.sendData(data);
        window.Telegram.WebApp.close();
      } else {
        console.error('Telegram WebApp не доступен');
        alert('Эта страница должна открываться через Telegram!');
      }
    }
  }
};
</script>

<style scoped>
.webapp-container {
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.tg-button {
  background-color: #0088cc;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}

.tg-button:hover {
  background-color: #0077b3;
}

.debug-info {
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  font-family: monospace;
}
</style>