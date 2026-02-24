<script setup lang="ts">
const type = defineModel<FormPayload["type"]>({
    required: true,
});

const isRequired = !import.meta.dev;
</script>

<template>
    <select
        :class="[
            `w-full h-full`,
            `px-4 py-3 border border-gray-300`,
            `hover:cursor-pointer hover:bg-gray-50`,
            `focus-within:ring-2 focus-within:ring-sky-600/20 focus-within:border-sky-500 outline-none`,
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
