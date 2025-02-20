"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-Parser");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors({
        credentials: true,
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        methods: 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD',
    });
    await app.listen(process.env.PORT ?? 3500);
}
bootstrap();
//# sourceMappingURL=main.js.map