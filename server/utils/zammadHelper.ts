export const isUserCreated = (
    email: string,
    { zammadToken, zammadUrl } = useRuntimeConfig(),
) =>
    $fetch(`${zammadUrl}/users/search`, {
        method: "GET",
        query: {
            query: email,
        },
        headers: {
            Authorization: `Token token=${zammadToken}`,
            "Content-Type": "application/json",
        },
    });

export const isTicketCreated = (ticket: unknown): ticket is FormTicket =>
    !ticket ||
    typeof ticket !== "object" ||
    !("id" in ticket) ||
    typeof ticket.id !== "string";

export const createOrganization = (
    { customer }: FormPayload,
    { zammadToken, zammadUrl } = useRuntimeConfig(),
) =>
    $fetch(`${zammadUrl}/organizations`, {
        method: "POST",
        headers: {
            Authorization: `Token token=${zammadToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: customer.email.split("@").at(-1),
            domain: customer.email.split("@").at(-1),
            shared: false,
            domain_assignment: true,
            active: true,
            vip: false,
            note: `Utworzył użytkownik ${customer.firstName} ${customer.lastName}`,
            members: [],
        }),
    });

export const createUser = (
    { customer }: FormPayload,
    { zammadToken, zammadUrl } = useRuntimeConfig(),
) =>
    $fetch(`${zammadUrl}/users`, {
        method: "POST",
        headers: {
            Authorization: `Token token=${zammadToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstname: customer.firstName,
            lastname: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            organization: customer.email.split("@").at(-1),
            roles: ["Klient"],
        }),
    });

export const createTicket = (
    { subject, details, files, customer }: FormPayload,
    { zammadAgent, zammadGroup, zammadToken, zammadUrl } = useRuntimeConfig(),
) =>
    $fetch<FormTicket>(`${zammadUrl}/tickets`, {
        method: "POST",
        headers: {
            Authorization: `Token token=${zammadToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            group: zammadGroup,
            customer: customer.email,
            title: subject,
            state: "new",
            article: {
                internal: true,
                type: "email",
                sender: "Customer",

                subject: subject,
                body: details,
                to: zammadAgent,
                attachments: files,
            },
        }),
    });

export const createTag = (
    scope: string,
    tag: string,
    { zammadToken, zammadUrl } = useRuntimeConfig(),
) =>
    $fetch(`${zammadUrl}/tags/add`, {
        method: "POST",
        headers: {
            Authorization: `Token token=${zammadToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            object: "Ticket",
            item: scope,
            o_id: tag,
        }),
    });

export default {
    isUserCreated,
    isTicketCreated,
    createOrganization,
    createUser,
    createTicket,
    createTag,
};
