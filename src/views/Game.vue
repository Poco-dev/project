<template>
    <div class="game-bg min-h-screen relative flex flex-col items-center">
        <h1 class="text-3xl font-bold mt-8 mb-4">🎮 Игра</h1>
        <!-- Иконки по краям -->
        <div v-if="stage === 'game'" class="icon-bar">
            <button @click="showAvatar" class="icon-btn left"><span>🐶</span><br>Аватар</button>
            <button @click="showSafe" class="icon-btn right"><span>🗝️</span><br>Сейф</button>
            <button @click="showUpgrade" class="icon-btn left2"><span>⚡</span><br>Апгрейд</button>
            <button @click="showTutorial" class="icon-btn right2"><span>❓</span><br>Обучение</button>
        </div>
        <!-- Выбор аватара -->
        <div v-if="stage === 'choose'" class="flex flex-col items-center">
            <h2 class="text-xl mb-4">Выберите аватар</h2>
            <div class="flex space-x-8 mb-8">
                <div @click="chooseAvatar('dog')" class="cursor-pointer flex flex-col items-center">
                    <span class="text-6xl mb-2">🐶</span>
                    <span>Собака</span>
                </div>
                <div @click="chooseAvatar('cat')" class="cursor-pointer flex flex-col items-center">
                    <span class="text-6xl mb-2">🐱</span>
                    <span>Кот</span>
                </div>
            </div>
        </div>
        <!-- Лестница уровней -->
        <div v-else class="ladder-container">
            <div class="cloud" style="left: 20px; top: 20px;">☁️</div>
            <div class="cloud" style="left: 220px; top: 80px;">☁️</div>
            <div class="cloud" style="left: 120px; top: 220px;">☁️</div>
            <div class="cloud" style="left: 180px; top: 320px;">☁️</div>
            <div v-for="(lvl, idx) in visibleLevels" :key="lvl" :style="getLevelStyle(idx)"
                :class="['level', lvl === level ? 'current' : lvl < level ? 'passed' : '']">
                <span class="font-bold">{{ lvl }}</span>
                <span v-if="lvl === level" class="ml-2">
                    <span class="text-2xl">🌩️</span>
                    <span>{{ currentMonster.name }} (HP: {{ monsterHp }})</span>
                    <button @click="hitMonster" class="ml-2 px-3 py-1 bg-green-600 text-white rounded">Ударить</button>
                </span>
                <span v-else-if="lvl < level" class="text-green-600 ml-2">✔️</span>
            </div>
            <!-- Баллы и аксессуары -->
            <div class="score-box">Баллы: <b>{{ userPoints }}</b></div>
            <div class="accessories-box">
                <div v-for="(variant, type) in accessories" :key="type" class="accessory">
                    <span class="text-2xl">🎩</span>
                </div>
            </div>
        </div>
        <router-link to="/" class="mt-8 text-green-600 menu-item">⬅️ Назад</router-link>
        <!-- Popup -->
        <div v-if="popup.show" class="popup-overlay">
            <div class="popup-window">
                <div class="mb-4">{{ popup.text }}</div>
                <button @click="closePopup" class="px-4 py-2 bg-green-600 text-white rounded">OK</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            stage: "choose",
            avatar: null,
            level: 1,
            maxLevel: 50,
            monsters: [
                { name: "Слизень", emoji: "🟢" },
                { name: "Гоблин", emoji: "👺" },
                { name: "Дракон", emoji: "🐉" },
                { name: "Призрак", emoji: "👻" },
                { name: "Голем", emoji: "🪨" },
            ],
            user: null,
            userPoints: 0,
            monsterHp: 5,
            hitValue: 1,
            accessories: {
                hat: 0,
                chain: 0,
                jacket: 0,
                pants: 0,
                slippers: 0,
            },
            safeOpenedToday: false,
            popup: { show: false, text: "" },
        };
    },
    computed: {
        currentMonster() {
            const idx = Math.floor((this.level - 1) / 5) % this.monsters.length;
            return this.monsters[idx];
        },
        currentMonsterHp() {
            return 5 + Math.floor((this.level - 1) / 5) * 5;
        },
        visibleLevels() {
            const start = Math.max(1, this.level - 3);
            const end = Math.min(this.maxLevel, start + 6);
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        },
    },
    mounted() {
        const tg = window.Telegram?.WebApp;
        if (tg?.initDataUnsafe?.user) {
            this.user = tg.initDataUnsafe.user;
            this.userPoints = 10; // временно
        }
    },
    methods: {
        chooseAvatar(type) {
            this.avatar = type;
            this.stage = "game";
        },
        hitMonster() {
            if (this.userPoints < this.hitValue) return this.showPopup("Недостаточно баллов!");
            this.userPoints -= this.hitValue;
            this.monsterHp -= this.hitValue;
            if (this.monsterHp <= 0) {
                this.levelUp();
            }
        },
        levelUp() {
            if (this.level < this.maxLevel) {
                this.level++;
                this.monsterHp = this.currentMonsterHp;
                this.showPopup("Уровень пройден!");
            }
        },
        openSafe() {
            if (this.safeOpenedToday) return this.showPopup("Сейф уже открыт сегодня!");
            this.safeOpenedToday = true;
            const types = ["hat", "chain", "jacket", "pants", "slippers"];
            const type = types[Math.floor(Math.random() * types.length)];
            const variant = Math.floor(Math.random() * 4);
            this.accessories[type] = variant;
            this.showPopup(`Вам выпал аксессуар: ${type} (${variant})`);
        },
        showTutorial() {
            this.showPopup("Наносите удары, чтобы победить монстра и пройти уровень. Открывайте сейф каждый день!");
        },
        showUpgrade() {
            this.showPopup("Система апгрейдов появится скоро!");
        },
        showAvatar() {
            this.showPopup("Выбранный аватар: " + (this.avatar === "dog" ? "🐶 Собака" : "🐱 Кот"));
        },
        showSafe() {
            this.openSafe();
        },
        showPopup(text) {
            this.popup.text = text;
            this.popup.show = true;
        },
        closePopup() {
            this.popup.show = false;
        },
        getLevelStyle(idx) {
            // Диагональное расположение
            return {
                position: 'absolute',
                left: `${40 + idx * 40}px`,
                top: `${60 + idx * 35}px`,
                zIndex: 10 + idx,
            };
        },
    },
};
</script>

