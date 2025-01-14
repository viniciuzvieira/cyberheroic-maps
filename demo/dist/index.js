/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./demo/src/biomes.ts":
/*!****************************!*\
  !*** ./demo/src/biomes.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BIOMES = void 0;
exports.BIOMES = [
    {
        params: {
            lowerBound: 0.0,
            upperBound: 0.2,
        },
        data: {
            name: 'WATER',
            color: 'dodgerblue',
        },
    },
    {
        params: {
            lowerBound: 0.2,
            upperBound: 0.3,
        },
        data: {
            name: 'SAND',
            color: '#edd665',
        },
    },
    {
        params: {
            lowerBound: 0.3,
            upperBound: 0.7,
        },
        data: {
            name: 'GRASS',
            color: '#9bd138',
        },
    },
    {
        params: {
            lowerBound: 0.7,
            upperBound: 0.9,
        },
        data: {
            name: 'MOUNT',
            color: 'gray',
        },
    },
    {
        params: {
            lowerBound: 0.9,
        },
        data: {
            name: 'SNOW',
            color: 'white',
        },
    },
];


/***/ }),

/***/ "./demo/src/interface.ts":
/*!*******************************!*\
  !*** ./demo/src/interface.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ui = void 0;
exports.ui = {
    screen: document.getElementById('screen'),
    inputs: {
        resetSeed: document.querySelector('[name=resetSeed]'),
        frequencyChange: document.querySelector('[name=frequencyChange]'),
        borderSmoothness: document.querySelector('[name=borderSmoothness]'),
        heightRedistribution: document.querySelector('[name=heightRedistribution]'),
        falloff: document.querySelector('[name=falloff]'),
        heightAveraging: document.querySelector('[name=heightAveraging]'),
        worldWidth: document.querySelector('[name=worldWidth]'),
        worldHeight: document.querySelector('[name=worldHeight]'),
    },
    buttons: {
        generate: document.getElementById('generate'),
    },
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./world-generator */ "./src/world-generator.ts"), exports);
__exportStar(__webpack_require__(/*! ./world */ "./src/world.ts"), exports);
__exportStar(__webpack_require__(/*! ./types */ "./src/types.ts"), exports);
__exportStar(__webpack_require__(/*! ./utils/perlin */ "./src/utils/perlin.ts"), exports);
__exportStar(__webpack_require__(/*! ./utils/seed */ "./src/utils/seed.ts"), exports);


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/utils/perlin.ts":
/*!*****************************!*\
  !*** ./src/utils/perlin.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateNoise = void 0;
function clamp(value, defaultValue, limit = [0, 1]) {
    return Math.max(limit[0], Math.min(limit[1], value !== null && value !== void 0 ? value : defaultValue));
}
function scaledCosine(i) {
    return 0.5 * (1.0 - Math.cos(i * Math.PI));
}
function smootherStep(x) {
    return (3 * Math.pow(x, 2)) - (2 * Math.pow(x, 3));
}
function heightFalloff(offset, length, falloff) {
    const radius = length / 2;
    const distance = Math.abs(radius - offset);
    const target = radius * (1 - falloff);
    if (distance < target) {
        return 1;
    }
    let x = ((distance - target) / radius) / (1 - target / radius);
    x = Math.min(1, Math.max(0, x));
    return 1 - smootherStep(x);
}
function generateNoise(parameters) {
    var _a;
    const { x, y, width, height, seed, params, } = parameters;
    const frequency = Math.round(clamp(params.frequencyChange, 0.3) * 31 + 1);
    const octaves = Math.round((1 - clamp(params.borderSmoothness, 0.5)) * 14 + 1);
    const redistribution = 2.0 - clamp(params.heightRedistribution, 1.0, [0.5, 1.5]);
    const falloff = clamp(params.falloff, 0.0, [0.0, 0.9]);
    const averaging = (_a = params.heightAveraging) !== null && _a !== void 0 ? _a : true;
    const PERLIN_SIZE = seed.length - 1;
    const PERLIN_YWRAPB = 4;
    const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
    const PERLIN_ZWRAPB = 8;
    const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
    const PERLIN_AMP_FALLOFF = 0.5;
    const PERLIN_AVG_POWER = 1.1;
    const cx = (x / width) * frequency;
    const cy = (y / height) * frequency;
    let xi = Math.floor(cx);
    let yi = Math.floor(cy);
    let xf = cx - xi;
    let yf = cy - yi;
    let rxf;
    let ryf;
    let r = 0;
    let ampl = 0.5;
    let n1;
    let n2;
    let n3;
    for (let o = 0; o < octaves; o++) {
        let of = xi + (yi << PERLIN_YWRAPB);
        rxf = scaledCosine(xf);
        ryf = scaledCosine(yf);
        n1 = seed[of & PERLIN_SIZE];
        n1 += rxf * (seed[(of + 1) & PERLIN_SIZE] - n1);
        n2 = seed[(of + PERLIN_YWRAP) & PERLIN_SIZE];
        n2 += rxf * (seed[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
        n1 += ryf * (n2 - n1);
        of += PERLIN_ZWRAP;
        n2 = seed[of & PERLIN_SIZE];
        n2 += rxf * (seed[(of + 1) & PERLIN_SIZE] - n2);
        n3 = seed[(of + PERLIN_YWRAP) & PERLIN_SIZE];
        n3 += rxf * (seed[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
        n2 += ryf * (n3 - n2);
        r += n1 * ampl;
        ampl *= PERLIN_AMP_FALLOFF;
        xi <<= 1;
        xf *= 2;
        if (xf >= 1.0) {
            xi++;
            xf--;
        }
        yi <<= 1;
        yf *= 2;
        if (yf >= 1.0) {
            yi++;
            yf--;
        }
    }
    if (averaging) {
        if (r > 0.5) {
            r = Math.pow(r, (1.5 - r) / PERLIN_AVG_POWER);
        }
        else if (r < 0.5) {
            r = Math.pow(r, (1.5 - r) * PERLIN_AVG_POWER);
        }
    }
    r = Math.pow(r, redistribution);
    if (falloff) {
        r *= heightFalloff(x, width, falloff) * heightFalloff(y, height, falloff);
    }
    return r;
}
exports.generateNoise = generateNoise;


/***/ }),

