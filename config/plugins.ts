import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const cloudinaryName = env('CLOUDINARY_NAME');
  const cloudinaryKey = env('CLOUDINARY_KEY');
  const cloudinarySecret = env('CLOUDINARY_SECRET');
  const useCloudinary = Boolean(cloudinaryName && cloudinaryKey && cloudinarySecret);

  return {
    upload: {
      config: useCloudinary
        ? {
            provider: 'cloudinary',
            providerOptions: {
              cloud_name: cloudinaryName,
              api_key: cloudinaryKey,
              api_secret: cloudinarySecret,
            },
            actionOptions: {
              upload: {},
              uploadStream: {},
              delete: {},
            },
          }
        : {
            provider: 'local',
          },
    },
  };
};

export default config;
