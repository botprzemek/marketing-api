<script setup lang="ts">
const isRequired = !import.meta.dev;
</script>

<template>
    <div>
        <div
            :class="[
                `relative border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center bg-gray-100/50 hover:bg-gray-100 transition-colors`,
                `focus-within:ring-2 focus-within:ring-sky-600/20 focus-within:border-sky-500 outline-none`,
            ]"
        >
            <input
                :class="[
                    `absolute inset-0 w-full h-full opacity-0 hover:cursor-pointer`,
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
            <div :class="[`p-3 mb-2 text-sky-600`]">
                <IconUpload />
            </div>
            <p :class="[`text-base text-gray-600`]">
                Kliknij, aby przesłać pliki
            </p>
        </div>
    </div>
</template>
