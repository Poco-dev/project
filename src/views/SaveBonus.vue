<template>
    <div class="profile flex flex-col items-center justify-between min-h-screen bg-blue-50">
        <h1 class="text-3xl font-bold mb-6 pt-10">💎 Копить бонусы</h1>

        <!-- QR-код -->
        <div v-if="qrDataUrl" class="info bg-white p-6 rounded-xl shadow-md w-80 flex flex-col items-center">
            <img :src="qrDataUrl" alt="QR Code" class="w-40 h-40 mx-auto" />
            <p class="text-sm mt-2 text-gray-600 text-center">Покажите этот QR-код на кассе<br />для начисления бонусов
            </p>
        </div>

        <!-- Промокод -->
        <div class="mt-6 w-80">
            <input v-model="promoCode" placeholder="Введите промокод"
                class="w-full p-3 rounded-lg border border-gray-300" />
            <button @click="submitPromo"
                class="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Применить промокод
            </button>
        </div>

        <!-- Назад и Выход -->
        <div class="flex flex-col items-center mt-10 mb-6 space-y-4">
            <router-link to="/" class="text-blue-600 menu-item">⬅️ Назад</router-link>
        </div>
    </div>
</template>

<script>
import QRCode from "qrcode";

export default {
    data() {
        return {
            user: null,
            qrDataUrl: "",
            promoCode: "",
            tg: null,
        };
    },
    mounted() {
        this.tg = window.Telegram?.WebApp;

        if (this.tg?.initDataUnsafe?.user) {
            this.user = this.tg.initDataUnsafe.user;

            const payload = {
                action: "save",
                userId: this.user.id,
            };

            QRCode.toDataURL(JSON.stringify(payload))
                .then((url) => {
                    this.qrDataUrl = url;
                })
                .catch((err) => {
                    console.error("QR generation error:", err);
                });
        } else {
            console.warn("❌ Пользователь не найден в initDataUnsafe");
        }
    },
    methods: {
        async submitPromo() {
            if (!this.promoCode.trim()) return alert("Введите промокод");

            try {
                const response = await fetch("https://your-backend.com/api/save-bonus", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: this.user.id,
                        promoCode: this.promoCode.trim(),
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    alert(`✅ Бонусы начислены! Сейчас у вас ${result.bonuses} бонусов.`);
                } else {
                    alert("❌ Промокод недействителен.");
                }
            } catch (err) {
                console.error("Ошибка при отправке промокода:", err);
                alert("🚫 Ошибка сервера");
            }
        },
        exit() {
            this.tg?.close();
        },
    },
};
</script>

<style scoped>
.profile {
    font-family: Arial, sans-serif;
    text-align: center;
}

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
