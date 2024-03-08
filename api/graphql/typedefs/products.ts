import { gql } from 'graphql-tag'

export default gql`
  type Manufacturer {
    id: ID
    name: String
  }

  type Distributor {
    id: ID
    name: String
  }

  type Ingredient {
    id: ID
    name: String
  }

  type Stat {
    price: Float
    timestamp: String
  }

  type PricingStats {
    latest: Stat
    max: Stat
    min: Stat
  }

  type Product {
    id: ID
    name: String
    category: String
    subcategory: String
    mappNumber: String
    manufacturer: Manufacturer
    alternatives: [Product]
    units: String
    ingredients: [Ingredient]
    pricingStats: PricingStats
    marketRange: marketBenchmark
  }

  input ProductFilter {
    id: ID
    name: String
    category: String
    subcategory: String
    manufacturerId: ID
  }

  type PricePoint {
    spend: Float
    date: String
    units: Float
    medium: String
    agronomy: String
    distributor: Distributor
    packSize: Float
    direction: String
  }

  type Season {
    id: ID
    name: String
    year: Int
    season: String
  }

  type ProductPrices {
    id: ID
    group: Group
    season: Season
    source: String
    product: Product
    pricePoints: [PricePoint]
    filteredPricePoints: [PricePoint]
    totalSpend: Float
    unitsBought: Float
    lowestPricePerUnit: Float
    highestPricePerUnit: Float
    averagePricePerUnit: Float
    medianPricePerUnit: Float
    percentile25PricePerUnit: Float
    percentile75PricePerUnit: Float
    opportunity: Float
    altBrandOpportunity: Float
  }

  type SeedBag {
    id: ID
    grams: Float
    count: Float
    seedId: ID
  }

  input ProductPriceFilter {
    groupId: ID
    seasonId: ID
    productId: ID
  }

  input ProductPriceWholeYearsFilter {
    groupId: ID
    year: Int
  }

  input ProductPriceWithoutGroupFilter {
    productIdList: [ID]
    from: String
    to: String
  }

  type PagedProductPrices implements PagedResponse {
    pageInfo: PageInfo!
    objects: [ProductPrices]!
  }

  type PagedProducts implements PagedResponse {
    pageInfo: PageInfo!
    objects: [Product]!
  }

  extend type Query {
    getProducts(filters: ProductFilter): PagedProducts
    getProductPriceData(filters: ProductPriceFilter): PagedProductPrices
    getProductPriceDataWholeYears(filters: ProductPriceWholeYearsFilter): PagedProductPrices
    getProductPriceDataWithoutGroup(filters: ProductPriceWithoutGroupFilter): PagedProductPrices
    getSeedBagInfo(seedId: ID): SeedBag
  }
`
