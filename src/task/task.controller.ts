import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiProperty } from '@nestjs/swagger';
import { SqsService } from 'src/sqs/sqs.service';

class Sqstask {
  @ApiProperty({
    type: String,
  })
  message: string;
}
@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('/v1/tasks/:taskName')
export class TaskController {
  constructor(private readonly sqsService: SqsService) {}

  @Post()
  async submitTask(
    @Param('taskName') taskName: string,
    @Body() taskRequest: Sqstask,
  ) {
    const response = await this.sqsService.sendMessage({
      messageGroupId: taskName,
      queueUrl:
        'https://sqs.eu-west-1.amazonaws.com/728151625916/notification-queue.fifo',
      message: taskRequest.message,
    });
    return response;
  }
}
