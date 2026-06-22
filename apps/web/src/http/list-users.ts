export interface ListedUser {
  _id: string;
  name: string;
}

export async function listUsers(): Promise<{ users: ListedUser[] }> {
  const response = await fetch(
    `${import.meta.env.DEV ? "http://" : "https://"}${import.meta.env.VITE_API_URI}/users`,
    { credentials: "include" },
  );

  if (!response.ok) throw new Error("Failed to load users");

  return response.json();
}
