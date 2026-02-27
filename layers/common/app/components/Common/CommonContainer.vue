<script setup lang="ts">
const {
    nopadding = false,
    side = false,
    separator = false,
} = defineProps<{
    nopadding?: boolean;
    side?: boolean;
    separator?: boolean;
}>();
</script>

<template>
    <section
        :class="[
            side ? `grid grid-cols-(--grid-cols-side)` : `flex flex-col`,
            separator ? `border-b border-gray-200/60` : ``,
            nopadding ? `` : `p-4`,
            `gap-4`,
        ]"
    >
        <slot />
    </section>
</template>
