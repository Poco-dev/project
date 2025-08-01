<script>
export default {
  data() {
    return {
      menu: [
        { id: 1, name: "Профиль" },
        { id: 2, name: "Списать бонусы" },
        { id: 3, name: "Потратить бонусы" },
        { id: 4, name: "Зайти в игру" },
        { id: 5, name: "Выйти" }
      ],
      selectedItem: null,
      cart: [],
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
    selectItem(item) {
      this.selectedItem = item;
    },
    addToCart() {
      if (this.selectedItem) {
        this.cart.push(this.selectedItem);
        this.selectedItem = null;
      }
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
    },
    sendOrder() {
      if (!this.tg || typeof this.tg.sendData !== "function") {
        alert("⚠️ WebApp API недоступен. Пожалуйста, запустите через Telegram.");
        console.error("Telegram WebApp API не доступен");
        return;
      }

      const orderData = JSON.stringify({
        action: "order",
        items: this.cart,
        total: this.cart.reduce((sum, item) => sum + item.price, 0),
      });

      console.log("📤 Отправка данных в Telegram:", orderData);
      this.tg.sendData(orderData);

      // Закрываем WebApp после отправки
      setTimeout(() => this.tg.close(), 300);
    },
  },
};
</script>

<template>
  <div class="app flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-3xl text-inherit underline p-4">
      Название будет
    </h1>

    <div class="menu">
      <div v-for="item in menu" :key="item.id" class="menu-item flex items-center justify-center cursor-pointer"
        @click="selectItem(item)">
        {{ item.name }}
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
  padding: 20px;
  margin: 5px 0;
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