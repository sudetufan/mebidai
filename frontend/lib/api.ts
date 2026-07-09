const API_URL = "http://localhost:8000/api/v1";

export async function createPost(post: {
  title: string;
  content: string;
  category_id: number;
}) {
  const response = await fetch(`${API_URL}/posts/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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
    credentials: "include",
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

export async function getPosts(
  page = 1,
  limit = 10,
  categoryId?: number,
  query?: string
) {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));

  if (categoryId) {
    params.append("category_id", String(categoryId));
  }

  if (query && query.trim() !== "") {
    params.append("q", query);
  }

  const response = await fetch(
    `${API_URL}/posts/?${params.toString()}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load posts");
  }

  return response.json();
}

export async function getPost(id: string) {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Post not found");
  }

  return response.json();
}

export async function searchPosts(
  query: string,
  categoryId?: number
) {
  let url = `${API_URL}/posts/search?q=${encodeURIComponent(query)}`;

  if (categoryId) {
    url += `&category_id=${categoryId}`;
  }

  const response = await fetch(
    url,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search posts");
  }

  return response.json();
}

export async function getComments(postId: string) {
  const response = await fetch(
    `${API_URL}/comments?post_id=${postId}`,
    {
      cache: "no-store",
      credentials: "include",
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
  const response = await fetch(`${API_URL}/comments/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });

  if (!response.ok) {
    throw new Error("Failed to create comment");
  }

  return response.json();
}

export async function likePost(postId: number) {
  const response = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to like post");
  }

  return response.json();
}

export async function unlikePost(postId: number) {
  const response = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to unlike post");
  }

  return response.json();
}

export async function updatePost(
  id: number,
  post: {
    title: string;
    content: string;
    category_id: number;
  }
) {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }

  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories/`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load categories");
  }

  return response.json();
}

export async function createCategory(name: string) {
  const response = await fetch(`${API_URL}/categories/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  return response.json();
}

export async function deleteCategory(id: number) {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete category");
  }

  return response.json();
}