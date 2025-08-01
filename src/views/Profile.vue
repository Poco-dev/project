<template>
    <div class="profile flex flex-col items-center justify-between min-h-screen bg-blue-50">
        <h1 class="text-3xl font-bold mb-6 pt-10">👤 Профиль</h1>

        <div class="info text-lg bg-white shadow-md p-6 rounded-xl w-80">
            <p><strong>Имя:</strong> {{ user?.first_name || "—" }}</p>
            <p><strong>Telegram ID:</strong> {{ user?.id || "—" }}</p>
            <p><strong>Бонусов:</strong> {{ bonuses }}</p>
        </div>

        <router-link to="/" class="mt-6 text-blue-600 hover:underline menu-item ">⬅️ Назад</router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: null,
            bonuses: 0,
        };
    },
    mounted() {
        const tg = window.Telegram?.WebApp;

        if (tg?.initDataUnsafe?.user) {
            this.user = tg.initDataUnsafe.user;

            // 🟡 Здесь ты позже сможешь подгружать бонусы из БД по ID
            // Пример:
            // fetch(`/api/bonuses/${this.user.id}`).then(...) 
        } else {
            console.warn("Пользователь не найден в initDataUnsafe");
        }
    },
};
</script>

<style scoped>
.profile {
    font-family: Arial, sans-serif;
    text-align: center;
}

.info p {
    margin: 10px 0;
}

.menu-item {
    display: block;
    padding: 16px;
    margin: 18px 0;
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