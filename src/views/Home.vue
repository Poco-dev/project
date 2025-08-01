<script>
export default {
    data() {
        return {};
    },
    methods: {
        exit() {
            window.Telegram.WebApp.close();
        },
    },
}
</script>
<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-violet-100">
        <h1 class="text-3xl font-bold mb-6">🌟 Добро пожаловать</h1>
        <div class="menu w-full max-w-md">
            <router-link class="menu-item" to="/profile">👤 Профиль</router-link>
            <router-link class="menu-item" to="/save">💎 Копить бонусы</router-link>
            <router-link class="menu-item" to="/spend">🎁 Потратить бонусы</router-link>
            <router-link class="menu-item" to="/game">🎮 Игра</router-link>
            <div class="menu-item bg-red-100 text-red-700 hover:bg-red-200" @click="exit">🚪 Выйти</div>
        </div>
    </div>
</template>

<style scoped>
.menu-item {
    display: block;
    padding: 16px;
    margin: 6px 0;
    background: #f0f0f0;
    text-align: center;
    font-size: 18px;
    border-radius: 8px;
    transition: background 0.2s;
}

.menu-item:hover {
    background: #e0e0e0;
}
</style>
