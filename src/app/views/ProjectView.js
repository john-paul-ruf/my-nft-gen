import {
    QMainWindow,
    QPushButton,
    QWidget,
    FlexLayout,
} from "@nodegui/nodegui";
import {LayerPickerView} from "./LayerPickerView.js";

export class ProjectView {
    constructor(menu) {
        this.menu = menu;

        this.rootView = new QWidget();
        this.rootView.setObjectName("rootView");

        this.rootViewFlexLayout = new FlexLayout();
        this.rootViewFlexLayout.setFlexNode(this.rootView.getFlexNode());
        this.rootView.setLayout(this.rootViewFlexLayout);

        const button = new QPushButton();
        button.setText('Pick Layers');
        button.setObjectName(`btnPickLayers`);
        button.addEventListener('clicked', () => {
            this.menu.changeView(new LayerPickerView(this.menu).getView(this));
        });

        this.rootViewFlexLayout.addWidget(button);
    }

    getView(){
        return this.rootView;
    }

}