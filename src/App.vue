<template>
  <div class="app">
    <h1>🍕 Пицца-бот</h1>

    <div class="menu">
      <div v-for="item in menu" :key="item.id" class="menu-item" @click="selectItem(item)">
        {{ item.name }} — {{ item.price }} ₽
      </div>
    </div>

    <div v-if="selectedItem" class="selected-item">
      Выбрано: <strong>{{ selectedItem.name }}</strong>
      <button @click="addToCart">Добавить в корзину</button>
    </div>

    <div class="cart">
      <h2>Корзина ({{ cart.length }})</h2>
      <ul>
        <li v-for="(item, index) in cart" :key="index">
          {{ item.name }} — {{ item.price }} ₽
          <button @click="removeFromCart(index)">❌</button>
        </li>
      </ul>
      <button @click="sendOrder" :disabled="!cart.length">Оформить заказ</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        { id: 1, name: "Пепперони", price: 450 },
        { id: 2, name: "Маргарита", price: 390 },
        { id: 3, name: "Гавайская", price: 420 },
      ],
      selectedItem: null,
      cart: [],
    };
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
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;

        // 1. Подготавливаем данные (обязательно в строку!)
        const orderData = JSON.stringify({
          action: "order",
          items: this.cart,
          total: this.cart.reduce((sum, item) => sum + item.price, 0),
        });

        console.log("Отправляемые данные:", orderData); // Проверьте в консоли браузера

        // 2. Отправляем данные
        tg.sendData(orderData); // Ключевой момент!

        // 3. Закрываем WebApp (не раньше отправки!)
        setTimeout(() => tg.close(), 300);
      }
    }
  },
};
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.menu-item {
  padding: 10px;
  margin: 5px 0;
  background: #f0f0f0;
  cursor: pointer;
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
}

button:disabled {
  background: #cccccc;
}

.cart {
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}
</style>