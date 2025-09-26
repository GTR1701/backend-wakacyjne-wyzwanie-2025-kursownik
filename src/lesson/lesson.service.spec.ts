import type { Lesson } from "@prisma/client";

import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { DatabaseService } from "../database/database.service";
import type { CreateLessonDto } from "./dto/create-lesson.dto";
import type { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonService } from "./lesson.service";

describe("LessonService", () => {
  let service: LessonService;

  const mockDatabaseService = {
    lesson: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    chapter: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
      .compile();

    service = module.get<LessonService>(LessonService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a lesson", async () => {
    const dto: CreateLessonDto = {
      name: "Test Lesson",
      description: "Description",
      chapterId: "chapter-1",
    };

    const mockLesson: Lesson = {
      id: "lesson-1",
      name: dto.name,
      description: dto.description,
      chapterId: dto.chapterId,
    };
    mockDatabaseService.lesson.create.mockResolvedValue(mockLesson);

    const result = await service.create(dto);

    expect(result).toEqual(mockLesson);
    expect(mockDatabaseService.lesson.create).toHaveBeenCalledWith({
      data: {
        name: dto.name,
        description: dto.description,
        chapterId: dto.chapterId,
      },
    });
  });

  it("should return all lessons", async () => {
    const lessons = [
      { id: "lesson-1", name: "Lesson 1", description: "", chapterId: "ch-1" },
      { id: "lesson-2", name: "Lesson 2", description: "", chapterId: "ch-1" },
    ];
    mockDatabaseService.lesson.findMany.mockResolvedValue(lessons);

    const result = await service.findAll();

    expect(result).toEqual(lessons);
    expect(mockDatabaseService.lesson.findMany).toHaveBeenCalled();
  });

  it("should return one lesson", async () => {
    const lesson = {
      id: "lesson-1",
      name: "Lesson 1",
      description: "desc",
      chapterId: "ch-1",
    };
    mockDatabaseService.lesson.findUnique.mockResolvedValue(lesson);

    const result = await service.findOne("lesson-1");

    expect(result).toEqual(lesson);
    expect(mockDatabaseService.lesson.findUnique).toHaveBeenCalledWith({
      where: { id: "lesson-1" },
    });
  });

  it("should throw NotFoundException when lesson not found in findOne", async () => {
    mockDatabaseService.lesson.findUnique.mockResolvedValue(null);

    await expect(service.findOne("bad-id")).rejects.toThrow(
      new NotFoundException("Lesson with id bad-id not found"),
    );
  });

  it("should update a lesson", async () => {
    const existingLesson = {
      id: "lesson-1",
      name: "Old Lesson",
      description: "Old",
      chapterId: "ch-1",
    };

    mockDatabaseService.lesson.findUnique.mockResolvedValueOnce(existingLesson);
    mockDatabaseService.chapter.findUnique.mockResolvedValue({
      id: "ch-2",
      name: "New Chapter",
    });
    mockDatabaseService.lesson.update.mockResolvedValue({
      ...existingLesson,
      name: "Updated Lesson",
      chapterId: "ch-2",
    });

    const dto: UpdateLessonDto = { name: "Updated Lesson", chapterId: "ch-2" };
    const result = await service.update("lesson-1", dto);

    expect(result.name).toBe("Updated Lesson");
    expect(result.chapterId).toBe("ch-2");
    expect(mockDatabaseService.lesson.update).toHaveBeenCalledWith({
      where: { id: "lesson-1" },
      data: {
        name: "Updated Lesson",
        description: undefined,
        chapterId: "ch-2",
      },
    });
  });

  it("should throw NotFoundException when updating a non-existent lesson", async () => {
    mockDatabaseService.lesson.findUnique.mockResolvedValue(null);

    await expect(service.update("bad-id", { name: "New" })).rejects.toThrow(
      new NotFoundException("Lesson with id bad-id not found"),
    );
  });

  it("should throw NotFoundException when updating with non-existent chapter", async () => {
    const existingLesson = {
      id: "lesson-1",
      name: "L",
      description: "",
      chapterId: "ch-1",
    };
    mockDatabaseService.lesson.findUnique.mockResolvedValueOnce(existingLesson);
    mockDatabaseService.chapter.findUnique.mockResolvedValue(null);

    await expect(
      service.update("lesson-1", { chapterId: "bad-ch" }),
    ).rejects.toThrow(
      new NotFoundException("Chapter with id bad-ch not found"),
    );
  });

  it("should remove a lesson", async () => {
    const lesson = {
      id: "lesson-1",
      name: "Lesson",
      description: "",
      chapterId: "ch-1",
    };
    mockDatabaseService.lesson.findUnique.mockResolvedValue(lesson);
    mockDatabaseService.lesson.delete.mockResolvedValue(lesson);

    const result = await service.remove("lesson-1");

    expect(result).toEqual(lesson);
    expect(mockDatabaseService.lesson.delete).toHaveBeenCalledWith({
      where: { id: "lesson-1" },
    });
  });

  it("should throw NotFoundException when removing non-existent lesson", async () => {
    mockDatabaseService.lesson.findUnique.mockResolvedValue(null);

    await expect(service.remove("bad-id")).rejects.toThrow(
      new NotFoundException("Lesson with id bad-id not found"),
    );
  });
});
