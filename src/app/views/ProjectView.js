import {
    QPushButton,
    QWidget,
    QLabel,
    QLineEdit,
    QGridLayout,
    AlignmentFlag,
    QTreeWidget,
    QTreeWidgetItem
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
        const txtArtist = new QLineEdit();
        txtArtist.setText(this.menu.project.artist);


        const lblProjectName = new QLabel();
        lblProjectName.setText("Project Name");
        const txtProjectName = new QLineEdit();
        txtProjectName.setText(this.menu.project.projectName);

        const lblProjectDirectory = new QLabel();
        lblProjectDirectory.setText("Project Directory");
        const txtProjectDirectory = new QLineEdit();
        txtProjectDirectory.setText(this.menu.project.projectDirectory);

        const twiPrimary = new QTreeWidgetItem();
        twiPrimary.setText(0,'Primary');

        for(let i = 0; i < this.menu.project.selectedPrimaryEffectConfigs.length; i++){
            const item = new QTreeWidgetItem(twiPrimary);
            item.setText(0,this.menu.project.selectedPrimaryEffectConfigs[i].name);
        }

        const twiFinal = new QTreeWidgetItem();
        twiFinal.setText(0, 'Final');

        for(let i = 0; i < this.menu.project.selectedFinalEffectConfigs.length; i++){
            const item = new QTreeWidgetItem(twiFinal);
            item.setText(0,this.menu.project.selectedFinalEffectConfigs[i].effect._name_);
        }

        const twEffects = new QTreeWidget();
        twEffects.addTopLevelItem(twiPrimary);
        twEffects.addTopLevelItem(twiFinal);

        const btnAddLayer = new QPushButton();
        btnAddLayer.setText('Add New Layer');
        btnAddLayer.setObjectName(`btnAddLayer`);
        btnAddLayer.addEventListener('clicked', () => {
            this.menu.changeView(new LayerPickerView(this.menu).getView(this));
        });

        const btnRemoveLayer = new QPushButton();
        btnRemoveLayer.setText('Remove Layer');
        btnRemoveLayer.setObjectName(`btnAddLayer`);
        btnRemoveLayer.addEventListener('clicked', () => {
            this.menu.changeView(new LayerPickerView(this.menu).getView(this));
        });


        this.layout.addWidget(lblArtist, 0, 0, 1,1, AlignmentFlag.AlignRight);
        this.layout.addWidget(txtArtist, 0, 1, 1, 1, AlignmentFlag.AlignLeft);

        this.layout.addWidget(lblProjectName, 1, 0, 1,1, AlignmentFlag.AlignRight);
        this.layout.addWidget(txtProjectName, 1, 1, 1, 1, AlignmentFlag.AlignLeft);

        this.layout.addWidget(lblProjectDirectory, 2, 0, 1,1, AlignmentFlag.AlignRight);
        this.layout.addWidget(txtProjectDirectory, 2, 1, 1, 1, AlignmentFlag.AlignLeft);

        this.layout.addWidget(twEffects, 3, 0,);

        this.layout.addWidget(btnAddLayer, 4, 0, 1, 1, AlignmentFlag.AlignCenter);
        this.layout.addWidget(btnRemoveLayer, 4, 1, 1, 1, AlignmentFlag.AlignCenter);
    }

    getView(){
        return this.rootView;
    }

}