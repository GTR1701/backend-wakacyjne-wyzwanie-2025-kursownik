import type { CanActivate, ExecutionContext } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { Role } from "@/lib/roles";

import { AuthGuard } from "../auth/auth.guard";
import { RoleGuard } from "../auth/roles/role.guard";
import type { CreateLessonDto } from "./dto/create-lesson.dto";
import type { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";

class MockAuthGuard implements CanActivate {
  constructor(private user) {}
  canActivate(context: ExecutionContext): boolean {
    const request_ = context.switchToHttp().getRequest();
    request_.user = this.user;
    return true;
  }
}

describe("LessonController", () => {
  let controller: LessonController;

  const mockLessonService = {
    create: jest.fn(async (dto) => ({ id: Date.now().toString(), ...dto })),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonController],
      providers: [LessonService],
    })
      .overrideProvider(LessonService)
      .useValue(mockLessonService)
      .overrideGuard(AuthGuard)
      .useValue(new MockAuthGuard({ email: "email", role: Role.ADMIN }))
      .overrideGuard(RoleGuard)
      .useValue(new MockAuthGuard({ email: "email", role: Role.ADMIN }))
      .compile();

    controller = module.get<LessonController>(LessonController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a lesson", async () => {
    const dto: CreateLessonDto = {
      name: "Test Lesson",
      description: "Lesson description",
      chapterId: "1",
    };

    const result = await controller.create(dto);
    expect(result).toEqual({
      id: expect.any(String),
      ...dto,
    });
    expect(mockLessonService.create).toHaveBeenCalledWith(dto);
  });

  it("should return all lessons", async () => {
    const lessons = [
      { id: 1, title: "Lesson 1", description: "", chapterId: 1 },
      { id: 2, title: "Lesson 2", description: "", chapterId: 1 },
    ];
    mockLessonService.findAll.mockResolvedValue(lessons);

    const result = await controller.findAll();
    expect(result).toEqual(lessons);
    expect(mockLessonService.findAll).toHaveBeenCalled();
  });

  it("should return lesson by id", async () => {
    const lesson = { id: 1, title: "Lesson 1", description: "", chapterId: 1 };
    mockLessonService.findOne.mockResolvedValue(lesson);

    const result = await controller.findOne("1");
    expect(result).toEqual(lesson);
    expect(mockLessonService.findOne).toHaveBeenCalledWith("1");
  });

  it("should update a lesson", async () => {
    const id = "1";
    const dto: UpdateLessonDto = { name: "Updated Lesson" };
    const updatedLesson = {
      id,
      name: "Updated Lesson",
      description: "",
      chapterId: 1,
    };
    mockLessonService.update.mockResolvedValue(updatedLesson);

    const result = await controller.update(id, dto);
    expect(result).toEqual(updatedLesson);
    expect(mockLessonService.update).toHaveBeenCalledWith(id, dto);
  });

  it("should delete a lesson", async () => {
    const lesson = { id: 1, title: "Lesson 1", description: "", chapterId: 1 };
    mockLessonService.remove.mockResolvedValue(lesson);

    const result = await controller.remove("1");
    expect(result).toEqual(lesson);
    expect(mockLessonService.remove).toHaveBeenCalledWith("1");
  });
});
