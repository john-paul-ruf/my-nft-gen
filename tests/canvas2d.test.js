import { SvgCanvasStrategy } from '../src/core/factory/canvas/strategy/SvgCanvasStrategy.js';
import { Canvas2d } from '../src/core/factory/canvas/Canvas2d.js';

function createCanvas() {
    const strategy = new SvgCanvasStrategy();
    const canvas = new Canvas2d(strategy);
    return { canvas, strategy };
}

async function setup(width = 100, height = 100) {
    const { canvas, strategy } = createCanvas();
    await canvas.newCanvas(width, height);
    return { canvas, strategy };
}

function lastElement(strategy) {
    return strategy.elements[strategy.elements.length - 1];
}

describe('State Management', () => {
    test('saveState and restoreState preserve globalAlpha', async () => {
        const { canvas, strategy } = await setup();
        strategy.setGlobalAlpha(0.5);
        strategy.saveState();
        strategy.setGlobalAlpha(0.1);
        expect(strategy._globalAlpha).toBe(0.1);
        strategy.restoreState();
        expect(strategy._globalAlpha).toBe(0.5);
    });

    test('saveState and restoreState preserve blendMode', async () => {
        const { canvas, strategy } = await setup();
        strategy.setBlendMode('multiply');
        strategy.saveState();
        strategy.setBlendMode('screen');
        expect(strategy._blendMode).toBe('screen');
        strategy.restoreState();
        expect(strategy._blendMode).toBe('multiply');
    });

    test('saveState and restoreState preserve transforms', async () => {
        const { canvas, strategy } = await setup();
        strategy.translate(10, 20);
        strategy.saveState();
        strategy.translate(30, 40);
        expect(strategy._transforms).toHaveLength(2);
        strategy.restoreState();
        expect(strategy._transforms).toHaveLength(1);
        expect(strategy._transforms[0]).toBe('translate(10, 20)');
    });

    test('restoreState on empty stack is a no-op', async () => {
        const { canvas, strategy } = await setup();
        strategy.setGlobalAlpha(0.7);
        strategy.restoreState();
        expect(strategy._globalAlpha).toBe(0.7);
    });

    test('translate adds transform', async () => {
        const { canvas, strategy } = await setup();
        strategy.translate(5, 10);
        expect(strategy._buildTransformString()).toBe('translate(5, 10)');
    });

    test('rotate without center', async () => {
        const { canvas, strategy } = await setup();
        strategy.rotate(45);
        expect(strategy._buildTransformString()).toBe('rotate(45)');
    });

    test('rotate with center', async () => {
        const { canvas, strategy } = await setup();
        strategy.rotate(45, 50, 50);
        expect(strategy._buildTransformString()).toBe('rotate(45, 50, 50)');
    });

    test('scale with uniform value', async () => {
        const { canvas, strategy } = await setup();
        strategy.scale(2);
        expect(strategy._buildTransformString()).toBe('scale(2, 2)');
    });

    test('scale with non-uniform values', async () => {
        const { canvas, strategy } = await setup();
        strategy.scale(2, 3);
        expect(strategy._buildTransformString()).toBe('scale(2, 3)');
    });

    test('resetTransform clears transforms', async () => {
        const { canvas, strategy } = await setup();
        strategy.translate(10, 20);
        strategy.rotate(45);
        strategy.resetTransform();
        expect(strategy._buildTransformString()).toBe('');
    });

    test('beginGroup and endGroup create g elements', async () => {
        const { canvas, strategy } = await setup();
        strategy.beginGroup({ opacity: 0.5 });
        expect(lastElement(strategy)).toContain('<g');
        expect(lastElement(strategy)).toContain('opacity="0.5"');
        expect(strategy._groupDepth).toBe(1);
        strategy.endGroup();
        expect(lastElement(strategy)).toBe('</g>');
        expect(strategy._groupDepth).toBe(0);
    });

    test('beginGroup with blendMode', async () => {
        const { canvas, strategy } = await setup();
        strategy.beginGroup({ blendMode: 'multiply' });
        expect(lastElement(strategy)).toContain('mix-blend-mode: multiply');
    });

    test('beginGroup with transform from state', async () => {
        const { canvas, strategy } = await setup();
        strategy.translate(10, 20);
        strategy.beginGroup({});
        expect(lastElement(strategy)).toContain('translate(10, 20)');
    });

    test('endGroup does nothing when depth is 0', async () => {
        const { canvas, strategy } = await setup();
        const before = strategy.elements.length;
        strategy.endGroup();
        expect(strategy.elements.length).toBe(before);
    });

    test('Canvas2d delegates state methods', async () => {
        const { canvas, strategy } = await setup();
        canvas.setGlobalAlpha(0.3);
        expect(strategy._globalAlpha).toBe(0.3);
        canvas.setBlendMode('overlay');
        expect(strategy._blendMode).toBe('overlay');
        canvas.translate(1, 2);
        canvas.rotate(90);
        canvas.scale(2, 2);
        expect(strategy._transforms).toHaveLength(3);
        canvas.resetTransform();
        expect(strategy._transforms).toHaveLength(0);
        canvas.saveState();
        canvas.setGlobalAlpha(0.9);
        canvas.restoreState();
        expect(strategy._globalAlpha).toBe(0.3);
    });
});

