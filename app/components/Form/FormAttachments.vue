<script setup lang="ts">
const files = defineModel<FormPayload["files"]>("files", {
    required: true,
});

const emit = defineEmits<{
    (e: "upload", files: Array<FormFile>): void;
    (e: "remove", index: number): void;
}>();
</script>

<template>
    <CommonContainer side>
        <CommonLabel for="form_files"> Załączniki </CommonLabel>
        <CommonFiles />
        <div v-if="files && files.length > 0" class="mt-4 space-y-2">
            <p class="text-sm font-medium text-gray-700">
                Wybrane pliki ({{ files.length }}):
            </p>
            <TransitionGroup>
                <div
                    v-for="(file, index) in files"
                    :key="index"
                    class="flex items-center justify-between border border-gray-200 bg-gray-100 p-2"
                >
                    <div class="flex items-center gap-2 overflow-hidden">
                        <svg
                            class="h-4 w-4 shrink-0 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-label="Ikona przesyłu plików"
                        >
                            <path
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            />
                        </svg>
                        <span class="truncate text-sm text-gray-600">{{
                            file.filename
                        }}</span>
                        <span class="text-xs text-gray-400">
                            ({{ formatFileSize(file.size) }})
                        </span>
                    </div>
                    <button
                        @click="removeFile(index, emit)"
                        type="button"
                        class="p-1 text-gray-400 hover:text-red-700"
                    >
                        <svg
                            class="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-label="Ikona przesyłu plików"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </CommonContainer>
</template>
