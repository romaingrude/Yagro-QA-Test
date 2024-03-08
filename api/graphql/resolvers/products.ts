export default {
  Product: {
    alternatives: (parent, _, { dataSources }) => {
      const alts: object[] = []
      for (const productId of parent.altTo) {
        const product = dataSources.ProductsAPI.getProductById(productId)
        alts.push(product)
      }
      return alts
    },
    ingredients: (parent, _, { dataSources }) => {
      return parent.ingredients.map(i => dataSources.ProductsAPI.getIngredientById(i))
    },
    manufacturer: (parent, _, { dataSources }) => {
      return dataSources.ProductsAPI.getManufacturerById(parent.manufacturerId)
    },
  },
}
