export type WorldParams = {
  width: number
  height: number
};

export type WorldLayerParams = {
  /**
   * Frequency of biomes change
   * Default: 0.3
   * Min: 0.0, Max: 1.0
   */
  frequencyChange?: number

  /**
   * Smoothness of biomes borders
   * Default: 0.5
   * Min: 0.0, Max: 1.0
   */
  borderSmoothness?: number

  /**
   * Redistribution of biomes height
   * Default: 1.0
   * Min: 0.5, Max: 1.5
   */
  heightRedistribution?: number

  /**
   * Averaging of biomes height
   * Default: true
   */
  heightAveraging?: boolean

  /**
   * Scale of falloff area
   * Default: 0.0
   */
  falloff?: number
};

export type WorldBiomeParams = {
  /**
   * Lower biome bound
   * Default: 0.0
   * Min: 0.0
   */
  lowerBound?: number

  /**
   * Upper biome bound
   * Default: 1.0
   * Max: 1.0
   */
  upperBound?: number
};

export type WorldGenerationParams = {
  /**
   * Generation seed
   * Default: Autogenerate
   */
  seed?: number[]

  /**
   * Size of seed array
   * Default: 512
   */
  seedSize?: number
};

export type WorldBiomePosition = {
  x: number
  y: number
};
