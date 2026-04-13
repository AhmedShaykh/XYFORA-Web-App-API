import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "https://ahmx-assessment-task.vercel.app",
      "http://localhost:3000"
    ],
    methods: "GET,HEAD,PUT,POST,DELETE",
    credentials: true
  });

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix("api");

  await app.listen(process.env.PORT || 8000);

};

bootstrap();