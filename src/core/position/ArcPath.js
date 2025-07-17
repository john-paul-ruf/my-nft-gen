export class ArcPath {
    static _name_ = 'arc-path';
    constructor({
                    center,
                    radius,
                    startAngle,
                    endAngle,
                    direction = 1
                }) {
        this.name = ArcPath._name_;
        this.center = center;
        this.radius = radius;
        this.startAngle = startAngle * (Math.PI / 180);
        this.endAngle = endAngle * (Math.PI / 180);
        this.direction = direction;
        this.name
    }

    getPosition(frame, totalFrames) {
        const t = frame / totalFrames;

        const angle = this.direction === 1
            ? this.startAngle + t * (this.endAngle - this.startAngle)
            : this.endAngle - t * (this.endAngle - this.startAngle);

        return {
            x: Math.floor(this.center.x + this.radius * Math.cos(angle)),
            y: Math.floor(this.center.y + this.radius * Math.sin(angle))
        };
    }
}