/***/ "./src/utils/seed.ts":
/*!***************************!*\
  !*** ./src/utils/seed.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateSeed = void 0;
function generateSeed(size = 512) {
    const seed = [];
    for (let i = 0; i < size; i++) {
        seed.push(Math.random());
    }
    return seed;
}
exports.generateSeed = generateSeed;


/***/ }),

/***/ "./src/world-biome.ts":
/*!****************************!*\
  !*** ./src/world-biome.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorldBiome = void 0;
class WorldBiome {
    constructor(params, data) {
        var _a, _b;
        this.lowerBound = Math.max(0, (_a = params.lowerBound) !== null && _a !== void 0 ? _a : 0);
        this.upperBound = Math.min(1, (_b = params.upperBound) !== null && _b !== void 0 ? _b : 1);
        this.data = data;
    }
}
exports.WorldBiome = WorldBiome;


/***/ }),

/***/ "./src/world-generator.ts":
/*!********************************!*\
  !*** ./src/world-generator.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorldGenerator = void 0;
const perlin_1 = __webpack_require__(/*! ./utils/perlin */ "./src/utils/perlin.ts");
const seed_1 = __webpack_require__(/*! ./utils/seed */ "./src/utils/seed.ts");
const world_1 = __webpack_require__(/*! ./world */ "./src/world.ts");
const world_layer_1 = __webpack_require__(/*! ./world-layer */ "./src/world-layer.ts");
class WorldGenerator {
    constructor(params) {
        this.layers = [];
        this.width = params.width;
        this.height = params.height;
    }
    addLayer(params = {}) {
        const layer = new world_layer_1.WorldLayer(params);
        this.layers.push(layer);
        return layer;
    }
    clearLayers() {
        this.layers = [];
    }
    getLayers() {
        return this.layers;
    }
    generate(params) {
        var _a;
        const currentSeed = (_a = params === null || params === void 0 ? void 0 : params.seed) !== null && _a !== void 0 ? _a : (0, seed_1.generateSeed)(params === null || params === void 0 ? void 0 : params.seedSize);
        const matrix = [];
        for (const layer of this.layers) {
            const layerMatrix = this.generateLayer(layer, currentSeed);
            for (let y = 0; y < this.height; y++) {
                if (!matrix[y]) {
                    matrix[y] = [];
                }
                for (let x = 0; x < this.width; x++) {
                    if (layerMatrix[y][x]) {
                        matrix[y][x] = layerMatrix[y][x].data;
                    }
                }
            }
        }
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (matrix[y][x] === undefined) {
                    throw Error(`World matrix contains empty biome at [${x},${y}]`);
                }
            }
        }
        return new world_1.World(matrix, currentSeed);
    }
    generateLayer(layer, seed) {
        const matrix = [];
        for (let y = 0; y < this.height; y++) {
            matrix[y] = [];
            for (let x = 0; x < this.width; x++) {
                const height = (0, perlin_1.generateNoise)({
                    params: layer.params,
                    seed,
                    width: this.width,
                    height: this.height,
                    x,
                    y,
                });
                const biome = layer.getBiomeByHeight(height);
                if (biome) {
                    matrix[y][x] = biome;
                }
            }
        }
        return matrix;
    }
}
exports.WorldGenerator = WorldGenerator;


/***/ }),

/***/ "./src/world-layer.ts":
/*!****************************!*\
  !*** ./src/world-layer.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorldLayer = void 0;
const world_biome_1 = __webpack_require__(/*! ./world-biome */ "./src/world-biome.ts");
class WorldLayer {
    constructor(params = {}) {
        this.biomes = [];
        this.params = params;
    }
    addBiome(params, data) {
        const biome = new world_biome_1.WorldBiome(params, data);
        this.biomes.push(biome);
        return biome;
    }
    clearBiomes() {
        this.biomes = [];
    }
    getBiomes() {
        return this.biomes;
    }
    getBiomeByHeight(height) {
        return this.getBiomes().find((biome) => (height >= biome.lowerBound && height <= biome.upperBound));
    }
}
exports.WorldLayer = WorldLayer;


/***/ }),

/***/ "./src/world.ts":
/*!**********************!*\
  !*** ./src/world.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.World = void 0;
class World {
    constructor(matrix, seed) {
        this.matrix = [];
        this.width = matrix[0].length;
        this.height = matrix.length;
        this.matrix = matrix;
        this.seed = seed;
    }
    getMatrix() {
        return this.matrix;
    }
    each(callback) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const res = callback({ x, y }, this.matrix[y][x]);
                if (res === false) {
                    return;
                }
            }
        }
    }
    getAt(position) {
        var _a, _b;
        return (_b = (_a = this.matrix[position.y]) === null || _a === void 0 ? void 0 : _a[position.x]) !== null && _b !== void 0 ? _b : null;
    }
    replaceAt(position, data) {
        if (position.y >= this.height || position.x >= this.width) {
            throw Error(`Position [${position.x},${position.y}] is out of world bounds`);
        }
        this.matrix[position.y][position.x] = data;
    }
}
exports.World = World;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!***************************!*\
  !*** ./demo/src/index.ts ***!
  \***************************/

