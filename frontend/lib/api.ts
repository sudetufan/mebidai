const API_URL = "http://127.0.0.1:8000/api/v1";

export async function getPosts() {
  const response = await fetch(`${API_URL}/posts/`, {
    cache: "no-store",
  });

  return response.json();
}
export async function createPost(post: {
  title: string;
  content: string;
}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/posts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
}

export async function registerUser(user: {
  username: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
}

export async function loginUser(user: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}
export async function getPost(id: string) {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Post not found");
  }

  return response.json();
}
export async function getComments(postId: string) {
  const response = await fetch(
    `${API_URL}/comments?post_id=${postId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load comments");
  }

  return response.json();
}
export async function createComment(comment: {
  content: string;
  post_id: number;
}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/comments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(comment),
  });

  if (!response.ok) {
    throw new Error("Failed to create comment");
  }

  return response.json();
}
