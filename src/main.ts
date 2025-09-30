import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (origin === undefined) {
        callback(null, true);
        return;
      }

      // Check if origin is localhost with allowed ports (5000-5599)
      const localhostPortPattern =
        /^https?:\/\/localhost:(50\d{2}|55\d{2}|5[0-4]\d{2})$/;
      const localhostPattern = /^https?:\/\/localhost$/;

      if (localhostPattern.test(origin) || localhostPortPattern.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("Kursownik API")
    .setDescription("API documentation for the Kursownik application")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "Custom Token",
        description:
          "Enter your authentication token (format: token_timestamp:email)",
      },
      "bearer",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