describe('Basic Primitives', () => {
    test('drawCircle2d creates stroked circle', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawCircle2d({ x: 50, y: 50 }, 25, 2, '#ff0000');
        const el = lastElement(strategy);
        expect(el).toContain('<circle');
        expect(el).toContain('cx="50"');
        expect(el).toContain('cy="50"');
        expect(el).toContain('r="25"');
        expect(el).toContain('fill="none"');
        expect(el).toContain('stroke="#ff0000"');
        expect(el).toContain('stroke-width="2"');
    });

    test('drawFilledCircle2d creates filled circle', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawFilledCircle2d({ x: 50, y: 50 }, 25, '#00ff00', 0.5);
        const el = lastElement(strategy);
        expect(el).toContain('<circle');
        expect(el).toContain('fill="rgba(0,255,0,0.5)"');
        expect(el).toContain('stroke="none"');
    });

    test('drawRect2d creates stroked rectangle', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawRect2d(10, 20, 60, 40, 3, '#0000ff');
        const el = lastElement(strategy);
        expect(el).toContain('<rect');
        expect(el).toContain('x="10"');
        expect(el).toContain('y="20"');
        expect(el).toContain('width="60"');
        expect(el).toContain('height="40"');
        expect(el).toContain('fill="none"');
        expect(el).toContain('stroke-width="3"');
    });

    test('drawFilledRect2d creates filled rectangle', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawFilledRect2d(0, 0, 100, 100, '#ff00ff');
        const el = lastElement(strategy);
        expect(el).toContain('<rect');
        expect(el).toContain('fill="#ff00ff"');
        expect(el).toContain('stroke="none"');
    });

    test('drawRoundedRect2d creates rounded rect', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawRoundedRect2d(5, 5, 90, 90, 10, 2, '#aabbcc');
        const el = lastElement(strategy);
        expect(el).toContain('rx="10"');
        expect(el).toContain('ry="10"');
        expect(el).toContain('fill="none"');
    });

    test('drawFilledRoundedRect2d creates filled rounded rect', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawFilledRoundedRect2d(5, 5, 90, 90, 10, '#112233');
        const el = lastElement(strategy);
        expect(el).toContain('rx="10"');
        expect(el).toContain('fill="#112233"');
        expect(el).toContain('stroke="none"');
    });

    test('drawEllipse2d creates stroked ellipse', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawEllipse2d({ x: 50, y: 50 }, 40, 20, 2, '#ff0000');
        const el = lastElement(strategy);
        expect(el).toContain('<ellipse');
        expect(el).toContain('rx="40"');
        expect(el).toContain('ry="20"');
        expect(el).toContain('fill="none"');
    });

    test('drawFilledEllipse2d creates filled ellipse', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawFilledEllipse2d({ x: 50, y: 50 }, 40, 20, '#00ff00');
        const el = lastElement(strategy);
        expect(el).toContain('<ellipse');
        expect(el).toContain('fill="#00ff00"');
        expect(el).toContain('stroke="none"');
    });

    test('drawArc2d creates arc path', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawArc2d({ x: 50, y: 50 }, 30, 0, 90, 2, '#ff0000');
        const el = lastElement(strategy);
        expect(el).toContain('<path');
        expect(el).toContain('fill="none"');
        expect(el).toContain('A 30 30');
    });

    test('drawArc2d large arc flag set for angles > 180', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawArc2d({ x: 50, y: 50 }, 30, 0, 270, 2, '#ff0000');
        const el = lastElement(strategy);
        expect(el).toContain('A 30 30 0 1 1');
    });

    test('drawFilledArc2d creates pie slice', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawFilledArc2d({ x: 50, y: 50 }, 30, 0, 90, '#00ff00');
        const el = lastElement(strategy);
        expect(el).toContain('<path');
        expect(el).toContain('M 50 50');
        expect(el).toContain('Z');
        expect(el).toContain('fill="#00ff00"');
    });

    test('drawDot creates filled circle', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawDot({ x: 25, y: 75 }, 3, '#ffffff');
        const el = lastElement(strategy);
        expect(el).toContain('<circle');
        expect(el).toContain('cx="25"');
        expect(el).toContain('r="3"');
        expect(el).toContain('fill="#ffffff"');
    });

    test('drawDots creates multiple circles', async () => {
        const { canvas, strategy } = await setup();
        const points = [{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 }];
        const beforeCount = strategy.elements.length;
        await canvas.drawDots(points, 2, '#ff0000');
        expect(strategy.elements.length - beforeCount).toBe(3);
    });
});

