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
    const baseWidth = 50; // Size of horizontal blocks
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
    console.log("seed gerado: ", savedSeed);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxXQUFXLEdBQUcsV0FBVztBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7Ozs7Ozs7VUNuQ2I7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGdCQUFnQixtQkFBTyxDQUFDLHVDQUFpQjtBQUN6QyxpQkFBaUIsbUJBQU8sQ0FBQyxzQ0FBVTtBQUNuQyxvQkFBb0IsbUJBQU8sQ0FBQyw0Q0FBYTtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsMEJBQTBCO0FBQzFCLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsaUJBQWlCLGVBQWU7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwczEvLi9kZW1vL3NyYy9iaW9tZXMudHMiLCJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwczEvLi9kZW1vL3NyYy9pbnRlcmZhY2UudHMiLCJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwczEvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwczEvLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwczEvLi9zcmMvdXRpbHMvcGVybGluLnRzIiwid2VicGFjazovL2N5YmVyaGVyb2ljLW1hcHMxLy4vc3JjL3V0aWxzL3NlZWQudHMiLCJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwczEvLi9zcmMvd29ybGQtYmlvbWUudHMiLCJ3ZWJwYWNrOi8vY3liZXJoZXJvaWMtbWFwczEvLi9zcmMvd29ybGQtZ2VuZXJhdG9yLnRzIiwid2VicGFjazovL2N5YmVyaGVyb2ljLW1hcHMxLy4vc3JjL3dvcmxkLWxheWVyLnRzIiwid2VicGFjazovL2N5YmVyaGVyb2ljLW1hcHMxLy4vc3JjL3dvcmxkLnRzIiwid2VicGFjazovL2N5YmVyaGVyb2ljLW1hcHMxL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2N5YmVyaGVyb2ljLW1hcHMxLy4vZGVtby9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkJJT01FUyA9IHZvaWQgMDtcbmV4cG9ydHMuQklPTUVTID0gW1xuICAgIHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBsb3dlckJvdW5kOiAwLjAsXG4gICAgICAgICAgICB1cHBlckJvdW5kOiAwLjIsXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIG5hbWU6ICdXQVRFUicsXG4gICAgICAgICAgICBjb2xvcjogJ2RvZGdlcmJsdWUnLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIGxvd2VyQm91bmQ6IDAuMixcbiAgICAgICAgICAgIHVwcGVyQm91bmQ6IDAuMyxcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgbmFtZTogJ1NBTkQnLFxuICAgICAgICAgICAgY29sb3I6ICcjZWRkNjY1JyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBsb3dlckJvdW5kOiAwLjMsXG4gICAgICAgICAgICB1cHBlckJvdW5kOiAwLjcsXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIG5hbWU6ICdHUkFTUycsXG4gICAgICAgICAgICBjb2xvcjogJyM5YmQxMzgnLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIGxvd2VyQm91bmQ6IDAuNyxcbiAgICAgICAgICAgIHVwcGVyQm91bmQ6IDAuOSxcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgbmFtZTogJ01PVU5UJyxcbiAgICAgICAgICAgIGNvbG9yOiAnZ3JheScsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgbG93ZXJCb3VuZDogMC45LFxuICAgICAgICB9LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBuYW1lOiAnU05PVycsXG4gICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgfSxcbiAgICB9LFxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51aSA9IHZvaWQgMDtcbmV4cG9ydHMudWkgPSB7XG4gICAgc2NyZWVuOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuJyksXG4gICAgaW5wdXRzOiB7XG4gICAgICAgIHJlc2V0U2VlZDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9cmVzZXRTZWVkXScpLFxuICAgICAgICBmcmVxdWVuY3lDaGFuZ2U6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPWZyZXF1ZW5jeUNoYW5nZV0nKSxcbiAgICAgICAgYm9yZGVyU21vb3RobmVzczogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9Ym9yZGVyU21vb3RobmVzc10nKSxcbiAgICAgICAgaGVpZ2h0UmVkaXN0cmlidXRpb246IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPWhlaWdodFJlZGlzdHJpYnV0aW9uXScpLFxuICAgICAgICBmYWxsb2ZmOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbbmFtZT1mYWxsb2ZmXScpLFxuICAgICAgICBoZWlnaHRBdmVyYWdpbmc6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPWhlaWdodEF2ZXJhZ2luZ10nKSxcbiAgICAgICAgd29ybGRXaWR0aDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9d29ybGRXaWR0aF0nKSxcbiAgICAgICAgd29ybGRIZWlnaHQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPXdvcmxkSGVpZ2h0XScpLFxuICAgIH0sXG4gICAgYnV0dG9uczoge1xuICAgICAgICBnZW5lcmF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dlbmVyYXRlJyksXG4gICAgfSxcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3dvcmxkLWdlbmVyYXRvclwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vd29ybGRcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3R5cGVzXCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi91dGlscy9wZXJsaW5cIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3V0aWxzL3NlZWRcIiksIGV4cG9ydHMpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2VuZXJhdGVOb2lzZSA9IHZvaWQgMDtcbmZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBkZWZhdWx0VmFsdWUsIGxpbWl0ID0gWzAsIDFdKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KGxpbWl0WzBdLCBNYXRoLm1pbihsaW1pdFsxXSwgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHZvaWQgMCA/IHZhbHVlIDogZGVmYXVsdFZhbHVlKSk7XG59XG5mdW5jdGlvbiBzY2FsZWRDb3NpbmUoaSkge1xuICAgIHJldHVybiAwLjUgKiAoMS4wIC0gTWF0aC5jb3MoaSAqIE1hdGguUEkpKTtcbn1cbmZ1bmN0aW9uIHNtb290aGVyU3RlcCh4KSB7XG4gICAgcmV0dXJuICgzICogTWF0aC5wb3coeCwgMikpIC0gKDIgKiBNYXRoLnBvdyh4LCAzKSk7XG59XG5mdW5jdGlvbiBoZWlnaHRGYWxsb2ZmKG9mZnNldCwgbGVuZ3RoLCBmYWxsb2ZmKSB7XG4gICAgY29uc3QgcmFkaXVzID0gbGVuZ3RoIC8gMjtcbiAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguYWJzKHJhZGl1cyAtIG9mZnNldCk7XG4gICAgY29uc3QgdGFyZ2V0ID0gcmFkaXVzICogKDEgLSBmYWxsb2ZmKTtcbiAgICBpZiAoZGlzdGFuY2UgPCB0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIGxldCB4ID0gKChkaXN0YW5jZSAtIHRhcmdldCkgLyByYWRpdXMpIC8gKDEgLSB0YXJnZXQgLyByYWRpdXMpO1xuICAgIHggPSBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCB4KSk7XG4gICAgcmV0dXJuIDEgLSBzbW9vdGhlclN0ZXAoeCk7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZU5vaXNlKHBhcmFtZXRlcnMpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzZWVkLCBwYXJhbXMsIH0gPSBwYXJhbWV0ZXJzO1xuICAgIGNvbnN0IGZyZXF1ZW5jeSA9IE1hdGgucm91bmQoY2xhbXAocGFyYW1zLmZyZXF1ZW5jeUNoYW5nZSwgMC4zKSAqIDMxICsgMSk7XG4gICAgY29uc3Qgb2N0YXZlcyA9IE1hdGgucm91bmQoKDEgLSBjbGFtcChwYXJhbXMuYm9yZGVyU21vb3RobmVzcywgMC41KSkgKiAxNCArIDEpO1xuICAgIGNvbnN0IHJlZGlzdHJpYnV0aW9uID0gMi4wIC0gY2xhbXAocGFyYW1zLmhlaWdodFJlZGlzdHJpYnV0aW9uLCAxLjAsIFswLjUsIDEuNV0pO1xuICAgIGNvbnN0IGZhbGxvZmYgPSBjbGFtcChwYXJhbXMuZmFsbG9mZiwgMC4wLCBbMC4wLCAwLjldKTtcbiAgICBjb25zdCBhdmVyYWdpbmcgPSAoX2EgPSBwYXJhbXMuaGVpZ2h0QXZlcmFnaW5nKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB0cnVlO1xuICAgIGNvbnN0IFBFUkxJTl9TSVpFID0gc2VlZC5sZW5ndGggLSAxO1xuICAgIGNvbnN0IFBFUkxJTl9ZV1JBUEIgPSA0O1xuICAgIGNvbnN0IFBFUkxJTl9ZV1JBUCA9IDEgPDwgUEVSTElOX1lXUkFQQjtcbiAgICBjb25zdCBQRVJMSU5fWldSQVBCID0gODtcbiAgICBjb25zdCBQRVJMSU5fWldSQVAgPSAxIDw8IFBFUkxJTl9aV1JBUEI7XG4gICAgY29uc3QgUEVSTElOX0FNUF9GQUxMT0ZGID0gMC41O1xuICAgIGNvbnN0IFBFUkxJTl9BVkdfUE9XRVIgPSAxLjE7XG4gICAgY29uc3QgY3ggPSAoeCAvIHdpZHRoKSAqIGZyZXF1ZW5jeTtcbiAgICBjb25zdCBjeSA9ICh5IC8gaGVpZ2h0KSAqIGZyZXF1ZW5jeTtcbiAgICBsZXQgeGkgPSBNYXRoLmZsb29yKGN4KTtcbiAgICBsZXQgeWkgPSBNYXRoLmZsb29yKGN5KTtcbiAgICBsZXQgeGYgPSBjeCAtIHhpO1xuICAgIGxldCB5ZiA9IGN5IC0geWk7XG4gICAgbGV0IHJ4ZjtcbiAgICBsZXQgcnlmO1xuICAgIGxldCByID0gMDtcbiAgICBsZXQgYW1wbCA9IDAuNTtcbiAgICBsZXQgbjE7XG4gICAgbGV0IG4yO1xuICAgIGxldCBuMztcbiAgICBmb3IgKGxldCBvID0gMDsgbyA8IG9jdGF2ZXM7IG8rKykge1xuICAgICAgICBsZXQgb2YgPSB4aSArICh5aSA8PCBQRVJMSU5fWVdSQVBCKTtcbiAgICAgICAgcnhmID0gc2NhbGVkQ29zaW5lKHhmKTtcbiAgICAgICAgcnlmID0gc2NhbGVkQ29zaW5lKHlmKTtcbiAgICAgICAgbjEgPSBzZWVkW29mICYgUEVSTElOX1NJWkVdO1xuICAgICAgICBuMSArPSByeGYgKiAoc2VlZFsob2YgKyAxKSAmIFBFUkxJTl9TSVpFXSAtIG4xKTtcbiAgICAgICAgbjIgPSBzZWVkWyhvZiArIFBFUkxJTl9ZV1JBUCkgJiBQRVJMSU5fU0laRV07XG4gICAgICAgIG4yICs9IHJ4ZiAqIChzZWVkWyhvZiArIFBFUkxJTl9ZV1JBUCArIDEpICYgUEVSTElOX1NJWkVdIC0gbjIpO1xuICAgICAgICBuMSArPSByeWYgKiAobjIgLSBuMSk7XG4gICAgICAgIG9mICs9IFBFUkxJTl9aV1JBUDtcbiAgICAgICAgbjIgPSBzZWVkW29mICYgUEVSTElOX1NJWkVdO1xuICAgICAgICBuMiArPSByeGYgKiAoc2VlZFsob2YgKyAxKSAmIFBFUkxJTl9TSVpFXSAtIG4yKTtcbiAgICAgICAgbjMgPSBzZWVkWyhvZiArIFBFUkxJTl9ZV1JBUCkgJiBQRVJMSU5fU0laRV07XG4gICAgICAgIG4zICs9IHJ4ZiAqIChzZWVkWyhvZiArIFBFUkxJTl9ZV1JBUCArIDEpICYgUEVSTElOX1NJWkVdIC0gbjMpO1xuICAgICAgICBuMiArPSByeWYgKiAobjMgLSBuMik7XG4gICAgICAgIHIgKz0gbjEgKiBhbXBsO1xuICAgICAgICBhbXBsICo9IFBFUkxJTl9BTVBfRkFMTE9GRjtcbiAgICAgICAgeGkgPDw9IDE7XG4gICAgICAgIHhmICo9IDI7XG4gICAgICAgIGlmICh4ZiA+PSAxLjApIHtcbiAgICAgICAgICAgIHhpKys7XG4gICAgICAgICAgICB4Zi0tO1xuICAgICAgICB9XG4gICAgICAgIHlpIDw8PSAxO1xuICAgICAgICB5ZiAqPSAyO1xuICAgICAgICBpZiAoeWYgPj0gMS4wKSB7XG4gICAgICAgICAgICB5aSsrO1xuICAgICAgICAgICAgeWYtLTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXZlcmFnaW5nKSB7XG4gICAgICAgIGlmIChyID4gMC41KSB7XG4gICAgICAgICAgICByID0gTWF0aC5wb3cociwgKDEuNSAtIHIpIC8gUEVSTElOX0FWR19QT1dFUik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAociA8IDAuNSkge1xuICAgICAgICAgICAgciA9IE1hdGgucG93KHIsICgxLjUgLSByKSAqIFBFUkxJTl9BVkdfUE9XRVIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHIgPSBNYXRoLnBvdyhyLCByZWRpc3RyaWJ1dGlvbik7XG4gICAgaWYgKGZhbGxvZmYpIHtcbiAgICAgICAgciAqPSBoZWlnaHRGYWxsb2ZmKHgsIHdpZHRoLCBmYWxsb2ZmKSAqIGhlaWdodEZhbGxvZmYoeSwgaGVpZ2h0LCBmYWxsb2ZmKTtcbiAgICB9XG4gICAgcmV0dXJuIHI7XG59XG5leHBvcnRzLmdlbmVyYXRlTm9pc2UgPSBnZW5lcmF0ZU5vaXNlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdlbmVyYXRlU2VlZCA9IHZvaWQgMDtcbmZ1bmN0aW9uIGdlbmVyYXRlU2VlZChzaXplID0gNTEyKSB7XG4gICAgY29uc3Qgc2VlZCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgIHNlZWQucHVzaChNYXRoLnJhbmRvbSgpKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlZWQ7XG59XG5leHBvcnRzLmdlbmVyYXRlU2VlZCA9IGdlbmVyYXRlU2VlZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Xb3JsZEJpb21lID0gdm9pZCAwO1xuY2xhc3MgV29ybGRCaW9tZSB7XG4gICAgY29uc3RydWN0b3IocGFyYW1zLCBkYXRhKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIHRoaXMubG93ZXJCb3VuZCA9IE1hdGgubWF4KDAsIChfYSA9IHBhcmFtcy5sb3dlckJvdW5kKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAwKTtcbiAgICAgICAgdGhpcy51cHBlckJvdW5kID0gTWF0aC5taW4oMSwgKF9iID0gcGFyYW1zLnVwcGVyQm91bmQpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IDEpO1xuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIH1cbn1cbmV4cG9ydHMuV29ybGRCaW9tZSA9IFdvcmxkQmlvbWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuV29ybGRHZW5lcmF0b3IgPSB2b2lkIDA7XG5jb25zdCBwZXJsaW5fMSA9IHJlcXVpcmUoXCIuL3V0aWxzL3BlcmxpblwiKTtcbmNvbnN0IHNlZWRfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL3NlZWRcIik7XG5jb25zdCB3b3JsZF8xID0gcmVxdWlyZShcIi4vd29ybGRcIik7XG5jb25zdCB3b3JsZF9sYXllcl8xID0gcmVxdWlyZShcIi4vd29ybGQtbGF5ZXJcIik7XG5jbGFzcyBXb3JsZEdlbmVyYXRvciB7XG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgICAgIHRoaXMubGF5ZXJzID0gW107XG4gICAgICAgIHRoaXMud2lkdGggPSBwYXJhbXMud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gcGFyYW1zLmhlaWdodDtcbiAgICB9XG4gICAgYWRkTGF5ZXIocGFyYW1zID0ge30pIHtcbiAgICAgICAgY29uc3QgbGF5ZXIgPSBuZXcgd29ybGRfbGF5ZXJfMS5Xb3JsZExheWVyKHBhcmFtcyk7XG4gICAgICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgICAgICByZXR1cm4gbGF5ZXI7XG4gICAgfVxuICAgIGNsZWFyTGF5ZXJzKCkge1xuICAgICAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgIH1cbiAgICBnZXRMYXllcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxheWVycztcbiAgICB9XG4gICAgZ2VuZXJhdGUocGFyYW1zKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgY29uc3QgY3VycmVudFNlZWQgPSAoX2EgPSBwYXJhbXMgPT09IG51bGwgfHwgcGFyYW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJhbXMuc2VlZCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKDAsIHNlZWRfMS5nZW5lcmF0ZVNlZWQpKHBhcmFtcyA9PT0gbnVsbCB8fCBwYXJhbXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmFtcy5zZWVkU2l6ZSk7XG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGxheWVyIG9mIHRoaXMubGF5ZXJzKSB7XG4gICAgICAgICAgICBjb25zdCBsYXllck1hdHJpeCA9IHRoaXMuZ2VuZXJhdGVMYXllcihsYXllciwgY3VycmVudFNlZWQpO1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXRyaXhbeV0pIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4W3ldID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXllck1hdHJpeFt5XVt4XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF0cml4W3ldW3hdID0gbGF5ZXJNYXRyaXhbeV1beF0uZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1hdHJpeFt5XVt4XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKGBXb3JsZCBtYXRyaXggY29udGFpbnMgZW1wdHkgYmlvbWUgYXQgWyR7eH0sJHt5fV1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyB3b3JsZF8xLldvcmxkKG1hdHJpeCwgY3VycmVudFNlZWQpO1xuICAgIH1cbiAgICBnZW5lcmF0ZUxheWVyKGxheWVyLCBzZWVkKSB7XG4gICAgICAgIGNvbnN0IG1hdHJpeCA9IFtdO1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgIG1hdHJpeFt5XSA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSAoMCwgcGVybGluXzEuZ2VuZXJhdGVOb2lzZSkoe1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IGxheWVyLnBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgc2VlZCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYmlvbWUgPSBsYXllci5nZXRCaW9tZUJ5SGVpZ2h0KGhlaWdodCk7XG4gICAgICAgICAgICAgICAgaWYgKGJpb21lKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeFt5XVt4XSA9IGJpb21lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF0cml4O1xuICAgIH1cbn1cbmV4cG9ydHMuV29ybGRHZW5lcmF0b3IgPSBXb3JsZEdlbmVyYXRvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Xb3JsZExheWVyID0gdm9pZCAwO1xuY29uc3Qgd29ybGRfYmlvbWVfMSA9IHJlcXVpcmUoXCIuL3dvcmxkLWJpb21lXCIpO1xuY2xhc3MgV29ybGRMYXllciB7XG4gICAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcbiAgICAgICAgdGhpcy5iaW9tZXMgPSBbXTtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgfVxuICAgIGFkZEJpb21lKHBhcmFtcywgZGF0YSkge1xuICAgICAgICBjb25zdCBiaW9tZSA9IG5ldyB3b3JsZF9iaW9tZV8xLldvcmxkQmlvbWUocGFyYW1zLCBkYXRhKTtcbiAgICAgICAgdGhpcy5iaW9tZXMucHVzaChiaW9tZSk7XG4gICAgICAgIHJldHVybiBiaW9tZTtcbiAgICB9XG4gICAgY2xlYXJCaW9tZXMoKSB7XG4gICAgICAgIHRoaXMuYmlvbWVzID0gW107XG4gICAgfVxuICAgIGdldEJpb21lcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmlvbWVzO1xuICAgIH1cbiAgICBnZXRCaW9tZUJ5SGVpZ2h0KGhlaWdodCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRCaW9tZXMoKS5maW5kKChiaW9tZSkgPT4gKGhlaWdodCA+PSBiaW9tZS5sb3dlckJvdW5kICYmIGhlaWdodCA8PSBiaW9tZS51cHBlckJvdW5kKSk7XG4gICAgfVxufVxuZXhwb3J0cy5Xb3JsZExheWVyID0gV29ybGRMYXllcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Xb3JsZCA9IHZvaWQgMDtcbmNsYXNzIFdvcmxkIHtcbiAgICBjb25zdHJ1Y3RvcihtYXRyaXgsIHNlZWQpIHtcbiAgICAgICAgdGhpcy5tYXRyaXggPSBbXTtcbiAgICAgICAgdGhpcy53aWR0aCA9IG1hdHJpeFswXS5sZW5ndGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gbWF0cml4Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5tYXRyaXggPSBtYXRyaXg7XG4gICAgICAgIHRoaXMuc2VlZCA9IHNlZWQ7XG4gICAgfVxuICAgIGdldE1hdHJpeCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0cml4O1xuICAgIH1cbiAgICBlYWNoKGNhbGxiYWNrKSB7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5oZWlnaHQ7IHkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBjYWxsYmFjayh7IHgsIHkgfSwgdGhpcy5tYXRyaXhbeV1beF0pO1xuICAgICAgICAgICAgICAgIGlmIChyZXMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0QXQocG9zaXRpb24pIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgcmV0dXJuIChfYiA9IChfYSA9IHRoaXMubWF0cml4W3Bvc2l0aW9uLnldKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbcG9zaXRpb24ueF0pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IG51bGw7XG4gICAgfVxuICAgIHJlcGxhY2VBdChwb3NpdGlvbiwgZGF0YSkge1xuICAgICAgICBpZiAocG9zaXRpb24ueSA+PSB0aGlzLmhlaWdodCB8fCBwb3NpdGlvbi54ID49IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBQb3NpdGlvbiBbJHtwb3NpdGlvbi54fSwke3Bvc2l0aW9uLnl9XSBpcyBvdXQgb2Ygd29ybGQgYm91bmRzYCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXRyaXhbcG9zaXRpb24ueV1bcG9zaXRpb24ueF0gPSBkYXRhO1xuICAgIH1cbn1cbmV4cG9ydHMuV29ybGQgPSBXb3JsZDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfYTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGluZGV4XzEgPSByZXF1aXJlKFwiLi4vLi4vc3JjL2luZGV4XCIpO1xuY29uc3QgYmlvbWVzXzEgPSByZXF1aXJlKFwiLi9iaW9tZXNcIik7XG5jb25zdCBpbnRlcmZhY2VfMSA9IHJlcXVpcmUoXCIuL2ludGVyZmFjZVwiKTtcbmNvbnN0IGN0eCA9IGludGVyZmFjZV8xLnVpLnNjcmVlbi5nZXRDb250ZXh0KFwiMmRcIik7XG5jb25zdCB0aWxlU2l6ZSA9IDI7XG5sZXQgc2F2ZWRTZWVkO1xuZnVuY3Rpb24gZ2VuZXJhdGVBbmRSZW5kZXJXb3JsZCgpIHtcbiAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lLCBfZiwgX2csIF9oO1xuICAgIC8vIFBSRVBBUkVcbiAgICBjb25zdCBnZW5lcmF0b3IgPSBuZXcgaW5kZXhfMS5Xb3JsZEdlbmVyYXRvcih7XG4gICAgICAgIHdpZHRoOiBOdW1iZXIoKF9hID0gaW50ZXJmYWNlXzEudWkuaW5wdXRzLndvcmxkV2lkdGgpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS52YWx1ZSksXG4gICAgICAgIGhlaWdodDogTnVtYmVyKChfYiA9IGludGVyZmFjZV8xLnVpLmlucHV0cy53b3JsZEhlaWdodCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnZhbHVlKSxcbiAgICB9KTtcbiAgICBjb25zdCBiYXNlV2lkdGggPSA1MDsgLy8gU2l6ZSBvZiBob3Jpem9udGFsIGJsb2Nrc1xuICAgIGNvbnN0IGJhc2VIZWlnaHQgPSAxMDsgLy8gU2l6ZSBvZiB2ZXJ0aWNhbCBibG9ja3NcbiAgICBjb25zdCBsYXllciA9IGdlbmVyYXRvci5hZGRMYXllcih7XG4gICAgICAgIGZyZXF1ZW5jeUNoYW5nZTogTnVtYmVyKChfYyA9IGludGVyZmFjZV8xLnVpLmlucHV0cy5mcmVxdWVuY3lDaGFuZ2UpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy52YWx1ZSksXG4gICAgICAgIGJvcmRlclNtb290aG5lc3M6IE51bWJlcigoX2QgPSBpbnRlcmZhY2VfMS51aS5pbnB1dHMuYm9yZGVyU21vb3RobmVzcykgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLnZhbHVlKSxcbiAgICAgICAgaGVpZ2h0UmVkaXN0cmlidXRpb246IE51bWJlcigoX2UgPSBpbnRlcmZhY2VfMS51aS5pbnB1dHMuaGVpZ2h0UmVkaXN0cmlidXRpb24pID09PSBudWxsIHx8IF9lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZS52YWx1ZSksXG4gICAgICAgIGZhbGxvZmY6IE51bWJlcigoX2YgPSBpbnRlcmZhY2VfMS51aS5pbnB1dHMuZmFsbG9mZikgPT09IG51bGwgfHwgX2YgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mLnZhbHVlKSxcbiAgICAgICAgaGVpZ2h0QXZlcmFnaW5nOiAoX2cgPSBpbnRlcmZhY2VfMS51aS5pbnB1dHMuaGVpZ2h0QXZlcmFnaW5nKSA9PT0gbnVsbCB8fCBfZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2cuY2hlY2tlZCxcbiAgICB9KTtcbiAgICBmb3IgKGNvbnN0IHsgcGFyYW1zLCBkYXRhIH0gb2YgYmlvbWVzXzEuQklPTUVTKSB7XG4gICAgICAgIGxheWVyLmFkZEJpb21lKHBhcmFtcywgZGF0YSk7XG4gICAgfVxuICAgIC8vIEdFTkVSQVRFXG4gICAgY29uc3Qgd29ybGQgPSBnZW5lcmF0b3IuZ2VuZXJhdGUoe1xuICAgICAgICBzZWVkOiAoKF9oID0gaW50ZXJmYWNlXzEudWkuaW5wdXRzLnJlc2V0U2VlZCkgPT09IG51bGwgfHwgX2ggPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9oLmNoZWNrZWQpID8gdW5kZWZpbmVkIDogc2F2ZWRTZWVkLFxuICAgIH0pO1xuICAgIHNhdmVkU2VlZCA9IHdvcmxkLnNlZWQ7XG4gICAgY29uc29sZS5sb2coXCJzZWVkIGdlcmFkbzogXCIsIHNhdmVkU2VlZCk7XG4gICAgLy8gUkVOREVSXG4gICAgaW50ZXJmYWNlXzEudWkuc2NyZWVuLndpZHRoID0gd29ybGQud2lkdGggKiB0aWxlU2l6ZTtcbiAgICBpbnRlcmZhY2VfMS51aS5zY3JlZW4uaGVpZ2h0ID0gd29ybGQuaGVpZ2h0ICogdGlsZVNpemU7XG4gICAgd29ybGQuZWFjaCgocG9zaXRpb24sIGJpb21lKSA9PiB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHJlZ2lvblxuICAgICAgICBjb25zdCByZWdpb25YID0gTWF0aC5mbG9vcihwb3NpdGlvbi54IC8gYmFzZVdpZHRoKTtcbiAgICAgICAgY29uc3QgcmVnaW9uWSA9IE1hdGguZmxvb3IocG9zaXRpb24ueSAvIGJhc2VIZWlnaHQpO1xuICAgICAgICAvLyBBbHRlcm5hdGUgYmV0d2VlbiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCByZWdpb25zXG4gICAgICAgIGNvbnN0IGlzSG9yaXpvbnRhbCA9IChyZWdpb25YICsgcmVnaW9uWSkgJSAyID09PSAwO1xuICAgICAgICBjb25zdCByZWdpb25XaWR0aCA9IGlzSG9yaXpvbnRhbCA/IGJhc2VXaWR0aCA6IGJhc2VIZWlnaHQ7XG4gICAgICAgIGNvbnN0IHJlZ2lvbkhlaWdodCA9IGlzSG9yaXpvbnRhbCA/IGJhc2VIZWlnaHQgOiBiYXNlV2lkdGg7XG4gICAgICAgIC8vIERldGVybWluZSBibG9jayB3aXRoaW4gcmVnaW9uXG4gICAgICAgIGNvbnN0IGJsb2NrWCA9IE1hdGguZmxvb3IocG9zaXRpb24ueCAvIHJlZ2lvbldpZHRoKTtcbiAgICAgICAgY29uc3QgYmxvY2tZID0gTWF0aC5mbG9vcihwb3NpdGlvbi55IC8gcmVnaW9uSGVpZ2h0KTtcbiAgICAgICAgLy8gQXNzaWduIGJpb21lIGNvbG9yIGJhc2VkIG9uIGJsb2NrIHBvc2l0aW9uXG4gICAgICAgIGNvbnN0IHNlZWRJbmRleCA9IChibG9ja1ggKyBibG9ja1kpICUgc2F2ZWRTZWVkLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgc2VlZFZhbHVlID0gc2F2ZWRTZWVkW3NlZWRJbmRleF07XG4gICAgICAgIGNvbnN0IGJpb21lSW5kZXggPSBNYXRoLmZsb29yKHNlZWRWYWx1ZSAqIGJpb21lc18xLkJJT01FUy5sZW5ndGgpO1xuICAgICAgICBjb25zdCBzZWxlY3RlZEJpb21lID0gKF9hID0gYmlvbWVzXzEuQklPTUVTW2Jpb21lSW5kZXhdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZGF0YTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IChzZWxlY3RlZEJpb21lID09PSBudWxsIHx8IHNlbGVjdGVkQmlvbWUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlbGVjdGVkQmlvbWUuY29sb3IpIHx8IGJpb21lLmNvbG9yO1xuICAgICAgICBjdHguZmlsbFJlY3QocG9zaXRpb24ueCAqIHRpbGVTaXplLCBwb3NpdGlvbi55ICogdGlsZVNpemUsIHRpbGVTaXplLCB0aWxlU2l6ZSk7XG4gICAgfSk7XG59XG4oX2EgPSBpbnRlcmZhY2VfMS51aS5idXR0b25zLmdlbmVyYXRlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGdlbmVyYXRlQW5kUmVuZGVyV29ybGQpO1xuZ2VuZXJhdGVBbmRSZW5kZXJXb3JsZCgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9