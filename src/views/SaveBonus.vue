<template>
    <div class="p-4 text-center">
        <h2 class="text-xl font-bold mb-4">💎 Сканируйте для накопления бонуса</h2>
        <canvas ref="qr"></canvas>
    </div>
</template>

<script>
import QRCode from "qrcode";

export default {
    mounted() {
        const payload = {
            action: "save",
            user_id: this.$route.query.id,
        };

        const data = JSON.stringify(payload);

        QRCode.toCanvas(this.$refs.qr, data, { width: 200 }, (err) => {
            if (err) console.error("QR Error", err);
        });
    },
};
</script>
