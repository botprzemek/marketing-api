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
                `fixed inset-0 flex flex-col place-content-center place-items-center`,
                `backdrop-blur-xs backdrop-grayscale-25`,
            ]"
            v-if="modal.isActive"
        >
            <section
                :class="[
                    `flex w-full max-w-md flex-col gap-4 border border-gray-200 bg-white px-12 py-6 shadow-2xl shadow-slate-200`,
                ]"
                separator
            >
                <h1
                    :class="[
                        `border-b border-gray-200 pb-4 text-2xl text-inherit`,
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
                        `text-base font-normal whitespace-pre-line text-slate-500`,
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
