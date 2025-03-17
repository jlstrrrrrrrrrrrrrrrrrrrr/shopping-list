import type {
  SignUpRequest,
  SignInRequest
} from '@/schemas/account-validation';

interface AuthResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Base request handler for API calls
 * Provides consistent error handling and request formatting
 */
async function makeRequest<T = {}>(
  endpoint: string,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
  }
): Promise<AuthResponse & T> {
  try {
    const response = await fetch(endpoint, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const data = await response.json();
    return data as AuthResponse & T;
  } catch (error) {
    // Create an object that satisfies both AuthResponse and T
    return {
      success: false,
      message: 'Failed to connect to the server',
      error: 'NETWORK_ERROR'
    } as AuthResponse & T;
  }
}

export const authService = {
  async signUp(credentials: SignUpRequest): Promise<AuthResponse> {
    return makeRequest('/api/auth/sign-up', {
      method: 'POST',
      body: credentials
    });
  },

  async resendVerification(email: string): Promise<AuthResponse> {
    return makeRequest('/api/auth/sign-up', {
      method: 'POST',
      body: { email, resend: true }
    });
  },

  async signIn(credentials: SignInRequest): Promise<AuthResponse> {
    return makeRequest('/api/auth/sign-in', {
      method: 'POST',
      body: credentials
    });
  },

  async forgotPassword(email: string): Promise<AuthResponse> {
    return makeRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: { email }
    });
  },

  async resetPassword(
    password: string,
    confirmPassword: string
  ): Promise<AuthResponse> {
    return makeRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { password, confirmPassword }
    });
  }
};
