import request from "supertest";

import type { INestApplication } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type { TestingModule } from "@nestjs/testing";

import { AppModule } from "../src/app.module";
import { AuthGuard } from "../src/auth/auth.guard";
import { RoleGuard } from "../src/auth/roles/role.guard";
import { PrismaService } from "../src/prisma/prisma.service";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface UserTestData {
  email?: string;
  password?: string;
  roles?: string;
}

// =============================================================================
// E2E TEST SUITE UTILITIES
// =============================================================================

/**
 * Main test suite class that handles NestJS application setup, database cleanup,
 * and provides utilities for making HTTP requests in e2e tests.
 */

export class E2ETestSuite {
  app: INestApplication;
  prisma: PrismaService;

  async setup(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .compile();

    this.app = moduleFixture.createNestApplication();
    this.prisma = this.app.get<PrismaService>(PrismaService);

    // Enable global validation pipe to match production setup
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    );

    await this.app.init();
    // Clean database after initialization to ensure clean state
    await this.cleanDatabase();
  }

  async cleanup(): Promise<void> {
    await this.cleanDatabase();
    await this.prisma.$disconnect();
    await this.app.close();
  }

  async cleanDatabase(): Promise<void> {
    try {
      // Use transaction to ensure atomicity and avoid foreign key issues
      await this.prisma.$transaction(async (tx) => {
        // Clean in correct order due to foreign key constraints
        await tx.user.deleteMany();
      });
    } catch (error) {
      // If transaction fails, try to clean one by one
      console.warn(
        "Transaction cleanup failed, trying individual cleanup:",
        error,
      );
      try {
        await this.prisma.user.deleteMany();
      } catch {
        /* ignore */
      }
    }
  }

  request() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(this.app.getHttpServer());
  }
}

// =============================================================================
// E2E DATA HELPER UTILITIES
// =============================================================================

/**
 * Helper class for creating test data in the database.
 * Provides convenient methods for creating trips, participants, expenses, and users
 * with sensible defaults for testing scenarios.
 */

export class E2EDataHelper {
  constructor(private prisma: PrismaService) {}
  /**
   * Creates a user with the provided data or defaults.
   * @param data Optional user data overrides
   * @returns Promise resolving to the created user
   */
  async createUser(data?: UserTestData) {
    return this.prisma.user.create({
      data: {
        email: data?.email ?? `user-${String(Date.now())}@example.com`,
        password: data?.password ?? "password123",
        roles: data?.roles ?? "USER",
      },
    });
  }
}

// =============================================================================
// E2E TEST DATA FACTORY
// =============================================================================

/**
 * Static test data factory providing predefined data objects for various test scenarios.
 * These objects can be used directly in API requests or with the E2EDataHelper methods.
 *
 * Note: All dates are set to future dates (December 2025) to pass @IsFutureDate validation.
 * Current date context: September 7, 2025
 */

export const e2eTestDataFactory = {
  user: {
    valid: {
      email: "test@example.com",
      password: "password123",
      roles: "USER",
    },
    admin: {
      email: "admin@example.com",
      password: "admin123",
      roles: "ADMIN",
    },
  },
};
