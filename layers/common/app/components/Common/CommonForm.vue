<script setup lang="ts">
const emit = defineEmits<{
    (e: "submit"): void;
}>();
</script>

<template>
    <form
        :class="[
            `w-full h-full flex flex-col`,
            `bg-white border border-gray-200/60`,
        ]"
        @submit.prevent="emit(`submit`)"
    >
        <slot />
    </form>
</template>
