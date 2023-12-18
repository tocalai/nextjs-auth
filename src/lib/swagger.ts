import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: process.env.SWAGGER_API_DOC_PATH, 
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Doc',
        version: '1.0',
      },
      // components: {
      //   securitySchemes: {
      //     BearerAuth: {
      //       type: 'http',
      //       scheme: 'bearer',
      //       bearerFormat: 'JWT',
      //     },
      //   },
      // },
      security: [],
    },
  });
  return spec;
};