describe('Advanced Curves & Complex Shapes', () => {
    test('drawCubicBezier creates cubic path', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawCubicBezier(
            { x: 0, y: 0 }, { x: 25, y: 50 }, { x: 75, y: 50 }, { x: 100, y: 0 },
            2, '#ff0000', 4, '#0000ff'
        );
        const elements = strategy.elements;
        const outerEl = elements[elements.length - 2];
        const innerEl = elements[elements.length - 1];
        expect(outerEl).toContain('C 25 50 75 50 100 0');
        expect(outerEl).toContain('stroke-width="4"');
        expect(innerEl).toContain('stroke-width="2"');
    });

    test('drawCubicBezier skips zero strokes', async () => {
        const { canvas, strategy } = await setup();
        const before = strategy.elements.length;
        await canvas.drawCubicBezier(
            { x: 0, y: 0 }, { x: 25, y: 50 }, { x: 75, y: 50 }, { x: 100, y: 0 },
            0, '#ff0000', 0, '#0000ff'
        );
        expect(strategy.elements.length).toBe(before);
    });

    test('drawSpline creates smooth curve through points', async () => {
        const { canvas, strategy } = await setup();
        const points = [{ x: 0, y: 50 }, { x: 25, y: 0 }, { x: 75, y: 100 }, { x: 100, y: 50 }];
        await canvas.drawSpline(points, 0.5, 1, '#ff0000', 2, '#0000ff');
        const outerEl = strategy.elements[strategy.elements.length - 2];
        expect(outerEl).toContain('<path');
        expect(outerEl).toContain('M 0 50');
        expect(outerEl).toContain('C ');
    });

    test('drawSpline with closed path', async () => {
        const { canvas, strategy } = await setup();
        const points = [{ x: 0, y: 50 }, { x: 50, y: 0 }, { x: 100, y: 50 }];
        await canvas.drawSpline(points, 0.5, 1, '#ff0000', 2, '#0000ff', true);
        const el = strategy.elements[strategy.elements.length - 1];
        expect(el).toContain(' Z');
    });

    test('drawSpline with fewer than 2 points does nothing', async () => {
        const { canvas, strategy } = await setup();
        const before = strategy.elements.length;
        await canvas.drawSpline([{ x: 0, y: 0 }], 0.5, 1, '#ff0000', 2, '#0000ff');
        expect(strategy.elements.length).toBe(before);
    });

    test('drawStar2d creates star polygon', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawStar2d({ x: 50, y: 50 }, 40, 20, 5, 0, 2, '#ffff00');
        const el = lastElement(strategy);
        expect(el).toContain('<polygon');
        expect(el).toContain('fill="none"');
        expect(el).toContain('stroke="#ffff00"');
        const pointsMatch = el.match(/points="([^"]+)"/);
        expect(pointsMatch).toBeTruthy();
        const coords = pointsMatch[1].split(' ');
        expect(coords).toHaveLength(10);
    });

    test('drawFilledStar2d creates filled star', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawFilledStar2d({ x: 50, y: 50 }, 40, 20, 5, 0, '#ffff00');
        const el = lastElement(strategy);
        expect(el).toContain('fill="#ffff00"');
        expect(el).toContain('stroke="none"');
    });

    test('drawCross2d creates cross polygon with 12 points', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawCross2d({ x: 50, y: 50 }, 40, 10, 2, '#ff0000');
        const el = lastElement(strategy);
        expect(el).toContain('<polygon');
        const pointsMatch = el.match(/points="([^"]+)"/);
        const coords = pointsMatch[1].split(' ');
        expect(coords).toHaveLength(12);
    });

    test('drawArrow2d creates line and arrowhead', async () => {
        const { canvas, strategy } = await setup();
        const before = strategy.elements.length;
        await canvas.drawArrow2d({ x: 10, y: 50 }, { x: 90, y: 50 }, 10, 8, 2, '#ff0000');
        expect(strategy.elements.length - before).toBe(2);
        const line = strategy.elements[strategy.elements.length - 2];
        const head = strategy.elements[strategy.elements.length - 1];
        expect(line).toContain('<line');
        expect(head).toContain('<polygon');
    });

    test('drawCustomPolygon2d creates polygon from points', async () => {
        const { canvas, strategy } = await setup();
        const pts = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 100 }];
        await canvas.drawCustomPolygon2d(pts, 2, '#ff0000');
        const el = lastElement(strategy);
        expect(el).toContain('<polygon');
        expect(el).toContain('0,0 100,0 50,100');
        expect(el).toContain('fill="none"');
    });

    test('drawFilledCustomPolygon2d creates filled polygon', async () => {
        const { canvas, strategy } = await setup();
        const pts = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 100 }];
        await canvas.drawFilledCustomPolygon2d(pts, '#00ff00');
        const el = lastElement(strategy);
        expect(el).toContain('fill="#00ff00"');
        expect(el).toContain('stroke="none"');
    });

    test('drawFilledPath2d with points array', async () => {
        const { canvas, strategy } = await setup();
        const pts = [{ x: 10, y: 10 }, { x: 90, y: 10 }, { x: 50, y: 90 }];
        await canvas.drawFilledPath2d(pts, '#ff00ff');
        const el = lastElement(strategy);
        expect(el).toContain('<path');
        expect(el).toContain('M 10 10');
        expect(el).toContain('L 90 10');
        expect(el).toContain('Z');
        expect(el).toContain('fill="#ff00ff"');
    });

    test('drawFilledPath2d with SVG path string', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawFilledPath2d('M 0 0 L 100 0 L 50 100 Z', '#aabb00');
        const el = lastElement(strategy);
        expect(el).toContain('d="M 0 0 L 100 0 L 50 100 Z"');
    });

    test('drawFilledPath2d with single point does nothing', async () => {
        const { canvas, strategy } = await setup();
        const before = strategy.elements.length;
        await canvas.drawFilledPath2d([{ x: 0, y: 0 }], '#ff0000');
        expect(strategy.elements.length).toBe(before);
    });
});

