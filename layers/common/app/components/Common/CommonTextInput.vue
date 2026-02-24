<script setup lang="ts">
const isRequired = !import.meta.dev;
</script>

<template>
    <input
        :class="[
            `w-full`,
            `px-4 py-3 border border-gray-300`,
            `focus-within:ring-2 focus-within:ring-sky-600/20 focus-within:border-sky-500 outline-none`,
            `hover:cursor-text hover:bg-gray-50`,
        ]"
        :required="isRequired"
    />
</template>
