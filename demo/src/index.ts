import { WorldGenerator } from "../../src/index";
import { BiomeData, BIOMES } from "./biomes";
import { ui } from "./interface";

const ctx = ui.screen.getContext("2d") as CanvasRenderingContext2D;
const tileSize = 2;
let savedSeed!: number[];

function generateAndRenderWorld() {
  // PREPARE
  const generator = new WorldGenerator<BiomeData>({
    width: Number(ui.inputs.worldWidth?.value),
    height: Number(ui.inputs.worldHeight?.value),
  });

  const baseWidth = 50; // Size of horizontal blocks
  const baseHeight = 10; // Size of vertical blocks

  const layer = generator.addLayer({
    frequencyChange: Number(ui.inputs.frequencyChange?.value),
    borderSmoothness: Number(ui.inputs.borderSmoothness?.value),
    heightRedistribution: Number(ui.inputs.heightRedistribution?.value),
    falloff: Number(ui.inputs.falloff?.value),
    heightAveraging: ui.inputs.heightAveraging?.checked,
  });

  for (const { params, data } of BIOMES) {
    layer.addBiome(params, data);
  }

  // GENERATE
  const world = generator.generate({
    seed: ui.inputs.resetSeed?.checked ? undefined : savedSeed,
  });

  savedSeed = world.seed;

  console.log("seed gerado: ", savedSeed);

  // RENDER
  ui.screen.width = world.width * tileSize;
  ui.screen.height = world.height * tileSize;

  world.each((position, biome) => {
    // Calculate region
    const regionX = Math.floor(position.x / baseWidth);
    const regionY = Math.floor(position.y / baseHeight);

    // Alternate between horizontal and vertical regions
    const isHorizontal = (regionX + regionY) % 2 === 0;
    const regionWidth = isHorizontal ? baseWidth : baseHeight;
    const regionHeight = isHorizontal ? baseHeight : baseWidth;

    // Determine block within region
    const blockX = Math.floor(position.x / regionWidth);
    const blockY = Math.floor(position.y / regionHeight);

    // Assign biome color based on block position
    const seedIndex = (blockX + blockY) % savedSeed.length;
    const seedValue = savedSeed[seedIndex];
    const biomeIndex = Math.floor(seedValue * BIOMES.length);

    const selectedBiome = BIOMES[biomeIndex]?.data;

    ctx.fillStyle = selectedBiome?.color || biome.color;
    ctx.fillRect(position.x * tileSize, position.y * tileSize, tileSize, tileSize);
  });
}

ui.buttons.generate?.addEventListener("click", generateAndRenderWorld);
generateAndRenderWorld();
