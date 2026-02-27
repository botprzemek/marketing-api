<template>
    <button
        :class="[
            `flex items-center justify-center`,
            `px-6 py-3`,
            `bg-sky-600 transition-colors`,
            `font-bold text-white`,
            `hover:cursor-pointer hover:bg-sky-700`,
            `disabled:bg-sky-800 disabled:hover:cursor-not-allowed`,
            `outline-none focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-600/20`,
        ]"
        type="button"
    >
        <slot />
    </button>
</template>
