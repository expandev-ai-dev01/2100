/**
 * @summary
 * User table service with mock data.
 * Simulates backend API for table operations.
 *
 * @service userTableService
 * @domain userTable
 */

import type {
  User,
  UserListParams,
  UserListResponse,
  BulkActionResult,
  ExportOptions,
} from '../types/models';

// Mock data generator
const generateMockUsers = (count: number): User[] => {
  const statuses: User['status'][] = ['Ativo', 'Inativo', 'Pendente'];
  const types: User['type'][] = ['Cliente', 'Fornecedor', 'Parceiro', 'Admin'];
  const names = [
    'João Silva',
    'Maria Santos',
    'Pedro Oliveira',
    'Ana Costa',
    'Carlos Souza',
    'Juliana Lima',
    'Roberto Alves',
    'Fernanda Rocha',
    'Lucas Martins',
    'Patrícia Ferreira',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + ` ${Math.floor(i / names.length) + 1}`,
    email: `user${i + 1}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    type: types[Math.floor(Math.random() * types.length)],
    created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    last_login:
      Math.random() > 0.3
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        : null,
    last_updated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

let mockUsers = generateMockUsers(150);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const userTableService = {
  /**
   * List users with pagination, sorting, and filtering.
   */
  async list(params: UserListParams): Promise<UserListResponse> {
    await delay(800); // Simulate network delay

    // Simulate 5% error rate
    if (Math.random() < 0.05) {
      throw new Error('Erro ao carregar dados. Tente novamente.');
    }

    let filtered = [...mockUsers];

    // Search filter
    if (params.search && params.search.length >= 3) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.id.toString().includes(searchLower)
      );
    }

    // Status filter
    if (params.status_filter && params.status_filter.length > 0) {
      filtered = filtered.filter((user) => params.status_filter!.includes(user.status));
    }

    // Type filter
    if (params.type_filter && params.type_filter.length > 0) {
      filtered = filtered.filter((user) => params.type_filter!.includes(user.type));
    }

    // Date range filter
    if (params.date_from) {
      filtered = filtered.filter(
        (user) => new Date(user.created_at) >= new Date(params.date_from!)
      );
    }
    if (params.date_to) {
      filtered = filtered.filter((user) => new Date(user.created_at) <= new Date(params.date_to!));
    }

    // Sorting
    if (params.sort_by) {
      filtered.sort((a, b) => {
        const aVal = a[params.sort_by!];
        const bVal = b[params.sort_by!];

        if (aVal === null) return 1;
        if (bVal === null) return -1;

        let comparison = 0;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        }

        return params.sort_order === 'desc' ? -comparison : comparison;
      });
    }

    // Pagination
    const total = filtered.length;
    const total_pages = Math.ceil(total / params.items_per_page);
    const start = (params.page - 1) * params.items_per_page;
    const end = start + params.items_per_page;
    const data = filtered.slice(start, end);

    return {
      data,
      total,
      page: params.page,
      total_pages,
      items_per_page: params.items_per_page,
    };
  },

  /**
   * Get user by ID.
   */
  async getById(id: number): Promise<User> {
    await delay(300);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  },

  /**
   * Update user.
   */
  async update(id: number, data: Partial<User>): Promise<User> {
    await delay(500);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Usuário não encontrado');

    // Check email uniqueness
    if (data.email) {
      const emailExists = mockUsers.some((u) => u.id !== id && u.email === data.email);
      if (emailExists) throw new Error('Email já está em uso');
    }

    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      last_updated: new Date().toISOString(),
    };

    return mockUsers[index];
  },

  /**
   * Delete user.
   */
  async delete(id: number): Promise<void> {
    await delay(500);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Usuário não encontrado');
    mockUsers.splice(index, 1);
  },

  /**
   * Bulk delete users.
   */
  async bulkDelete(ids: number[]): Promise<BulkActionResult> {
    await delay(1000);
    let success = 0;
    let failed = 0;

    ids.forEach((id) => {
      const index = mockUsers.findIndex((u) => u.id === id);
      if (index !== -1) {
        mockUsers.splice(index, 1);
        success++;
      } else {
        failed++;
      }
    });

    return {
      success,
      failed,
      message: `${success} usuário(s) excluído(s) com sucesso${
        failed > 0 ? `, ${failed} falhou` : ''
      }`,
    };
  },

  /**
   * Bulk activate users.
   */
  async bulkActivate(ids: number[]): Promise<BulkActionResult> {
    await delay(800);
    let success = 0;

    ids.forEach((id) => {
      const user = mockUsers.find((u) => u.id === id);
      if (user) {
        user.status = 'Ativo';
        user.last_updated = new Date().toISOString();
        success++;
      }
    });

    return {
      success,
      failed: ids.length - success,
      message: `${success} usuário(s) ativado(s) com sucesso`,
    };
  },

  /**
   * Bulk deactivate users.
   */
  async bulkDeactivate(ids: number[]): Promise<BulkActionResult> {
    await delay(800);
    let success = 0;

    ids.forEach((id) => {
      const user = mockUsers.find((u) => u.id === id);
      if (user) {
        user.status = 'Inativo';
        user.last_updated = new Date().toISOString();
        success++;
      }
    });

    return {
      success,
      failed: ids.length - success,
      message: `${success} usuário(s) desativado(s) com sucesso`,
    };
  },

  /**
   * Export users data.
   */
  async export(options: ExportOptions, params: UserListParams): Promise<Blob> {
    await delay(1500);

    let dataToExport: User[] = [];

    if (options.scope === 'selected' && options.selected_ids) {
      dataToExport = mockUsers.filter((u) => options.selected_ids!.includes(u.id));
    } else if (options.scope === 'current_page') {
      const response = await this.list(params);
      dataToExport = response.data;
    } else {
      // all_filtered
      const response = await this.list({ ...params, page: 1, items_per_page: 10000 });
      dataToExport = response.data;
    }

    // Generate CSV content
    const headers = ['ID', 'Nome', 'Email', 'Status', 'Tipo', 'Data Cadastro', 'Último Login'];
    const rows = dataToExport.map((user) => [
      user.id,
      user.name,
      user.email,
      user.status,
      user.type,
      new Date(user.created_at).toLocaleDateString('pt-BR'),
      user.last_login ? new Date(user.last_login).toLocaleDateString('pt-BR') : 'Nunca',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  },
};
