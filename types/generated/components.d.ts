import type { Schema, Struct } from '@strapi/strapi';

export interface ProductCompositionItem extends Struct.ComponentSchema {
  collectionName: 'components_product_composition_items';
  info: {
    description: 'Product composition ingredient';
    displayName: 'Composition Item';
    icon: 'layer';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    quantity: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.composition-item': ProductCompositionItem;
    }
  }
}
