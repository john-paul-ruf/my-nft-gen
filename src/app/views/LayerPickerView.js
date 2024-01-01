import {
    QPushButton, QWidget, QGridLayout, QLabel, AlignmentFlag, QComboBox, QTextEdit, QLineEdit,
} from "@nodegui/nodegui";
import {LayerConfigFactory} from "../../effects/LayerConfigFactory.js";
import {ProjectView} from "./ProjectView.js";

export class LayerPickerView {
    constructor(menu) {
        this.menu = menu;

        this.layerConfig = {};

        this.rootView = new QWidget();
        this.rootView.setObjectName("rootView");

        this.layout = new QGridLayout();
        this.rootView.setLayout(this.layout);

        this.lblEffects = new QLabel();
        this.lblEffects.setText("Effects");
        this.cbEffects = new QComboBox();
        this.cbEffects.addItem(null, LayerConfigFactory.PrimaryEffect.Default.toString());
        this.cbEffects.addItem(null, LayerConfigFactory.PrimaryEffect.Amp.toString());
        this.cbEffects.addItem(null, LayerConfigFactory.PrimaryEffect.FuzzyBands.toString());
        this.cbEffects.addItem(null, LayerConfigFactory.PrimaryEffect.Viewport.toString());

        this.cbEffects.addEventListener('currentIndexChanged', (index) => {
            this.layerConfig = LayerConfigFactory.getPrimaryEffect({type: this.cbEffects.currentText()});
            this.txtConfig.setText(JSON.stringify(new this.layerConfig.defaultEffectConfig({})));
        });

        this.lblPercentChance = new QLabel();
        this.lblPercentChance.setText("Percent Chance");
        this.txtPercentChance = new QLineEdit();
        this.txtPercentChance.setText("100");

        this.lblConfig = new QLabel();
        this.lblConfig.setText("Config");
        this.txtConfig = new QTextEdit();

        this.btnAdd = new QPushButton();
        this.btnAdd.setText('Add');
        this.btnAdd.setObjectName(`btnAdd`);
        this.btnAdd.addEventListener('clicked', () => {
            this.layerConfig.currentEffectConfig = JSON.parse(this.txtConfig.toPlainText());
            this.layerConfig.percentChance = parseInt(this.txtPercentChance.text());
            this.menu.project.addPrimaryEffect({layerConfig:  this.layerConfig});
            this.menu.changeView(new ProjectView(this.menu).getView(this));
        });

        this.btnCancel = new QPushButton();
        this.btnCancel.setText('Cancel');
        this.btnCancel.setObjectName(`btnCancel`);
        this.btnCancel.addEventListener('clicked', () => {
            this.menu.changeView(new ProjectView(this.menu).getView(this));
        });


        this.layout.addWidget(this.lblEffects, 0, 0, 1, 1, AlignmentFlag.AlignRight);
        this.layout.addWidget(this.cbEffects, 0, 1, 1, 1, AlignmentFlag.AlignLeft);

        this.layout.addWidget(this.lblPercentChance, 1, 0, 1, 1, AlignmentFlag.AlignRight);
        this.layout.addWidget(this.txtPercentChance, 1, 1, 1, 1, AlignmentFlag.AlignLeft);

        this.layout.addWidget(this.lblConfig, 2, 0, 1, 1, AlignmentFlag.AlignRight);
        this.layout.addWidget(this.txtConfig, 2, 1, 1, 1, AlignmentFlag.AlignLeft);

        this.layout.addWidget(this.btnAdd, 3, 0, 1, 1, AlignmentFlag.AlignCenter);
        this.layout.addWidget(this.btnCancel, 3, 1, 1, 1, AlignmentFlag.AlignCenter);
    }

    getView() {
        return this.rootView;
    }

}