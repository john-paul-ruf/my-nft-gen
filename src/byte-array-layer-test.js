import { LayerFactory } from './core/factory/layer/LayerFactory.js';
import BlendMode from './core/factory/layer/BlendMode.js';

async function testByteArrayLayer() {
    console.log('Testing ByteArrayLayerStrategy...');
    
    const config = {
        finalImageSize: {
            width: 400,
            height: 400,
            longestSide: 400,
            shortestSide: 400,
        },
        workingDirectory: './',
        layerStrategy: 'bytearray',
    };
    
    // Create a base layer with red background
    const baseLayer = await LayerFactory.getNewLayer(400, 400, '#FF0000', config);
    
    // Create a second layer with blue background
    const blueLayer = await LayerFactory.getNewLayer(200, 200, '#0000FF', config);
    
    // Test basic compositing
    console.log('Testing basic compositing...');
    await baseLayer.compositeLayerOver(blueLayer);
    await baseLayer.toFile('./test-byte-array-layer-basic.png');
    
    // Create layers for blend mode testing
    const redLayer = await LayerFactory.getNewLayer(400, 400, '#FF0000', config);
    const greenLayer = await LayerFactory.getNewLayer(400, 400, '#00FF00', config);
    
    // Test multiply blend mode
    console.log('Testing multiply blend mode...');
    await redLayer.compositeLayerOverAtPoint(greenLayer, 0, 0, BlendMode.MULTIPLY);
    await redLayer.toFile('./test-byte-array-layer-multiply.png');
    
    // Test screen blend mode
    console.log('Testing screen blend mode...');
    const redLayer2 = await LayerFactory.getNewLayer(400, 400, '#FF0000', config);
    const greenLayer2 = await LayerFactory.getNewLayer(400, 400, '#00FF00', config);
    await redLayer2.compositeLayerOverAtPoint(greenLayer2, 0, 0, BlendMode.SCREEN);
    await redLayer2.toFile('./test-byte-array-layer-screen.png');
    
    // Test opacity adjustment
    console.log('Testing opacity adjustment...');
    const opacityLayer = await LayerFactory.getNewLayer(400, 400, '#FF0000', config);
    await opacityLayer.adjustLayerOpacity(0.5);
    await opacityLayer.toFile('./test-byte-array-layer-opacity.png');
    
    // Test blur
    console.log('Testing blur...');
    const blurLayer = await LayerFactory.getNewLayer(400, 400, '#FF0000', config);
    await blurLayer.blur(5);
    await blurLayer.toFile('./test-byte-array-layer-blur.png');
    
    // Test resize
    console.log('Testing resize...');
    const resizeLayer = await LayerFactory.getNewLayer(400, 400, '#FF0000', config);
    await resizeLayer.resize(200, 200, 'contain');
    await resizeLayer.toFile('./test-byte-array-layer-resize.png');
    
    // Test rotation
    console.log('Testing rotation...');
    const rotateLayer = await LayerFactory.getNewLayer(400, 400, '#FF0000', config);
    await rotateLayer.rotate(45);
    await rotateLayer.toFile('./test-byte-array-layer-rotate.png');
    
    console.log('ByteArrayLayerStrategy tests completed!');
    console.log('Generated test files:');
    console.log('- test-byte-array-layer-basic.png');
    console.log('- test-byte-array-layer-multiply.png');
    console.log('- test-byte-array-layer-screen.png');
    console.log('- test-byte-array-layer-opacity.png');
    console.log('- test-byte-array-layer-blur.png');
    console.log('- test-byte-array-layer-resize.png');
    console.log('- test-byte-array-layer-rotate.png');
}

testByteArrayLayer().catch(console.error);