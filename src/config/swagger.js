import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Silver Eye API',
      version: '1.0.0',
      description: 'Professional Express.js backend API with MySQL and Sequelize ORM',
      contact: {
        name: 'API Support',
        email: 'support@silvereye.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      },
      {
        url: 'https://api.silvereye.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Success message'
            },
            data: {
              type: 'object'
            }
          }
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK'
            },
            message: {
              type: 'string',
              example: 'Server is running'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Access token required'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Validation failed',
                errors: []
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Route not found'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Forbidden - Insufficient permissions or role',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Access denied. Required role: admin'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'API',
        description: 'API information endpoints'
      },
      {
        name: 'Authentication',
        description: 'Participant authentication endpoints (login, refresh, logout, profile)'
      },
      {
        name: 'Teams',
        description: 'Team management endpoints (create, get all teams, get by ID, update, delete, manage participants)'
      },
      {
        name: 'Participants',
        description: 'Participant management endpoints (create, get all, get by ID) - Admin only'
      },
      {
        name: 'Chapters',
        description: 'Chapter management endpoints (admin CRUD, view for all roles)'
      },
      {
        name: 'Stories',
        description: 'Story management endpoints (admin CRUD, view for all roles)'
      },
      {
        name: 'Challenges',
        description: 'Challenge management endpoints (admin CRUD, view for all roles)'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/app.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };

