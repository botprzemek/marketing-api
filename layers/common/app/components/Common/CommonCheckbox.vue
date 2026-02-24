<script setup lang="ts">
const isRequired = !import.meta.dev;
</script>

<template>
    <input
        :class="[
            `w-4 h-4 accent-sky-600 bg-sky-600`,
            `hover:checked:bg-sky-600 hover:cursor-pointer`,
            `checked:bg-sky-600 checked:accent-sky-600`,
            `focus-within:ring-2 focus-within:ring-sky-600/20 focus-within:border-sky-500 outline-none`,
        ]"
        :required="isRequired"
        type="checkbox"
        id="form_privacy"
    />
</template>
