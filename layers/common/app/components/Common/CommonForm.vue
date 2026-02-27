<script setup lang="ts">
const emit = defineEmits<{
    (e: "submit"): void;
}>();
</script>

<template>
    <form
        :class="[
            `flex h-full w-full flex-col`,
            `border border-gray-200/60 bg-white`,
        ]"
        @submit.prevent="emit(`submit`)"
    >
        <slot />
    </form>
</template>
