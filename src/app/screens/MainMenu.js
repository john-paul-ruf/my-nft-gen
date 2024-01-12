import {
    QMainWindow,
    QPushButton,
    QWidget,
    FlexLayout,
} from "@nodegui/nodegui";
import {MainView} from "../views/MainView.js";
import {Project} from "../Project.js";

export class MainMenu {
    constructor() {

        this.project = new Project({});

        this.win = new QMainWindow();
        this.win.setFixedSize(640, 480);

        this.rootView = new QWidget();
        this.rootView.setObjectName("rootView");

        this.win.setCentralWidget(new MainView(this).getView());
    }

    show(){
        this.win.show();
    }

    changeView(view){
        this.win.setCentralWidget(view);
    }

}