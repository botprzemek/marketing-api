export default defineEventHandler( () => {
  return $fetch("http://oauth-api:3000/users");
});
