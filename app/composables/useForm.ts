const FORM_STATUS = new Map<FormResponseStatus, FormResponseStatus>([
    ["not_send", "not_send"],
    ["ok", "ok"],
    ["error", "error"],
]);

export const useForm = () => {
    const modal = ref<FormModal>({
        isActive: false,
        isPending: false,
        status: FORM_STATUS.get("not_send") || "error",
        message: "Nie wysłano",
    } satisfies FormModal);
    const data = ref<FormPayload>({
        subject: "",
        details: "",
        scope: "",
        type: "",
        files: [],
        customer: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        },
    } satisfies FormPayload);

    const uploadFiles = (files: Array<FormFile>) =>
        data.value.files.push(...files);

    const removeFile = (index: number) => data.value.files.splice(index, 1);

    const submit = async () => {
        modal.value.isPending = true;

        const { status, message } = await $fetch("/api/form", {
            method: "POST",
            body: data.value,
        });

        modal.value = {
            isActive: true,
            isPending: false,
            status,
            message,
        };
    };

    const clear = () => {
        modal.value.isActive = false;
        modal.value.isPending = false;
        data.value = {
            subject: "",
            details: "",
            scope: "",
            type: "",
            files: [],
            customer: {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
            },
        } satisfies FormPayload;
    };

    return {
        modal,
        data,
        uploadFiles,
        removeFile,
        submit,
        clear,
    };
};

export default useForm;
