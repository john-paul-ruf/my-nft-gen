export class Position {
    static _name_ = 'position';
    constructor({
                    x = 0,
                    y = 0
                }) {
        this.name = Position._name_;
        this.x = x;
        this.y = y;
    }

    getPosition(frame, totalFrames) {
        return {x: this.x, y: this.y};
    }
}