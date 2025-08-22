import { Canvas2d } from './core/factory/canvas/Canvas2d.js';
import { ByteArrayCanvasStrategy } from './core/factory/canvas/strategy/ByteArrayCanvasStrategy.js';

async function testByteArrayCanvas() {
    console.log('Testing ByteArrayCanvasStrategy...');
    
    const canvas = new Canvas2d(new ByteArrayCanvasStrategy());
    
    // Create a 400x400 canvas
    await canvas.newCanvas(400, 400);
    
    // Test drawing a ring
    await canvas.drawRing2d({ x: 200, y: 200 }, 50, 5, '#FF0000', 3, '#00FF00', 1.0);
    
    // Test drawing a line
    await canvas.drawLine2d({ x: 100, y: 100 }, { x: 300, y: 300 }, 3, '#0000FF', 2, '#FFFF00', 1.0);
    
    // Test drawing a filled polygon (triangle)
    await canvas.drawFilledPolygon2d(30, { x: 150, y: 150 }, 3, 0, '#FF00FF', 0.8);
    
    // Save to file
    await canvas.toFile('./test-byte-array-output.png');
    
    console.log('ByteArrayCanvasStrategy test completed! Output saved to test-byte-array-output.png');
    
    // Clean up
    canvas.dispose();
}

testByteArrayCanvas().catch(console.error);