<template>
  <div>
    <h1>Привет из Vue.js!</h1>
    <button @click="sendDataToBot">Отправить данные боту</button>
  </div>
</template>

<script>
export default {
  mounted() {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand(); // Раскрыть на весь экран
      tg.MainButton.setText("Готово").show().onClick(() => {
        tg.sendData(JSON.stringify({ action: "submit" }));
      });
    } else {
      alert('Telegram WebApp не доступен');
    }
  },
  methods: {
    sendDataToBot() {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.sendData("Данные из Vue!");
        window.Telegram.WebApp.close();
      } else {
        console.log('Telegram WebApp не доступен');
        alert('Telegram WebApp не доступен');
      }
    }
  }
};
</script>