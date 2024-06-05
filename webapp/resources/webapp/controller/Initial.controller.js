sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/Fragment",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"webapp/webapp/view/jszip",
		"webapp/webapp/view/xlsx",
		"sap/ui/model/Sorter"
	],

	function (Controller, Fragment, MessageToast, JSONModel, Filter, FilterOperator, jszip, xlsx, Sorter) {
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
				for (var i = 0; i < finalArray.length; i++) {
					var oEntry = {
						MT_KEY: finalArray[i].LookUp,
						SOLD_TO: finalArray[i]["Customer Sold-To (ID)"],
						SOLD_TO_DESC: finalArray[i]["Customer Sold-To (Desc)"],
						MATNR: finalArray[i]["Material ID"],
						MAKTX: finalArray[i]["Material Desc"],
						MT_SEG_ID: finalArray[i]["MT Biz_Seg_ID"],
						MT_SEG_DESC: finalArray[i]["MT Biz_Seg_Desc"],
						MARKET_SEG: finalArray[i]["Marketing Segment"],
						COMMENTS: finalArray[i].Comments,
						MKT_SIGN: finalArray[i]["Mkting Signoff"],
						CREATED_ON: this.formatDateobjToBackendDateString(new Date()),
						LAST_MODIFIED_USER: this.getView().getModel("oUserModel").getProperty("/userName"),
						LAST_MODIFIED_TIMESTAMP: this.formatDateobjToBackendDateString(new Date())
					};

					$.ajax({
						url: "/xsjs_crud/CUDInitial.xsjs?cmd=insertupdate",
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

			onSave: function () {
				// var oTableModel = this.getView().getModel("tableModel");
				var oDialogModel = this.getView().getModel("dialogModel");
				var oNewItem = oDialogModel.getData();

				if (!oNewItem.MT_KEY || !oNewItem.SOLD_TO || !oNewItem.SOLD_TO_DESC || !oNewItem.MATNR || !oNewItem.MAKTX || !oNewItem.MT_SEG_ID ||
					!oNewItem.MT_SEG_DESC || !oNewItem.MARKET_SEG) {
					MessageToast.show("Please fill in all mandatory fields!");
					return;
				}
				oNewItem.LAST_MODIFIED_USER = this.getView().getModel("oUserModel").getProperty("/userName");
				oNewItem.LAST_MODIFIED_TIMESTAMP = this.formatDateobjToBackendDateString(new Date());
				for (var key in oNewItem) {
					if (oNewItem[key] !== null && typeof oNewItem[key] === "number") {
						oNewItem[key] = oNewItem[key].toString();
					} else if (oNewItem[key] === null) {
						oNewItem[key] = "";
					}
				}
				$.ajax({
					url: "/xsjs_crud/CUDInitial.xsjs?cmd=insertupdate",
					method: "POST",
					contentType: "application/json",
					data: JSON.stringify(oNewItem),
					success: function () {
						this.loadTableData();
						oDialogModel.setData({});
						this._oDialog.close();
						MessageToast.show("Record Added Successfully!");
					}.bind(this),
					error: function () {
						MessageToast.show("An error occurred while adding the record. Please try again later.");
					}
				});
			},
			onFilter: function () {
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
				this.getView().byId("idCdate").setValue('');
				this.getView().byId("idChdate").setValue('');
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
				if (lCdatef === null &&
					lCdatet === null &&
					lChdatef === null && lChdatet === null) {
					this.loadTableData();
				} else {
					var oEntry = {
						CREATEDF: lCdatef,
						CREATEDT: lCdatet,
						CHANGEDF: lChdatef,
						CHANGEDT: lChdatet
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
							oTableModel.setData(data);
						},
						error: function () {
							MessageToast.show("An error occurred while loading the records. Please try again later.");
						}
					});
				}
			},
			loadTableData: function () {
				var oTableModel = new JSONModel();
				var oPtions = new JSONModel();
				var busyDialog = new sap.m.BusyDialog();
				busyDialog.open();
				this.getView().setModel(oTableModel, "tableModel");
				this.getView().setModel(oPtions, "options");
				$.ajax({
					url: "/xsjs_crud/FetchInitial.xsjs",
					method: "GET",
					success: function (data) {
						data = data.map(function (item) {
							return item;
						});
						$.ajax({
							url: "/xsjs_crud/FetchMM.xsjs",
							method: "GET",
							success: function (dataMM) {
								dataMM = dataMM.map(function (item) {
									return item;
								});
								for (var i = 0; i < data.length; i++) {
									data[i].LAST_MODIFIED_TIMESTAMP = data[i].LAST_MODIFIED_TIMESTAMP.slice(0,10);
									data[i].CREATED_ON = data[i].CREATED_ON.slice(0,10);
									
									var numZeros = 18;
									var num = data[i].MATNR;
									var n = Math.abs(num);
									var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
									var zeroString = Math.pow(10, zeros).toString().substr(1);
									if (num < 0) {
										zeroString = '-' + zeroString;
									}
									num = zeroString + n;
									var j = dataMM.findIndex(item => item.MATNR === num);
									if (num === dataMM[j].MATNR) {
										data[i].MT_SEG_ID_SAP = dataMM[j].MVGR4;
										data[i].MT_SEG_DESC_SAP = dataMM[j].BEZEI;
									}
								}
								oTableModel.setData(data);
								busyDialog.close();
							}
						});
					},
					error: function () {
						MessageToast.show("An error occurred while loading the records. Please try again later.");
					}
				});

				$.ajax({
					url: "/xsjs_crud/FetchCombo.xsjs",
					method: "GET",
					success: function (dataC) {
						dataC = dataC.map(function (item) {
							return item;
						});
							var len = dataC.length;
							oPtions.setSizeLimit(len);
							oPtions.setData(dataC);
					}
				});
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

				if (!this._oDialog) {
					Fragment.load({
						id: this.getView().getId(),
						name: "webapp.webapp.fragment.UpdateItemDialog",
						controller: this
					}).then(function (oDialog) {
						this._oDialog = oDialog;
						this.getView().addDependent(this._oDialog);

						if (!this._oDialog.getModel()) {
							this._oDialog.setModel(this.getView().getModel("dialogModel"));
						}

						this._oDialog.open();
						this.byId("comboBox").setSelectedKey(this.oOriginalItem.MT_SEG_ID);
						this._oDialog.attachAfterClose(function () {
							this._oDialog.destroy();
							this._oDialog = null;
						}.bind(this));
					}.bind(this));
				} else {
					this._oDialog.open();
				}
			},
			onUpdate: function () {
				var oTableModel = this.getView().getModel("tableModel");
				var oCombo = this.byId("comboBox");
				var oDialogModel = this.getView().getModel("dialogModel");
				var oUpdatedItem = oDialogModel.getData();
				var oKey = oCombo.getSelectedKey();
				var len = oCombo.mProperties.value.length;
				var oText = oCombo.mProperties.value.slice(5,len);
				oUpdatedItem.MT_SEG_ID = oKey;
				oUpdatedItem.MT_SEG_DESC = oText;
				if (!oUpdatedItem.MT_KEY || !oUpdatedItem.SOLD_TO || !oUpdatedItem.SOLD_TO_DESC || !oUpdatedItem.MATNR || !oUpdatedItem.MAKTX ||
					!oUpdatedItem.MT_SEG_ID || !oUpdatedItem.MT_SEG_DESC || !oUpdatedItem.MARKET_SEG) {
					MessageToast.show("Please fill in all mandatory fields!");
					return;
				}
				oUpdatedItem.LAST_MODIFIED_USER = this.getView().getModel("oUserModel").getProperty("/userName");
				oUpdatedItem.LAST_MODIFIED_TIMESTAMP = this.formatDateobjToBackendDateString(new Date());
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
						new Filter("MT_SEG_ID", FilterOperator.Contains, searchTerm),
						new Filter("MT_SEG_DESC", FilterOperator.Contains, searchTerm),
						new Filter("MARKET_SEG", FilterOperator.Contains, searchTerm)
					], false);
					binding.filter([oFilterArr]);
					this.getView().byId("Search").setValue('');
				}
			},

			onDelete: function (oEvent) {
				var busyDialog = new sap.m.BusyDialog();
				var oTable = this.getView().byId("tableId1");
				var oTableModel = this.getView().getModel("tableModel");
				var aTableData = oTableModel.getData();
				var items = oTable.getSelectedItems();
				sap.m.MessageBox.confirm("Are you sure you want to delete this record?", {
					title: "Confirmation",
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							for (var i = 0; i < items.length; i++) {
								var data = items[i].getBindingContextPath();
								var len = data.length;
								var j = data.slice(1, len);
								busyDialog.open();
								if (j !== -1) {
									aTableData.splice(j, 1);
									oTableModel.refresh(true);
									$.ajax({
										url: "/xsjs_crud/CUDInitial.xsjs?cmd=delete",
										method: "DELETE",
										contentType: "application/json",
										data: JSON.stringify(aTableData[j]),
										success: function () {
											for (var s = 0; s < items.length; s++) {
												items[s].setSelected(false);
												oTableModel.refresh();
											}
											busyDialog.close();
											MessageToast.show("Record Deleted Successfully!");
										},
										error: function () {
											MessageToast.show("An error occurred while deleting the record. Please try again later.");
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