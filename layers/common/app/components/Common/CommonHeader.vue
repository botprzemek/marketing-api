<template>
    <nav :class="[`w-full h-full flex justify-between`]">
        <img
            :class="[`w-24 h-auto`]"
            src="~/assets/img/logo.png"
            alt="SPIE Energotest"
        />
        <aside>
            <h1 :class="[`text-2xl text-right text-inherit font-semibold`]">
                SPIE ENERGOTEST
            </h1>
            <p :class="[`text-base text-right text-slate-500 font-normal`]">
                Formularz zgłoszeniowy
            </p>
        </aside>
    </nav>
</template>
