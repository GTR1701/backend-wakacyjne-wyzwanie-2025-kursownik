/* eslint-disable @typescript-eslint/no-misused-spread */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { Role } from "@/lib/roles";

import { AuthGuard } from "../auth/auth.guard";
import { RoleGuard } from "../auth/roles/role.guard";
import { ChapterController } from "./chapter.controller";
import { ChapterService } from "./chapter.service";
import type { CreateChapterDto } from "./dto/create-chapter.dto";
import type { UpdateChapterDto } from "./dto/update-chapter.dto";

class MockAuthGuard implements CanActivate {
  constructor(private user) {}
  canActivate(context: ExecutionContext): boolean {
    const request_ = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    request_.user = this.user;
    return true;
  }
}

describe("ChapterController", () => {
  let controller: ChapterController;

  const mockChapterService = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    create: jest.fn((dto) => ({ id: Date.now().toString(), ...dto })),
    findAll: jest.fn(),
    findOne: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChapterController],
      providers: [ChapterService],
    })
      .overrideProvider(ChapterService)
      .useValue(mockChapterService)
      .overrideGuard(AuthGuard)

      .useValue(new MockAuthGuard({ email: "email", role: Role.ADMIN }))
      .overrideGuard(RoleGuard)

      .useValue(new MockAuthGuard({ email: "email", role: Role.ADMIN }))
      .compile();

    controller = module.get<ChapterController>(ChapterController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a chapter", async () => {
    const dto: CreateChapterDto = {
      name: "Test Chapter",
      description: "Chapter description",
      courseId: "1",
    };

    const result = await controller.create(dto);
    expect(result).toEqual({
      id: expect.any(String),
      ...dto,
    });
    expect(mockChapterService.create).toHaveBeenCalledWith(dto);
  });

  it("should return all chapters", async () => {
    const chapters = [
      { id: "1", name: "Chapter 1", description: "Desc 1", courseId: "1" },
      { id: "2", name: "Chapter 2", description: "Desc 2", courseId: "2" },
    ];
    mockChapterService.findAll.mockResolvedValue(chapters);

    const result = await controller.findAll();
    expect(result).toEqual(chapters);
    expect(mockChapterService.findAll).toHaveBeenCalled();
  });

  it("should return chapter by id", async () => {
    const chapter = {
      id: "1",
      name: "Chapter 1",
      description: "Desc 1",
      courseId: "1",
    };
    mockChapterService.findOne.mockResolvedValue(chapter);

    const result = await controller.findOne("1");
    expect(result).toEqual(chapter);
    expect(mockChapterService.findOne).toHaveBeenCalledWith("1");
  });

  it("should update a chapter", async () => {
    const id = "1";
    const dto: UpdateChapterDto = { name: "Updated Chapter" };
    const updatedChapter = {
      id,
      name: dto.name,
      description: "Desc 1",
    };
    mockChapterService.update.mockResolvedValue(updatedChapter);

    const result = await controller.update(id, dto);
    expect(result).toEqual(updatedChapter);
    expect(mockChapterService.update).toHaveBeenCalledWith(id, dto);
  });

  it("should delete a chapter", async () => {
    const chapter = {
      id: "1",
      name: "Chapter 1",
      description: "Desc 1",
      courseId: "1",
    };
    mockChapterService.remove.mockResolvedValue(chapter);

    const result = await controller.remove("1");
    expect(result).toEqual(chapter);
    expect(mockChapterService.remove).toHaveBeenCalledWith("1");
  });
});
