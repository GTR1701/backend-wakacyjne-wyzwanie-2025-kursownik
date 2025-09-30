import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import type { NBPRate, NBPResponse } from "./dto/forex.dto";
import { FetchRatesResponseDto, ForexRateDto } from "./dto/forex.dto";
import {
  PurchaseCourseDto,
  PurchaseCourseResponseDto,
} from "./dto/purchase-course.dto";

interface ForexRateEntity {
  id: number;
  currency: string;
  rate: number;
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateForexRateData {
  currency: string;
  rate: number;
  fetchedAt: Date;
}

function isForexRateEntity(value: unknown): value is ForexRateEntity {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const forexRateObject = value as Record<string, unknown>;
  return (
    typeof forexRateObject.id === "number" &&
    typeof forexRateObject.currency === "string" &&
    typeof forexRateObject.rate === "number" &&
    forexRateObject.fetchedAt instanceof Date &&
    forexRateObject.createdAt instanceof Date &&
    forexRateObject.updatedAt instanceof Date
  );
}

function _isForexRateArray(value: unknown): value is ForexRateEntity[] {
  return (
    Array.isArray(value) &&
    value.every((item: unknown) => isForexRateEntity(item))
  );
}

interface PaymentCreateData {
  title: string;
  description?: string;
  originalAmount: number;
  originalCurrency: string;
  plnAmount: number;
  exchangeRate?: number;
  status: string;
  processedAt: Date;
}

interface PaymentEntity {
  id: number;
  title: string;
  description?: string;
  originalAmount: number;
  originalCurrency: string;
  plnAmount: number;
  exchangeRate?: number;
  status: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

function isPaymentEntity(value: unknown): value is PaymentEntity {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const paymentObject = value as Record<string, unknown>;
  return (
    typeof paymentObject.id === "number" &&
    typeof paymentObject.title === "string" &&
    typeof paymentObject.originalAmount === "number" &&
    typeof paymentObject.originalCurrency === "string" &&
    typeof paymentObject.plnAmount === "number" &&
    typeof paymentObject.status === "string" &&
    paymentObject.createdAt instanceof Date &&
    paymentObject.updatedAt instanceof Date
  );
}

@Injectable()
export class ForexService {
  private readonly logger = new Logger(ForexService.name);
  private readonly NBP_API_BASE_URL = "https://api.nbp.pl/api/exchangerates";
  private readonly TARGET_CURRENCIES = ["USD", "EUR", "GBP"];

  constructor(private readonly prisma: PrismaService) {}

