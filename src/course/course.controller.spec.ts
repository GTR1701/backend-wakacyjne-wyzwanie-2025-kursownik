import type { CanActivate, ExecutionContext } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { Role } from "@/lib/roles";

import { AuthGuard } from "../auth/auth.guard";
import { RoleGuard } from "../auth/roles/role.guard";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import type { CreateCourseDto } from "./dto/create-course.dto";
import type { UpdateCourseDto } from "./dto/update-course.dto";

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

describe("CourseController", () => {
  let controller: CourseController;

  const mockCourseService = {
    create: jest.fn((dto: CreateCourseDto) => ({
      id: Date.now().toString(),
      name: dto.name,
      description: dto.description,
      imageSrc: dto.imageSrc,
    })),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn((id: string, dto: UpdateCourseDto) => ({
      id,
      name: dto.name,
      description: dto.description,
      imageSrc: dto.imageSrc,
    })),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [CourseService],
    })
      .overrideProvider(CourseService)
      .useValue(mockCourseService)
      .overrideGuard(AuthGuard)
      .useValue(new MockAuthGuard({ email: "email", role: Role.ADMIN }))
      .overrideGuard(RoleGuard)
      .useValue(new MockAuthGuard({ email: "email", role: Role.ADMIN }))
      .compile();

    controller = module.get<CourseController>(CourseController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a course", async () => {
    const dto: CreateCourseDto = {
      name: "Test Course",
      description: "Course description",
      imageSrc: "image src",
    };

    const result = await controller.create(dto);
    expect(result.id).toEqual(expect.stringMatching(/.*/));
    expect(result).toMatchObject(dto);
    expect(mockCourseService.create).toHaveBeenCalledWith(dto);
  });

  it("should return all courses", async () => {
    const courses = [
      {
        id: 1,
        name: "Course 1",
        description: "Desc 1",
        imageSrc: "image src 1",
      },
      {
        id: 2,
        name: "Course 2",
        description: "Desc 2",
        imageSrc: "image src 2",
      },
    ];
    mockCourseService.findAll.mockResolvedValue(courses);

    const result = await controller.findAll();
    expect(result).toEqual(courses);
    expect(mockCourseService.findAll).toHaveBeenCalled();
  });

  it("should return course by id", async () => {
    const course = {
      id: 1,
      name: "Course 1",
      description: "Desc 1",
      imageSrc: "image src",
    };
    mockCourseService.findOne.mockResolvedValue(course);

    const result = await controller.findOne("1");
    expect(result).toEqual(course);
    expect(mockCourseService.findOne).toHaveBeenCalledWith("1");
  });

  it("should update a course", async () => {
    const id = "1";
    const dto: UpdateCourseDto = { name: "Updated Course" };
    const updatedCourse = {
      id,
      name: dto.name,
      description: "Desc 1",
      imageSrc: "image src",
    } as never;
    mockCourseService.update.mockResolvedValue(updatedCourse);

    const result = await controller.update(id, dto);
    expect(result).toEqual(updatedCourse);
    expect(mockCourseService.update).toHaveBeenCalledWith(id, dto);
  });

  it("should delete a course", async () => {
    const course = { id: 1, name: "Course 1", description: "Desc 1" };
    mockCourseService.remove.mockResolvedValue(course);

    const result = await controller.remove("1");
    expect(result).toEqual(course);
    expect(mockCourseService.remove).toHaveBeenCalledWith("1");
  });
});
