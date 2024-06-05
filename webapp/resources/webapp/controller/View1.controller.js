sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"

], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("webapp.webapp.controller.View1", {

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onMT: function () {
			this.getRouter().navTo("RouteView1");
		},
		onInitial: function () {
			this.getRouter().navTo("RouteView3");
		},
		onFinal: function () {
			this.getRouter().navTo("RouteView4");
		}
	});
});