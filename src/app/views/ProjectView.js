import {
    QPushButton,
    QWidget,
    FlexLayout,
    QLabel,
    QTextEdit,
    QSize, QGridLayout
} from "@nodegui/nodegui";
import {LayerPickerView} from "./LayerPickerView.js";

export class ProjectView {
    constructor(menu) {
        this.menu = menu;

        this.rootView = new QWidget();
        this.rootView.setObjectName("rootView");

        this.layout = new QGridLayout();
        this.rootView.setLayout(this.layout);

        const lblArtist = new QLabel();
        lblArtist.setText("Artist");
        const txtArtist = new QTextEdit();
        txtArtist.setFixedSize(400,32);
        txtArtist.setText(this.menu.project.artist);


        const lblProjectName = new QLabel();
        lblProjectName.setText("Project Name");
        const txtProjectName = new QTextEdit();
        txtProjectName.setFixedSize(400,32);
        txtProjectName.setText(this.menu.project.projectName);

        const lblProjectDirectory = new QLabel();
        lblProjectDirectory.setText("Project Directory");
        const txtProjectDirectory = new QTextEdit();
        txtProjectDirectory.setFixedSize(400,32);
        txtProjectDirectory.setText(this.menu.project.projectDirectory);

        const button = new QPushButton();
        button.setText('Pick Layers');
        button.setObjectName(`btnPickLayers`);
        button.addEventListener('clicked', () => {
            this.menu.project.artist = txtArtist.toPlainText()
            this.menu.project.projectName = txtProjectName.toPlainText()
            this.menu.project.projectDirectory = txtProjectDirectory.toPlainText()

            this.menu.changeView(new LayerPickerView(this.menu).getView(this));
        });

        this.layout.addWidget(lblArtist, 0, 0);
        this.layout.addWidget(txtArtist, 0, 1);

        this.layout.addWidget(lblProjectName, 1, 0);
        this.layout.addWidget(txtProjectName, 1, 1);

        this.layout.addWidget(lblProjectDirectory, 2, 0);
        this.layout.addWidget(txtProjectDirectory, 2, 1);

        this.layout.addWidget(button, 3, 0);
    }

    getView(){
        return this.rootView;
    }

}