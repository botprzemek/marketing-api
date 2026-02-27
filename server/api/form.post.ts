export default defineEventHandler(async (event) => {
    if (event.headers.get("Content-Type") !== "application/json") {
        return {
            status: "error",
            message:
                "Błąd połączenia z serwerem, prosimy o kontakt z administratorem strony.",
        } satisfies FormResponse;
    }

    if (import.meta.dev) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
            status: "ok",
            message: `Dziękujemy za skontaktowanie się z naszym działem serwisu. Prosimy o sprawdzenie skrzynki e-mail w sprawie dalszych instrukcji.

            Nasi specjaliści serwisu wkrótce zapoznają się z problemem i rozpatrzą zgłoszenie w jak najkrótszym czasie.
        `,
        } satisfies FormResponse;
    }

    const data = await readBody<FormPayload>(event);
    if (!isUserCreated(data.customer.email)) {
        await createOrganization(data);
        await createUser(data);
    }

    const ticket = await createTicket(data);
    if (!isTicketCreated(ticket)) {
        return {
            status: "error",
            message:
                "Błąd połączenia z serwerem, prosimy o kontakt z administratorem strony.",
        } satisfies FormResponse;
    }

    await createTag(data.scope, ticket.id);
    await createTag(data.type, ticket.id);

    return {
        status: "ok",
        message: `Dziękujemy za skontaktowanie się z naszym działem serwisu. Prosimy o sprawdzenie skrzynki e-mail w sprawie dalszych instrukcji.

            Nasi specjaliści serwisu wkrótce zapoznają się z problemem i rozpatrzą zgłoszenie w jak najkrótszym czasie.
        `,
    } satisfies FormResponse;
});
