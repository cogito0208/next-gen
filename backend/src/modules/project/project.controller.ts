import { Controller, Get, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectService } from './project.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { TaskStatus } from './entities/project-task.entity.js';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: '프로젝트 목록 조회' })
  findAll(@Request() req: any) {
    const { id, role } = req.user;
    return this.projectService.findAll(id, role);
  }

  @Get('stats')
  @ApiOperation({ summary: '프로젝트 통계 조회' })
  getStats() {
    return this.projectService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: '프로젝트 상세 조회' })
  findById(@Param('id') id: string) {
    return this.projectService.findById(id);
  }

  @Get(':id/kanban')
  @ApiOperation({ summary: '칸반 보드 조회' })
  getKanban(@Param('id') id: string) {
    return this.projectService.getKanbanBoard(id);
  }

  @Patch(':id/tasks/:taskId/status')
  @ApiOperation({ summary: '태스크 상태 변경' })
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() body: { status: TaskStatus },
  ) {
    return this.projectService.updateTaskStatus(taskId, body.status);
  }
}
