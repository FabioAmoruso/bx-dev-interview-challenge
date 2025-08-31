import { GlobalConfig } from './types';

function getCommonConfig(): GlobalConfig {
  return {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    aws: {
      region: process.env.AWS_REGION!,
      endpoint: process.env.S3_ENDPOINT!,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      bucket: process.env.S3_BUCKET_NAME!,
    },
    auth: {
      email: process.env.EMAIL!,
      password: process.env.PASSWORD!,
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES_IN!,
    },
  };
}

export default getCommonConfig;
