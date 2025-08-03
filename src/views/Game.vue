<script>
export default {
    data() {
        return {
            stage: "choose", // choose | game
            avatar: null, // "dog" | "cat"
            level: 1,
            maxLevel: 50,
            monsters: [
                { name: "Слизень", img: "monster1.png" },
                { name: "Гоблин", img: "monster2.png" },
                { name: "Дракон", img: "monster3.png" },
                { name: "Призрак", img: "monster4.png" },
                { name: "Голем", img: "monster5.png" },
            ],
            user: null,
            userPoints: 0,
            monsterHp: 5,
            hitValue: 1,
            showSafe: false,
            accessories: {
                hat: 0,
                chain: 0,
                jacket: 0,
                pants: 0,
                slippers: 0,
            },
            safeOpenedToday: false,
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
            // Показываем 7 уровней вокруг текущего
            const start = Math.max(1, this.level - 3);
            const end = Math.min(this.maxLevel, start + 6);
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        },
    },
    mounted() {
        const tg = window.Telegram?.WebApp;
        if (tg?.initDataUnsafe?.user) {
            this.user = tg.initDataUnsafe.user;
            // Получить баллы пользователя с сервера
            // fetch(`/api/user/${this.user.id}`).then(...)
            this.userPoints = 10; // временно
        }
        // Проверить, открывал ли сейф сегодня (можно через сервер)
        // fetch(`/api/safe/${this.user?.id}`).then(...)
    },
    methods: {
        chooseAvatar(type) {
            this.avatar = type;
            this.stage = "game";
        },
        hitMonster() {
            if (this.userPoints < this.hitValue) return alert("Недостаточно баллов!");
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
            }
        },
        openSafe() {
            if (this.safeOpenedToday) return alert("Сейф уже открыт сегодня!");
            this.safeOpenedToday = true;
            // Случайный аксессуар
            const types = ["hat", "chain", "jacket", "pants", "slippers"];
            const type = types[Math.floor(Math.random() * types.length)];
            const variant = Math.floor(Math.random() * 4); // 0 - пустой, 1-3 - аксессуар
            this.accessories[type] = variant;
            alert(`Вам выпал аксессуар: ${type} (${variant})`);
            // Сохранить на сервере
            // fetch(`/api/accessory`, { ... })
        },
        showTutorial() {
            alert("Наносите удары, чтобы победить монстра и пройти уровень. Открывайте сейф каждый день!");
        },
        showUpgrade() {
            alert("Система апгрейдов появится скоро!");
        },
        showAvatar() {
            alert("Выбранный аватар: " + (this.avatar === "dog" ? "Собака" : "Кот"));
        },
    },
};
</script>

<template>
    <div class="game flex flex-col items-center min-h-screen bg-green-50">
        <h1 class="text-3xl font-bold mt-8 mb-4">🎮 Игра</h1>
        <div v-if="stage === 'choose'" class="flex flex-col items-center">
            <h2 class="text-xl mb-4">Выберите аватар</h2>
            <div class="flex space-x-8 mb-8">
                <div @click="chooseAvatar('dog')" class="cursor-pointer flex flex-col items-center">
                    <img src="" alt="Собака"
                        class="w-24 h-24 rounded-full border-4 border-blue-300 mb-2" />
                    <span>Собака</span>
                </div>
                <div @click="chooseAvatar('cat')" class="cursor-pointer flex flex-col items-center">
                    <img src="" alt="Кот"
                        class="w-24 h-24 rounded-full border-4 border-pink-300 mb-2" />
                    <span>Кот</span>
                </div>
            </div>
        </div>
        <div v-else class="w-full max-w-md flex flex-col items-center">
            <!-- Кнопки -->
            <div class="flex justify-between w-full mb-4">
                <button @click="showAvatar" class="menu-item">Аватар</button>
                <button @click="showTutorial" class="menu-item">Обучение</button>
                <button @click="showUpgrade" class="menu-item">Апгрейд</button>
                <button @click="openSafe" class="menu-item">Сейф</button>
            </div>
            <!-- Лестница уровней -->
            <div class="levels flex flex-col items-center w-full overflow-y-auto" style="max-height: 400px;">
                <div v-for="lvl in visibleLevels" :key="lvl"
                    :class="['level', lvl === level ? 'current' : lvl < level ? 'passed' : '']"
                    class="w-full flex items-center justify-between px-4 py-2 mb-2 rounded-lg shadow"
                    style="background: #fff;">
                    <span class="font-bold">Уровень {{ lvl }}</span>
                    <span v-if="lvl === level">
                        <img :src="'/monsters/' + currentMonster.img" alt="Монстр"
                            class="w-10 h-10 inline-block mr-2" />
                        <span>{{ currentMonster.name }} (HP: {{ monsterHp }})</span>
                        <button @click="hitMonster"
                            class="ml-2 px-3 py-1 bg-green-600 text-white rounded">Ударить</button>
                    </span>
                    <span v-else-if="lvl < level" class="text-green-600">✔️ Пройдено</span>
                </div>
            </div>
            <div class="mt-4 text-lg">Ваши баллы: <b>{{ userPoints }}</b></div>
            <!-- Аксессуары -->
            <div class="mt-4 flex flex-wrap justify-center gap-2">
                <div v-for="(variant, type) in accessories" :key="type" class="accessory">
                    <img :src="`/accessories/${type}_${variant}.png`" :alt="type" class="w-10 h-10" />
                </div>
            </div>
        </div>
        <router-link to="/" class="mt-8 text-green-600 menu-item">⬅️ Назад</router-link>
    </div>
</template>

<style scoped>
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

.level.current {
    border: 2px solid #38a169;
    background: #e6ffe6;
}

.level.passed {
    opacity: 0.6;
}

.accessory {
    background: #f9f9f9;
    border-radius: 6px;
    padding: 4px;
}
</style>