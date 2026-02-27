<script setup lang="ts">
const isRequired = !import.meta.dev;
</script>

<template>
    <div>
        <div
            :class="[
                `relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-100/50 p-6 transition-colors hover:bg-gray-100`,
                `outline-none focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-600/20`,
            ]"
        >
            <input
                :class="[
                    `absolute inset-0 h-full w-full opacity-0 hover:cursor-pointer`,
                ]"
                :required="isRequired"
                @change="uploadFiles($event, emit)"
                id="form_files"
                name="form_files"
                accept="audio/*,video/*,image/*"
                type="file"
                capture
                multiple
            />
            <div :class="[`mb-2 p-3 text-sky-600`]">
                <IconUpload />
            </div>
            <p :class="[`text-base text-gray-600`]">
                Kliknij, aby przesłać pliki
            </p>
        </div>
    </div>
</template>
