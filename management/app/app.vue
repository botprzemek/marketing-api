<script setup lang="ts">
const { data: users } = await useUsers().get();
</script>

<template>
  <main>
    <h1>Users</h1>
    <ul>
      <li v-for="u in users" :key="u.id">{{ u.email }} — {{ u.first_name }} {{ u.last_name }}</li>
    </ul>
  </main>
</template>
