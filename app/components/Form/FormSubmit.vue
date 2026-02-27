<script setup lang="ts">
const modal = defineModel<FormModal>("modal", {
    required: true,
});
</script>

<template>
    <CommonContainer>
        <aside :class="[`flex items-center gap-3`]">
            <CommonCheckbox id="form_mailing" />
            <CommonLabel :class="[`text-sm`]" for="form_mailing">
                Wyrażam zgodę, aby SPIE ENERGOTEST utworzył zgłoszenie i wysyłał
                je na podany adres e-mail
            </CommonLabel>
        </aside>
        <aside :class="[`flex items-center gap-3`]">
            <CommonCheckbox id="form_privacy" />
            <CommonLabel :class="[`text-sm`]" for="form_privacy">
                Akceptuję
                <CommonLink>politykę prywatności</CommonLink>
                oraz
                <CommonLink>zasady ochrony danych</CommonLink>
            </CommonLabel>
        </aside>
        <CommonButton
            :disabled="modal.isActive || modal.isPending"
            type="submit"
        >
            <span v-if="!modal.isPending"> Wyślij zgłoszenie </span>
            <span v-else>
                <IconPending />
            </span>
        </CommonButton>
    </CommonContainer>
</template>
