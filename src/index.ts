import type { Core } from '@strapi/strapi';
import { slugify } from './utils/slugify';

const PUBLIC_ACTIONS = [
  'api::category.category.find',
  'api::category.category.findOne',
  'api::product.product.find',
  'api::product.product.findOne',
  'api::website-setting.website-setting.find',
];

const DEFAULT_CATEGORIES = [
  {
    name: 'Premium Dry Fruits',
    description: 'Handpicked premium dry fruits sourced for exceptional quality.',
    active: true,
  },
  {
    name: 'Packaging Hampers',
    description: 'Elegant hampers crafted for memorable gifting experiences.',
    active: true,
  },
  {
    name: 'Customized Hampers',
    description: 'Personalized hamper collections tailored to your occasion.',
    active: true,
  },
];

const enablePublicPermissions = async (strapi: Core.Strapi) => {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) return;

  const existingPermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
    where: { role: publicRole.id },
  });

  const existingActions = new Set(existingPermissions.map((permission) => permission.action));

  await Promise.all(
    PUBLIC_ACTIONS.filter((action) => !existingActions.has(action)).map((action) =>
      strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action,
          role: publicRole.id,
        },
      }),
    ),
  );
};

const seedDefaultCategories = async (strapi: Core.Strapi) => {
  const existing = await strapi.documents('api::category.category').findMany({ limit: 1 });
  if (existing.length > 0) return;

  await Promise.all(
    DEFAULT_CATEGORIES.map((category) =>
      strapi.documents('api::category.category').create({
        data: {
          ...category,
          slug: slugify(category.name),
        },
      }),
    ),
  );
};

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await enablePublicPermissions(strapi);
    await seedDefaultCategories(strapi);
  },
};