describe('Gradients, Dashed Strokes & Patterns', () => {
    test('drawRadialGradient creates radial gradient circle', async () => {
        const { canvas, strategy } = await setup();
        const stops = [{ offset: 0, color: '#ff0000' }, { offset: 1, color: '#0000ff' }];
        await canvas.drawRadialGradient({ x: 50, y: 50 }, 10, 40, stops);
        const defs = strategy.elements[strategy.elements.length - 2];
        const circle = lastElement(strategy);
        expect(defs).toContain('<radialGradient');
        expect(defs).toContain('gradientUnits="userSpaceOnUse"');
        expect(circle).toContain('<circle');
        expect(circle).toContain('r="40"');
    });

    test('drawLinearGradientLine2d creates multi-stop gradient line', async () => {
        const { canvas, strategy } = await setup();
        const stops = [
            { offset: 0, color: '#ff0000' },
            { offset: 0.5, color: '#00ff00' },
            { offset: 1, color: '#0000ff' },
        ];
        await canvas.drawLinearGradientLine2d({ x: 0, y: 50 }, { x: 100, y: 50 }, 3, stops);
        const defs = strategy.elements[strategy.elements.length - 2];
        expect(defs).toContain('<linearGradient');
        expect(defs).toContain('offset="50%"');
        const line = lastElement(strategy);
        expect(line).toContain('<line');
    });

    test('drawGradientRing2d creates gradient ring', async () => {
        const { canvas, strategy } = await setup();
        const stops = [{ offset: 0, color: '#ff0000' }, { offset: 1, color: '#0000ff' }];
        await canvas.drawGradientRing2d({ x: 50, y: 50 }, 30, 4, stops);
        const circle = lastElement(strategy);
        expect(circle).toContain('<circle');
        expect(circle).toContain('fill="none"');
        expect(circle).toContain('stroke="url(#');
    });

    test('drawGradientPath2d with points array', async () => {
        const { canvas, strategy } = await setup();
        const pts = [{ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 100, y: 0 }];
        const stops = [{ offset: 0, color: '#ff0000' }, { offset: 1, color: '#0000ff' }];
        await canvas.drawGradientPath2d(pts, 2, stops);
        const path = lastElement(strategy);
        expect(path).toContain('<path');
        expect(path).toContain('stroke="url(#');
    });

    test('drawGradientPath2d with SVG string', async () => {
        const { canvas, strategy } = await setup();
        const stops = [{ offset: 0, color: '#ff0000' }, { offset: 1, color: '#0000ff' }];
        await canvas.drawGradientPath2d('M 0 0 L 100 100', 2, stops);
        const path = lastElement(strategy);
        expect(path).toContain('d="M 0 0 L 100 100"');
    });

    test('drawDashedLine2d creates dashed line', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawDashedLine2d({ x: 0, y: 50 }, { x: 100, y: 50 }, 2, '#ff0000', [5, 3]);
        const el = lastElement(strategy);
        expect(el).toContain('<line');
        expect(el).toContain('stroke-dasharray="5,3"');
    });

    test('drawDashedLine2d with string dashArray', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawDashedLine2d({ x: 0, y: 0 }, { x: 100, y: 0 }, 1, '#000000', '10 5');
        const el = lastElement(strategy);
        expect(el).toContain('stroke-dasharray="10 5"');
    });

    test('drawDashedRing2d creates dashed circle', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawDashedRing2d({ x: 50, y: 50 }, 30, 2, '#ff0000', [8, 4]);
        const el = lastElement(strategy);
        expect(el).toContain('<circle');
        expect(el).toContain('stroke-dasharray="8,4"');
    });

    test('drawDashedRect2d creates dashed rectangle', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawDashedRect2d(10, 10, 80, 80, 2, '#ff0000', [6, 2]);
        const el = lastElement(strategy);
        expect(el).toContain('<rect');
        expect(el).toContain('stroke-dasharray="6,2"');
    });

    test('drawGrid2d creates vertical and horizontal lines', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawGrid2d(0, 0, 100, 100, 25, 25, 1, '#cccccc');
        const el = lastElement(strategy);
        const lineCount = (el.match(/<line /g) || []).length;
        expect(lineCount).toBe(10);
    });
});

