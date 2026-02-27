<script setup lang="ts">
const isRequired = !import.meta.dev;
</script>

<template>
    <textarea
        :class="[
            `w-full border border-gray-300 px-4 py-3`,
            `resize-none outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20`,
        ]"
        :required="isRequired"
    />
</template>
