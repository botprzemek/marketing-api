<script setup lang="ts">
const { modal, data, uploadFiles, removeFile, submit, clear } = useForm();
</script>

<template>
    <NuxtLayout>
        <CommonHeader />
        <CommonForm v-on:submit="submit">
            <FormSubject
                v-model:subject="data.subject"
                v-model:scope="data.scope"
            />
            <FormRequestType
                v-model:type="data.type"
                v-model:date="data.date"
            />
            <FormDetails v-model:details="data.details" />
            <FormCustomer v-model:customer="data.customer" />
            <FormAttachments
                v-model:files="data.files"
                v-on:upload="uploadFiles"
                v-on:remove="removeFile"
            />
            <FormSubmit v-model:modal="modal" />
        </CommonForm>
        <FormModal v-model:modal="modal" v-on:close="clear" />
    </NuxtLayout>
</template>