describe('Clipping', () => {
    test('setClipRect creates clipPath and group', async () => {
        const { canvas, strategy } = await setup();
        canvas.setClipRect(10, 10, 80, 80);
        expect(strategy._activeClipId).toBeTruthy();
        expect(strategy._groupDepth).toBe(1);
        const groupEl = lastElement(strategy);
        expect(groupEl).toContain('clip-path="url(#');
    });

    test('setClipCircle creates circular clip', async () => {
        const { canvas, strategy } = await setup();
        canvas.setClipCircle({ x: 50, y: 50 }, 40);
        const defs = strategy.elements[strategy.elements.length - 2];
        expect(defs).toContain('<circle');
        expect(defs).toContain('r="40"');
    });

    test('setClipPath with points array', async () => {
        const { canvas, strategy } = await setup();
        canvas.setClipPath([{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 100 }]);
        const defs = strategy.elements[strategy.elements.length - 2];
        expect(defs).toContain('<path');
        expect(defs).toContain('M 0 0');
        expect(defs).toContain('Z');
    });

    test('setClipPath with SVG string', async () => {
        const { canvas, strategy } = await setup();
        canvas.setClipPath('M 0 0 L 100 0 L 50 100 Z');
        const defs = strategy.elements[strategy.elements.length - 2];
        expect(defs).toContain('d="M 0 0 L 100 0 L 50 100 Z"');
    });

    test('clearClip closes group and resets clipId', async () => {
        const { canvas, strategy } = await setup();
        canvas.setClipRect(0, 0, 100, 100);
        canvas.clearClip();
        expect(strategy._activeClipId).toBeNull();
        expect(lastElement(strategy)).toBe('</g>');
    });

    test('clearClip does nothing when no clip active', async () => {
        const { canvas, strategy } = await setup();
        const before = strategy.elements.length;
        canvas.clearClip();
        expect(strategy.elements.length).toBe(before);
    });
});

