sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/Fragment",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"webapp/webapp/view/jszip",
		"webapp/webapp/view/xlsx",
		"sap/ui/core/UIComponent",
		"sap/ui/export/Spreadsheet",
		"sap/ui/model/Sorter"
	],

	function (Controller, Fragment, MessageToast, JSONModel, Filter, FilterOperator, jszip, xlsx, UIComponent, Spreadsheet, Sorter) {
		"use strict";

		return Controller.extend("webapp.webapp.controller.Final", {

			onInit: function () {

				var oColumn = this.getView().byId("hideColumn");
				oColumn.setVisible(!oColumn.getVisible());
				var oColumn2 = this.getView().byId("hideColumn1");
				oColumn2.setVisible(!oColumn2.getVisible());
				var oColumn3 = this.getView().byId("hideColumn2");
				oColumn3.setVisible(!oColumn3.getVisible());

				var oColumn6 = this.getView().byId("showColumn");
				oColumn6.setVisible(oColumn6.getVisible());
				var oColumn7 = this.getView().byId("showColumn1");
				oColumn7.setVisible(oColumn7.getVisible());
				var oColumn8 = this.getView().byId("showColumn2");
				oColumn8.setVisible(oColumn8.getVisible());

				this.loadTableData();
				var oDialogModel = new JSONModel({});
				this.getView().setModel(oDialogModel, "dialogModel");
				var oUserModel = new JSONModel({});
				this.getView().setModel(oUserModel, "oUserModel");
				var that = this;
				$.ajax({
					url: "/xsjs_crud/FetchUsernameDetails.xsjs",
					method: "GET",
					contentType: "application/json",
					success: function (oData) {
						that.getView().getModel("oUserModel").setProperty("/userName", oData.Database_Application_User);
					},
					error: function () {
						MessageToast.show("An error occurred while adding the record. Please try again later.");
					}
				});

			},
			onFilterChange: function (oEvent) {
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");
				this._bDescendingSort = !this._bDescendingSort;
				var oSorter = new Sorter("LAST_MODIFIED_TIMESTAMP", this._bDescendingSort);
				binding.sort(oSorter);
			},
			onFilterlastModifiedBy: function (oEvent) {
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");
				this._bDescendingSort = !this._bDescendingSort;
				var oSorter = new Sorter("LAST_MODIFIED_USER", this._bDescendingSort);
				binding.sort(oSorter);
			},
			onFilterMktoff: function (oEvent) {
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");
				this._bDescendingSort = !this._bDescendingSort;
				var oSorter = new Sorter("MKT_SIGN", this._bDescendingSort);
				binding.sort(oSorter);
			},
			onFilterMktSeg: function (oEvent) {
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");
				this._bDescendingSort = !this._bDescendingSort;
				var oSorter = new Sorter("MARKET_SEG", this._bDescendingSort);
				binding.sort(oSorter);
			},
			onFilterMTSegId: function (oEvent) {
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");
				this._bDescendingSort = !this._bDescendingSort;
				var oSorter = new Sorter("MT_SEG_ID", this._bDescendingSort);
				binding.sort(oSorter);
			},
			onFilterMatx: function (oEvent) {
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");
				this._bDescendingSort = !this._bDescendingSort;
				var oSorter = new Sorter("MAKTX", this._bDescendingSort);
				binding.sort(oSorter);
			},
			onFilterMat: function (oEvent) {
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");
				this._bDescendingSort = !this._bDescendingSort;
				var oSorter = new Sorter("MATNR", this._bDescendingSort);
				binding.sort(oSorter);
			},
			onFilterSoldToDesc: function (oEvent) {
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");
				this._bDescendingSort = !this._bDescendingSort;
				var oSorter = new Sorter("SOLD_TO_DESC", this._bDescendingSort);
				binding.sort(oSorter);
			},
			onFilterSoldTo: function (oEvent) {
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");
				this._bDescendingSort = !this._bDescendingSort;
				var oSorter = new Sorter("SOLD_TO", this._bDescendingSort);
				binding.sort(oSorter);
			},
			onRefresh: function (oEvent) {
				this.loadTableData();
			},
			onPress: function (oEvent) {
				var oColumn = this.getView().byId("hideColumn");
				oColumn.setVisible(!oColumn.getVisible());
				var oColumn2 = this.getView().byId("hideColumn1");
				oColumn2.setVisible(!oColumn2.getVisible());
				var oColumn3 = this.getView().byId("hideColumn2");
				oColumn3.setVisible(!oColumn3.getVisible());

				var oColumn6 = this.getView().byId("showColumn");
				oColumn6.setVisible(!oColumn6.getVisible());
				var oColumn7 = this.getView().byId("showColumn1");
				oColumn7.setVisible(!oColumn7.getVisible());
				var oColumn8 = this.getView().byId("showColumn2");
				oColumn8.setVisible(!oColumn8.getVisible());
			},
			getRouter: function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},
			onBackFinal: function () {
				this.getRouter().navTo("RouteView2");
			},

			onDataExport: function () {
				var oTable = this.byId("tableId1");
				//	var oModel = oTable.getModel();
				var oTableModel = this.getView().getModel("tableModelFinal");
				var aData = oTableModel.getData();
				//	var aData = oModel.getProperty("tableModelFinal");
				var aCols, oSettings, oSheet;
				aCols = this.createColumnConfig();
				oSettings = {
					workbook: {
						columns: aCols
					},
					dataSource: aData
				};
				oSheet = new sap.ui.export.Spreadsheet(oSettings);
				oSheet.build().finally(function () {
					oSheet.destroy();
				});
			},
			createColumnConfig: function () {
				return [{
					label: "Customer Sold-To (ID)",
					property: "SOLD_TO"
				}, {
					label: "Customer Sold-To (Description)",
					property: "SOLD_TO_DESC"
				}, {
					label: "Material ID",
					property: "MATNR",
					width: 20
				}, { //hdonapar
					label: "Material Description",
					property: "MAKTX"
				}, {
					label: "MT Business Segment (ID)",
					property: "MT_SEG_ID"
				}, {
					label: "MT Business Segment (Desc)",
					property: "MT_SEG_DESC"
				}, {
					label: "Market Segment",
					property: "MARKET_SEG"
				}, {
					label: "Last ModifiedBy",
					property: "LAST_MODIFIED_USER"
				}, {
					label: "Last Modified Time",
					property: "LAST_MODIFIED_TIMESTAMP"
				}];
			},

			loadTableData: function () {

				var oTableModel = new JSONModel();
				this.getView().setModel(oTableModel, "tableModelFinal");
				$.ajax({
					url: "/xsjs_crud/FetchFinal.xsjs",
					method: "GET",
					success: function (data) {
						data = data.map(function (item) {
							return item;
						});
						for (var i = 0; i < data.length; i++) {
							data[i].LAST_MODIFIED_TIMESTAMP = data[i].LAST_MODIFIED_TIMESTAMP.slice(0, 10);
						}
						oTableModel.setData(data);
					},
					error: function () {
						MessageToast.show("An error occurred while loading the records. Please try again later.");
					}
				});
			},
			onSearch: function (event) {
				var searchTerm = event.getParameter("query");
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");

				if (searchTerm === "") {
					binding.filter([]);
				} else {
					var oFilterArr = new Filter([
						new Filter("SOLD_TO", FilterOperator.Contains, searchTerm),
						new Filter("SOLD_TO_DESC", FilterOperator.Contains, searchTerm),
						new Filter("MATNR", FilterOperator.Contains, searchTerm),
						new Filter("MAKTX", FilterOperator.Contains, searchTerm),
						new Filter("MT_SEG_ID", FilterOperator.Contains, searchTerm),
						new Filter("MT_SEG_DESC", FilterOperator.Contains, searchTerm),
						new Filter("MARKET_SEG", FilterOperator.Contains, searchTerm)
					], false);
					binding.filter([oFilterArr]);
				}
			}
		});
	});