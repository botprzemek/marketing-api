<template>
    <button
        :class="[
            `flex justify-center items-center`,
            `px-6 py-3`,
            `bg-sky-600 transition-colors`,
            `text-white font-bold`,
            ` hover:bg-sky-700 hover:cursor-pointer`,
            `disabled:bg-sky-800 disabled:hover:cursor-not-allowed`,
            `focus-within:ring-2 focus-within:ring-sky-600/20 focus-within:border-sky-500 outline-none`,
        ]"
        type="button"
    >
        <slot />
    </button>
</template>
