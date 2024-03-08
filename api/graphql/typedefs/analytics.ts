import { gql } from 'graphql-tag'

export default gql`
  type Field {
    id: ID
    name: String
    area: Float
    group: Group
    year: Int
  }
  type Crop {
    id: ID
    name: String
  }
  type Variety {
    id: ID
    name: String
    crop: Crop
  }
  type Yield {
    dimension: String
    magnitude: Float
    source: String
    harvestDate: String
  }
  type QuantityUnit {
    magnitude: Float
    units: String
  }
  type ProgrammeApplication {
    date: String
    product: Product
    rate: QuantityUnit
    area: Float
    cost: Float
  }
  type IngredientSummary {
    ingredient: Ingredient
    subcategory: String
    quantity: QuantityUnit
    market_median: QuantityUnit
    reference_cost: QuantityUnit
    opportunity: QuantityUnit
  }
  type CategoryFieldPerformance {
    category: String
    cost: Float
    opportunity: Float
    ingredients: [IngredientSummary]
    costPerHa: Float
    cop: Float
    marketBenchmark: marketBenchmark
  }
  type FieldPerformance {
    field: Field
    variety: Variety
    opportunity: Float
    yield: Yield
    cop: Float
    year: Int
    group: Group
    cost_per_ha: Float
    programme: [ProgrammeApplication]
    categories: [CategoryFieldPerformance]
    area: Float
    costPerHa: Float
    fieldCount: Int
    production: Float
    totalCost: Float
    marketRange: marketBenchmark
    benchmark: Float
  }

  input FieldPerformanceFilter {
    id: ID
    groupId: ID
    cropId: ID
    varietyId: ID
    fieldId: ID
    year: Int
  }

  type PagedFieldPerformances implements PagedResponse {
    pageInfo: PageInfo!
    objects: [FieldPerformance]!
  }

  type MinMax {
    min: Float
    max: Float
  }

  type marketBenchmark {
    min: Float
    max: Float
    median: Float
    percentile25: Float
    percentile75: Float
  }

  type CropPerformance {
    group: Group
    year: Int
    crop: Crop
    area: Float
    cop: Float
    costPerHa: Float
    fieldCount: Int
    production: Float
    totalCost: Float
    benchmark: Float
    yield: Yield
    marketRange: marketBenchmark
    categories: [CategoryPerformance]
  }

  input CropPerformanceFilter {
    groupId: ID
    cropId: ID
    year: Int
  }
  type PagedCropPerformances implements PagedResponse {
    pageInfo: PageInfo!
    objects: [CropPerformance]!
  }

  type VarietyPerformance {
    group: Group
    variety: Variety
    yield: Yield
    year: Int
    area: Float
    costPerHa: Float
    cop: Float
    fieldCount: Float
    production: Float
    marketRange: marketBenchmark
    totalCost: Float
    benchmark: Float
    categories: [CategoryPerformance]
  }
  input VarietyPerformanceFilter {
    groupId: ID
    cropId: ID
    year: Int
    varietyId: ID
  }

  input CropFilter {
    groupId: ID
    year: Int
  }

  input FieldFilter {
    groupId: ID
    year: Int
  }

  type PagedVarietyPerformances implements PagedResponse {
    pageInfo: PageInfo!
    objects: [VarietyPerformance]!
  }

  type VirtualGroup {
    id: ID
    name: String
  }

  type BuyingScore {
    group: Group
    season: Season
    buyingScore: Float
  }

  type CategoryPerformance {
    category: String
    costPerHa: Float
    cop: Float
    marketBenchmark: marketBenchmark
  }

  type VGCropPerformance {
    group: Group
    year: Int
    crop: Crop
    costPerHa: Float
    yield: Yield
    cop: Float
    categories: [CategoryPerformance]
  }

  type FieldDetailed {
    harvestYear: Int
    croppedFieldId: String
    fieldName: String
    fieldGroupName: String
    fieldArea: Float
    harvestArea: Float
    currentCropId: Int
    currentCropName: String
    varietyId: Int
    varietyName: String
    prevCropId: Int
    prevCropName: String
    costOfProduction: Float
    costPerHa: Float
    fieldYield: Float
    drillRate: Float
    drillDate: String
    seedCostPerHa: Float
    seedId: Int
    fertCostPerHa: Float
    nApplied: Float
    nRate: Float
    appliedNUseEfficiency: Float
    totalChemCostPerHa: Float
    fungCostPerHa: Float
    herbCostPerHa: Float
    traceElCostPerHa: Float
    unit: String
    adjCostPerHa: Float
    otherChemCostPerHa: Float
  }

  extend type Query {
    getCrops(filters: CropFilter): [Crop]
    getFields(filters: FieldFilter): [Field]
    getFieldPerformance(filters: FieldPerformanceFilter): PagedFieldPerformances
    getCropPerformance(filters: CropPerformanceFilter): PagedCropPerformances
    getHarvestYears(groupId: ID, type: String): [Int]
    getVarietyPerformance(filters: VarietyPerformanceFilter): PagedVarietyPerformances
    getVirtualGroups(groupId: ID): [VirtualGroup]
    getFarmSeasons(groupId: ID): [Season]
    getFarmBuyingScore(groupId: ID, seasonId: ID): BuyingScore
    getVGSeasons(virtualGroupId: ID): [Season]
    getVGBuyingScores(virtualGroupId: ID, seasonId: ID): [BuyingScore]
    getVGCropPerformances(virtualGroupId: ID, year: Int): [VGCropPerformance]
    getVirtualGroupFarms(virtualGroupId: ID): [Group]
    getFieldsComparison(groupId: ID, year: Int): [FieldDetailed]
  }
`
