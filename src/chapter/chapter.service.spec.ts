import type { Course } from "@prisma/client";

import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { PrismaService } from "../prisma/prisma.service";
import { ChapterService } from "./chapter.service";
import type { CreateChapterDto } from "./dto/create-chapter.dto";
import type { UpdateChapterDto } from "./dto/update-chapter.dto";

describe("ChapterService", () => {
  let service: ChapterService;

  const email = "email";
  const mockDatabaseService = {
    chapter: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    lesson: {
      findMany: jest.fn(),
    },
    course: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChapterService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDatabaseService)
      .compile();

    service = module.get<ChapterService>(ChapterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a chapter", async () => {
    const dto: CreateChapterDto = {
      name: "Chapter 1",
      description: "Desc",
      chapterOrder: 1,
      courseId: "course-1",
    };

    const course: Course = {
      id: "course-1",
      name: "Course 1",
      description: "Course description",
      imageSrc: "image.png",
    };
    mockDatabaseService.course.findUnique.mockResolvedValue(course);

    const mockChapter = {
      id: "ch-1",
      name: dto.name,
      description: dto.description,
      chapterOtder: dto.chapterOrder,
      courseId: dto.courseId,
    };

    mockDatabaseService.chapter.create.mockResolvedValue(mockChapter);

    const result = await service.create(dto);

    expect(result).toEqual(mockChapter);
    expect(mockDatabaseService.chapter.create).toHaveBeenCalledWith({
      data: {
        name: dto.name,
        description: dto.description,
        chapterOrder: dto.chapterOrder,
        courseId: dto.courseId,
      },
    });
  });

  it("should return all chapters", async () => {
    const chapters = [
      {
        id: "ch-1",
        name: "Chapter 1",
        description: "",
        chapterOrder: 1,
        courseId: "course-1",
      },
      {
        id: "ch-2",
        name: "Chapter 2",
        description: "",
        chapterOrder: 2,
        courseId: "course-1",
      },
    ];
    mockDatabaseService.chapter.findMany.mockResolvedValue(chapters);

    const result = await service.findAll(email);

    expect(result).toEqual(chapters);
    expect(mockDatabaseService.chapter.findMany).toHaveBeenCalled();
  });

  it("should return one chapter with lessons", async () => {
    const chapter = {
      id: "ch-1",
      name: "Chapter 1",
      description: "Desc",
      courseId: "course-1",
    };
    const lessons = [
      { id: "l-1", name: "Lesson 1", chapterId: "ch-1" },
      { id: "l-2", name: "Lesson 2", chapterId: "ch-1" },
    ];

    mockDatabaseService.chapter.findUnique.mockResolvedValue(chapter);
    mockDatabaseService.lesson.findMany.mockResolvedValue(lessons);

    const result = await service.findOne(email, "ch-1");

    expect(result).toEqual({
      ...chapter,
      lessons,
    });
    expect(mockDatabaseService.chapter.findUnique).toHaveBeenCalledWith({
      where: { id: "ch-1" },
    });
    expect(mockDatabaseService.lesson.findMany).toHaveBeenCalledWith({
      where: { chapterId: "ch-1" },
    });
  });

  it("should throw NotFoundException when chapter not found in findOne", async () => {
    mockDatabaseService.chapter.findUnique.mockResolvedValue(null);

    await expect(service.findOne(email, "bad-id")).rejects.toThrow(
      new NotFoundException("Chapter with id bad-id not found"),
    );
  });

  it("should update a chapter", async () => {
    const existingChapter = {
      id: "ch-1",
      name: "Old Name",
      description: "Old Desc",
      courseId: "course-1",
    };

    mockDatabaseService.chapter.findUnique.mockResolvedValueOnce(
      existingChapter,
    );
    mockDatabaseService.course.findUnique.mockResolvedValue({
      id: "course-2",
      name: "New Course",
    });
    mockDatabaseService.chapter.update.mockResolvedValue({
      ...existingChapter,
      name: "Updated Name",
      courseId: "course-2",
    });

    const dto: UpdateChapterDto = {
      name: "Updated Name",
      courseId: "course-2",
    };
    const result = await service.update("ch-1", dto);

    expect(result.name).toBe("Updated Name");
    expect(result.courseId).toBe("course-2");
    expect(mockDatabaseService.chapter.update).toHaveBeenCalledWith({
      where: { id: "ch-1" },
      data: {
        name: "Updated Name",
        description: undefined,
        courseId: "course-2",
      },
    });
  });

  it("should throw NotFoundException when updating non-existent chapter", async () => {
    mockDatabaseService.chapter.findUnique.mockResolvedValue(null);

    await expect(
      service.update("bad-id", { name: "New Name" }),
    ).rejects.toThrow(
      new NotFoundException("Chapter with id bad-id not found"),
    );
  });

  it("should throw NotFoundException when updating with non-existent course", async () => {
    const existingChapter = {
      id: "ch-1",
      name: "Chapter",
      description: "",
      courseId: "course-1",
    };
    mockDatabaseService.chapter.findUnique.mockResolvedValueOnce(
      existingChapter,
    );
    mockDatabaseService.course.findUnique.mockResolvedValue(null);

    await expect(
      service.update("ch-1", { courseId: "bad-course" }),
    ).rejects.toThrow(
      new NotFoundException("Course with id bad-course not found"),
    );
  });

  it("should remove a chapter", async () => {
    const chapter = {
      id: "ch-1",
      name: "Chapter",
      description: "",
      courseId: "course-1",
    };
    mockDatabaseService.chapter.findUnique.mockResolvedValue(chapter);
    mockDatabaseService.chapter.delete.mockResolvedValue(chapter);

    const result = await service.remove("ch-1");

    expect(result).toEqual(chapter);
    expect(mockDatabaseService.chapter.delete).toHaveBeenCalledWith({
      where: { id: "ch-1" },
    });
  });

  it("should throw NotFoundException when removing non-existent chapter", async () => {
    mockDatabaseService.chapter.findUnique.mockResolvedValue(null);

    await expect(service.remove("bad-id")).rejects.toThrow(
      new NotFoundException("Chapter with id bad-id not found"),
    );
  });
});