  private async safeCreateForexRate(
    data: CreateForexRateData,
  ): Promise<ForexRateEntity> {
    try {
      const prismaClient = this.prisma as unknown as {
        forexRate: {
          create: (arguments_: {
            data: CreateForexRateData;
          }) => Promise<unknown>;
        };
      };
      const result = await prismaClient.forexRate.create({ data });

      if (!isForexRateEntity(result)) {
        throw new Error("Invalid forex rate data returned from database");
      }

      return result;
    } catch (error) {
      throw new BadRequestException(
        `Failed to create forex rate: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async safeFindForexRate(
    currency: string,
  ): Promise<ForexRateEntity | null> {
    try {
      const prismaClient = this.prisma as unknown as {
        forexRate: {
          findFirst: (arguments_: {
            where: { currency: string };
            orderBy: { fetchedAt: string };
          }) => Promise<unknown>;
        };
      };
      const result = await prismaClient.forexRate.findFirst({
        where: { currency },
        orderBy: { fetchedAt: "desc" },
      });

      if (result === null) {
        return null;
      }

      if (!isForexRateEntity(result)) {
        throw new Error("Invalid forex rate data returned from database");
      }

      return result;
    } catch (error) {
      throw new BadRequestException(
        `Failed to find forex rate: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async safeFindManyForexRates(options: {
    where?: Record<string, unknown>;
    orderBy?: Record<string, unknown>;
    take?: number;
  }): Promise<ForexRateEntity[]> {
    try {
      const prismaClient = this.prisma as unknown as {
        forexRate: {
          findMany: (arguments_: typeof options) => Promise<unknown>;
        };
      };
      const result = await prismaClient.forexRate.findMany(options);

      if (!_isForexRateArray(result)) {
        throw new Error("Invalid forex rate data returned from database");
      }

      return result;
    } catch (error) {
      throw new BadRequestException(
        `Failed to find forex rates: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async safeCreatePayment(
    data: PaymentCreateData,
  ): Promise<PaymentEntity> {
    try {
      const prismaClient = this.prisma as unknown as {
        payment: {
          create: (arguments_: { data: PaymentCreateData }) => Promise<unknown>;
        };
      };
      const result = await prismaClient.payment.create({ data });

      if (!isPaymentEntity(result)) {
        throw new Error("Invalid payment data returned from database");
      }

      return result;
    } catch (error) {
      throw new BadRequestException(
        `Failed to create payment: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async fetchCurrentRates(): Promise<FetchRatesResponseDto> {
    this.logger.log("Starting to fetch current currency rates from NBP API");

    try {
      // Fetch the current table A (average rates) from NBP
      const response = await fetch(
        `${this.NBP_API_BASE_URL}/tables/a?format=json`,
      );

      if (!response.ok) {
        throw new BadRequestException(
          `NBP API returned status ${String(response.status)}: ${response.statusText}`,
        );
      }

      const data = (await response.json()) as NBPResponse[];

      if (!Array.isArray(data) || data.length === 0) {
        throw new BadRequestException("No data received from NBP API");
      }

      const tableData = data[0];
      const filteredRates = tableData.rates.filter((rate) =>
        this.TARGET_CURRENCIES.includes(rate.code),
      );

      if (filteredRates.length === 0) {
        throw new BadRequestException(
          "No target currencies found in NBP response",
        );
      }

      // Save rates to database
      const savedRates = await this.saveRatesToDatabase(filteredRates);
      const fetchedAt = new Date().toISOString();

      this.logger.log(
        `Successfully fetched and saved ${String(savedRates.length)} currency rates`,
      );

      return {
        fetchedCount: savedRates.length,
        rates: savedRates,
        fetchedAt,
      };
    } catch (error) {
      this.logger.error("Failed to fetch currency rates", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        "Failed to fetch currency rates from external API",
      );
    }
  }

  private async saveRatesToDatabase(rates: NBPRate[]): Promise<ForexRateDto[]> {
    const savedRates: ForexRateDto[] = [];

    for (const rate of rates) {
      try {
        const savedRate = await this.safeCreateForexRate({
          currency: rate.code,
          rate: rate.mid,
          fetchedAt: new Date(),
        });

        savedRates.push({
          currencyName: savedRate.currency,
          rate: savedRate.rate,
          fetchedAt: savedRate.fetchedAt.toISOString(),
        });

        this.logger.debug(
          `Saved rate for ${rate.code}: ${String(rate.mid)} PLN`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to save rate for currency ${rate.code}`,
          error,
        );
        // Continue with other currencies even if one fails
      }
    }

    return savedRates;
  }

  async getLatestRates(): Promise<ForexRateDto[]> {
    this.logger.log("Fetching latest currency rates from database");

    try {
      // Get the most recent rates for each currency
      const rates = await this.prisma.$queryRaw<
        {
          currencyName: string;
          rate: number;
          fetchedAt: Date;
        }[]
      >`
        SELECT DISTINCT ON ("currency") 
          "currency" as "currencyName", 
          "rate", 
          "fetchedAt"
        FROM "ForexRate" 
        WHERE "currency" IN ('USD', 'EUR', 'GBP')
        ORDER BY "currency", "fetchedAt" DESC
      `;

      return rates.map((rate) => ({
        currencyName: rate.currencyName,
        rate: rate.rate,
        fetchedAt: rate.fetchedAt.toISOString(),
      }));
    } catch (error) {
      this.logger.error("Failed to fetch latest rates from database", error);
      throw new BadRequestException("Failed to fetch latest currency rates");
    }
  }

  async getRatesHistory(
    currencyCode?: string,
    limit = 10,
  ): Promise<ForexRateDto[]> {
    this.logger.log(
      `Fetching rates history for ${currencyCode ?? "all currencies"} with limit ${String(limit)}`,
    );

    try {
      const whereClause =
        currencyCode === undefined
          ? {
              currency: {
                in: this.TARGET_CURRENCIES,
              },
            }
          : { currency: currencyCode.toUpperCase() };

      const rates = await this.safeFindManyForexRates({
        where: whereClause,
        orderBy: {
          fetchedAt: "desc",
        },
        take: limit,
      });

      return rates.map((rate) => ({
        currencyName: rate.currency,
        rate: rate.rate,
        fetchedAt: rate.fetchedAt.toISOString(),
      }));
    } catch (error) {
      this.logger.error("Failed to fetch rates history from database", error);
      throw new BadRequestException("Failed to fetch currency rates history");
    }
  }

  async purchaseCourse(
    userId: string,
    purchaseData: PurchaseCourseDto,
  ): Promise<PurchaseCourseResponseDto> {
    this.logger.log(
      `Processing course purchase for user ${userId}, course ${purchaseData.courseId}`,
    );

    try {
      // Check if course exists
      const course = await this.prisma.course.findUnique({
        where: { id: purchaseData.courseId },
      });

      if (course === null) {
        throw new NotFoundException(
          `Course with ID ${purchaseData.courseId} not found`,
        );
      }

      // Check if user already has premium access to this course
      const existingUserCourse = await this.prisma.userCourses.findFirst({
        where: {
          userId,
          courseId: purchaseData.courseId,
        },
      });

      if (existingUserCourse?.isPremium === true) {
        throw new BadRequestException(
          "User already has premium access to this course",
        );
      }

      let plnAmount = purchaseData.amount;
      let exchangeRate: number | undefined;

      // Convert to PLN if needed
      if (purchaseData.currency !== "PLN") {
        const latestRate = await this.safeFindForexRate(purchaseData.currency);

        if (latestRate === null) {
          throw new BadRequestException(
            `Exchange rate for ${purchaseData.currency} not available. Please fetch latest rates first.`,
          );
        }

        exchangeRate = latestRate.rate;
        plnAmount = purchaseData.amount * exchangeRate;
      }

      // Create payment record
      const payment = await this.safeCreatePayment({
        title: `Course Purchase: ${course.name}`,
        description:
          purchaseData.description ??
          `Premium access to course: ${course.name}`,
        originalAmount: purchaseData.amount,
        originalCurrency: purchaseData.currency,
        plnAmount,
        exchangeRate,
        status: "COMPLETED",
        processedAt: new Date(),
      });

      // Grant premium access to user
      const hasExistingUserCourse = existingUserCourse !== null;
      if (hasExistingUserCourse) {
        // Update existing user course to premium
        await this.prisma.userCourses.update({
          where: { id: existingUserCourse.id },
          data: { isPremium: true },
        });
      } else {
        // Create new user course with premium access
        // We need to get the first lesson to set as active lesson
        const firstChapter = await this.prisma.chapter.findFirst({
          where: { courseId: purchaseData.courseId },
          orderBy: { chapterOrder: "asc" },
        });

        if (firstChapter === null) {
          throw new BadRequestException(
            "Course has no chapters. Cannot create user course.",
          );
        }

        const firstLesson = await this.prisma.lesson.findFirst({
          where: { chapterId: firstChapter.id },
          orderBy: { lessonOrder: "asc" },
        });

        if (firstLesson === null) {
          throw new BadRequestException(
            "Course has no lessons. Cannot create user course.",
          );
        }

        await this.prisma.userCourses.create({
          data: {
            userId,
            courseId: purchaseData.courseId,
            activeLessonId: firstLesson.id,
            isPremium: true,
          },
        });
      }

      this.logger.log(
        `Course purchase completed successfully for user ${userId}, payment ID ${String(payment.id)}`,
      );

      return {
        paymentId: payment.id,
        courseId: purchaseData.courseId,
        originalAmount: purchaseData.amount,
        originalCurrency: purchaseData.currency,
        plnAmount,
        exchangeRate,
        status: payment.status,
        processedAt:
          payment.processedAt?.toISOString() ?? new Date().toISOString(),
        message: "Course purchased successfully! Premium access granted.",
      };
    } catch (error) {
      this.logger.error(
        `Failed to process course purchase for user ${userId}`,
        error,
      );

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException("Failed to process course purchase");
    }
  }
}
