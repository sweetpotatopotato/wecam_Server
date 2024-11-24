// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 설정
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'This is the API documentation for our application.',
        },
        servers: [
            {
                url: 'http://localhost:3849/api', // 서버 URL 설정 (배포 시 변경 필요)
            },
        ],
    },
    // swagger 파일을 자동으로 생성할 경로
    apis: ['./routes/*.js'], // 여기서는 `routes` 폴더 안의 파일들에서 주석을 추출하도록 설정
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
