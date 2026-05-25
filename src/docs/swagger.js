const swaggerJSDoc = require('swagger-jsdoc');

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'LockyAPI',
    version: '1.0.0',
    description: 'API REST para gestão de cacifos. Trabalho de DWEB II - UMAIA 2025/2026.',
  },
  servers: [
    { url: 'http://localhost:3001' },
  ],
  tags: [
    { name: 'Auth' },
    { name: 'Stations' },
    { name: 'Lockers' },
    { name: 'Reservations' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'connect.sid' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { error: { type: 'string' } },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          githubId: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string', nullable: true },
        },
      },
      Station: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          isActive: { type: 'boolean' },
        },
      },
      Locker: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          stationId: { type: 'integer' },
          number: { type: 'string' },
          size: { type: 'string', enum: ['S', 'M', 'L'] },
          pricePerHour: { type: 'number' },
        },
      },
      Reservation: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer' },
          lockerId: { type: 'integer' },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
          totalPrice: { type: 'number' },
        },
      },
    },
  },
  paths: {
    '/auth/github': {
      get: { tags: ['Auth'], summary: 'Iniciar login OAuth2 (GitHub)', responses: { 302: { description: 'Redirect para o GitHub' } } },
    },
    '/auth/github/callback': {
      get: { tags: ['Auth'], summary: 'Callback do GitHub', responses: { 302: { description: 'Redirect para /auth/me' } } },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'], summary: 'Perfil do utilizador autenticado',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { description: 'Não autenticado' },
        },
      },
    },
    '/auth/logout': {
      get: { tags: ['Auth'], summary: 'Termina a sessão', responses: { 200: { description: 'OK' } } },
    },

    '/api/stations': {
      get: {
        tags: ['Stations'], summary: 'Listar estações',
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Station' } } } } },
        },
      },
      post: {
        tags: ['Stations'], summary: 'Criar estação',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Station' } } } },
        responses: { 201: { description: 'Criada' }, 400: { description: 'Campos em falta' }, 401: { description: 'Não autenticado' } },
      },
    },
    '/api/stations/{id}': {
      get: {
        tags: ['Stations'], summary: 'Detalhe da estação (inclui cacifos)',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Station' } } } },
          404: { description: 'Não encontrada' },
        },
      },
      put: {
        tags: ['Stations'], summary: 'Atualizar estação',
        security: [{ cookieAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Station' } } } },
        responses: { 200: { description: 'OK' }, 404: { description: 'Não encontrada' } },
      },
      delete: {
        tags: ['Stations'], summary: 'Remover estação',
        security: [{ cookieAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Removida' }, 404: { description: 'Não encontrada' } },
      },
    },

    '/api/lockers': {
      get: {
        tags: ['Lockers'], summary: 'Listar cacifos',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Locker' } } } } },
          401: { description: 'Não autenticado' },
        },
      },
      post: {
        tags: ['Lockers'], summary: 'Criar cacifo',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Locker' } } } },
        responses: { 201: { description: 'Criado' }, 400: { description: 'Campos em falta' }, 401: { description: 'Não autenticado' } },
      },
    },
    '/api/lockers/{id}': {
      get: {
        tags: ['Lockers'], summary: 'Detalhe do cacifo',
        security: [{ cookieAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Locker' } } } },
          404: { description: 'Não encontrado' },
        },
      },
      put: {
        tags: ['Lockers'], summary: 'Atualizar cacifo',
        security: [{ cookieAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Locker' } } } },
        responses: { 200: { description: 'OK' }, 404: { description: 'Não encontrado' } },
      },
      delete: {
        tags: ['Lockers'], summary: 'Remover cacifo',
        security: [{ cookieAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Removido' }, 404: { description: 'Não encontrado' } },
      },
    },

    '/api/reservations': {
      get: {
        tags: ['Reservations'], summary: 'Listar as minhas reservas',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Reservation' } } } } },
          401: { description: 'Não autenticado' },
        },
      },
      post: {
        tags: ['Reservations'], summary: 'Criar reserva',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['lockerId', 'startTime', 'endTime'],
                properties: {
                  lockerId: { type: 'integer' },
                  startTime: { type: 'string', format: 'date-time' },
                  endTime: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Criada' }, 400: { description: 'Campos em falta ou inválidos' } },
      },
    },
    '/api/reservations/{id}': {
      get: {
        tags: ['Reservations'], summary: 'Detalhe (apenas dono)',
        security: [{ cookieAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' }, 403: { description: 'Não és o dono' }, 404: { description: 'Não encontrada' } },
      },
      put: {
        tags: ['Reservations'], summary: 'Atualizar (apenas dono)',
        security: [{ cookieAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' }, 403: { description: 'Não és o dono' } },
      },
      delete: {
        tags: ['Reservations'], summary: 'Remover (apenas dono)',
        security: [{ cookieAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
        responses: { 204: { description: 'Removida' }, 403: { description: 'Não és o dono' } },
      },
    },
  },
};

module.exports = swaggerJSDoc({ definition, apis: [] });
