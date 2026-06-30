interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export async function register({ name, email, password }: RegisterParams) {
  const response = await fetch(
    `${import.meta.env.DEV ? "http://" : "https://"}${import.meta.env.VITE_API_URI}/users`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    },
  );

  if (response.status === 409) {
    throw new Error("email_conflict");
  }

  if (!response.ok) {
    throw new Error("Registration failed");
  }
}
