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
                    class="flex items-center justify-between p-2 bg-gray-100 border border-gray-200"
                >
                    <div class="flex items-center gap-2 overflow-hidden">
                        <svg
                            class="w-4 h-4 text-gray-400 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-label="Ikona przesyłu plików"
                        >
                            <path
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            />
                        </svg>
                        <span class="text-sm text-gray-600 truncate">{{
                            file.filename
                        }}</span>
                        <span class="text-xs text-gray-400">
                            ({{ formatFileSize(file.size) }})
                        </span>
                    </div>
                    <button
                        @click="removeFile(index, emit)"
                        type="button"
                        class="text-gray-400 hover:text-red-700 p-1"
                    >
                        <svg
                            class="w-4 h-4"
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
