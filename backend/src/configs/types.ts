export type GlobalConfig = {
  port: number;
  aws: {
    region: string;
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
  };
};
