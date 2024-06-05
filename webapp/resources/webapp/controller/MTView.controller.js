sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/Fragment",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"webapp/webapp/view/jszip",
		"webapp/webapp/view/xlsx",
		"sap/ui/core/UIComponent"
	],

	function (Controller, Fragment, MessageToast, JSONModel, Filter, FilterOperator, jszip, xlsx, UIComponent) {
		"use strict";

		return Controller.extend("webapp.webapp.controller.MTView", {

			onInit: function () {
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
			getRouter: function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},
			onBack: function () {
				this.getRouter().navTo("RouteView2");
			},
			onUpload: function (e) {
				//	var	this.excelData ;
				this._import(e.getParameter("files") && e.getParameter("files")[0]);
			},

			_import: function (file) {
				var that = this;

				if (file && window.FileReader) {
					var reader = new FileReader();
					reader.onload = function (e) {
						var data = e.target.result;
						var workbook = XLSX.read(data, {
							type: 'binary'
						});
						workbook.SheetNames.forEach(function (sheetName) {
							// Here is your object for every sheet in workbook
							that.excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

						});
					};
					reader.onerror = function (ex) {
						console.log(ex);
					};
					reader.readAsBinaryString(file);
				}
			},
			onSearch: function (event) {
				var searchTerm = event.getParameter("query");
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");

				if (searchTerm === "") {
					binding.filter([]);
				} else {
					var oFilterArr = new Filter([
						new Filter("MT_ID", FilterOperator.Contains, searchTerm),
						new Filter("MT_DESC", FilterOperator.Contains, searchTerm),
						new Filter("MT_SEG", FilterOperator.Contains, searchTerm),
						new Filter("PROFIT", FilterOperator.Contains, searchTerm)
					], false);
					binding.filter([oFilterArr]);
					this.getView().byId("Search").setValue('');
				}
			},
			onuploadBtn: function (oEvent) {
				//	var oErrors = {};
				//	var that = this;
				var finalArray = new Array();
				finalArray = this.excelData;
				if (!finalArray.length) {
					sap.m.MessageToast.show("Please upload an XLSX file", {
						duration: 1000,
						my: sap.ui.core.Popup.Dock.CenterCenter,
						at: sap.ui.core.Popup.Dock.CenterCenter
					});
					return;
				}
				var oTableModel = new JSONModel();
				this.getView().setModel(oTableModel, "tableModel");
				var busyDialog = new sap.m.BusyDialog();
				busyDialog.open();
				for (var i = 0; i < finalArray.length; i++) {
					var oEntry = {
						MT_ID: finalArray[i]["MT_Business_Segment_(ID)"],
						MT_DESC: finalArray[i]["MT_Business_Segment (Desc)"],
						MT_SEG: finalArray[i].MT_Market_Sector,
						PROFIT: finalArray[i]["Profit Center"]
					};

					$.ajax({
						url: "/xsjs_crud/CUDMT.xsjs?cmd=insertupdate",
						method: "POST",
						contentType: "application/json",
						data: JSON.stringify(oEntry),
						success: function () {
							this.loadTableData();
						}.bind(this),
						error: function () {
							MessageToast.show("An error occurred while adding the record. Please try again later.");
						}
					});
				}
				busyDialog.close();
				MessageToast.show("Record Added Successfully!");
			},
			loadTableData: function () {

				var oTableModel = new JSONModel();
				this.getView().setModel(oTableModel, "tableModel");
				$.ajax({
					url: "/xsjs_crud/FetchMT.xsjs",
					method: "GET",
					success: function (data) {
						data = data.map(function (item) {
							return item;
						});
						oTableModel.setData(data);
					},
					error: function () {
						MessageToast.show("An error occurred while loading the records. Please try again later.");
					}
				});
			}
		});
	});