<script setup lang="ts">
const type = defineModel<FormPayload["type"]>({
    required: true,
});

const isRequired = !import.meta.dev;
</script>

<template>
    <select
        :class="[
            `h-full w-full`,
            `border border-gray-300 px-4 py-3`,
            `hover:cursor-pointer hover:bg-gray-50`,
            `outline-none focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-600/20`,
        ]"
        v-model="type"
        :required="isRequired"
    >
        <option :class="[`hover:cursor-pointer`]" :value="``" disabled selected>
            Wybierz typ zgłoszenia
        </option>
        <option :class="[`hover:cursor-pointer`]" value="Produkt">
            Produkt
        </option>
        <option :class="[`hover:cursor-pointer`]" value="Pytanie">
            Pytanie
        </option>
        <option :class="[`hover:cursor-pointer`]" value="Inne">Inne</option>
    </select>
</template>
