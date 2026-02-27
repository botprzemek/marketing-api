<script setup lang="ts">
const type = defineModel<FormPayload["type"]>("type", {
    required: true,
});
const date = defineModel<FormPayload["date"]>("date", {
    required: true,
});
</script>

<template>
    <CommonContainer side separator>
        <CommonLabel for="form_type"> Typ i czas zgłoszenia </CommonLabel>
        <CommonContainer nopadding>
            <CommonDropdown v-model="type" id="form_type" name="form_type" />
        </CommonContainer>
        <CommonLabel for="form_datetime"></CommonLabel>
        <CommonContainer nopadding>
            <CommonDatePicker
                v-model="date"
                id="form_datetime"
                name="form_datetime"
            />
        </CommonContainer>
    </CommonContainer>
</template>
