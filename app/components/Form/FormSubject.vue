<script setup lang="ts">
const subject = defineModel<FormPayload["subject"]>("subject", {
    required: true,
});
const scope = defineModel<FormPayload["scope"]>("scope", {
    required: true,
});

const isRequired = !import.meta.dev;
</script>

<template>
    <CommonContainer side separator>
        <CommonLabel for="form_subject"> Temat zgłoszenia </CommonLabel>
        <CommonTextInput
            v-model="subject"
            id="form_subject"
            name="form_subject"
            placeholder="Wpisz temat zgłoszenia"
        />
        <CommonLabel for="form_scope"> Zakres zgłoszenia </CommonLabel>

        <div :class="[`grid grid-cols-2 gap-4`]">
            <CommonLabel
                :class="[
                    `flex cursor-pointer items-center justify-between px-4 py-3`,
                    `border border-gray-300 transition-all`,
                    `hover:bg-gray-50 has-checked:border-sky-600 has-checked:ring-1 has-checked:ring-sky-600`,
                ]"
                for="form_scope_internal"
            >
                <span :class="[`text-base text-gray-700`]">Wewnętrzne</span>
                <input
                    :class="[
                        `h-4 w-4 border-gray-300 text-sky-600 checked:accent-sky-600 focus:ring-sky-600`,
                    ]"
                    :required="isRequired"
                    type="radio"
                    v-model="scope"
                    id="form_scope_internal"
                    name="form_scope"
                    value="Wewnętrzny"
                />
            </CommonLabel>
            <CommonLabel
                :class="[
                    `flex cursor-pointer items-center justify-between px-4 py-3`,
                    `border border-gray-300 transition-all`,
                    `hover:bg-gray-50 has-checked:border-sky-600 has-checked:ring-1 has-checked:ring-sky-600`,
                ]"
                for="form_scope_external"
            >
                <span :class="[`text-base text-gray-700`]"
                    >Firmy zewnętrzne</span
                >
                <input
                    :class="[
                        `h-4 w-4 border-gray-300 text-sky-600 checked:accent-sky-600 focus:ring-sky-600`,
                    ]"
                    :required="isRequired"
                    type="radio"
                    v-model="scope"
                    id="form_scope_external"
                    name="form_scope"
                    value="Firma trzecia"
                />
            </CommonLabel>
        </div>
    </CommonContainer>
</template>
