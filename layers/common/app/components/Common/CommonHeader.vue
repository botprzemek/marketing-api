<template>
    <nav :class="[`flex h-full w-full justify-between`]">
        <img
            :class="[`h-auto w-24`]"
            src="~/assets/img/logo.png"
            alt="SPIE Energotest"
        />
        <aside>
            <h1 :class="[`text-right text-2xl font-semibold text-inherit`]">
                SPIE ENERGOTEST
            </h1>
            <p :class="[`text-right text-base font-normal text-slate-500`]">
                Formularz zgłoszeniowy
            </p>
        </aside>
    </nav>
</template>
