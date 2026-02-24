type FileUnit = "B" | "KB" | "MB" | "GB" | "TB";

interface FormTicket {
    id: string;
}

interface FormFile {
    filename: string;
    data: string;
    "mime-type": string;
    size: number;
}

interface FormPayload {
    subject: string;
    details: string;
    scope: string;
    type: string;
    date?: Date;
    files: Array<FormFile>;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
}

type FormResponseStatus = "not_send" | "ok" | "error";

interface FormResponse {
    status: FormResponseStatus;
    message: string;
}

interface FormModal extends FormResponse {
    isActive: boolean;
    isPending: boolean;
}
