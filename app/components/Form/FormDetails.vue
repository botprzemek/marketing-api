<script setup lang="ts">
const details = defineModel<FormPayload["details"]>("details", {
    required: true,
});
</script>

<template>
    <CommonContainer side separator>
        <CommonLabel for="form_details"> Szczegóły zgłoszenia </CommonLabel>
        <CommonTextArea
            v-model="details"
            id="form_details"
            name="form_details"
            placeholder="Opisz dokładnie wszelkie szczegóły..."
            rows="5"
        />
    </CommonContainer>
</template>
