export class ColorPicker {
    static _name_ = 'ColorPicker';

    static SelectionType = {
        color: 'color',
        colorBucket: 'color-bucket',
        neutralBucket: 'neutral-bucket',
    };

    constructor(selectionType = ColorPicker.SelectionType.colorBucket, colorValue = null) {
        this.selectionType = selectionType;
        this.colorValue = colorValue;
        this.getColor = (settings) => {
            switch (this.selectionType) {
            case ColorPicker.SelectionType.color:
                return this.colorValue;
            case ColorPicker.SelectionType.colorBucket:
                return settings.getColorFromBucket();
            case ColorPicker.SelectionType.neutralBucket:
                return settings.getNeutralFromBucket();
            }
        };
    }
}
