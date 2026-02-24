const UNITS = Array.from(new Set<FileUnit>(["B", "KB", "MB", "GB", "TB"]));

export const formatFileSize = (bytes: number) => {
    let unitIndex = 0;

    while (bytes >= 1024 && unitIndex < UNITS.length - 1) {
        bytes /= 1024;
        unitIndex++;
    }

    return `${unitIndex === 0 ? bytes.toFixed(0) : bytes.toFixed(1)} ${UNITS.at(unitIndex)}`;
};

const formatFile = (file: File, result: FileReader["result"]) =>
    ({
        filename: file.name,
        "mime-type": file.type,
        data: typeof result === "string" ? result.split(",").at(-1) || "" : "",
        size: file.size,
    }) satisfies FormFile;

const processFile = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(formatFile(file, reader.result));
        reader.onerror = reject;
    });

const isFileProccesed = (
    response: PromiseSettledResult<unknown>,
): response is PromiseFulfilledResult<FormFile> =>
    response.status === "fulfilled";

export const uploadFiles = async (
    { target }: Event,
    callback: (event: "upload", files: Array<FormFile>) => void,
) => {
    if (!target || !(target instanceof HTMLInputElement)) {
        return;
    }

    if (!target.files || !target.files.length) {
        return;
    }

    const results = await Promise.allSettled(
        Array.from(target.files).map(processFile),
    );

    const files = results.filter(isFileProccesed).map((result) => result.value);

    if (files.length <= 0) {
        return;
    }

    callback("upload", files);
    target.value = "";
};

export const removeFile = (
    index: number,
    callback: (event: "remove", index: number) => void,
) => callback("remove", index);
