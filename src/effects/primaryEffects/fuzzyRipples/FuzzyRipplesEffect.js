import { promises as fs } from 'fs';
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { findOneWayValue } from '../../../core/math/findOneWayValue.js';
import { LayerFactory } from '../../../core/factory/layer/LayerFactory.js';
import { Canvas2dFactory } from '../../../core/factory/canvas/Canvas2dFactory.js';
import { getRandomIntInclusive, randomId } from '../../../core/math/random.js';
import { findValue } from '../../../core/math/findValue.js';
import { findPointByAngleAndCircle } from '../../../core/math/drawingMath.js';
import { Settings } from '../../../core/Settings.js';
import { FuzzyRipplesConfig } from './FuzzyRipplesConfig.js';

export class FuzzyRipplesEffect extends LayerEffect {
  static _name_ = 'fuzzy-ripples';

  constructor({
    name = FuzzyRipplesEffect._name_,
    requiresLayer = true,
    config = new FuzzyRipplesConfig({}),
    additionalEffects = [],
    ignoreAdditionalEffects = false,
    settings = new Settings({}),
  }) {
    super({
      name,
      requiresLayer,
      config,
      additionalEffects,
      ignoreAdditionalEffects,
      settings,
    });
    this.#generate(settings);
  }

  async #drawRing(pos, radius, weight, color, context) {
    const theGaston = findValue(radius, radius + context.data.ripple, context.data.times, context.numberOfFrames, context.currentFrame);
    await context.canvas.drawRing2d(pos, theGaston, weight, color, 0, color);
  }

  async #drawRings(context, pos, radius, numberOfRings, color, weight) {
    for (let i = 0; i < numberOfRings; i++) {
      await this.#drawRing(pos, radius / numberOfRings * i, weight, color, context);
    }
  }

  async #drawUnderlay(context, filename) {
    // outer color
    await this.#drawRings(context, context.data.center, context.data.largeRadius, context.data.largeNumberOfRings, context.data.outerColor, context.data.thickness + context.data.stroke);
    for (let i = 30; i <= 330; i += 60) {
      await this.#drawRings(
        context,
        findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius),
        context.data.smallRadius,
        context.data.smallNumberOfRings,
        context.data.outerColor,
        context.data.thickness + context.data.stroke + context.theAccentGaston,
      );
    }
    await context.canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center, 6, 30 + context.theAngleGaston, context.data.thickness, context.data.outerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor);

    // inner color
    await this.#drawRings(context, context.data.center, context.data.largeRadius, context.data.largeNumberOfRings, context.data.innerColor, context.data.thickness);
    for (let i = 30; i <= 330; i += 60) {
      await this.#drawRings(
        context,
        findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius),
        context.data.smallRadius,
        context.data.smallNumberOfRings,
        context.data.innerColor,
        context.data.thickness,
      );
    }
    await context.canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center, 6, 30 + context.theAngleGaston, context.data.thickness, context.data.innerColor, 0, context.data.innerColor);

    await context.canvas.toFile(filename);
  }

  async #draw(context, filename) {
    // outer color
    await this.#drawRings(context, context.data.center, context.data.largeRadius, context.data.largeNumberOfRings, context.data.outerColor, context.data.thickness + context.data.stroke);
    for (let i = 30; i <= 330; i += 60) {
      await this.#drawRings(
        context,
        findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius),
        context.data.smallRadius,
        context.data.smallNumberOfRings,
        context.data.outerColor,
        context.data.thickness + context.data.stroke + context.theAccentGaston,
      );
    }
    await context.canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center, 6, 30 + context.theAngleGaston, context.data.thickness, context.data.outerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor);

    // inner color
    await this.#drawRings(context, context.data.center, context.data.largeRadius, context.data.largeNumberOfRings, context.data.innerColor, context.data.thickness);
    for (let i = 30; i <= 330; i += 60) {
      await this.#drawRings(
        context,
        findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius),
        context.data.smallRadius,
        context.data.smallNumberOfRings,
        context.data.innerColor,
        context.data.thickness,
      );
    }
    await context.canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center, 6, 30 + context.theAngleGaston, context.data.thickness, context.data.innerColor, 0, context.data.innerColor);

    await context.canvas.toFile(filename);
  }

  async #compositeImage(context, layer) {
    await this.#drawUnderlay(context, context.underlayName);

    context.theAccentGaston = 0;
    context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

    await this.#draw(context, context.drawing);

    const tempLayer = await LayerFactory.getLayerFromFile(context.drawing, this.fileConfig);
    const underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName, this.fileConfig);

    await underlayLayer.blur(context.theBlurGaston);

    await underlayLayer.adjustLayerOpacity(context.data.underLayerOpacity);
    await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

    if (!context.data.invertLayers) {
      await layer.compositeLayerOver(underlayLayer);
      await layer.compositeLayerOver(tempLayer);
    } else {
      await layer.compositeLayerOver(tempLayer);
      await layer.compositeLayerOver(underlayLayer);
    }
  }

  async #fuzzyRipple(layer, currentFrame, numberOfFrames) {
    const context = {
      currentFrame,
      numberOfFrames,
      theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
      theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
      theAngleGaston: findOneWayValue(0, this.data.speed * 60, 1, numberOfFrames, currentFrame),
      drawing: `${this.workingDirectory}fuzzy-ripples${randomId()}.png`,
      underlayName: `${this.workingDirectory}fuzzy-ripples-underlay${randomId()}.png`,
      canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
      data: this.data,
    };

    await this.#compositeImage(context, layer);

    await fs.unlink(context.drawing);
    await fs.unlink(context.underlayName);
  }

  #generate(settings) {
    this.data = {
      invertLayers: this.config.invertLayers,
      layerOpacity: this.config.layerOpacity,
      underLayerOpacity: this.config.underLayerOpacity,
      height: this.finalSize.height,
      width: this.finalSize.width,
      stroke: this.config.stroke,
      thickness: this.config.thickness,
      innerColor: this.config.innerColor.getColor(settings),
      outerColor: this.config.outerColor.getColor(settings),
      speed: this.config.speed,
      largeRadius: getRandomIntInclusive(this.config.largeRadius.lower(this.finalSize), this.config.largeRadius.upper(this.finalSize)),
      smallRadius: getRandomIntInclusive(this.config.smallRadius.lower(this.finalSize), this.config.smallRadius.upper(this.finalSize)),
      largeNumberOfRings: getRandomIntInclusive(this.config.largeNumberOfRings.lower, this.config.largeNumberOfRings.upper),
      smallNumberOfRings: getRandomIntInclusive(this.config.smallNumberOfRings.lower, this.config.smallNumberOfRings.upper),
      ripple: getRandomIntInclusive(this.config.ripple.lower(this.finalSize), this.config.ripple.upper(this.finalSize)),
      smallerRingsGroupRadius: getRandomIntInclusive(this.config.smallerRingsGroupRadius.lower(this.finalSize), this.config.smallerRingsGroupRadius.upper(this.finalSize)),
      times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
      center: this.config.center,
      accentRange: {
        lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
        upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper),
      },
      blurRange: {
        lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
        upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
      },
      featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),

    };
  }

  async invoke(layer, currentFrame, numberOfFrames) {
    await this.#fuzzyRipple(layer, currentFrame, numberOfFrames);
    await super.invoke(layer, currentFrame, numberOfFrames);
  }

  getInfo() {
    return `${this.name}: large rings: ${this.data.largeNumberOfRings}, small rings x6: ${this.data.smallNumberOfRings}, ripple: ${this.data.ripple}`;
  }
}
