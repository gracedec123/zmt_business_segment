sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/Fragment",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"webapp/webapp/view/jszip",
		"webapp/webapp/view/xlsx",
		"sap/ui/model/Sorter",
		"sap/ui/core/UIComponent",
		"sap/ui/export/Spreadsheet"
	],

	function (Controller, Fragment, MessageToast, JSONModel, Filter, FilterOperator, jszip, xlsx, Sorter, UIComponent, Spreadsheet) {
		//	MockServer, ODataModel) {
		"use strict";

		return Controller.extend("webapp.webapp.controller.Initial", {

			onInit: function () {

				var oColumn = this.getView().byId("hideColumn");
				oColumn.setVisible(!oColumn.getVisible());
				var oColumn2 = this.getView().byId("hideColumn2");
				oColumn2.setVisible(!oColumn2.getVisible());
				var oColumn3 = this.getView().byId("hideColumn3");
				oColumn3.setVisible(!oColumn3.getVisible());
				var oColumn4 = this.getView().byId("hideColumn4");
				oColumn4.setVisible(!oColumn4.getVisible());
				var oColumn5 = this.getView().byId("hideColumn5");
				oColumn5.setVisible(!oColumn5.getVisible());
				var oColumn10 = this.getView().byId("hideColumn6");
				oColumn10.setVisible(!oColumn10.getVisible());

				var oColumn6 = this.getView().byId("showColumn");
				oColumn6.setVisible(oColumn6.getVisible());
				var oColumn7 = this.getView().byId("showColumn1");
				oColumn7.setVisible(oColumn7.getVisible());
				var oColumn8 = this.getView().byId("showColumn2");
				oColumn8.setVisible(oColumn8.getVisible());
				var oColumn9 = this.getView().byId("showColumn3");
				oColumn9.setVisible(oColumn9.getVisible());
				var oColumn12 = this.getView().byId("showColumn5");
				oColumn12.setVisible(oColumn12.getVisible());

				this.loadTableData();
				var oDialogModel = new JSONModel({});
				this.getView().setModel(oDialogModel, "dialogModel");
				var oUserModel = new JSONModel({});
				this.getView().setModel(oUserModel, "oUserModel");
				var oselectDialog = new JSONModel({});
				this.getView().setModel(oselectDialog, "oselectDialog");
				oselectDialog.setSizeLimit(100000);
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
			onSync: function () {
				this.getView().byId("idMKey").setValue("");
				this.getView().byId("idMSign").setValue("");
				this.getView().byId("idMcus").setValue("");
				this.getView().byId("idMmat").setValue("");
				this.getView().byId("idMtseg").setValue("");
				this.getView().byId("idMcom").setValue("");
				this.getView().byId("idMUsr").setValue("");
				this.byId("comboBox1").setSelectedKey("");
				this.getView().byId("idChdate").setValue("");
				this.getView().byId("idCdate").setValue("");
				this.getView().byId("Search").setValue("");
				this.loadTableData();
			},
			onValueHelpKey: function (oEvent) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();
				if (!this._pValueHelpDialogKey) {
					this._pValueHelpDialogKey = Fragment.load({
						id: oView.getId(),
						name: "webapp.webapp.fragment.ValueHelpMKey",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pValueHelpDialogKey.then(function (oDialog) {
					oDialog.getBinding("items").filter([new Filter("MT_KEY", FilterOperator.Contains, sInputValue)]);
					oDialog.open(sInputValue);
				});
			},

			onValueHelpSearchKey: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("MT_KEY", FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onValueHelpCloseKey: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				if (!oSelectedItem) {
					return;
				}
				this.byId("idMKey").setValue(oSelectedItem.getTitle());
			},	
			onValueHelpUsr: function (oEvent) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();
				if (!this._pValueHelpDialogUsr) {
					this._pValueHelpDialogUsr = Fragment.load({
						id: oView.getId(),
						name: "webapp.webapp.fragment.ValueHelpMUsr",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pValueHelpDialogUsr.then(function (oDialog) {
					oDialog.getBinding("items").filter([new Filter("LAST_MODIFIED_USER", FilterOperator.Contains, sInputValue)]);
					oDialog.open(sInputValue);
				});
			},

			onValueHelpSearchUsr: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("LAST_MODIFIED_USER", FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onValueHelpCloseUsr: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				if (!oSelectedItem) {
					return;
				}
				this.byId("idMUsr").setValue(oSelectedItem.getTitle());
			},
			onValueHelpCus: function (oEvent) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();
				if (!this._pValueHelpDialogCus) {
					this._pValueHelpDialogCus = Fragment.load({
						id: oView.getId(),
						name: "webapp.webapp.fragment.ValueHelpMCus",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pValueHelpDialogCus.then(function (oDialog) {
					oDialog.getBinding("items").filter([new Filter("SOLD_TO", FilterOperator.Contains, sInputValue)]);
					oDialog.open(sInputValue);
				});
			},

			onValueHelpSearchCus: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("SOLD_TO", FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onValueHelpCloseCus: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				if (!oSelectedItem) {
					return;
				}
				this.byId("idMcus").setValue(oSelectedItem.getTitle());
			},
			onValueHelpMat: function (oEvent) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();
				if (!this._pValueHelpDialogMat) {
					this._pValueHelpDialogMat = Fragment.load({
						id: oView.getId(),
						name: "webapp.webapp.fragment.ValueHelpMMat",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pValueHelpDialogMat.then(function (oDialog) {
					oDialog.getBinding("items").filter([new Filter("MATNR", FilterOperator.Contains, sInputValue)]);
					oDialog.open(sInputValue);
				});
			},

			onValueHelpSearchMat: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("MATNR", FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onValueHelpCloseMat: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				if (!oSelectedItem) {
					return;
				}
				this.byId("idMmat").setValue(oSelectedItem.getTitle());
			},
			onValueHelpMtSeg: function (oEvent) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();
				if (!this._pValueHelpDialogMtSeg) {
					this._pValueHelpDialogMtSeg = Fragment.load({
						id: oView.getId(),
						name: "webapp.webapp.fragment.ValueHelpMtSeg",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pValueHelpDialogMtSeg.then(function (oDialog) {
					oDialog.getBinding("items").filter([new Filter("MARKET_SEG", FilterOperator.Contains, sInputValue)]);
					oDialog.open(sInputValue);
				});
			},

			onValueHelpSearchMtSeg: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("MARKET_SEG", FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onValueHelpCloseMtSeg: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				if (!oSelectedItem) {
					return;
				}
				this.byId("idMtseg").setValue(oSelectedItem.getTitle());
			},
			onValueHelpMCom: function (oEvent) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();
				if (!this._pValueHelpDialogMCom) {
					this._pValueHelpDialogMCom = Fragment.load({
						id: oView.getId(),
						name: "webapp.webapp.fragment.ValueHelpMCom",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pValueHelpDialogMCom.then(function (oDialog) {
					oDialog.getBinding("items").filter([new Filter("COMMENTS", FilterOperator.Contains, sInputValue)]);
					oDialog.open(sInputValue);
				});
			},

			onValueHelpSearchCom: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("COMMENTS", FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onValueHelpCloseCom: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);
				if (!oSelectedItem) {
					return;
				}
				this.byId("idMcom").setValue(oSelectedItem.getTitle());
			},
			onValueHelpSign: function (oEvent) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = this.getView();
				if (!this._pValueHelpDialog) {
					this._pValueHelpDialog = Fragment.load({
						id: oView.getId(),
						name: "webapp.webapp.fragment.ValueHelpMSign",
						controller: this
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pValueHelpDialog.then(function (oDialog) {
					oDialog.getBinding("items").filter([new Filter("MKT_SIGN", FilterOperator.Contains, sInputValue)]);
					oDialog.open(sInputValue);
				});
			},

			onValueHelpSearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("MKT_SIGN", FilterOperator.Contains, sValue);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onValueHelpClose: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);

				if (!oSelectedItem) {
					return;
				}

				this.byId("idMSign").setValue(oSelectedItem.getTitle());
			},

			onDataExport: function () {
				var FArray = new Array();
				var oTable = this.byId("tableId1");
				var oTableModel = this.getView().getModel("tableModel");
				var aData = oTableModel.getData();
				var search = this.getView().byId("Search")._lastValue;
				var ind = this.byId("tableId1").getBinding("items").aIndices;
				if (search !== "") {
					for (var i = 0; i < ind.length; i++) {
						var j = ind[i];
						FArray.push(aData[j]);
					}
				} else {
					FArray = aData;
				}
				var aCols, oSettings, oSheet;
				aCols = this.createColumnConfig();
				oSettings = {
					workbook: {
						columns: aCols
					},
					dataSource: FArray
				};
				oSheet = new sap.ui.export.Spreadsheet(oSettings);
				oSheet._mSettings.fileName = "MT Bussiness Segment";
				oSheet.build().finally(function () {
					oSheet.destroy();
				});
			},
			createColumnConfig: function () {
				return [{
					label: "LookUp",
					property: "MT_KEY"
				}, {
					label: "Customer Sold-To (ID)",
					property: "SOLD_TO"
				}, {
					label: "Customer Sold-To (Desc)",
					property: "SOLD_TO_DESC"
				}, {
					label: "Material ID",
					property: "MATNR",
					width: 20
				}, { //hdonapar
					label: "Material Desc",
					property: "MAKTX"
				}, {
					label: "MT Biz_Seg_ID",
					property: "MT_SEG_ID"
				}, {
					label: "MT Biz_Seg_Desc",
					property: "MT_SEG_DESC"
				}, {
					label: "MT Biz_Seg_ID_SAP",
					property: "MT_SEG_ID_SAP"
				}, {
					label: "MT Biz_Seg_Desc_SAP",
					property: "MT_SEG_DESC_SAP"
				}, {
					label: "Marketing Segment",
					property: "MARKET_SEG"
				}, {
					label: "Comments",
					property: "COMMENTS"
				}, {
					label: "Mkting Signoff",
					property: "MKT_SIGN"
				}, {
					label: "Created On",
					property: "CREATED_ON"
				}, {
					label: "Last ModifiedBy",
					property: "LAST_MODIFIED_USER"
				}, {
					label: "Last Modified Time",
					property: "LAST_MODIFIED_TIMESTAMP"
				}];
			},
			onFilterCreate: function (oEvent) {
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");
				this._bDescendingSort = !this._bDescendingSort;
				var oSorter = new Sorter("CREATED_ON", this._bDescendingSort);
				binding.sort(oSorter);
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
			onFilterComments: function (oEvent) {
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");
				this._bDescendingSort = !this._bDescendingSort;
				var oSorter = new Sorter("COMMENTS", this._bDescendingSort);
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
				var oSorter = new Sorter("MT_SEG_ID_SAP", this._bDescendingSort);
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
			onFilterMTKey: function (oEvent) {
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");
				this._bDescendingSort = !this._bDescendingSort;
				var oSorter = new Sorter("MT_KEY", this._bDescendingSort);
				binding.sort(oSorter);
			},
			onPress: function (oEvent) {
				var oColumn = this.getView().byId("hideColumn");
				oColumn.setVisible(!oColumn.getVisible());
				var oColumn2 = this.getView().byId("hideColumn2");
				oColumn2.setVisible(!oColumn2.getVisible());
				var oColumn3 = this.getView().byId("hideColumn3");
				oColumn3.setVisible(!oColumn3.getVisible());
				var oColumn4 = this.getView().byId("hideColumn4");
				oColumn4.setVisible(!oColumn4.getVisible());
				var oColumn5 = this.getView().byId("hideColumn5");
				oColumn5.setVisible(!oColumn5.getVisible());
				var oColumn10 = this.getView().byId("hideColumn6");
				oColumn10.setVisible(!oColumn10.getVisible());

				var oColumn6 = this.getView().byId("showColumn");
				oColumn6.setVisible(!oColumn6.getVisible());
				var oColumn7 = this.getView().byId("showColumn1");
				oColumn7.setVisible(!oColumn7.getVisible());
				var oColumn8 = this.getView().byId("showColumn2");
				oColumn8.setVisible(!oColumn8.getVisible());
				var oColumn9 = this.getView().byId("showColumn3");
				oColumn9.setVisible(!oColumn9.getVisible());
				var oColumn12 = this.getView().byId("showColumn5");
				oColumn12.setVisible(!oColumn12.getVisible());

			},
			getRouter: function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},
			onBackInitial: function () {
				this.getRouter().navTo("RouteView2");
			},
			onSignSave: function () {
			//	var oDialogModel = this.getView().getModel("dialogModel");
			//	var oSign = oDialogModel.getData();
				var busyDialog = new sap.m.BusyDialog();
				var oTable = this.getView().byId("tableId1");
				var oTableModel = this.getView().getModel("tableModel");
				var aTableData = oTableModel.getData();
				var items = oTable.getSelectedItems();
				var that = this;
				if (items.length === 0) {
					MessageToast.show("Please Select Entries before Signoff");
					that._oDialog.close();
				} else {
					for (var i = 0; i < items.length; i++) {

						var data = items[i].getBindingContextPath();
						var len = data.length;
						var j = data.slice(1, len);

						for (var key in aTableData[j]) {
							if (typeof aTableData[j][key] === "number") {
								aTableData[j][key] = aTableData[j][key].toString();
							} else if (aTableData[j][key] === null) {
								aTableData[j][key] = "";
							}
						}

						aTableData[j].LAST_MODIFIED_USER = this.getView().getModel("oUserModel").getProperty("/userName");
						aTableData[j].LAST_MODIFIED_TIMESTAMP = this.formatDateobjToBackendDateString(new Date());
						aTableData[j].LAST_MODIFIED_TIMESTAMP = aTableData[j].LAST_MODIFIED_TIMESTAMP.slice(0, 10);
						aTableData[j].MKT_SIGN = aTableData[j].LAST_MODIFIED_USER + '-' +
						                         aTableData[j].LAST_MODIFIED_TIMESTAMP    //oSign.MKT_SIGN;
						busyDialog.open();
						$.ajax({
							url: "/xsjs_crud/CUDInitial.xsjs?cmd=insertupdate",
							method: "PUT",
							contentType: "application/json",
							data: JSON.stringify(aTableData[j]),
							success: function () {
								that.loadTableData();
								busyDialog.close();
							//	that._oDialog.close();
							}
						});
					}
				}
			},
			onSignoff: function () {
				if (!this._oDialog) {
					Fragment.load({
						id: this.getView().getId(),
						name: "webapp.webapp.fragment.AddSignoff",
						controller: this
					}).then(function (oDialog) {
						this._oDialog = oDialog;
						this.getView().addDependent(this._oDialog);
						this.getView().getModel("dialogModel").setData({});

						this._oDialog.setModel(this.getView().getModel("dialogModel"));

						this._oDialog.open();
						this.getView().byId("ip10").focus();
						this._oDialog.attachAfterClose(function () {
							this._oDialog.destroy();
							this._oDialog = null;
						}.bind(this));
					}.bind(this));
				} else {
					this._oDialog.open();
				}
			},
			onTransfer: function () {
				this.getRouter().navTo("RouteView4");
				var busyDialog = new sap.m.BusyDialog();
				var oTable = this.getView().byId("tableId1");
				var oTableModel = this.getView().getModel("tableModel");
				var aTableData = oTableModel.getData();
				var items = oTable.getSelectedItems();
				for (var i = 0; i < items.length; i++) {
					var data = items[i].getBindingContextPath();
					var len = data.length;
					var j = data.slice(1, len);
					busyDialog.open();
					$.ajax({
						url: "/xsjs_crud/CUDInitial.xsjs?cmd=insertupdatefinal",
						method: "POST",
						contentType: "application/json",
						data: JSON.stringify(aTableData[j]),
						success: function () {
							this.loadTableDataFinal();
							busyDialog.close();
						}.bind(this)
					});
				}
			},
			loadTableDataFinal: function () {

				var busyDialog = new sap.m.BusyDialog();
				var oTableModel = new JSONModel();
				busyDialog.open();
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
						oTableModel.refresh();
						busyDialog.close();
					},
					error: function () {
						MessageToast.show("An error occurred while loading the records. Please try again later.");
					}
				});
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
				var date = this.formatDateobjToBackendDateString(new Date());
				var user = this.getView().getModel("oUserModel").getProperty("/userName");
				var modif = this.formatDateobjToBackendDateString(new Date());
				var batchSize = 1000;
				const delayTime = 1000;

				/*	function delay(ms) {
						return new Promise(resolve => setTimeout(resolve, ms));
					}*/

				/*	for (var i = 0; i < finalArray.length; i += batchSize) {
						var FArray = new Array();
						var batch = finalArray.slice(i, i + batchSize);
						executeBatch(batch, date, user, modif);
					}
					// Function to execute a batch of updates
					async function executeBatch(batch, date, user, modif) {
						for (var i = 0; i < batch.length; i++) {
							var oEntry = {
								MT_KEY: batch[i].LookUp,
								SOLD_TO: batch[i]["Customer Sold-To (ID)"],
								SOLD_TO_DESC: batch[i]["Customer Sold-To (Desc)"],
								MATNR: batch[i]["Material ID"],
								MAKTX: batch[i]["Material Desc"],
								MT_SEG_ID: batch[i]["MT Biz_Seg_ID"],
								MT_SEG_DESC: batch[i]["MT Biz_Seg_Desc"],
								MARKET_SEG: batch[i]["Marketing Segment"],
								COMMENTS: batch[i].Comments,
								MKT_SIGN: batch[i]["Mkting Signoff"],
								CREATED_ON: date,
								LAST_MODIFIED_USER: user,
								LAST_MODIFIED_TIMESTAMP: modif
							};
							FArray.push(oEntry);
						$.ajax({
							url: "/xsjs_crud/CUDInitial.xsjs?cmd=insertupdate",
							method: "POST",
							contentType: "application/json",
							data: JSON.stringify(oEntry),
							success: function () {
								//	this.loadTableData();
								busyDialog.close();
							}.bind(this)
						});
						}
					}
					this.loadTableData();*/
				var FArray = new Array();
				for (var i = 0; i < finalArray.length; i++) {
					for (var key in finalArray[i]) {
						if (typeof finalArray[i][key] === "number") {
							finalArray[i][key] = finalArray[i][key].toString();
						} else if (finalArray[i][key] === null) {
							finalArray[i][key] = "";
						}
					}
					var oEntry = {
						Action: 'U',
						MT_KEY: finalArray[i]["Material ID"] + finalArray[i]["Customer Sold-To (ID)"], //finalArray[i].LookUp,
						SOLD_TO: finalArray[i]["Customer Sold-To (ID)"],
						SOLD_TO_DESC: finalArray[i]["Customer Sold-To (Desc)"],
						MATNR: finalArray[i]["Material ID"],
						MAKTX: finalArray[i]["Material Desc"],
						MT_SEG_ID: finalArray[i]["MT Biz_Seg_ID"],
						MT_SEG_DESC: finalArray[i]["MT Biz_Seg_Desc"],
						MT_SEG_ID_SAP: finalArray[i]["MT Biz_Seg_ID"],
						MT_SEG_DESC_SAP: finalArray[i]["MT Biz_Seg_Desc"],
						MARKET_SEG: finalArray[i]["Marketing Segment"],
						COMMENTS: finalArray[i].Comments,
						MKT_SIGN: finalArray[i]["Mkting Signoff"],
						CREATED_ON: this.formatDateobjToBackendDateString(new Date()).slice(0, 10),
						LAST_MODIFIED_USER: this.getView().getModel("oUserModel").getProperty("/userName"),
						LAST_MODIFIED_TIMESTAMP: this.formatDateobjToBackendDateString(new Date()).slice(0, 10)
					};
					FArray.push(oEntry);
				}
				/*	for (var j = 0; j < FArray.length; j++) {
						var numZeros = 18;
						var num = FArray[j].MATNR;
						var n = Math.abs(num);
						var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
						var zeroString = Math.pow(10, zeros).toString().substr(1);
						if (num < 0) {
							zeroString = '-' + zeroString;
						}
						num = zeroString + n;
						var datavalue = JSON.stringify(num);
						$.ajax({
							url: "/xsjs_crud/FetchMM.xsjs",
							method: "GET",
							contentType: "application/json",
							data: ({
								dataobject: datavalue
							}),
							success: function (data) {
								data = data.map(function (item) {
									return item;
								});
								FArray[j].MT_SEG_ID_SAP = data[0].MVGR4;
								FArray[j].MT_SEG_DESC_SAP = data[0].BEZEI;
							}
						})

					}*/

				oTableModel.setData(FArray);
				busyDialog.close();
			},
			onAdd: function () {
				if (!this._oDialog) {
					Fragment.load({
						id: this.getView().getId(),
						name: "webapp.webapp.fragment.AddItemDialog",
						controller: this
					}).then(function (oDialog) {
						this._oDialog = oDialog;
						this.getView().addDependent(this._oDialog);
						this.getView().getModel("dialogModel").setData({});

						this._oDialog.setModel(this.getView().getModel("dialogModel"));

						this._oDialog.open();
						this._oDialog.attachAfterClose(function () {
							this._oDialog.destroy();
							this._oDialog = null;
						}.bind(this));
					}.bind(this));
				} else {
					this._oDialog.open();
				}
			},
			onLive: function (oEvent) {
				var oTableModel = this.getView().getModel("tableModel");
				var aTableData = oTableModel.getData();
				var len = oEvent.oSource.mBindingInfos.value.binding.oContext.sPath.length;
				var i = oEvent.oSource.mBindingInfos.value.binding.oContext.sPath.slice(1, len);
				aTableData[i].Action = 'U';
			},
			onSave: function () {

				const delayTime = 1000;

				function delay(ms) {
					return new Promise(resolve => setTimeout(resolve, ms));
				}
				var oTableModel = this.getView().getModel("tableModel");
				var aTableData = oTableModel.getData();
				var busyDialog = new sap.m.BusyDialog();
				var that = this;
				busyDialog.open();
				for (var i = 0; i < aTableData.length; i++) {
					for (var key in aTableData[i]) {
						if (typeof aTableData[i][key] === "number") {
							aTableData[i][key] = aTableData[i][key].toString();
						} else if (aTableData[i][key] === null) {
							aTableData[i][key] = "";
						}
					}
					if (aTableData[i].Action === 'U') {
						var oEntry = {
							MT_KEY: aTableData[i].MT_KEY,
							SOLD_TO: aTableData[i].SOLD_TO,
							SOLD_TO_DESC: aTableData[i].SOLD_TO_DESC,
							MATNR: aTableData[i].MATNR,
							MAKTX: aTableData[i].MAKTX,
							MT_SEG_ID: aTableData[i].MT_SEG_ID,
							MT_SEG_DESC: aTableData[i].MT_SEG_DESC,
							MT_SEG_ID_SAP: aTableData[i].MT_SEG_ID_SAP,
							MT_SEG_DESC_SAP: aTableData[i].MT_SEG_DESC_SAP,
							MARKET_SEG: aTableData[i].MARKET_SEG,
							COMMENTS: aTableData[i].COMMENTS,
							MKT_SIGN: aTableData[i].MKT_SIGN,
							CREATED_ON: aTableData[i].CREATED_ON,
							LAST_MODIFIED_USER: that.getView().getModel("oUserModel").getProperty("/userName"),
							LAST_MODIFIED_TIMESTAMP: that.formatDateobjToBackendDateString(new Date()).slice(0, 10)
						};

						/*	var numZeros = 18;
							var num = oEntry.MATNR;
							var n = Math.abs(num);
							var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
							var zeroString = Math.pow(10, zeros).toString().substr(1);
							if (num < 0) {
								zeroString = '-' + zeroString;
							}
							num = zeroString + n;
							var datavalue = JSON.stringify(num);
							$.ajax({
								url: "/xsjs_crud/FetchMM.xsjs",
								method: "GET",
								contentType: "application/json",
								data: ({
									dataobject: datavalue
								}),
								success: function (data) {
									data = data.map(function (item) {
										return item;
									});
									oEntry.MT_SEG_ID_SAP = data[0].MVGR4;
									oEntry.MT_SEG_DESC_SAP = data[0].BEZEI;*/
						$.ajax({
							url: "/xsjs_crud/CUDInitial.xsjs?cmd=insertupdate",
							method: "PUT",
							contentType: "application/json",
							data: JSON.stringify(oEntry),
							success: function () {
								that.loadTableData();
								busyDialog.close();
							}
						});
						//		}
						//	})

					}
				}
			},
			onFilter: function () {
				var busyDialog = new sap.m.BusyDialog();
				busyDialog.open();
				var Msign = this.getView().byId("idMSign").mProperties.value;
				var Mkey = this.getView().byId("idMKey").mProperties.value;
				var Mcus = this.getView().byId("idMcus").mProperties.value;
				var Mmat = this.getView().byId("idMmat").mProperties.value;
				var MtSeg = this.getView().byId("idMtseg").mProperties.value;
				var Mcom = this.getView().byId("idMcom").mProperties.value;
				var Musr = this.getView().byId("idMUsr").mProperties.value;
				var oCombo = this.byId("comboBox1");
				var Mseg = oCombo.getSelectedKey();
				var lCdatef = this.getView().byId("idCdate").getDateValue(); //this.CdateFrom;
				if (lCdatef) {
					var lCdatef2 = lCdatef.toLocaleString().split(',');
					lCdatef = lCdatef2[0];
				}
				var lCdatet = this.getView().byId("idCdate").getSecondDateValue(); //this.CdateTo;
				if (lCdatet) {
					var lCdatet2 = lCdatet.toLocaleString().split(",");
					lCdatet = lCdatet2[0];
				}
				var lChdatef = this.getView().byId("idChdate").getDateValue(); //this.CdateFrom;
				if (lChdatef) {
					var lChdatef2 = lChdatef.toLocaleString().split(",");
					lChdatef = lChdatef2[0];
				}
				var lChdatet = this.getView().byId("idChdate").getSecondDateValue(); //this.CdateTo;
				if (lChdatet) {
					var lChdatet2 = lChdatet.toLocaleString().split(",");
					lChdatet = lChdatet2[0];
				}

				function date_con(date) {
					date = date.split("/");
					var lv = date[2] + "-" + date[0] + "-" + date[1];
					return lv;
				}
				if (lCdatef) {
					lCdatef = date_con(lCdatef);
				}
				if (lCdatet) {
					lCdatet = date_con(lCdatet);
				}
				if (lChdatef) {
					lChdatef = date_con(lChdatef);
				}
				if (lChdatet) {
					lChdatet = date_con(lChdatet);
				}
				//this.getView().byId("idCdate").setValueState("None")
				//this.getView().byId("idChdate").setValueState("None")
				if (lCdatef === null &&
					lCdatet === null &&
					lChdatef === null && 
					lChdatet === null && 
					(Msign === null || Msign === "") && 
					(Mseg === null || Mseg === "") && 
					Mkey === null &&
					Mcus === null &&
					Mmat === null &&
					MtSeg === null &&
					Mcom === null &&
					Musr === null) {
					this.loadTableData();
					//this.getView().byId("idCdate").setValueState("Error")
					//this.getView().byId("idChdate").setValueState("Error")
					busyDialog.close();
				} else {
					var oEntry = {
						CREATEDF: lCdatef,
						CREATEDT: lCdatet,
						CHANGEDF: lChdatef,
						CHANGEDT: lChdatet,
						MTKEY: Mkey,
						MTCUS: Mcus,
						MTMAT: Mmat,
						MTSEG: MtSeg,
						MTCOM: Mcom,
						MTUSR: Musr,
						MSIGNOFF: Msign,
						MSEGMENT: Mseg
					};
					var oTableModel = new JSONModel();
					this.getView().setModel(oTableModel, "tableModel");
					var datavalue = JSON.stringify(oEntry);
					$.ajax({
						url: "/xsjs_crud/FetchInitialFilter.xsjs",
						method: "GET",
						contentType: "application/json",
						data: ({
							dataobject: datavalue
						}),
						success: function (data) {
							data = data.map(function (item) {
								return item;
							});
							for (var i = 0; i < data.length; i++) {
								data[i].LAST_MODIFIED_TIMESTAMP = data[i].LAST_MODIFIED_TIMESTAMP.slice(0, 10);
								data[i].CREATED_ON = data[i].CREATED_ON.slice(0, 10);
							}
							oTableModel.setData(data);
							busyDialog.close();
						},
						error: function () {
							MessageToast.show("An error occurred while loading the records. Please try again later.");
						}
					});
				}
			},
			loadTableData: function () {
				var oTableModel = new JSONModel();
				var busyDialog = new sap.m.BusyDialog();
				busyDialog.open();
				var oTable = new JSONModel();
				this.getView().setModel(oTable, "oTable");
				var oSign = new JSONModel();
				this.getView().setModel(oSign, "oSign");
				var oCus = new JSONModel();
				this.getView().setModel(oCus, "oCus");
				var oMat = new JSONModel();
				this.getView().setModel(oMat, "oMat");
				var oMtSeg = new JSONModel();
				this.getView().setModel(oMtSeg, "oMtSeg");
				var oCom = new JSONModel();
				this.getView().setModel(oCom, "oCom");
				var oUsr = new JSONModel();
				this.getView().setModel(oUsr, "oUsr");
				this.getView().setModel(oTableModel, "tableModel");
				$.ajax({
					url: "/xsjs_crud/FetchInitial.xsjs",
					method: "GET",
					success: function (data) {
						data = data.map(function (item) {
							return item;
						});
						for (var i = 0; i < data.length; i++) {
							data[i].LAST_MODIFIED_TIMESTAMP = data[i].LAST_MODIFIED_TIMESTAMP.slice(0, 10);
							data[i].CREATED_ON = data[i].CREATED_ON.slice(0, 10);
						}

						oTableModel.setData(data);
						oTable.setData(data);
						var aTable = oTable.oData;
						var SignArray = new Array();
						var CusArray = new Array();
						var MatArray = new Array();
						var MtSegArray = new Array();
						var ComArray = new Array();
						var UsrArray = new Array();
						var oASign = new Array();
						var oACus = new Array();
						var oAMat = new Array();
						var oAMtSeg = new Array();
						var oACom = new Array();
						var oAUsr = new Array();
						for (var i = 0; i < aTable.length; i++) {
							if (oASign.indexOf(aTable[i].MKT_SIGN) === -1) {
								var oEntry = {
									MKT_SIGN: aTable[i].MKT_SIGN
								}
								oASign.push(aTable[i].MKT_SIGN);
								SignArray.push(oEntry);
							}
							if (oACus.indexOf(aTable[i].SOLD_TO) === -1) {
								var oEntry_cus = {
									SOLD_TO: aTable[i].SOLD_TO
								}
								oACus.push(aTable[i].SOLD_TO);
								CusArray.push(oEntry_cus);
							}
							if (oAMat.indexOf(aTable[i].MATNR) === -1) {
								var oEntry_Mat = {
									MATNR: aTable[i].MATNR
								}
								oAMat.push(aTable[i].MATNR);
								MatArray.push(oEntry_Mat);
							}
							if (oAMtSeg.indexOf(aTable[i].MARKET_SEG) === -1) {
								var oEntry_MtSeg = {
									MARKET_SEG: aTable[i].MARKET_SEG
								}
								oAMtSeg.push(aTable[i].MARKET_SEG);
								MtSegArray.push(oEntry_MtSeg);
							}
							if (oACom.indexOf(aTable[i].COMMENTS) === -1) {
								var oEntry_Com = {
									COMMENTS: aTable[i].COMMENTS
								}
								oACom.push(aTable[i].COMMENTS);
								ComArray.push(oEntry_Com);
							}
							if (oAUsr.indexOf(aTable[i].LAST_MODIFIED_USER) === -1) {
								var oEntry_Usr = {
									LAST_MODIFIED_USER: aTable[i].LAST_MODIFIED_USER
								}
								oAUsr.push(aTable[i].LAST_MODIFIED_USER);
								UsrArray.push(oEntry_Usr);
							}
						}
						oSign.setData(SignArray);
						oCus.setData(CusArray);
						oMat.setData(MatArray);
						oMtSeg.setData(MtSegArray);
						oCom.setData(ComArray);
						oUsr.setData(UsrArray);
						busyDialog.close();
					}
				});
				var oMTSeg = new JSONModel();
				this.getView().setModel(oMTSeg, "oMTSeg");
				$.ajax({
					url: "/xsjs_crud/FetchMT.xsjs",
					method: "GET",
					success: function (dataMM) {
						dataMM = dataMM.map(function (item) {
							return item;
						});
						var len = dataMM.length;
						oMTSeg.setSizeLimit(len);
						oMTSeg.setData(dataMM);
					}
				})
			},

			onCancel: function () {
				this.getView().getModel("dialogModel").setData({});
				this._oDialog.close();
			},
			onEdit: function (oEvent) {
				var oSelectedItem = oEvent.getSource().getParent().getBindingContext("tableModel");
				var oSelectedData = oSelectedItem.getObject();
				this.oOriginalItem = Object.assign({}, oSelectedData);
				this.getView().getModel("dialogModel").setData(this.oOriginalItem);
				var busyDialog = new sap.m.BusyDialog();
				var oPtions = new JSONModel();
				this.getView().setModel(oPtions, "options");
				busyDialog.open();
				var that = this;
				var numZeros = 18;
				var num = this.oOriginalItem.MATNR;
				var n = Math.abs(num);
				var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
				var zeroString = Math.pow(10, zeros).toString().substr(1);
				if (num < 0) {
					zeroString = '-' + zeroString;
				}
				num = zeroString + n;
				if (this.oOriginalItem.MT_SEG_ID === "531") {
					this.oOriginalItem.MT_SEG_ID = "53D";
				} else {
					var datavalue = JSON.stringify(num);
					var datavalue1 = JSON.stringify(that.oOriginalItem.MT_SEG_ID);
					$.ajax({
						url: "/xsjs_crud/FetchProfit.xsjs",
						method: "GET",
						contentType: "application/json",
						data: ({
							dataobject: datavalue1
						}),
						success: function (dataPro) {
							dataPro = dataPro.map(function (item) {
								return item;
							});
							var datavalue2 = JSON.stringify(dataPro[0].PROFIT);
							$.ajax({
								url: "/xsjs_crud/FetchSegCombo.xsjs",
								method: "GET",
								contentType: "application/json",
								data: ({
									dataobject: datavalue2
								}),
								success: function (dataCombo) {
									dataCombo = dataCombo.map(function (item) {
										return item;
									});
									var len = dataCombo.length;
									oPtions.setSizeLimit(len);
									/*		var idx = dataCombo.findIndex(item => item.MT_ID === "XXX");
											if (idx > 0) {
												dataCombo[idx].MT_DESC = "No Default Segment";
											}*/
									oPtions.setData(dataCombo);
								}
							});
						}

					});
					/*	if (that.oOriginalItem.SOLD_TO === "853379" && that.oOriginalItem.MATNR === "5174890") {
							that.oOriginalItem.MT_SEG_ID = "XXX";
							that.oOriginalItem.MT_SEG_ID_DESC = "No Default Segment";
						}*/
					//	that.oOriginalItem.MT_SEG_ID_SAP = data[0].MVGR4 + ' ' + data[0].BEZEI;

					if (!that._oDialog) {
						Fragment.load({
							id: that.getView().getId(),
							name: "webapp.webapp.fragment.UpdateItemDialog",
							controller: that
						}).then(function (oDialog) {
							that._oDialog = oDialog;
							that.getView().addDependent(that._oDialog);

							if (!that._oDialog.getModel()) {
								that._oDialog.setModel(that.getView().getModel("dialogModel"));
							}
							that._oDialog.open();
							that.byId("comboBox").setSelectedKey(that.oOriginalItem.MT_SEG_ID);
							that._oDialog.attachAfterClose(function () {
								that._oDialog.destroy();
								that._oDialog = null;
							}.bind(that));
						}.bind(that));
					} else {
						this._oDialog.open();
					}

					busyDialog.close();
					//		}
					//	});
				}
			},
			onUpdate: function () {
				var oTableModel = this.getView().getModel("tableModel");
				var oCombo = this.byId("comboBox");
				var oDialogModel = this.getView().getModel("dialogModel");
				var oUpdatedItem = oDialogModel.getData();
				var oKey = oCombo.getSelectedKey();
				var len = oCombo.mProperties.value.length;
				var len_desc = oUpdatedItem.MT_SEG_ID_SAP.length;
				var oText = oCombo.mProperties.value.slice(4, len);
				//	oUpdatedItem.MT_SEG_ID_SAP = oUpdatedItem.MT_SEG_ID_SAP.slice(0, 3);
				//	oUpdatedItem.MT_SEG_DESC_SAP = oUpdatedItem.MT_SEG_ID_SAP.slice(4, len_desc);
				oUpdatedItem.MT_SEG_ID = oKey;
				oUpdatedItem.MT_SEG_DESC = oText;
				if (!oUpdatedItem.MT_KEY || !oUpdatedItem.SOLD_TO || !oUpdatedItem.SOLD_TO_DESC || !oUpdatedItem.MATNR || !oUpdatedItem.MAKTX ||
					!oUpdatedItem.MT_SEG_ID || !oUpdatedItem.MT_SEG_DESC || !oUpdatedItem.MARKET_SEG) {
					MessageToast.show("Please fill in all mandatory fields!");
					return;
				}
				oUpdatedItem.LAST_MODIFIED_USER = this.getView().getModel("oUserModel").getProperty("/userName");
				oUpdatedItem.LAST_MODIFIED_TIMESTAMP = this.formatDateobjToBackendDateString(new Date());
				oUpdatedItem.LAST_MODIFIED_TIMESTAMP = oUpdatedItem.LAST_MODIFIED_TIMESTAMP.slice(0, 10);
				for (var key in oUpdatedItem) {
					if (typeof oUpdatedItem[key] === "number") {
						oUpdatedItem[key] = oUpdatedItem[key].toString();
					} else if (oUpdatedItem[key] === null) {
						oUpdatedItem[key] = "";
					}
				}
				var aTableData = oTableModel.getData();
				$.ajax({
					url: "/xsjs_crud/CUDInitial.xsjs?cmd=insertupdate",
					method: "PUT",
					contentType: "application/json",
					data: JSON.stringify(oUpdatedItem),
					success: function () {
						var nIndex = aTableData.findIndex(function (item) {
							return item.MT_KEY === oUpdatedItem.MT_KEY;
						});

						if (nIndex !== -1) {
							aTableData.splice(nIndex, 1, Object.assign({}, oUpdatedItem));
							oTableModel.setData(aTableData);
							oDialogModel.setData({});
							this._oDialog.close();
							MessageToast.show("Record Updated Successfully!");
						} else {
							MessageToast.show("Record not found for update.");
						}
					}.bind(this),
					error: function () {
						MessageToast.show("An error occurred while updating the record. Please try again later.");
					}
				});
			},

			onCancelUpdate: function () {
				this.getView().getModel("dialogModel").setData(this.oOriginalItem);
				this._oDialog.close();
			},
			onSearch: function (event) {
				var searchTerm = event.getParameter("query");
				var table = this.byId("tableId1");
				var binding = table.getBinding("items");

				if (searchTerm === "") {
					binding.filter([]);
				} else {
					var oFilterArr = new Filter([
						new Filter("MT_KEY", FilterOperator.Contains, searchTerm),
						new Filter("SOLD_TO", FilterOperator.Contains, searchTerm),
						new Filter("SOLD_TO_DESC", FilterOperator.Contains, searchTerm),
						new Filter("MATNR", FilterOperator.Contains, searchTerm),
						new Filter("MAKTX", FilterOperator.Contains, searchTerm),
						//	new Filter("MT_SEG_ID", FilterOperator.Contains, searchTerm),
						//	new Filter("MT_SEG_DESC", FilterOperator.Contains, searchTerm),
						new Filter("MARKET_SEG", FilterOperator.Contains, searchTerm),
						new Filter("COMMENTS", FilterOperator.Contains, searchTerm)
						//	new Filter("MKT_SIGN", FilterOperator.Contains, searchTerm)
					], false);
					binding.filter([oFilterArr]);
				}
			},

			onDelete: function (oEvent) {
				var busyDialog = new sap.m.BusyDialog();
				var oTable = this.getView().byId("tableId1");
				var oTableModel = this.getView().getModel("tableModel");
				var aTableData = oTableModel.getData();
				var items = oTable.getSelectedItems();
				var that = this;
				sap.m.MessageBox.confirm("Are you sure you want to delete this record?", {
					title: "Confirmation",
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							for (var i = 0; i < items.length; i++) {
								var data = items[i].getBindingContextPath();
								var len = data.length;
								var j = data.slice(1, len);
								var oEntry = aTableData[j];
								aTableData.splice(j, 1);
								oTableModel.refresh(true);
								busyDialog.open();
								if (j !== -1) {
									$.ajax({
										url: "/xsjs_crud/CUDInitial.xsjs?cmd=delete",
										method: "DELETE",
										contentType: "application/json",
										data: JSON.stringify(oEntry),
										success: function () {
											//	that.loadTableData();
											busyDialog.close();
											/*	aTableData.splice(j, 1);
												oTableModel.refresh(true);*/
											for (var s = 0; s < items.length; s++) {
												items[s].setSelected(false);
											}
											oTableModel.refresh();
										}
									});
								}
							}
						}
					}
				});
			},

			formatDateobjToBackendDateString: function (oDate) {

				if (!oDate) {

					return "";

				}

				oDate = new Date(oDate);

				var dd = oDate.getDate();

				var MM = oDate.getMonth() + 1;

				var yy = oDate.getFullYear();

				if (dd < 10) {

					dd = "0" + dd;

				}

				if (MM < 10) {

					MM = "0" + MM;

				}

				var newDate = yy + "-" + MM + "-" + dd;

				var hh = oDate.getHours();

				if (hh < 10) {

					hh = "0" + hh;

				}

				hh = hh.toString();

				var mi = oDate.getMinutes();

				if (mi < 10) {

					mi = "0" + mi;

				}

				mi = mi.toString();
				var ss = oDate.getSeconds();
				if (ss < 10) {
					ss = "0" + ss;
				}
				ss = ss.toString();
				var ms = oDate.getMilliseconds();
				if (ms < 100) {
					ms = "0" + ms;
				}
				var time = hh + ":" + mi + ":" + ss + "." + ms;
				newDate = newDate + "T" + time + "Z";
				return newDate;
			}
		});
	});