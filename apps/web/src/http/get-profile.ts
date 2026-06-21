export interface User {
  _id: string;
  name: string;
  email: string;
}

export async function getProfile(): Promise<{ user: User }> {
  const response = await fetch(
    `${import.meta.env.DEV ? "http://" : "https://"}${import.meta.env.VITE_API_URI}/me`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  return response.json();
}
