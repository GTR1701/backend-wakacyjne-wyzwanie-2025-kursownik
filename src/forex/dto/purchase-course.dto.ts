import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PurchaseCourseDto {
  @ApiProperty({
    description: "Course ID to purchase",
    example: "clkv1a2b3c4d5e6f7g8h9i0j1",
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: "Payment amount in the specified currency",
    example: 29.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: "Currency code for the payment (USD, EUR, GBP, or PLN)",
    example: "USD",
    enum: ["USD", "EUR", "GBP", "PLN"],
  })
  @IsString()
  @IsIn(["USD", "EUR", "GBP", "PLN"])
  currency: string;

  @ApiPropertyOptional({
    description: "Optional description for the purchase",
    example: "Premium access to Advanced JavaScript Course",
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class PurchaseCourseResponseDto {
  @ApiProperty({
    description: "Payment ID for tracking",
    example: 123,
  })
  paymentId: number;

  @ApiProperty({
    description: "Course ID that was purchased",
    example: "clkv1a2b3c4d5e6f7g8h9i0j1",
  })
  courseId: string;

  @ApiProperty({
    description: "Original payment amount",
    example: 29.99,
  })
  originalAmount: number;

  @ApiProperty({
    description: "Original currency code",
    example: "USD",
  })
  originalCurrency: string;

  @ApiProperty({
    description: "Converted amount in PLN",
    example: 123.45,
  })
  plnAmount: number;

  @ApiPropertyOptional({
    description: "Exchange rate used for conversion (if applicable)",
    example: 4.1234,
  })
  exchangeRate?: number;

  @ApiProperty({
    description: "Payment status",
    example: "COMPLETED",
    enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED"],
  })
  status: string;

  @ApiProperty({
    description: "Timestamp when the purchase was processed",
    example: "2025-09-30T10:30:00.000Z",
  })
  processedAt: string;

  @ApiProperty({
    description: "Message indicating the result of the purchase",
    example: "Course purchased successfully! Premium access granted.",
  })
  message: string;
}