var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
const index_1 = __webpack_require__(/*! ../../src/index */ "./src/index.ts");
const biomes_1 = __webpack_require__(/*! ./biomes */ "./demo/src/biomes.ts");
const interface_1 = __webpack_require__(/*! ./interface */ "./demo/src/interface.ts");
const ctx = interface_1.ui.screen.getContext("2d");
const tileSize = 2;
let savedSeed;
function generateAndRenderWorld() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // PREPARE
    const generator = new index_1.WorldGenerator({
        width: Number((_a = interface_1.ui.inputs.worldWidth) === null || _a === void 0 ? void 0 : _a.value),
        height: Number((_b = interface_1.ui.inputs.worldHeight) === null || _b === void 0 ? void 0 : _b.value),
    });
    const baseWidth = 30; // Size of horizontal blocks
    const baseHeight = 10; // Size of vertical blocks
    const layer = generator.addLayer({
        frequencyChange: Number((_c = interface_1.ui.inputs.frequencyChange) === null || _c === void 0 ? void 0 : _c.value),
        borderSmoothness: Number((_d = interface_1.ui.inputs.borderSmoothness) === null || _d === void 0 ? void 0 : _d.value),
        heightRedistribution: Number((_e = interface_1.ui.inputs.heightRedistribution) === null || _e === void 0 ? void 0 : _e.value),
        falloff: Number((_f = interface_1.ui.inputs.falloff) === null || _f === void 0 ? void 0 : _f.value),
        heightAveraging: (_g = interface_1.ui.inputs.heightAveraging) === null || _g === void 0 ? void 0 : _g.checked,
    });
    for (const { params, data } of biomes_1.BIOMES) {
        layer.addBiome(params, data);
    }
    // GENERATE
    const world = generator.generate({
        seed: ((_h = interface_1.ui.inputs.resetSeed) === null || _h === void 0 ? void 0 : _h.checked) ? undefined : savedSeed,
    });
    savedSeed = world.seed;
    // RENDER
    interface_1.ui.screen.width = world.width * tileSize;
    interface_1.ui.screen.height = world.height * tileSize;
    world.each((position, biome) => {
        var _a;
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
        const biomeIndex = Math.floor(seedValue * biomes_1.BIOMES.length);
        const selectedBiome = (_a = biomes_1.BIOMES[biomeIndex]) === null || _a === void 0 ? void 0 : _a.data;
        ctx.fillStyle = (selectedBiome === null || selectedBiome === void 0 ? void 0 : selectedBiome.color) || biome.color;
        ctx.fillRect(position.x * tileSize, position.y * tileSize, tileSize, tileSize);
    });
}
(_a = interface_1.ui.buttons.generate) === null || _a === void 0 ? void 0 : _a.addEventListener("click", generateAndRenderWorld);
generateAndRenderWorld();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGNBQWM7QUFDZCxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDs7Ozs7Ozs7Ozs7QUNyRGE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsVUFBVTtBQUNWLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7Ozs7Ozs7OztBQ2xCYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxvQ0FBb0M7QUFDbkQ7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxhQUFhLG1CQUFPLENBQUMsbURBQW1CO0FBQ3hDLGFBQWEsbUJBQU8sQ0FBQywrQkFBUztBQUM5QixhQUFhLG1CQUFPLENBQUMsK0JBQVM7QUFDOUIsYUFBYSxtQkFBTyxDQUFDLDZDQUFnQjtBQUNyQyxhQUFhLG1CQUFPLENBQUMseUNBQWM7Ozs7Ozs7Ozs7O0FDcEJ0QjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQzs7Ozs7Ozs7Ozs7QUNEaEQ7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxxQ0FBcUM7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsYUFBYTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjs7Ozs7Ozs7Ozs7QUMvRlI7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQSxvQkFBb0IsVUFBVTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjs7Ozs7Ozs7Ozs7QUNWUDtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjs7Ozs7Ozs7Ozs7QUNYTDtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxzQkFBc0I7QUFDdEIsaUJBQWlCLG1CQUFPLENBQUMsNkNBQWdCO0FBQ3pDLGVBQWUsbUJBQU8sQ0FBQyx5Q0FBYztBQUNyQyxnQkFBZ0IsbUJBQU8sQ0FBQywrQkFBUztBQUNqQyxzQkFBc0IsbUJBQU8sQ0FBQywyQ0FBZTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsaUJBQWlCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxnQkFBZ0I7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGlCQUFpQjtBQUN6Qyw0QkFBNEIsZ0JBQWdCO0FBQzVDO0FBQ0EseUVBQXlFLEVBQUUsR0FBRyxFQUFFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGlCQUFpQjtBQUN6QztBQUNBLDRCQUE0QixnQkFBZ0I7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCOzs7Ozs7Ozs7OztBQ3hFVDtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQkFBa0I7QUFDbEIsc0JBQXNCLG1CQUFPLENBQUMsMkNBQWU7QUFDN0M7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCOzs7Ozs7Ozs7OztBQ3hCTDtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGlCQUFpQjtBQUN6Qyw0QkFBNEIsZ0JBQWdCO0FBQzVDLHVDQUF1QyxNQUFNO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxXQUFXLEdBQUcsV0FBVztBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7Ozs7Ozs7VUNuQ2I7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGdCQUFnQixtQkFBTyxDQUFDLHVDQUFpQjtBQUN6QyxpQkFBaUIsbUJBQU8sQ0FBQyxzQ0FBVTtBQUNuQyxvQkFBb0IsbUJBQU8sQ0FBQyw0Q0FBYTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsMEJBQTBCO0FBQzFCLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsaUJBQWlCLGVBQWU7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2N5YmVyaGVyb2ljLW1hcHMvLi9kZW1vL3NyYy9iaW9tZXMudHMiLCJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwcy8uL2RlbW8vc3JjL2ludGVyZmFjZS50cyIsIndlYnBhY2s6Ly9jeWJlcmhlcm9pYy1tYXBzLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL2N5YmVyaGVyb2ljLW1hcHMvLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwcy8uL3NyYy91dGlscy9wZXJsaW4udHMiLCJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwcy8uL3NyYy91dGlscy9zZWVkLnRzIiwid2VicGFjazovL2N5YmVyaGVyb2ljLW1hcHMvLi9zcmMvd29ybGQtYmlvbWUudHMiLCJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwcy8uL3NyYy93b3JsZC1nZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwcy8uL3NyYy93b3JsZC1sYXllci50cyIsIndlYnBhY2s6Ly9jeWJlcmhlcm9pYy1tYXBzLy4vc3JjL3dvcmxkLnRzIiwid2VicGFjazovL2N5YmVyaGVyb2ljLW1hcHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwcy8uL2RlbW8vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5CSU9NRVMgPSB2b2lkIDA7XG5leHBvcnRzLkJJT01FUyA9IFtcbiAgICB7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgbG93ZXJCb3VuZDogMC4wLFxuICAgICAgICAgICAgdXBwZXJCb3VuZDogMC4yLFxuICAgICAgICB9LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBuYW1lOiAnV0FURVInLFxuICAgICAgICAgICAgY29sb3I6ICdkb2RnZXJibHVlJyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBsb3dlckJvdW5kOiAwLjIsXG4gICAgICAgICAgICB1cHBlckJvdW5kOiAwLjMsXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIG5hbWU6ICdTQU5EJyxcbiAgICAgICAgICAgIGNvbG9yOiAnI2VkZDY2NScsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgbG93ZXJCb3VuZDogMC4zLFxuICAgICAgICAgICAgdXBwZXJCb3VuZDogMC43LFxuICAgICAgICB9LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBuYW1lOiAnR1JBU1MnLFxuICAgICAgICAgICAgY29sb3I6ICcjOWJkMTM4JyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBsb3dlckJvdW5kOiAwLjcsXG4gICAgICAgICAgICB1cHBlckJvdW5kOiAwLjksXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIG5hbWU6ICdNT1VOVCcsXG4gICAgICAgICAgICBjb2xvcjogJ2dyYXknLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIGxvd2VyQm91bmQ6IDAuOSxcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgbmFtZTogJ1NOT1cnLFxuICAgICAgICAgICAgY29sb3I6ICd3aGl0ZScsXG4gICAgICAgIH0sXG4gICAgfSxcbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudWkgPSB2b2lkIDA7XG5leHBvcnRzLnVpID0ge1xuICAgIHNjcmVlbjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjcmVlbicpLFxuICAgIGlucHV0czoge1xuICAgICAgICByZXNldFNlZWQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPXJlc2V0U2VlZF0nKSxcbiAgICAgICAgZnJlcXVlbmN5Q2hhbmdlOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT1mcmVxdWVuY3lDaGFuZ2VdJyksXG4gICAgICAgIGJvcmRlclNtb290aG5lc3M6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPWJvcmRlclNtb290aG5lc3NdJyksXG4gICAgICAgIGhlaWdodFJlZGlzdHJpYnV0aW9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT1oZWlnaHRSZWRpc3RyaWJ1dGlvbl0nKSxcbiAgICAgICAgZmFsbG9mZjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9ZmFsbG9mZl0nKSxcbiAgICAgICAgaGVpZ2h0QXZlcmFnaW5nOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT1oZWlnaHRBdmVyYWdpbmddJyksXG4gICAgICAgIHdvcmxkV2lkdGg6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPXdvcmxkV2lkdGhdJyksXG4gICAgICAgIHdvcmxkSGVpZ2h0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT13b3JsZEhlaWdodF0nKSxcbiAgICB9LFxuICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgZ2VuZXJhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZW5lcmF0ZScpLFxuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi93b3JsZC1nZW5lcmF0b3JcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3dvcmxkXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi90eXBlc1wiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vdXRpbHMvcGVybGluXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi91dGlscy9zZWVkXCIpLCBleHBvcnRzKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdlbmVyYXRlTm9pc2UgPSB2b2lkIDA7XG5mdW5jdGlvbiBjbGFtcCh2YWx1ZSwgZGVmYXVsdFZhbHVlLCBsaW1pdCA9IFswLCAxXSkge1xuICAgIHJldHVybiBNYXRoLm1heChsaW1pdFswXSwgTWF0aC5taW4obGltaXRbMV0sIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB2b2lkIDAgPyB2YWx1ZSA6IGRlZmF1bHRWYWx1ZSkpO1xufVxuZnVuY3Rpb24gc2NhbGVkQ29zaW5lKGkpIHtcbiAgICByZXR1cm4gMC41ICogKDEuMCAtIE1hdGguY29zKGkgKiBNYXRoLlBJKSk7XG59XG5mdW5jdGlvbiBzbW9vdGhlclN0ZXAoeCkge1xuICAgIHJldHVybiAoMyAqIE1hdGgucG93KHgsIDIpKSAtICgyICogTWF0aC5wb3coeCwgMykpO1xufVxuZnVuY3Rpb24gaGVpZ2h0RmFsbG9mZihvZmZzZXQsIGxlbmd0aCwgZmFsbG9mZikge1xuICAgIGNvbnN0IHJhZGl1cyA9IGxlbmd0aCAvIDI7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhyYWRpdXMgLSBvZmZzZXQpO1xuICAgIGNvbnN0IHRhcmdldCA9IHJhZGl1cyAqICgxIC0gZmFsbG9mZik7XG4gICAgaWYgKGRpc3RhbmNlIDwgdGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICBsZXQgeCA9ICgoZGlzdGFuY2UgLSB0YXJnZXQpIC8gcmFkaXVzKSAvICgxIC0gdGFyZ2V0IC8gcmFkaXVzKTtcbiAgICB4ID0gTWF0aC5taW4oMSwgTWF0aC5tYXgoMCwgeCkpO1xuICAgIHJldHVybiAxIC0gc21vb3RoZXJTdGVwKHgpO1xufVxuZnVuY3Rpb24gZ2VuZXJhdGVOb2lzZShwYXJhbWV0ZXJzKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCwgc2VlZCwgcGFyYW1zLCB9ID0gcGFyYW1ldGVycztcbiAgICBjb25zdCBmcmVxdWVuY3kgPSBNYXRoLnJvdW5kKGNsYW1wKHBhcmFtcy5mcmVxdWVuY3lDaGFuZ2UsIDAuMykgKiAzMSArIDEpO1xuICAgIGNvbnN0IG9jdGF2ZXMgPSBNYXRoLnJvdW5kKCgxIC0gY2xhbXAocGFyYW1zLmJvcmRlclNtb290aG5lc3MsIDAuNSkpICogMTQgKyAxKTtcbiAgICBjb25zdCByZWRpc3RyaWJ1dGlvbiA9IDIuMCAtIGNsYW1wKHBhcmFtcy5oZWlnaHRSZWRpc3RyaWJ1dGlvbiwgMS4wLCBbMC41LCAxLjVdKTtcbiAgICBjb25zdCBmYWxsb2ZmID0gY2xhbXAocGFyYW1zLmZhbGxvZmYsIDAuMCwgWzAuMCwgMC45XSk7XG4gICAgY29uc3QgYXZlcmFnaW5nID0gKF9hID0gcGFyYW1zLmhlaWdodEF2ZXJhZ2luZykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogdHJ1ZTtcbiAgICBjb25zdCBQRVJMSU5fU0laRSA9IHNlZWQubGVuZ3RoIC0gMTtcbiAgICBjb25zdCBQRVJMSU5fWVdSQVBCID0gNDtcbiAgICBjb25zdCBQRVJMSU5fWVdSQVAgPSAxIDw8IFBFUkxJTl9ZV1JBUEI7XG4gICAgY29uc3QgUEVSTElOX1pXUkFQQiA9IDg7XG4gICAgY29uc3QgUEVSTElOX1pXUkFQID0gMSA8PCBQRVJMSU5fWldSQVBCO1xuICAgIGNvbnN0IFBFUkxJTl9BTVBfRkFMTE9GRiA9IDAuNTtcbiAgICBjb25zdCBQRVJMSU5fQVZHX1BPV0VSID0gMS4xO1xuICAgIGNvbnN0IGN4ID0gKHggLyB3aWR0aCkgKiBmcmVxdWVuY3k7XG4gICAgY29uc3QgY3kgPSAoeSAvIGhlaWdodCkgKiBmcmVxdWVuY3k7XG4gICAgbGV0IHhpID0gTWF0aC5mbG9vcihjeCk7XG4gICAgbGV0IHlpID0gTWF0aC5mbG9vcihjeSk7XG4gICAgbGV0IHhmID0gY3ggLSB4aTtcbiAgICBsZXQgeWYgPSBjeSAtIHlpO1xuICAgIGxldCByeGY7XG4gICAgbGV0IHJ5ZjtcbiAgICBsZXQgciA9IDA7XG4gICAgbGV0IGFtcGwgPSAwLjU7XG4gICAgbGV0IG4xO1xuICAgIGxldCBuMjtcbiAgICBsZXQgbjM7XG4gICAgZm9yIChsZXQgbyA9IDA7IG8gPCBvY3RhdmVzOyBvKyspIHtcbiAgICAgICAgbGV0IG9mID0geGkgKyAoeWkgPDwgUEVSTElOX1lXUkFQQik7XG4gICAgICAgIHJ4ZiA9IHNjYWxlZENvc2luZSh4Zik7XG4gICAgICAgIHJ5ZiA9IHNjYWxlZENvc2luZSh5Zik7XG4gICAgICAgIG4xID0gc2VlZFtvZiAmIFBFUkxJTl9TSVpFXTtcbiAgICAgICAgbjEgKz0gcnhmICogKHNlZWRbKG9mICsgMSkgJiBQRVJMSU5fU0laRV0gLSBuMSk7XG4gICAgICAgIG4yID0gc2VlZFsob2YgKyBQRVJMSU5fWVdSQVApICYgUEVSTElOX1NJWkVdO1xuICAgICAgICBuMiArPSByeGYgKiAoc2VlZFsob2YgKyBQRVJMSU5fWVdSQVAgKyAxKSAmIFBFUkxJTl9TSVpFXSAtIG4yKTtcbiAgICAgICAgbjEgKz0gcnlmICogKG4yIC0gbjEpO1xuICAgICAgICBvZiArPSBQRVJMSU5fWldSQVA7XG4gICAgICAgIG4yID0gc2VlZFtvZiAmIFBFUkxJTl9TSVpFXTtcbiAgICAgICAgbjIgKz0gcnhmICogKHNlZWRbKG9mICsgMSkgJiBQRVJMSU5fU0laRV0gLSBuMik7XG4gICAgICAgIG4zID0gc2VlZFsob2YgKyBQRVJMSU5fWVdSQVApICYgUEVSTElOX1NJWkVdO1xuICAgICAgICBuMyArPSByeGYgKiAoc2VlZFsob2YgKyBQRVJMSU5fWVdSQVAgKyAxKSAmIFBFUkxJTl9TSVpFXSAtIG4zKTtcbiAgICAgICAgbjIgKz0gcnlmICogKG4zIC0gbjIpO1xuICAgICAgICByICs9IG4xICogYW1wbDtcbiAgICAgICAgYW1wbCAqPSBQRVJMSU5fQU1QX0ZBTExPRkY7XG4gICAgICAgIHhpIDw8PSAxO1xuICAgICAgICB4ZiAqPSAyO1xuICAgICAgICBpZiAoeGYgPj0gMS4wKSB7XG4gICAgICAgICAgICB4aSsrO1xuICAgICAgICAgICAgeGYtLTtcbiAgICAgICAgfVxuICAgICAgICB5aSA8PD0gMTtcbiAgICAgICAgeWYgKj0gMjtcbiAgICAgICAgaWYgKHlmID49IDEuMCkge1xuICAgICAgICAgICAgeWkrKztcbiAgICAgICAgICAgIHlmLS07XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF2ZXJhZ2luZykge1xuICAgICAgICBpZiAociA+IDAuNSkge1xuICAgICAgICAgICAgciA9IE1hdGgucG93KHIsICgxLjUgLSByKSAvIFBFUkxJTl9BVkdfUE9XRVIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHIgPCAwLjUpIHtcbiAgICAgICAgICAgIHIgPSBNYXRoLnBvdyhyLCAoMS41IC0gcikgKiBQRVJMSU5fQVZHX1BPV0VSKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByID0gTWF0aC5wb3cociwgcmVkaXN0cmlidXRpb24pO1xuICAgIGlmIChmYWxsb2ZmKSB7XG4gICAgICAgIHIgKj0gaGVpZ2h0RmFsbG9mZih4LCB3aWR0aCwgZmFsbG9mZikgKiBoZWlnaHRGYWxsb2ZmKHksIGhlaWdodCwgZmFsbG9mZik7XG4gICAgfVxuICAgIHJldHVybiByO1xufVxuZXhwb3J0cy5nZW5lcmF0ZU5vaXNlID0gZ2VuZXJhdGVOb2lzZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZW5lcmF0ZVNlZWQgPSB2b2lkIDA7XG5mdW5jdGlvbiBnZW5lcmF0ZVNlZWQoc2l6ZSA9IDUxMikge1xuICAgIGNvbnN0IHNlZWQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICBzZWVkLnB1c2goTWF0aC5yYW5kb20oKSk7XG4gICAgfVxuICAgIHJldHVybiBzZWVkO1xufVxuZXhwb3J0cy5nZW5lcmF0ZVNlZWQgPSBnZW5lcmF0ZVNlZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuV29ybGRCaW9tZSA9IHZvaWQgMDtcbmNsYXNzIFdvcmxkQmlvbWUge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtcywgZGF0YSkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICB0aGlzLmxvd2VyQm91bmQgPSBNYXRoLm1heCgwLCAoX2EgPSBwYXJhbXMubG93ZXJCb3VuZCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMCk7XG4gICAgICAgIHRoaXMudXBwZXJCb3VuZCA9IE1hdGgubWluKDEsIChfYiA9IHBhcmFtcy51cHBlckJvdW5kKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAxKTtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9XG59XG5leHBvcnRzLldvcmxkQmlvbWUgPSBXb3JsZEJpb21lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLldvcmxkR2VuZXJhdG9yID0gdm9pZCAwO1xuY29uc3QgcGVybGluXzEgPSByZXF1aXJlKFwiLi91dGlscy9wZXJsaW5cIik7XG5jb25zdCBzZWVkXzEgPSByZXF1aXJlKFwiLi91dGlscy9zZWVkXCIpO1xuY29uc3Qgd29ybGRfMSA9IHJlcXVpcmUoXCIuL3dvcmxkXCIpO1xuY29uc3Qgd29ybGRfbGF5ZXJfMSA9IHJlcXVpcmUoXCIuL3dvcmxkLWxheWVyXCIpO1xuY2xhc3MgV29ybGRHZW5lcmF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgICAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgICAgICB0aGlzLndpZHRoID0gcGFyYW1zLndpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IHBhcmFtcy5oZWlnaHQ7XG4gICAgfVxuICAgIGFkZExheWVyKHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGxheWVyID0gbmV3IHdvcmxkX2xheWVyXzEuV29ybGRMYXllcihwYXJhbXMpO1xuICAgICAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcbiAgICAgICAgcmV0dXJuIGxheWVyO1xuICAgIH1cbiAgICBjbGVhckxheWVycygpIHtcbiAgICAgICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICB9XG4gICAgZ2V0TGF5ZXJzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXllcnM7XG4gICAgfVxuICAgIGdlbmVyYXRlKHBhcmFtcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTZWVkID0gKF9hID0gcGFyYW1zID09PSBudWxsIHx8IHBhcmFtcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGFyYW1zLnNlZWQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICgwLCBzZWVkXzEuZ2VuZXJhdGVTZWVkKShwYXJhbXMgPT09IG51bGwgfHwgcGFyYW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJhbXMuc2VlZFNpemUpO1xuICAgICAgICBjb25zdCBtYXRyaXggPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBsYXllciBvZiB0aGlzLmxheWVycykge1xuICAgICAgICAgICAgY29uc3QgbGF5ZXJNYXRyaXggPSB0aGlzLmdlbmVyYXRlTGF5ZXIobGF5ZXIsIGN1cnJlbnRTZWVkKTtcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xuICAgICAgICAgICAgICAgIGlmICghbWF0cml4W3ldKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeFt5XSA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGF5ZXJNYXRyaXhbeV1beF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdHJpeFt5XVt4XSA9IGxheWVyTWF0cml4W3ldW3hdLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgICAgICAgICAgIGlmIChtYXRyaXhbeV1beF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihgV29ybGQgbWF0cml4IGNvbnRhaW5zIGVtcHR5IGJpb21lIGF0IFske3h9LCR7eX1dYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgd29ybGRfMS5Xb3JsZChtYXRyaXgsIGN1cnJlbnRTZWVkKTtcbiAgICB9XG4gICAgZ2VuZXJhdGVMYXllcihsYXllciwgc2VlZCkge1xuICAgICAgICBjb25zdCBtYXRyaXggPSBbXTtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICBtYXRyaXhbeV0gPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gKDAsIHBlcmxpbl8xLmdlbmVyYXRlTm9pc2UpKHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBsYXllci5wYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgIHNlZWQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJpb21lID0gbGF5ZXIuZ2V0QmlvbWVCeUhlaWdodChoZWlnaHQpO1xuICAgICAgICAgICAgICAgIGlmIChiaW9tZSkge1xuICAgICAgICAgICAgICAgICAgICBtYXRyaXhbeV1beF0gPSBiaW9tZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcbiAgICB9XG59XG5leHBvcnRzLldvcmxkR2VuZXJhdG9yID0gV29ybGRHZW5lcmF0b3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuV29ybGRMYXllciA9IHZvaWQgMDtcbmNvbnN0IHdvcmxkX2Jpb21lXzEgPSByZXF1aXJlKFwiLi93b3JsZC1iaW9tZVwiKTtcbmNsYXNzIFdvcmxkTGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIHRoaXMuYmlvbWVzID0gW107XG4gICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgIH1cbiAgICBhZGRCaW9tZShwYXJhbXMsIGRhdGEpIHtcbiAgICAgICAgY29uc3QgYmlvbWUgPSBuZXcgd29ybGRfYmlvbWVfMS5Xb3JsZEJpb21lKHBhcmFtcywgZGF0YSk7XG4gICAgICAgIHRoaXMuYmlvbWVzLnB1c2goYmlvbWUpO1xuICAgICAgICByZXR1cm4gYmlvbWU7XG4gICAgfVxuICAgIGNsZWFyQmlvbWVzKCkge1xuICAgICAgICB0aGlzLmJpb21lcyA9IFtdO1xuICAgIH1cbiAgICBnZXRCaW9tZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJpb21lcztcbiAgICB9XG4gICAgZ2V0QmlvbWVCeUhlaWdodChoZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QmlvbWVzKCkuZmluZCgoYmlvbWUpID0+IChoZWlnaHQgPj0gYmlvbWUubG93ZXJCb3VuZCAmJiBoZWlnaHQgPD0gYmlvbWUudXBwZXJCb3VuZCkpO1xuICAgIH1cbn1cbmV4cG9ydHMuV29ybGRMYXllciA9IFdvcmxkTGF5ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuV29ybGQgPSB2b2lkIDA7XG5jbGFzcyBXb3JsZCB7XG4gICAgY29uc3RydWN0b3IobWF0cml4LCBzZWVkKSB7XG4gICAgICAgIHRoaXMubWF0cml4ID0gW107XG4gICAgICAgIHRoaXMud2lkdGggPSBtYXRyaXhbMF0ubGVuZ3RoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IG1hdHJpeC5sZW5ndGg7XG4gICAgICAgIHRoaXMubWF0cml4ID0gbWF0cml4O1xuICAgICAgICB0aGlzLnNlZWQgPSBzZWVkO1xuICAgIH1cbiAgICBnZXRNYXRyaXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hdHJpeDtcbiAgICB9XG4gICAgZWFjaChjYWxsYmFjaykge1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0gY2FsbGJhY2soeyB4LCB5IH0sIHRoaXMubWF0cml4W3ldW3hdKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGdldEF0KHBvc2l0aW9uKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHJldHVybiAoX2IgPSAoX2EgPSB0aGlzLm1hdHJpeFtwb3NpdGlvbi55XSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW3Bvc2l0aW9uLnhdKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBudWxsO1xuICAgIH1cbiAgICByZXBsYWNlQXQocG9zaXRpb24sIGRhdGEpIHtcbiAgICAgICAgaWYgKHBvc2l0aW9uLnkgPj0gdGhpcy5oZWlnaHQgfHwgcG9zaXRpb24ueCA+PSB0aGlzLndpZHRoKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgUG9zaXRpb24gWyR7cG9zaXRpb24ueH0sJHtwb3NpdGlvbi55fV0gaXMgb3V0IG9mIHdvcmxkIGJvdW5kc2ApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWF0cml4W3Bvc2l0aW9uLnldW3Bvc2l0aW9uLnhdID0gZGF0YTtcbiAgICB9XG59XG5leHBvcnRzLldvcmxkID0gV29ybGQ7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX2E7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBpbmRleF8xID0gcmVxdWlyZShcIi4uLy4uL3NyYy9pbmRleFwiKTtcbmNvbnN0IGJpb21lc18xID0gcmVxdWlyZShcIi4vYmlvbWVzXCIpO1xuY29uc3QgaW50ZXJmYWNlXzEgPSByZXF1aXJlKFwiLi9pbnRlcmZhY2VcIik7XG5jb25zdCBjdHggPSBpbnRlcmZhY2VfMS51aS5zY3JlZW4uZ2V0Q29udGV4dChcIjJkXCIpO1xuY29uc3QgdGlsZVNpemUgPSAyO1xubGV0IHNhdmVkU2VlZDtcbmZ1bmN0aW9uIGdlbmVyYXRlQW5kUmVuZGVyV29ybGQoKSB7XG4gICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaDtcbiAgICAvLyBQUkVQQVJFXG4gICAgY29uc3QgZ2VuZXJhdG9yID0gbmV3IGluZGV4XzEuV29ybGRHZW5lcmF0b3Ioe1xuICAgICAgICB3aWR0aDogTnVtYmVyKChfYSA9IGludGVyZmFjZV8xLnVpLmlucHV0cy53b3JsZFdpZHRoKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudmFsdWUpLFxuICAgICAgICBoZWlnaHQ6IE51bWJlcigoX2IgPSBpbnRlcmZhY2VfMS51aS5pbnB1dHMud29ybGRIZWlnaHQpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi52YWx1ZSksXG4gICAgfSk7XG4gICAgY29uc3QgYmFzZVdpZHRoID0gMzA7IC8vIFNpemUgb2YgaG9yaXpvbnRhbCBibG9ja3NcbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gMTA7IC8vIFNpemUgb2YgdmVydGljYWwgYmxvY2tzXG4gICAgY29uc3QgbGF5ZXIgPSBnZW5lcmF0b3IuYWRkTGF5ZXIoe1xuICAgICAgICBmcmVxdWVuY3lDaGFuZ2U6IE51bWJlcigoX2MgPSBpbnRlcmZhY2VfMS51aS5pbnB1dHMuZnJlcXVlbmN5Q2hhbmdlKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MudmFsdWUpLFxuICAgICAgICBib3JkZXJTbW9vdGhuZXNzOiBOdW1iZXIoKF9kID0gaW50ZXJmYWNlXzEudWkuaW5wdXRzLmJvcmRlclNtb290aG5lc3MpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC52YWx1ZSksXG4gICAgICAgIGhlaWdodFJlZGlzdHJpYnV0aW9uOiBOdW1iZXIoKF9lID0gaW50ZXJmYWNlXzEudWkuaW5wdXRzLmhlaWdodFJlZGlzdHJpYnV0aW9uKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2UudmFsdWUpLFxuICAgICAgICBmYWxsb2ZmOiBOdW1iZXIoKF9mID0gaW50ZXJmYWNlXzEudWkuaW5wdXRzLmZhbGxvZmYpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi52YWx1ZSksXG4gICAgICAgIGhlaWdodEF2ZXJhZ2luZzogKF9nID0gaW50ZXJmYWNlXzEudWkuaW5wdXRzLmhlaWdodEF2ZXJhZ2luZykgPT09IG51bGwgfHwgX2cgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9nLmNoZWNrZWQsXG4gICAgfSk7XG4gICAgZm9yIChjb25zdCB7IHBhcmFtcywgZGF0YSB9IG9mIGJpb21lc18xLkJJT01FUykge1xuICAgICAgICBsYXllci5hZGRCaW9tZShwYXJhbXMsIGRhdGEpO1xuICAgIH1cbiAgICAvLyBHRU5FUkFURVxuICAgIGNvbnN0IHdvcmxkID0gZ2VuZXJhdG9yLmdlbmVyYXRlKHtcbiAgICAgICAgc2VlZDogKChfaCA9IGludGVyZmFjZV8xLnVpLmlucHV0cy5yZXNldFNlZWQpID09PSBudWxsIHx8IF9oID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfaC5jaGVja2VkKSA/IHVuZGVmaW5lZCA6IHNhdmVkU2VlZCxcbiAgICB9KTtcbiAgICBzYXZlZFNlZWQgPSB3b3JsZC5zZWVkO1xuICAgIC8vIFJFTkRFUlxuICAgIGludGVyZmFjZV8xLnVpLnNjcmVlbi53aWR0aCA9IHdvcmxkLndpZHRoICogdGlsZVNpemU7XG4gICAgaW50ZXJmYWNlXzEudWkuc2NyZWVuLmhlaWdodCA9IHdvcmxkLmhlaWdodCAqIHRpbGVTaXplO1xuICAgIHdvcmxkLmVhY2goKHBvc2l0aW9uLCBiaW9tZSkgPT4ge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIC8vIENhbGN1bGF0ZSByZWdpb25cbiAgICAgICAgY29uc3QgcmVnaW9uWCA9IE1hdGguZmxvb3IocG9zaXRpb24ueCAvIGJhc2VXaWR0aCk7XG4gICAgICAgIGNvbnN0IHJlZ2lvblkgPSBNYXRoLmZsb29yKHBvc2l0aW9uLnkgLyBiYXNlSGVpZ2h0KTtcbiAgICAgICAgLy8gQWx0ZXJuYXRlIGJldHdlZW4gaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgcmVnaW9uc1xuICAgICAgICBjb25zdCBpc0hvcml6b250YWwgPSAocmVnaW9uWCArIHJlZ2lvblkpICUgMiA9PT0gMDtcbiAgICAgICAgY29uc3QgcmVnaW9uV2lkdGggPSBpc0hvcml6b250YWwgPyBiYXNlV2lkdGggOiBiYXNlSGVpZ2h0O1xuICAgICAgICBjb25zdCByZWdpb25IZWlnaHQgPSBpc0hvcml6b250YWwgPyBiYXNlSGVpZ2h0IDogYmFzZVdpZHRoO1xuICAgICAgICAvLyBEZXRlcm1pbmUgYmxvY2sgd2l0aGluIHJlZ2lvblxuICAgICAgICBjb25zdCBibG9ja1ggPSBNYXRoLmZsb29yKHBvc2l0aW9uLnggLyByZWdpb25XaWR0aCk7XG4gICAgICAgIGNvbnN0IGJsb2NrWSA9IE1hdGguZmxvb3IocG9zaXRpb24ueSAvIHJlZ2lvbkhlaWdodCk7XG4gICAgICAgIC8vIEFzc2lnbiBiaW9tZSBjb2xvciBiYXNlZCBvbiBibG9jayBwb3NpdGlvblxuICAgICAgICBjb25zdCBzZWVkSW5kZXggPSAoYmxvY2tYICsgYmxvY2tZKSAlIHNhdmVkU2VlZC5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHNlZWRWYWx1ZSA9IHNhdmVkU2VlZFtzZWVkSW5kZXhdO1xuICAgICAgICBjb25zdCBiaW9tZUluZGV4ID0gTWF0aC5mbG9vcihzZWVkVmFsdWUgKiBiaW9tZXNfMS5CSU9NRVMubGVuZ3RoKTtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRCaW9tZSA9IChfYSA9IGJpb21lc18xLkJJT01FU1tiaW9tZUluZGV4XSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmRhdGE7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAoc2VsZWN0ZWRCaW9tZSA9PT0gbnVsbCB8fCBzZWxlY3RlZEJpb21lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZWxlY3RlZEJpb21lLmNvbG9yKSB8fCBiaW9tZS5jb2xvcjtcbiAgICAgICAgY3R4LmZpbGxSZWN0KHBvc2l0aW9uLnggKiB0aWxlU2l6ZSwgcG9zaXRpb24ueSAqIHRpbGVTaXplLCB0aWxlU2l6ZSwgdGlsZVNpemUpO1xuICAgIH0pO1xufVxuKF9hID0gaW50ZXJmYWNlXzEudWkuYnV0dG9ucy5nZW5lcmF0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBnZW5lcmF0ZUFuZFJlbmRlcldvcmxkKTtcbmdlbmVyYXRlQW5kUmVuZGVyV29ybGQoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==