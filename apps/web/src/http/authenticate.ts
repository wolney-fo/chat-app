export async function authenticate(email: string, password: string) {
  const response = await fetch("http://localhost:3333/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }
}
