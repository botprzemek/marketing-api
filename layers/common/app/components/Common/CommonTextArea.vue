<script setup lang="ts">
const isRequired = !import.meta.dev;
</script>

<template>
    <textarea
        :class="[
            `w-full px-4 py-3 border border-gray-300`,
            `focus:ring-2 focus:ring-sky-600/20 focus:border-sky-600 outline-none resize-none`,
        ]"
        :required="isRequired"
    />
</template>