describe('Filters', () => {
    test('applyGaussianBlur creates filter and group', async () => {
        const { canvas, strategy } = await setup();
        canvas.applyGaussianBlur(5);
        expect(strategy._activeFilterId).toBeTruthy();
        const defs = strategy.elements[strategy.elements.length - 2];
        expect(defs).toContain('<feGaussianBlur');
        expect(defs).toContain('stdDeviation="5"');
        expect(lastElement(strategy)).toContain('filter="url(#');
    });

    test('applyDropShadow creates drop shadow filter', async () => {
        const { canvas, strategy } = await setup();
        canvas.applyDropShadow(2, 4, 3, '#000000');
        const defs = strategy.elements[strategy.elements.length - 2];
        expect(defs).toContain('<feDropShadow');
        expect(defs).toContain('dx="2"');
        expect(defs).toContain('dy="4"');
    });

    test('applyGlow creates glow filter chain', async () => {
        const { canvas, strategy } = await setup();
        canvas.applyGlow(3, '#ff0000');
        const defs = strategy.elements[strategy.elements.length - 2];
        expect(defs).toContain('<feGaussianBlur');
        expect(defs).toContain('<feFlood');
        expect(defs).toContain('<feComposite');
        expect(defs).toContain('<feMerge');
    });

    test('clearFilters closes group and resets filterId', async () => {
        const { canvas, strategy } = await setup();
        canvas.applyGaussianBlur(5);
        canvas.clearFilters();
        expect(strategy._activeFilterId).toBeNull();
        expect(lastElement(strategy)).toBe('</g>');
    });

    test('clearFilters does nothing when no filter active', async () => {
        const { canvas, strategy } = await setup();
        const before = strategy.elements.length;
        canvas.clearFilters();
        expect(strategy.elements.length).toBe(before);
    });
});

