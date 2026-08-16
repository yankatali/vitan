export const PRODUCT_QUERY = `
query Products($limit: Int!, $skip: Int!, $where: ProductFilter, $order: [ProductOrder]) {
  productCollection(limit: $limit, skip: $skip, where: $where, order: $order) {
    total
    items {
      sys {
        id
      }
      name
      description
      price
      category
      imagesCollection(limit: 10) {
        items {
          url
          title
          description
        }
      }
    }
  }
}
`;

export const PRICING_CONFIG_QUERY = `
query PricingConfig {
  pricingConfigCollection(limit: 1) {
    items {
      usdToUahRate
      retailMarkup
      wholesaleMarkup
      wholesaleDescription
      optPrice
      descriptionAfterOptValid
    }
  }
}
`;
