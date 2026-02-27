<script setup lang="ts">
const isRequired = !import.meta.dev;
</script>

<template>
    <input
        :class="[
            `h-4 w-4 bg-sky-600 accent-sky-600`,
            `hover:cursor-pointer hover:checked:bg-sky-600`,
            `checked:bg-sky-600 checked:accent-sky-600`,
            `outline-none focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-600/20`,
        ]"
        :required="isRequired"
        type="checkbox"
        id="form_privacy"
    />
</template>
