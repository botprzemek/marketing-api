export default defineEventHandler(async () => {
  return await $fetch("http://api:3000/users");
});
