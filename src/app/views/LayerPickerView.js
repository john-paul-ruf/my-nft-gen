import {
    QMainWindow,
    QPushButton,
    QWidget,
    FlexLayout,
} from "@nodegui/nodegui";
import {LayerConfigFactory} from "../../effects/LayerConfigFactory.js";

export class LayerPickerView {
    constructor(menu) {
        this.menu = menu;

        this.rootView = new QWidget();
        this.rootView.setObjectName("rootView");

        this.rootViewFlexLayout = new FlexLayout();
        this.rootViewFlexLayout.setFlexNode(this.rootView.getFlexNode());
        this.rootView.setLayout(this.rootViewFlexLayout);

        const button = new QPushButton();
        button.setText('Select Layer');
        button.setObjectName(`btnSelectLayers`);
        button.addEventListener('clicked', () => {

        });

        this.rootViewFlexLayout.addWidget(button);
    }

    getView(){
        return this.rootView;
    }

}