describe('Compositing', () => {
    test('drawImage embeds base64 image', async () => {
        const { canvas, strategy } = await setup();
        const buf = Buffer.from('fakepng');
        await canvas.drawImage(buf, 10, 20, 80, 60);
        const el = lastElement(strategy);
        expect(el).toContain('<image');
        expect(el).toContain('x="10"');
        expect(el).toContain('y="20"');
        expect(el).toContain('width="80"');
        expect(el).toContain('height="60"');
        expect(el).toContain('data:image/png;base64,');
    });

    test('drawImage with alpha adds opacity', async () => {
        const { canvas, strategy } = await setup();
        const buf = Buffer.from('fakepng');
        await canvas.drawImage(buf, 0, 0, 100, 100, 0.5);
        const el = lastElement(strategy);
        expect(el).toContain('opacity="0.5"');
    });

    test('drawImage with string base64', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawImage('aGVsbG8=', 0, 0, 50, 50);
        const el = lastElement(strategy);
        expect(el).toContain('href="data:image/png;base64,aGVsbG8="');
    });

    test('drawImage with invalid input does nothing', async () => {
        const { canvas, strategy } = await setup();
        const before = strategy.elements.length;
        await canvas.drawImage(12345, 0, 0, 50, 50);
        expect(strategy.elements.length).toBe(before);
    });
});

describe('Text Extensions', () => {
    test('drawTextOnPath with SVG path string', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawTextOnPath('Hello', 'M 0 50 L 100 50', { fontSize: 20, color: '#ff0000' });
        const defs = strategy.elements[strategy.elements.length - 2];
        const text = lastElement(strategy);
        expect(defs).toContain('<path');
        expect(defs).toContain('d="M 0 50 L 100 50"');
        expect(text).toContain('<textPath');
        expect(text).toContain('Hello');
        expect(text).toContain('font-size: 20px');
    });

    test('drawTextOnPath with points array', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawTextOnPath('World', [{ x: 0, y: 0 }, { x: 100, y: 100 }]);
        const defs = strategy.elements[strategy.elements.length - 2];
        expect(defs).toContain('M 0 0');
        expect(defs).toContain('L 100 100');
    });

    test('drawTextOnPath with startOffset', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawTextOnPath('Test', 'M 0 0 L 100 0', { startOffset: '50%' });
        const text = lastElement(strategy);
        expect(text).toContain('startOffset="50%"');
    });

    test('drawTextOnPath escapes XML characters', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawTextOnPath('<b>&test</b>', 'M 0 0 L 100 0');
        const text = lastElement(strategy);
        expect(text).toContain('&lt;b&gt;&amp;test&lt;/b&gt;');
    });

    test('drawTextOnPath with fewer than 2 points does nothing', async () => {
        const { canvas, strategy } = await setup();
        const before = strategy.elements.length;
        await canvas.drawTextOnPath('X', [{ x: 0, y: 0 }]);
        expect(strategy.elements.length).toBe(before);
    });
});

describe('_nextId uniqueness', () => {
    test('generates unique IDs', async () => {
        const { canvas, strategy } = await setup();
        const id1 = strategy._nextId('test');
        const id2 = strategy._nextId('test');
        expect(id1).not.toBe(id2);
    });
});

describe('_colorToSvg', () => {
    test('hex color without alpha', () => {
        const strategy = new SvgCanvasStrategy();
        expect(strategy._colorToSvg('#ff0000')).toBe('#ff0000');
    });

    test('hex color with alpha < 1', () => {
        const strategy = new SvgCanvasStrategy();
        expect(strategy._colorToSvg('#ff0000', 0.5)).toBe('rgba(255,0,0,0.5)');
    });

    test('non-hex string passthrough', () => {
        const strategy = new SvgCanvasStrategy();
        expect(strategy._colorToSvg('red')).toBe('red');
    });

    test('non-string returns black', () => {
        const strategy = new SvgCanvasStrategy();
        expect(strategy._colorToSvg(123)).toBe('#000000');
    });
});

describe('dispose', () => {
    test('clears elements and cache', async () => {
        const { canvas, strategy } = await setup();
        await canvas.drawCircle2d({ x: 50, y: 50 }, 25, 2, '#ff0000');
        expect(strategy.elements.length).toBeGreaterThan(0);
        canvas.dispose();
        expect(strategy.elements).toHaveLength(0);
    });
});
