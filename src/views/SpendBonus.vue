<template>
    <div class="profile flex flex-col items-center justify-between min-h-screen bg-blue-50">
        <h1 class="text-3xl font-bold mb-6 pt-10">🎁 Списать бонусы</h1>

        <div v-if="user" class="info text-lg bg-white shadow-md p-6 rounded-xl w-80 flex flex-col items-center">
            <input v-model="promoCode" placeholder="Введите промокод" class="w-full p-2 border rounded mb-4" />
            <button @click="sendPromoCode" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Списать по промокоду
            </button>

            <div v-if="qrDataUrl" class="mt-6">
                <img :src="qrDataUrl" alt="QR Code" class="w-40 h-40 mx-auto" />
                <p class="text-sm mt-2 text-gray-600">Покажите этот QR-код на кассе</p>
            </div>

            <p v-if="message" class="text-sm mt-4 text-green-700">{{ message }}</p>
        </div>

        <router-link to="/" class="mt-6 text-red-600 menu-item">⬅️ Назад</router-link>
    </div>
</template>

<script>
import QRCode from "qrcode";
import axios from "axios";

export default {
    data() {
        return {
            user: null,
            qrDataUrl: "",
            promoCode: "",
            message: "",
        };
    },
    mounted() {
        const tg = window.Telegram?.WebApp;

        if (tg?.initDataUnsafe?.user) {
            this.user = tg.initDataUnsafe.user;

            const payload = {
                action: "spend_bonus",
                userId: this.user.id,
            };

            QRCode.toDataURL(JSON.stringify(payload))
                .then((url) => {
                    this.qrDataUrl = url;
                })
                .catch((err) => {
                    console.error("Ошибка генерации QR:", err);
                });
        }
    },
    methods: {
        async sendPromoCode() {
            try {
                const response = await axios.post("http://localhost:3000/api/spend-bonus", {
                    userId: this.user.id,
                    promoCode: this.promoCode,
                });

                if (response.data.success) {
                    this.message = `✅ Списано! Осталось бонусов: ${response.data.bonuses}`;
                } else {
                    this.message = `❌ Ошибка: ${response.data.error}`;
                }
            } catch (err) {
                this.message = "❌ Ошибка при списании бонусов";
                console.error(err);
            }
        },
    },
};
</script>

<style scoped>
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
