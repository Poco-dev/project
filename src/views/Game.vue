<template>
    <div class="game-bg min-h-screen relative flex flex-col items-center justify-between pb-5">
        <!-- Иконки по краям -->
        <div v-if="stage === 'game'" class="icon-bar">
            <router-link v-if="stage !== 'choose'" to="/" class="font-bold text-red-600 icon-btn left">⬅️
                Выход</router-link>
            <button @click="showAvatar" class="icon-btn right2"><span>🐶</span><br>Аватар</button>
            <button @click="showSafe" class="icon-btn right"><span>🗝️</span><br>Сейф</button>
            <button @click="showUpgrade" class="icon-btn right3"><span>⚡</span><br>Апгрейд</button>

        </div>
        <!-- Выбор аватара -->
        <div v-if="stage === 'choose'" class="flex flex-col items-center pt-30">
            <h1 class="text-4xl mb-7 font-bold">Выберите аватар</h1>
            <div class="flex space-x-8 mb-8">
                <div @click="chooseAvatar('dog')" class="cursor-pointer flex flex-col items-center">
                    <span class="text-6xl mb-2">🐶</span>
                    <span class="font-semibold">Собака</span>
                </div>
                <div @click="chooseAvatar('cat')" class="cursor-pointer flex flex-col items-center">
                    <span class="text-6xl mb-2">🐱</span>
                    <span class="font-semibold">Кот</span>
                </div>
            </div>
        </div>
        <div v-else class="levels w-full overflow-y-auto h-[90vh] flex flex-col-reverse items-center pt-10 pb-20">
            <div v-for="(group, groupIndex) in levelGroups" :key="groupIndex" class="flex gap-4 mb-10"
                :class="groupIndex % 2 === 0 ? 'flex-row' : 'flex-row-reverse'">
                <div v-for="(lvl, lvlIndex) in group" :key="lvl"
                    class="level-item flex items-center justify-center w-24 h-24 rounded-full border-4 border-blue-300 text-xl font-bold"
                    @click="handleAttack(lvl)" :style="{ marginBottom: getDiagonalOffset(groupIndex, lvlIndex) }">
                    {{ lvl }}
                    <span v-if="lvl === level" class="ml-2">{{ currentMonster.emoji }}</span>
                </div>
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
        levelGroups() {
            const groups = [];
            for (let i = 0; i < this.visibleLevels.length; i += 4) {
                groups.push(this.visibleLevels.slice(i, i + 4));
            }
            return groups;
        }
    },

    mounted() {
        const tg = window.Telegram?.WebApp;
        if (tg?.initDataUnsafe?.user) {
            this.user = tg.initDataUnsafe.user;
            this.userPoints = 1000; // временно
        }
    }, methods: {
        chooseAvatar(type) {
            this.avatar = type;
            this.stage = "game";
        },
        handleAttack(lvl) {
            if (lvl !== this.level) return;

            if (this.userPoints < this.hitValue) {
                this.popup = { show: true, text: "Недостаточно баллов!" };
                return;
            }

            this.monsterHp -= this.hitValue;
            this.userPoints -= this.hitValue;

            if (this.monsterHp <= 0) {
                this.level++;
                this.monsterHp = this.currentMonsterHp;
                this.popup = { show: true, text: `Монстр побежден! Уровень ${this.level}` };
            }
        },
        getSide(index) {
            const groupIndex = Math.floor(index / 4);
            return groupIndex % 2 === 0 ? 'flex-start' : 'flex-end';
        },
        getDiagonalOffset(groupIndex, lvlIndex) {
            const baseOffset = 10; // px
            const offset = lvlIndex * baseOffset;
            return groupIndex % 2 === 0 ? `${offset}px` : `${(3 - lvlIndex) * baseOffset}px`;
        }
    }


};
</script>

<style scoped>
.game-bg {
    background: linear-gradient(to top, #e6ffe6 70%, #cce3fa 100%);
    overflow: hidden;
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
    border-radius: 32px;
    box-shadow: 0 2px 8px #0001;
    padding: 8px 12px;
    font-size: 18px;
    min-width: 60px;
    text-align: center;
    pointer-events: auto;
    border: none;
    position: absolute;
    cursor: pointer;
}

.icon-btn:hover {
    background: #f0f0f0;
}

.icon-btn.left {
    left: 10px;
    top: 0;
}

.icon-btn.right {
    right: 10px;
    top: 0;
}

.icon-btn.right3 {
    right: 10px;
    top: 160px;
}

.icon-btn.right2 {
    right: 10px;
    top: 80px;
}

.levels {
    border: 2px solid #ccc;
}

.level-item:hover {
    background-color: #e0f7ff;
    transform: scale(1.05);
}

.level-item {
    transition: transform 0.3s, background-color 0.3s;
    min-width: 5rem;
    min-height: 5rem;
}
</style>