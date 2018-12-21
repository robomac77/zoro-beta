/// <reference path="../tools/wwwtool.ts" />
/// <reference path="../tools/cointool.ts" />
/// <reference path="../tools/timetool.ts" />
namespace WebBrowser {
	export class Address implements Page {
		app: App
		langType: string;

		constructor(app: App) {
			this.app = app
		}

		getLangs() {
			if (this.langType != this.app.langmgr.type) {
				let page_lang = [
					"addr_title",
					"addr_ctm",
					"addr_tran",

					"addr_title2",
					"addr_title3",
					"addr_txid",
					"addr_type",
					"addr_time",

					// "addr_utxo_asset",
					// "addr_utxo_number",
					// "addr_utxo_txid",
				]
				page_lang.forEach(
					lang => {
						document.getElementById(lang).textContent = this.app.langmgr.get(lang)
					}
				)
				this.langType = this.app.langmgr.type
			}

		}

		close(): void {
			this.div.hidden = true;
			this.footer.hidden = true;
		}
		div: HTMLDivElement = document.getElementById("address-info") as HTMLDivElement;
		footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
		private pageUtil: PageUtil;
		private pageUtilUtxo: PageUtil;
		async start() {
			this.getLangs()

			var appchain = locationtool.getParam2();
            if (appchain && appchain.length == 40){
				var address = locationtool.getParam3();
				var href = locationtool.getUrl() + "/addresses/" + appchain;
				var addrMsg = await WWW.api_getappchainaddrMsg(appchain, address);
				var utxos = await WWW.api_getappchainUTXOCount(appchain, address);
				var balances = await WWW.api_getappchainbalances(appchain, address);
			}else{
				var address = locationtool.getParam();
				var href = locationtool.getUrl() + "/addresses";
				var addrMsg = await WWW.api_getaddrMsg(address);
				var utxos = await WWW.api_getUTXOCount(address);
				var balances = await WWW.api_getbalances(address);
			}
			
			let html = '<a href="' + href + '" target="_self">&lt&lt&lt' + this.app.langmgr.get("addr_goalladress") + '</a>';
			$("#goalladress").empty();
			$("#goalladress").append(html);
			
			if (addrMsg) {
				this.loadAddressInfo(address, addrMsg);
				this.pageUtil = new PageUtil(addrMsg[0].txcount, 10);
				this.initTranPage(addrMsg[0].txcount, address);
				this.updateAddrTrasctions(address, this.pageUtil);
			} else {
				$("#address").text("-");
				$("#created").text("-");
				$("#totalTran").text("-");
				let html = '<div class="line" style="text-align:center;padding:16px;font-size:16px;">' + this.app.langmgr.get('no_data') + '</div>';

				$("#addr-trans").append(html);
			}

			this.loadView(balances);

			// if (utxos) {
			// 	this.pageUtilUtxo = new PageUtil(utxos.length, 10);
			// 	this.initUTXOPage(utxos.length, address);
			// 	this.updateAddrUTXO(address, this.pageUtilUtxo)
			// } else {
			// 	let html = '<tr><td colspan="3" >' + this.app.langmgr.get('no_data') + '</td></tr>';

			// 	$("#add-utxos").append(html);
			// }
			//this.loadUTXOView(utxos);


			this.div.hidden = false;
			this.footer.hidden = false;
		}

		//AddressInfo视图
		loadAddressInfo(address: string, addrMsg: AddressMsg[]) {
			let createdTime = DateTool.getTime(addrMsg[0].firstDate);

			let totalTran = addrMsg[0].txcount;
			$("#address").text(address);
			$("#created").text(createdTime);
			$("#totalTran").text(totalTran);

		}

		loadView(balances: Balance[]) {
			$("#balance").empty();
			if (balances) {
				balances.forEach((balance: Balance) => {
					if (balance.name.indexOf("{") >= 0){
						var json = JSON.parse(balance.name);		
						for (let i = 0; i < json.length; i++){
							if (this.langType == "cn" && json[i].lang == "zh-CN"){
								balance.name = json[i].name;
								break;
							}
							else if (json[i].lang == this.langType){
								balance.name = json[i].name;
								break;
							}
						};												
					}					
					
					let html = `
                <div class="line" > <div class="title-nel" > <span>` + balance.name + ` </span></div >
                <div class="content-nel" > <span> ` + balance.balance + ` </span></div > </div>`;
					$("#balance").append(html);
				});
			}
			
			if (!balances) {
				let html = '<div class="line"><div class="title-nel" style="width:100%;text-align:center;display: block;line-height: 56px;"><span>' + this.app.langmgr.get('no_data') + '</span></div> </div>';

				$("#balance").append(html);
			}
		}
		loadUTXOView(utxos: Utxo[]) {
			$("#add-utxos").empty();
			if (utxos) {
				utxos.forEach((utxo: Utxo) => {
					let html = `
                <tr>
                <td class='code'>` + CoinTool.assetID2name[utxo.asset] + `
                </td>
                <td>` + utxo.value + `
                </td>
                <td><a class='code' target='_self' href='`+ Url.href_transaction(utxo.txid) + `'>` + utxo.txid + `
                </a>[` + utxo.n + `]</td>
                </tr>`
					$("#add-utxos").append(html);
				});
			}
		}

