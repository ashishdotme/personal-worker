import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT ?? 8002,
  host: process.env.HOST ?? 'localhost',
}));
