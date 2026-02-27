<script setup lang="ts">
const isRequired = !import.meta.dev;
</script>

<template>
    <input
        :class="[
            `w-full border border-gray-300 px-4 py-3 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20`,
            `hover:cursor-pointer hover:bg-gray-50`,
        ]"
        :required="isRequired"
        type="datetime-local"
    />
</template>
