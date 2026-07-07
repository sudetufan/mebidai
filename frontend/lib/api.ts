const API_URL = "http://localhost:8000/api/v1";


export async function createPost(post: {
  title: string;
  content: string;
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
  }
) {
  const response = await fetch(
    `${API_URL}/posts/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update post");
  }

  return response.json();
}