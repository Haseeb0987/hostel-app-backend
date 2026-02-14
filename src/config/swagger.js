/**
 * Swagger Configuration
 * API documentation setup using OpenAPI 3.0
 */

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Express Supabase Backend API',
      version: '1.0.0',
      description: 'Professional Node.js backend with Express.js and Supabase authentication. Perfect foundation for SaaS applications.',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-production-domain.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login endpoint'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique user identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            emailConfirmed: {
              type: 'boolean',
              description: 'Whether email is confirmed'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            lastSignIn: {
              type: 'string',
              format: 'date-time',
              description: 'Last sign-in timestamp'
            }
          }
        },
        Session: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              description: 'JWT access token'
            },
            refresh_token: {
              type: 'string',
              description: 'Refresh token for getting new access tokens'
            },
            expires_in: {
              type: 'integer',
              description: 'Token expiration time in seconds'
            },
            token_type: {
              type: 'string',
              example: 'bearer',
              description: 'Token type'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Error code'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Field name with validation error'
                  },
                  message: {
                    type: 'string',
                    description: 'Validation error message'
                  }
                }
              },
              description: 'Detailed validation errors'
            }
          }
        },
        SignupRequest: {
          type: 'object',
          required: ['email', 'password', 'confirmPassword'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Password (min 6 chars, must contain uppercase, lowercase, and number)',
              example: 'SecurePass123'
            },
            confirmPassword: {
              type: 'string',
              description: 'Password confirmation (must match password)',
              example: 'SecurePass123'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'SecurePass123'
            }
          }
        },
        RefreshTokenRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: {
              type: 'string',
              description: 'Refresh token obtained from login',
              example: 'refresh-token-string'
            }
          }
        },
        Plan: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique plan identifier'
            },
            name: {
              type: 'string',
              description: 'Plan name',
              example: 'Pro'
            },
            description: {
              type: 'string',
              description: 'Plan description',
              example: 'Professional plan with advanced features'
            },
            price: {
              type: 'number',
              description: 'Plan price',
              example: 29.99
            },
            currency: {
              type: 'string',
              description: 'Currency code',
              example: 'PKR'
            },
            interval: {
              type: 'string',
              enum: ['monthly', 'yearly'],
              description: 'Billing interval',
              example: 'monthly'
            },
            is_active: {
              type: 'boolean',
              description: 'Whether the plan is active'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Plan creation timestamp'
            }
          }
        },
        UserSubscription: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique subscription identifier'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'User identifier'
            },
            plan_id: {
              type: 'string',
              format: 'uuid',
              description: 'Plan identifier'
            },
            status: {
              type: 'string',
              enum: ['active', 'canceled', 'expired', 'trialing'],
              description: 'Subscription status',
              example: 'active'
            },
            start_date: {
              type: 'string',
              format: 'date-time',
              description: 'Subscription start date'
            },
            end_date: {
              type: 'string',
              format: 'date-time',
              description: 'Subscription end date'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Subscription creation timestamp'
            },
            plans: {
              $ref: '#/components/schemas/Plan',
              description: 'Associated plan details'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                message: 'Invalid or expired token',
                error: 'INVALID_TOKEN'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                message: 'Validation failed',
                error: 'VALIDATION_ERROR',
                details: [
                  {
                    field: 'email',
                    message: 'Please provide a valid email address'
                  }
                ]
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                success: false,
                message: 'Internal server error',
                error: 'SERVER_ERROR'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication operations (signup, login, logout)'
      },
      {
        name: 'User',
        description: 'User profile and account management operations'
      },
      {
        name: 'Subscriptions',
        description: 'Subscription plans and user subscription management'
      },
      {
        name: 'System',
        description: 'System health and information endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/app.js'] // Path to the API files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;