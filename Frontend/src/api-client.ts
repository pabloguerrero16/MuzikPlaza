import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Call Register API
export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

// Call Validate Token API
export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token Invalid");
  }

  return response.json();
};

// Call Login API
export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
};

// Call SignOut API
export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error Signing Out");
  }
};

// Call fetch Genres API
export const getGenres = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin-products/genre`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch genres");
  }

  return response.json();
};

// Call fetch Artists API
export const getArtists = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin-products/artist`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch Artists");
  }

  return response.json();
};

// Call Add Product API
export const addProduct = async (productFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin-products`, {
    method: "POST",
    credentials: "include",
    body: productFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};
