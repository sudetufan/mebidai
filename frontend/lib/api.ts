const API_URL = "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const data = await response.json();

      if (data.detail) {
        message = data.detail;
      }
    } catch {}

    throw new ApiError(message, response.status);
  }

  return response.json();
}

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

  return handleResponse(response);
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

  return handleResponse(response);
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

  return handleResponse(response);
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

  return handleResponse(response);
}

export async function getPost(id: string) {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    cache: "no-store",
    credentials: "include",
  });

  return handleResponse(response);
}

export async function searchPosts(
  query: string,
  categoryId?: number
) {
  let url = `${API_URL}/posts/search?q=${encodeURIComponent(query)}`;

  if (categoryId) {
    url += `&category_id=${categoryId}`;
  }

  const response = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  return handleResponse(response);
}

export async function getComments(postId: string) {
  const response = await fetch(
    `${API_URL}/comments?post_id=${postId}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  return handleResponse(response);
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

  return handleResponse(response);
}

export async function likePost(postId: number) {
  const response = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "POST",
    credentials: "include",
  });

  return handleResponse(response);
}

export async function unlikePost(postId: number) {
  const response = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(response);
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

  return handleResponse(response);
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories/`, {
    cache: "no-store",
    credentials: "include",
  });

  return handleResponse(response);
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

  return handleResponse(response);
}

export async function deleteCategory(id: number) {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(response);
}
export async function updateComment(
  id: number,
  content: string
) {
  const response = await fetch(
    `${API_URL}/comments/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    }
  );

  return handleResponse(response);
}

export async function googleLogin(token: string) {
  const response = await fetch(`${API_URL}/users/google-login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  });

  return handleResponse(response);
}
export async function getUserProfile(userId: number) {
  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  return handleResponse(response);
}

export async function getUserPosts(userId: number) {
  const response = await fetch(
    `${API_URL}/users/${userId}/posts`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  return handleResponse(response);
}

export async function followUser(userId: string) {
  const response = await fetch(
    `${API_URL}/users/${userId}/follow`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Follow failed");
  }

  return response.json();
}


export async function unfollowUser(userId: string) {
  const response = await fetch(
    `${API_URL}/users/${userId}/follow`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Unfollow failed");
  }

  return response.json();
}