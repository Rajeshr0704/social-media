import { http, HttpResponse } from 'msw';

// Mock user data
const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  avatar: null,
  bio: 'Test user bio',
  followers: [],
  following: [],
  createdAt: new Date().toISOString(),
};

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();

    // Simple validation for demo purposes
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: mockUser,
      });
    }

    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({
      message: 'User registered successfully',
    });
  }),

  // Posts endpoints
  http.get('/api/posts', () => {
    return HttpResponse.json([
      {
        id: '1',
        content: 'This is a test post',
        imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
        authorId: '1',
        author: mockUser,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      },
    ]);
  }),

  // Users endpoints
  http.get('/api/users/:userId', () => {
    return HttpResponse.json(mockUser);
  }),
];