		initTranPage(transtotal: number, address: string) {
			if (transtotal > 10) {
				$("#trans-page-msg").show();
				$("#addr-trans-page").show();
			} else {
				$("#trans-page-msg").hide();
				$("#addr-trans-page").hide();
			}

			$("#trans-next").off("click").click(() => {
				if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
					this.pageUtil.currentPage = this.pageUtil.totalPage;
					$('#errMsg').modal('show');
				} else {
					this.pageUtil.currentPage += 1;
					this.updateAddrTrasctions(address, this.pageUtil);
				}
			});
			$("#trans-previous").off("click").click(() => {
				if (this.pageUtil.currentPage <= 1) {
					this.pageUtil.currentPage = 1;
				} else {
					this.pageUtil.currentPage -= 1;
					this.updateAddrTrasctions(address, this.pageUtil);
				}
			});
		}
		initUTXOPage(utxototal: number, address: string) {
			if (utxototal > 10) {
				$("#utxo-page-msg").show();
				$("#addr-utxo-page").show();
			} else {
				$("#utxo-page-msg").hide();
				$("#addr-utxo-page").hide();
			}

			$("#utxo-next").off("click").click(() => {
				if (this.pageUtilUtxo.currentPage == this.pageUtilUtxo.totalPage) {
					this.pageUtil.currentPage = this.pageUtil.totalPage;
				} else {
					this.pageUtilUtxo.currentPage += 1;
					this.updateAddrUTXO(address, this.pageUtilUtxo)
				}
			});
			$("#utxo-previous").off("click").click(() => {
				if (this.pageUtilUtxo.currentPage <= 1) {
					this.pageUtil.currentPage = 1;
				} else {
					this.pageUtilUtxo.currentPage -= 1;
					this.updateAddrUTXO(address, this.pageUtilUtxo)
				}
			});
		}

		//更新交易记录
		public async updateAddrTrasctions(address: string, pageUtil: PageUtil) {
			$("#addr-trans").empty();
			//分页查询交易记录
			var appchain = locationtool.getParam2();
            if (appchain && appchain.length == 40){
				var txlist: TransOfAddress[] = await WWW.getappchainaddresstxs(appchain, address, pageUtil.pageSize, pageUtil.currentPage - 1);
			}else{
				var txlist: TransOfAddress[] = await WWW.getaddresstxs(address, pageUtil.pageSize, pageUtil.currentPage - 1);
			}
			let listLength = 0;
			if (txlist) {
				if (txlist.length < 10) {
					listLength = txlist.length;
				} else {
					listLength = pageUtil.pageSize;
				}
				for (var n = 0; n < listLength; n++) {
					let txid = txlist[n].txid;
					let time = DateTool.getTime(txlist[n].blocktime);

					let html: string = await this.getAddrTransLine(txid, txlist[n].blockindex.toString(), time);
					$("#addr-trans").append(html);
				}
			} else {
				let html = '<div class="line"><div class="title-nel" style="width:100%;text-align:center;display: block;line-height: 56px;"><span>' + this.app.langmgr.get('no_data') + '</span></div></div>';
				$("#addr-trans").append(html);
			}

			let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
			let maxNum = pageUtil.totalCount;
			let diffNum = maxNum - minNum;
			if (diffNum > 10) {
				maxNum = pageUtil.currentPage * pageUtil.pageSize;
			}
			let pageMsg = "Transactions " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
			$("#trans-page-msg").html(pageMsg);
			if (pageUtil.totalPage - pageUtil.currentPage) {
				$("#trans-next").removeClass('disabled');
			} else {
				$("#trans-next").addClass('disabled');
			}
			if (pageUtil.currentPage - 1) {
				$("#trans-previous").removeClass('disabled');
			} else {
				$("#trans-previous").addClass('disabled');
			}
		}

		//更新UTXO记录
		public async updateAddrUTXO(address: string, pageUtil: PageUtil) {
			$("#add-utxos").empty();
			//分页查询交易记录
			var appchain = locationtool.getParam2();
            if (appchain && appchain.length == 40){
				var utxolist: Utxo[] = await WWW.api_getappchainUTXO(appchain, address, pageUtil.pageSize, pageUtil.currentPage);
			}else{
				var utxolist: Utxo[] = await WWW.api_getUTXO(address, pageUtil.pageSize, pageUtil.currentPage);
			}
			let listLength = 0;
			if (utxolist) {
				if (utxolist.length < 10) {
					listLength = utxolist.length;
				} else {
					listLength = pageUtil.pageSize;
				}
				this.loadUTXOView(utxolist);
			}

			let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
			let maxNum = pageUtil.totalCount;
			let diffNum = maxNum - minNum;
			if (diffNum > 10) {
				maxNum = pageUtil.currentPage * pageUtil.pageSize;
			}
			let pageMsg = "UTXO " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
			$("#utxo-page-msg").html(pageMsg);
			if (pageUtil.totalPage - pageUtil.currentPage) {
				$("#utxo-next").removeClass('disabled');
			} else {
				$("#utxo-next").addClass('disabled');
			}
			if (pageUtil.currentPage - 1) {
				$("#utxo-previous").removeClass('disabled');
			} else {
				$("#utxo-previous").addClass('disabled');
			}
		}

		async getAddrTransLine(txid: string, blockindex: string, time: string) {
			var id = txid.replace('0x', '');
			id = id.substring(0, 6) + '...' + id.substring(id.length - 6);
			return `
            <div class="line">
                <div class="line-general">
                    <div class="content-nel"><span><a href="`+ Url.href_transaction(txid) + `" target="_self">` + id + `</a></span></div>
                    <div class="content-nel"><span>`+ blockindex + `</span></div>
                    <div class="content-nel"><span>`+ time + `</a></span></div>
                </div>
            </div>
            `;
		}		
	}
}