<style scoped>
.game-bg {
    background: linear-gradient(to top, #e6ffe6 70%, #cce3fa 100%);
    min-height: 100vh;
    overflow: hidden;
}

.ladder-container {
    position: relative;
    width: 100%;
    height: 400px;
    margin-top: 20px;
}

.level {
    width: 100px;
    height: 48px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 8px #0001;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    position: absolute;
    transition: box-shadow 0.2s;
}

.level.current {
    border: 2px solid #38a169;
    background: #e6ffe6;
    box-shadow: 0 0 16px #38a16955;
}

.level.passed {
    opacity: 0.6;
}

.cloud {
    position: absolute;
    font-size: 32px;
    opacity: 0.7;
    pointer-events: none;
    z-index: 1;
}

.icon-bar {
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
}

.icon-btn {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px #0001;
    padding: 8px 12px;
    font-size: 18px;
    min-width: 60px;
    text-align: center;
    pointer-events: auto;
    border: none;
    position: absolute;
}

.icon-btn.left {
    left: 10px;
    top: 0;
}

.icon-btn.right {
    right: 10px;
    top: 0;
}

.icon-btn.left2 {
    left: 10px;
    top: 60px;
}

.icon-btn.right2 {
    right: 10px;
    top: 60px;
}

.score-box {
    position: absolute;
    left: 10px;
    bottom: 10px;
    background: #fff;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 18px;
    box-shadow: 0 2px 8px #0001;
}

.accessories-box {
    position: absolute;
    right: 10px;
    bottom: 10px;
    display: flex;
    gap: 8px;
}

.accessory {
    background: #f9f9f9;
    border-radius: 6px;
    padding: 4px;
}

.menu-item {
    display: block;
    padding: 8px 16px;
    margin: 0 4px;
    background: #f0f0f0;
    text-align: center;
    font-size: 16px;
    border-radius: 8px;
    transition: background 0.2s;
    cursor: pointer;
}

.menu-item:hover {
    background: #e0e0e0;
}

.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.popup-window {
    background: #fff;
    padding: 32px 24px;
    border-radius: 16px;
    box-shadow: 0 4px 24px #0002;
    min-width: 240px;
    text-align: center;
}
</style>