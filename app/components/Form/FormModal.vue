<script setup lang="ts">
const modal = defineModel<FormModal>("modal", {
    required: true,
});

const emit = defineEmits<{
    (e: "close"): void;
}>();
</script>

<template>
    <Transition>
        <CommonContainer
            :class="[
                `flex fixed inset-0 flex-col place-content-center place-items-center`,
                `backdrop-grayscale-25 backdrop-blur-xs`,
            ]"
            v-if="modal.isActive"
        >
            <section
                :class="[
                    `bg-white border border-gray-200 shadow-2xl shadow-slate-200 w-full max-w-md flex flex-col gap-4 px-12 py-6`,
                ]"
                separator
            >
                <h1
                    :class="[
                        `text-2xl text-inherit border-b border-gray-200 pb-4`,
                    ]"
                >
                    {{
                        modal.status === "ok"
                            ? `Zgłoszenie zostało wysłane pomyślnie`
                            : `Wystąpił błąd!`
                    }}
                </h1>
                <p
                    :class="[
                        `text-base text-slate-500 font-normal whitespace-pre-line`,
                    ]"
                >
                    {{ modal.message }}
                </p>
                <CommonButton type="button" @click="emit(`close`)">
                    Zamknij
                </CommonButton>
            </section>
        </CommonContainer>
    </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
