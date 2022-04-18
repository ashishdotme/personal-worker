import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiProperty } from '@nestjs/swagger';
import { SqsService } from 'src/sqs/sqs.service';
import axios from 'axios';
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
    axios.post(
      'https://studentncirl.webhook.office.com/webhookb2/763df20a-8d8c-4618-b193-b969714f1ea7@6edb49c1-bf72-4eea-8b3f-a7fd0a25b68c/IncomingWebhook/17caf35a66554b2d9a2b384c3df1c46b/7a4ddd04-d9db-4721-a558-8f366599cfa3',
      { text: taskRequest.message },
    );
    return response;
  }
}
