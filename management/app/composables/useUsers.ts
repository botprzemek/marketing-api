interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export default () => {
  const get = () => useFetch<User[]>("/api/users");

  return { get };
};
