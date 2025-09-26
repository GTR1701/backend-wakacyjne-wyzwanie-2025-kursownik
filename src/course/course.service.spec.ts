import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { PrismaService } from "../prisma/prisma.service";
import { CourseService } from "./course.service";
import type { CreateCourseDto } from "./dto/create-course.dto";
import type { UpdateCourseDto } from "./dto/update-course.dto";

describe("CourseService", () => {
  let service: CourseService;

  const mockPrismaService = {
    course: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    chapter: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<CourseService>(CourseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a course", async () => {
    const dto: CreateCourseDto = {
      name: "Course 1",
      description: "Desc",
      imageSrc: "image.png",
    };
    const mockCourse = { id: "c-1", ...dto };

    mockPrismaService.course.create.mockResolvedValue(mockCourse);

    const result = await service.create(dto);

    expect(result).toEqual(mockCourse);
    expect(mockPrismaService.course.create).toHaveBeenCalledWith({
      data: {
        name: dto.name,
        description: dto.description,
        imageSrc: dto.imageSrc,
      },
    });
  });

  it("should return all courses", async () => {
    const courses = [
      { id: "c-1", name: "Course 1", description: "", imageSrc: "" },
      { id: "c-2", name: "Course 2", description: "", imageSrc: "" },
    ];
    mockPrismaService.course.findMany.mockResolvedValue(courses);

    const result = await service.findAll();

    expect(result).toEqual(courses);
    expect(mockPrismaService.course.findMany).toHaveBeenCalled();
  });

  it("should return one course with chapters", async () => {
    const course = {
      id: "c-1",
      name: "Course 1",
      description: "Desc",
      imageSrc: "img.png",
    };
    const chapters = [
      { id: "ch-1", name: "Chapter 1", courseId: "c-1" },
      { id: "ch-2", name: "Chapter 2", courseId: "c-1" },
    ];

    mockPrismaService.course.findUnique.mockResolvedValue(course);
    mockPrismaService.chapter.findMany.mockResolvedValue(chapters);

    const result = await service.findOne("c-1");

    expect(result).toEqual({
      ...course,
      chapters,
    });
    expect(mockPrismaService.course.findUnique).toHaveBeenCalledWith({
      where: { id: "c-1" },
    });
    expect(mockPrismaService.chapter.findMany).toHaveBeenCalledWith({
      where: { courseId: "c-1" },
    });
  });

  it("should throw NotFoundException when course not found in findOne", async () => {
    mockPrismaService.course.findUnique.mockResolvedValue(null);

    await expect(service.findOne("bad-id")).rejects.toThrow(
      new NotFoundException("Course with id bad-id not found"),
    );
  });

  it("should update a course", async () => {
    const existingCourse = {
      id: "c-1",
      name: "Old Name",
      description: "Old",
      imageSrc: "old.png",
    };

    mockPrismaService.course.findUnique.mockResolvedValue(existingCourse);
    mockPrismaService.course.update.mockResolvedValue({
      ...existingCourse,
      name: "Updated Name",
      imageSrc: "new.png",
    });

    const dto: UpdateCourseDto = { name: "Updated Name", imageSrc: "new.png" };
    const result = await service.update("c-1", dto);

    expect(result.name).toBe("Updated Name");
    expect(result.imageSrc).toBe("new.png");
    expect(mockPrismaService.course.update).toHaveBeenCalledWith({
      where: { id: "c-1" },
      data: {
        name: "Updated Name",
        description: undefined,
        imageSrc: "new.png",
      },
    });
  });

  it("should throw NotFoundException when updating non-existent course", async () => {
    mockPrismaService.course.findUnique.mockResolvedValue(null);

    await expect(
      service.update("bad-id", { name: "New Name" }),
    ).rejects.toThrow(new NotFoundException("Course with id bad-id not found"));
  });

  it("should remove a course", async () => {
    const course = {
      id: "c-1",
      name: "Course",
      description: "",
      imageSrc: "",
    };
    mockPrismaService.course.findUnique.mockResolvedValue(course);
    mockPrismaService.course.delete.mockResolvedValue(course);

    const result = await service.remove("c-1");

    expect(result).toEqual(course);
    expect(mockPrismaService.course.delete).toHaveBeenCalledWith({
      where: { id: "c-1" },
    });
  });

  it("should throw NotFoundException when removing non-existent course", async () => {
    mockPrismaService.course.findUnique.mockResolvedValue(null);

    await expect(service.remove("bad-id")).rejects.toThrow(
      new NotFoundException("Course with id bad-id not found"),
    );
  });
});
