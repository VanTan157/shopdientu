import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, "..", "image"), {
    prefix: "/image/",
  }); // Phục vụ file từ thư mục uploads
  app.enableCors({
    origin: "http://localhost:3000", // Cho phép FE từ localhost:3000
    credentials: true, // Cho phép gửi/nhận cookies
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức được phép
    allowedHeaders: "Content-Type, Accept", // Headers được phép
  });
  await app.listen(process.env.PORT ?? 8080, "0.0.0.0");
}
bootstrap();
