import {
    QPushButton,
    QWidget,
    FlexLayout,
} from "@nodegui/nodegui";
import {ProjectView} from "./ProjectView.js";

export class MainView {
    constructor(menu) {
        this.menu = menu;

        this.rootView = new QWidget();
        this.rootView.setObjectName("rootView");

        this.rootViewFlexLayout = new FlexLayout();
        this.rootViewFlexLayout.setFlexNode(this.rootView.getFlexNode());
        this.rootView.setLayout(this.rootViewFlexLayout);

        const button = new QPushButton();
        button.setText('New Project');
        button.setObjectName(`btnNewProject}`);
        button.addEventListener('clicked', () => {
            this.menu.changeView(new ProjectView(this.menu).getView(this));
        });

        this.rootViewFlexLayout.addWidget(button);
    }

    getView(){
        return this.rootView;
    }

}