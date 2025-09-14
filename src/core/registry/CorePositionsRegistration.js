import { PositionRegistry } from './PositionRegistry.js';
import { Position } from '../position/Position.js';
import { ArcPath } from '../position/ArcPath.js';

export function registerCorePositions() {
    PositionRegistry.registerGlobal(Position);
    PositionRegistry.registerGlobal(ArcPath);
}