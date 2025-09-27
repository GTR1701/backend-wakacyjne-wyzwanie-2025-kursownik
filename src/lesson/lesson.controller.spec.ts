import type { CanActivate, ExecutionContext } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { Role } from "@/lib/roles";

import { AuthGuard } from "../auth/auth.guard";
import { RoleGuard } from "../auth/roles/role.guard";
import type { UserMetadata } from "../user/dto/user-metadata.dto";
import type { CreateLessonDto } from "./dto/create-lesson.dto";
import type { UpdateLessonDto } from "./dto/update-lesson.dto";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";

interface MockUser {
  email: string;
  role: number;
}

class MockAuthGuard implements CanActivate {
  constructor(private user: MockUser) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: MockUser }>();
    request.user = this.user;
    return true;
  }
}

describe("LessonController", () => {
  let controller: LessonController;
  const user: UserMetadata = {
    id: "id",
    email: "email",
    roles: Role.USER.toString(),
  };

  const mockLessonService = {
    create: jest.fn((dto: CreateLessonDto) => ({
      id: Date.now().toString(),
      name: dto.name,
      description: dto.description,
      chapterId: dto.chapterId,
    })),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn((id: string, dto: UpdateLessonDto) => ({
      id,
      name: dto.name,
      description: dto.description,
      chapterId: dto.chapterId,
    })),
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
    expect(result.id).toEqual(expect.stringMatching(/.*/));
    expect(result).toMatchObject(dto);
    expect(mockLessonService.create).toHaveBeenCalledWith(dto);
  });

  it("should return all lessons", async () => {
    const lessons = [
      { id: 1, title: "Lesson 1", description: "", chapterId: 1 },
      { id: 2, title: "Lesson 2", description: "", chapterId: 1 },
    ];
    mockLessonService.findAll.mockResolvedValue(lessons);

    const result = await controller.findAll({ user });
    expect(result).toEqual(lessons);
    expect(mockLessonService.findAll).toHaveBeenCalled();
  });

  it("should return lesson by id", async () => {
    const lesson = { id: 1, title: "Lesson 1", description: "", chapterId: 1 };
    mockLessonService.findOne.mockResolvedValue(lesson);

    const result = await controller.findOne("1", { user });
    expect(result).toEqual(lesson);
    expect(mockLessonService.findOne).toHaveBeenCalled();
  });

  it("should update a lesson", async () => {
    const id = "1";
    const dto: UpdateLessonDto = { name: "Updated Lesson" };
    const updatedLesson = {
      id,
      name: "Updated Lesson",
      description: "test",
      chapterId: "1",
    } as never;
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
