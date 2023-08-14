"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MaterialModule = void 0;
var core_1 = require("@angular/core");
var button_1 = require("@angular/material/button");
var card_1 = require("@angular/material/card");
var checkbox_1 = require("@angular/material/checkbox");
var chips_1 = require("@angular/material/chips");
var dialog_1 = require("@angular/material/dialog");
var divider_1 = require("@angular/material/divider");
var form_field_1 = require("@angular/material/form-field");
var icon_1 = require("@angular/material/icon");
var input_1 = require("@angular/material/input");
var list_1 = require("@angular/material/list");
var paginator_1 = require("@angular/material/paginator");
var progress_bar_1 = require("@angular/material/progress-bar");
var radio_1 = require("@angular/material/radio");
var select_1 = require("@angular/material/select");
var tabs_1 = require("@angular/material/tabs");
var toolbar_1 = require("@angular/material/toolbar");
var MATERIAL_MODULES = [
    toolbar_1.MatToolbarModule,
    button_1.MatButtonModule,
    card_1.MatCardModule,
    checkbox_1.MatCheckboxModule,
    chips_1.MatChipsModule,
    dialog_1.MatDialogModule,
    divider_1.MatDividerModule,
    form_field_1.MatFormFieldModule,
    icon_1.MatIconModule,
    input_1.MatInputModule,
    list_1.MatListModule,
    paginator_1.MatPaginatorModule,
    progress_bar_1.MatProgressBarModule,
    radio_1.MatRadioModule,
    select_1.MatSelectModule,
    tabs_1.MatTabsModule,
];
var MaterialModule = /** @class */ (function () {
    function MaterialModule() {
    }
    MaterialModule = __decorate([
        (0, core_1.NgModule)({
            imports: MATERIAL_MODULES,
            exports: MATERIAL_MODULES
        })
    ], MaterialModule);
    return MaterialModule;
}());
exports.MaterialModule = MaterialModule;
