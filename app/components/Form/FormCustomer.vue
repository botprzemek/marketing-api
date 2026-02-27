<script setup lang="ts">
const customer = defineModel<FormPayload["customer"]>("customer", {
    required: true,
});

const isRequired = !import.meta.dev;
</script>

<template>
    <CommonContainer side separator>
        <CommonLabel>Twoje dane</CommonLabel>
        <div :class="[`grid grid-cols-1 gap-4 sm:grid-cols-2`]" v-if="customer">
            <CommonTextInput
                v-model="customer.firstName"
                id="first_name"
                name="form_first_name"
                type="text"
                placeholder="Imię"
            />
            <CommonTextInput
                v-model="customer.lastName"
                id="last_name"
                name="form_last_name"
                type="text"
                placeholder="Nazwisko"
                :required="isRequired"
            />
            <div :class="[`sm:col-span-2`]">
                <CommonTextInput
                    v-model="customer.email"
                    id="form_email"
                    name="form_email"
                    type="email"
                    placeholder="Adres e-mail"
                    :required="isRequired"
                />
            </div>
            <div :class="[`sm:col-span-2`]">
                <CommonTextInput
                    v-model="customer.phone"
                    id="form_phone"
                    name="form_tel"
                    type="tel"
                    placeholder="Numer telefonu"
                    :required="isRequired"
                />
            </div>
        </div>
    </CommonContainer>
</template>
