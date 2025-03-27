import { supabase } from '@/lib/supabase';
import { AuthResponse, LoginCredentials, ResetPasswordData, UpdatePasswordData } from '@/types/auth';
import { User } from '@/types/user';
import { logger } from '@/lib/logger';
import { RateLimiter } from '@/lib/rateLimiting';
import { validatePassword } from '@/lib/passwordValidation';

// Rate limiter para tentativas de login
const loginRateLimiter = new RateLimiter(5, 60 * 1000); // 5 tentativas por minuto

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Realiza o login do usuário
   */
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    try {
      // Verifica o rate limit
      if (!loginRateLimiter.tryRequest(email)) {
        logger.warn('Rate limit excedido para login', { email });
        throw new Error('Muitas tentativas de login. Tente novamente mais tarde.');
      }

      logger.info('Tentativa de login', { email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.error('Erro no login', { email, error: error.message });
        throw error;
      }

      // Busca dados adicionais do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        logger.error('Erro ao buscar dados do usuário', { email, error: userError.message });
        throw userError;
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: userData.name,
        role: userData.role,
        avatar_url: userData.avatar_url,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      };

      logger.info('Login realizado com sucesso', { email });

      return {
        user,
        session: {
          access_token: data.session?.access_token!,
          refresh_token: data.session?.refresh_token!,
          expires_at: data.session?.expires_at!,
        },
      };
    } catch (error) {
      logger.error('Erro inesperado no login', { email, error });
      throw error;
    }
  }

  /**
   * Realiza o logout do usuário
   */
  async logout(): Promise<void> {
    try {
      logger.info('Iniciando logout');
      const { error } = await supabase.auth.signOut();

      if (error) {
        logger.error('Erro no logout', { error: error.message });
        throw error;
      }

      logger.info('Logout realizado com sucesso');
    } catch (error) {
      logger.error('Erro inesperado no logout', { error });
      throw error;
    }
  }

  /**
   * Solicita redefinição de senha
   */
  async resetPassword({ email }: ResetPasswordData): Promise<void> {
    try {
      logger.info('Solicitando redefinição de senha', { email });

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        logger.error('Erro ao solicitar redefinição de senha', { email, error: error.message });
        throw error;
      }

      logger.info('Solicitação de redefinição de senha enviada', { email });
    } catch (error) {
      logger.error('Erro inesperado na solicitação de redefinição de senha', { email, error });
      throw error;
    }
  }

  /**
   * Atualiza a senha do usuário
   */
  async updatePassword({ password, token }: UpdatePasswordData): Promise<void> {
    try {
      // Valida a força da senha
      const validationResult = validatePassword(password);
      if (!validationResult.isValid) {
        throw new Error(validationResult.error);
      }

      logger.info('Atualizando senha');

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        logger.error('Erro ao atualizar senha', { error: error.message });
        throw error;
      }

      logger.info('Senha atualizada com sucesso');
    } catch (error) {
      logger.error('Erro inesperado na atualização de senha', { error });
      throw error;
    }
  }

  /**
   * Retorna o usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      logger.info('Buscando usuário atual');

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        logger.info('Nenhum usuário autenticado');
        return null;
      }

      // Busca dados adicionais do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        logger.error('Erro ao buscar dados do usuário', { error: userError.message });
        throw userError;
      }

      const currentUser: User = {
        id: user.id,
        email: user.email!,
        name: userData.name,
        role: userData.role,
        avatar_url: userData.avatar_url,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      };

      logger.info('Usuário atual recuperado com sucesso', { email: currentUser.email });

      return currentUser;
    } catch (error) {
      logger.error('Erro inesperado ao buscar usuário atual', { error });
      throw error;
    }
  }

  /**
   * Atualiza os dados do usuário
   */
  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    try {
      logger.info('Atualizando perfil do usuário', { userId });

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Erro ao atualizar perfil', { userId, error: error.message });
        throw error;
      }

      logger.info('Perfil atualizado com sucesso', { userId });

      return updatedUser as User;
    } catch (error) {
      logger.error('Erro inesperado na atualização do perfil', { userId, error });
      throw error;
    }
  }

  /**
   * Atualiza o avatar do usuário
   */
  async updateUserAvatar(userId: string, file: File): Promise<string> {
    try {
      logger.info('Iniciando upload do avatar', { userId });

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        logger.error('Erro no upload do avatar', { userId, error: uploadError.message });
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Atualiza o avatar_url no perfil do usuário
      await this.updateUserProfile(userId, { avatar_url: publicUrl });

      logger.info('Avatar atualizado com sucesso', { userId });

      return publicUrl;
    } catch (error) {
      logger.error('Erro inesperado no upload do avatar', { userId, error });
      throw error;
    }
  }
}

export const authService = AuthService.getInstance(); 