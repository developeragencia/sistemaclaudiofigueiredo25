import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/lib/supabase';
import * as authService from '../authService';
import { User } from '@/types/user';
import { logger } from '../../lib/logger';
import { rateLimiter } from '../../lib/rateLimiting';
import { validatePassword } from '../../lib/passwordValidation';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
      getUser: vi.fn(),
      refreshSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));

// Mock do Logger
vi.mock('../../lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock do Rate Limiter
vi.mock('../../lib/rateLimiting', () => ({
  rateLimiter: {
    check: vi.fn(),
    registerAttempt: vi.fn(),
  },
}));

// Mock da validação de senha
vi.mock('../../lib/passwordValidation', () => ({
  validatePassword: vi.fn(),
}));

describe('authService', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    roles: ['user'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'Test123!@#',
    };

    it('deve realizar login com sucesso', async () => {
      const mockUser = { id: '1', email: credentials.email };
      const mockSession = { access_token: 'token' };

      vi.mocked(rateLimiter.check).mockReturnValue({ allowed: true });
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await authService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(rateLimiter.registerAttempt).toHaveBeenCalledWith(credentials.email, true);
      expect(logger.info).toHaveBeenCalled();
    });

    it('deve bloquear login quando exceder limite de tentativas', async () => {
      vi.mocked(rateLimiter.check).mockReturnValue({
        allowed: false,
        waitTime: 900,
      });

      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toContain('muitas tentativas');
      expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });

    it('deve lidar com erro de autenticação', async () => {
      vi.mocked(rateLimiter.check).mockReturnValue({ allowed: true });
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(rateLimiter.registerAttempt).toHaveBeenCalledWith(credentials.email, false);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('deve fazer logout com sucesso', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

      await expect(authService.logout()).resolves.not.toThrow();
    });

    it('deve lançar erro se o logout falhar', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: new Error('Logout failed'),
      });

      await expect(authService.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('resetPassword', () => {
    const email = 'test@example.com';

    it('deve enviar email de reset de senha com sucesso', async () => {
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await authService.resetPassword({ email });

      expect(result.success).toBe(true);
      expect(logger.info).toHaveBeenCalled();
    });

    it('deve lidar com erro no reset de senha', async () => {
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
        data: null,
        error: { message: 'Error resetting password' },
      });

      const result = await authService.resetPassword({ email });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    const updateData = {
      password: 'NewTest123!@#',
      token: 'reset-token',
    };

    it('deve atualizar senha com sucesso', async () => {
      vi.mocked(validatePassword).mockReturnValue({ isValid: true, errors: [] });
      vi.mocked(supabase.auth.updateUser).mockResolvedValue({
        data: { user: { id: '1' } },
        error: null,
      });

      const result = await authService.updatePassword(updateData);

      expect(result.success).toBe(true);
      expect(logger.info).toHaveBeenCalled();
    });

    it('deve rejeitar senha inválida', async () => {
      vi.mocked(validatePassword).mockReturnValue({
        isValid: false,
        errors: ['Senha muito fraca'],
      });

      const result = await authService.updatePassword(updateData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Senha muito fraca');
      expect(supabase.auth.updateUser).not.toHaveBeenCalled();
    });

    it('deve lidar com erro na atualização da senha', async () => {
      vi.mocked(validatePassword).mockReturnValue({ isValid: true, errors: [] });
      vi.mocked(supabase.auth.updateUser).mockResolvedValue({
        data: { user: null },
        error: { message: 'Error updating password' },
      });

      const result = await authService.updatePassword(updateData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('deve retornar o usuário atual com sucesso', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: { id: '1' } },
        error: null,
      });

      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
      }));

      const result = await authService.getCurrentUser();
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null se não houver usuário autenticado', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await authService.getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe('refreshSession', () => {
    it('deve renovar a sessão com sucesso', async () => {
      vi.mocked(supabase.auth.refreshSession).mockResolvedValue({
        data: {},
        error: null,
      });

      await expect(authService.refreshSession()).resolves.not.toThrow();
    });

    it('deve lançar erro se a renovação da sessão falhar', async () => {
      vi.mocked(supabase.auth.refreshSession).mockResolvedValue({
        data: null,
        error: new Error('Refresh session failed'),
      });

      await expect(authService.refreshSession()).rejects.toThrow(
        'Refresh session failed'
      );
    });
  });
}); 