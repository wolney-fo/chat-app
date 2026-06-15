export interface User {
  _id: string;
  name: string;
  email: string;
}

export async function getProfile(): Promise<{ user: User }> {
  const response = await fetch("http://localhost:3333/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  return response.json();
}
