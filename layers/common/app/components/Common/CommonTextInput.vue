<script setup lang="ts">
const isRequired = !import.meta.dev;
</script>

<template>
    <input
        :class="[
            `w-full`,
            `border border-gray-300 px-4 py-3`,
            `outline-none focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-600/20`,
            `hover:cursor-text hover:bg-gray-50`,
        ]"
        :required="isRequired"
    />
</template>
