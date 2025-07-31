<template>
  <div>
    <h1>Привет из Vue.js!</h1>
    <button @click="sendDataToBot">Отправить данные боту</button>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log(window.Telegram?.WebApp); // Должен вывести объект, если запущено в Telegram
    console.log(window.Telegram?.WebApp.initData); // Данные от Telegram (user, chat и т. д.)
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