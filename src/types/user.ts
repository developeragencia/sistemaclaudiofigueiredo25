import { Role } from './auth';

export type UserRole = 'ADMIN_MASTER' | 'OFFICE_PERMANENT' | 'OFFICE_TEMPORARY' | 'CLIENT' | 'SALES_REP';

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN_MASTER: 'Administrador Master',
  OFFICE_PERMANENT: 'Equipe Permanente',
  OFFICE_TEMPORARY: 'Equipe Temporária',
  CLIENT: 'Cliente',
  SALES_REP: 'Representante Comercial'
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  status: 'active' | 'inactive' | 'blocked';
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: Role;
  status?: 'active' | 'inactive' | 'blocked';
}

export interface UserFilters {
  search?: string;
  role?: Role;
  status?: 'active' | 'inactive' | 'blocked';
  page?: number;
  limit?: number;
}

export interface UserResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserCreateInput {
  email: string;
  password: string;
  name: string;
  roles: string[];
  clientId?: string;
}

export interface UserUpdateInput {
  name?: string;
  roles?: string[];
  clientId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  position?: string;
  department?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  role: UserRole;
  status?: 'active' | 'inactive';
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  position?: string;
  phone?: string;
  department?: string;
  bio?: string;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface UpdateAvatarResponse {
  avatarUrl: string;
}

export interface Client {
  id: string;
  cnpj: string;
  corporateName: string;
  tradeName: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  assignedUsers: string[]; // IDs dos usuários com acesso
  salesRepId?: string; // ID do representante comercial
}

export interface CreateClientData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    district?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  type?: 'public' | 'private';
}

export interface UpdateClientData {
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    district?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  type?: 'public' | 'private';
  status?: 'active' | 'inactive';
}

export interface ClientsResponse {
  data: Client[];
  total: number;
}

export interface ActiveClientContext {
  client: Client | null;
  setActiveClient: (client: Client | null) => void;
}

export interface UserPermissions {
  canViewAllClients: boolean;
  canEditClients: boolean;
  canCreateProposals: boolean;
  canApproveProposals: boolean;
  canViewFinancialData: boolean;
  canExportData: boolean;
  canManageUsers: boolean;
}
