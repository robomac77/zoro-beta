﻿/// <reference path="../app.ts"/>
/// <reference path="../Entitys.ts"/>

namespace WebBrowser {
    /**
     * @class 交易记录
     */
	export class Transactions implements Page {
		app: App
		langType: string;

		close(): void {
			this.div.hidden = true;
			this.footer.hidden = true;
		}
		div: HTMLDivElement = document.getElementById("txlist-page") as HTMLDivElement;
		footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
		private pageUtil: PageUtil;
		private txlist: JQuery<HTMLElement>;


		getLangs() {
			if (this.langType != this.app.langmgr.type) {
				let page_lang = [
					"trans_title",
					"trans_txid",
					"trans_type",
					"trans_size",
					"trans_height",
				]
				page_lang.forEach(
					lang => {
						document.getElementById(lang).textContent = this.app.langmgr.get(lang)
					}
				)
				this.langType = this.app.langmgr.type
			}

		}

		constructor(app: App) {
			this.app = app

			this.txlist = $("#txlist-page");
			//监听交易列表选择框
			// $("#TxType").change(() => {
			// 	this.pageUtil.currentPage = 1;
			// 	this.updateTransactions(this.pageUtil, <string>$("#TxType").val());// <string>$("#TxType").val()
			// });

			$("#txlist-page-next").off("click").click(() => {
				if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
					this.pageUtil.currentPage = this.pageUtil.totalPage;
				} else {
					this.pageUtil.currentPage += 1;
					this.updateTransactions(this.pageUtil, "");// <string>$("#TxType").val()
				}
			});
			$("#txlist-page-previous").off("click").click(() => {
				if (this.pageUtil.currentPage <= 1) {
					this.pageUtil.currentPage = 1;
				} else {
					this.pageUtil.currentPage -= 1;
					this.updateTransactions(this.pageUtil, ""); // <string>$("#TxType").val()
				}
			});

		}

		//更新交易记录
		public async updateTransactions(pageUtil: PageUtil, txType: string) {
			this.txlist.find("#txlist-page-transactions").empty();
			//分页查询交易记录
			var appchain = locationtool.getParam2();
            if (appchain && appchain.length == 40){
				var txs: Tx[] = await WWW.getappchainrawtransactions(appchain, pageUtil.pageSize, pageUtil.currentPage);
				var txCount = await WWW.getappchaintxcount(appchain);
			}else{
				var txs: Tx[] = await WWW.getrawtransactions(pageUtil.pageSize, pageUtil.currentPage, txType);
				var txCount = await WWW.gettxcount(txType);
			}
			
			pageUtil.totalCount = txCount;

			let listLength = 0;
			if (txs.length < 15) {
				this.txlist.find(".page").hide();
				listLength = txs.length;
			} else {
				this.txlist.find(".page").show();
				listLength = pageUtil.pageSize;
			}
			for (var n = 0; n < listLength; n++) {
			
				let txid = txs[n].txid;
				let html: string = await this.getTxLine(txid, txs[n].type, txs[n].size.toString(), txs[n].blockindex.toString());
				this.txlist.find("#txlist-page-transactions").append(html);
			}

			let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize; //       
			let maxNum = pageUtil.totalCount;
			let diffNum = maxNum - minNum;
			if (diffNum > 15) {
				maxNum = pageUtil.currentPage * pageUtil.pageSize;
			}
			let pageMsg = "Transactions " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
			$("#txlist-page").find("#txlist-page-msg").html(pageMsg);
			if (pageUtil.totalPage - pageUtil.currentPage) {
				$("#txlist-page-next").removeClass('disabled');
			} else {
				$("#txlist-page-next").addClass('disabled');
			}
			if (pageUtil.currentPage - 1) {
				$("#txlist-page-previous").removeClass('disabled');
			} else {
				$("#txlist-page-previous").addClass('disabled');
			}
		}
        /**
         * async start
         */
		public async start() {
			this.getLangs()

			let type = "";
			var appchain = locationtool.getParam2();
            if (appchain && appchain.length == 40){
				var txCount = await WWW.getappchaintxcount(appchain);
			}else{
				var txCount = await WWW.gettxcount(type);
			}
			
			//初始化交易列表
			this.pageUtil = new PageUtil(txCount, 15); //0
			this.updateTransactions(this.pageUtil, type);
			this.div.hidden = false;
			this.footer.hidden = false;
		}


		async getTxLine(txid: string, type: string, size: string, index: string) // deleted string datatype for string
		{
			var id = txid.replace('0x', '');
			id = id.substring(0, 6) + '...' + id.substring(id.length - 6);
			return `<div class="line">
						<div class="line-general">
							<div class="content-nel"><span><a href="`+ Url.href_transaction(txid) + `" target="_self">` + id + `</a></span></div>
							<div class="content-nel"><span>`+ type.replace("Transaction", "") + `</span></div>
							<div class="content-nel"><span>`+ size + ` bytes</span></div>
							<div class="content-nel"><span><a href="`+ Url.href_block(parseInt(index)) + `" target="_self">` + index + `</a></span></div>
						</div>
						<a class="end" id="genbtn" style="border-left:none;"></a>
					</div>`;

			// return `
            // <div class="line">
            //     <div class="line-general">
            //         <div class="content-nel"><span><a href="`+ Url.href_transaction(txid) + `" target="_self">` + id + `</a></span></div>
            //         <div class="content-nel"><span>`+ type.replace("Transaction", "") + `</span></div>
            //         <div class="content-nel"><span>`+ size + ` bytes</span></div>
            //         <div class="content-nel"><span><a href="`+ Url.href_block(parseInt(index)) + `" target="_self">` + index + `</a></span></div>
            //     </div>
            //     <a onclick="txgeneral(this)" class="end" id="genbtn"><img src="./img/open.svg" /></a>
            //     <div class="transaction" style="width:100%;display: none;" vins='`+ JSON.stringify(vins) + `' vouts='` + JSON.stringify(vouts) + `'>
            //     </div>
            // </div>
            // `;
		}

		static async getTxgeneral(vins, vouts, div: HTMLDivElement) {
			vins = JSON.parse(vins);
			vouts = JSON.parse(vouts);
			var ajax: Ajax = new Ajax();
			let allAsset: Asset[] = await ajax.post('getallasset', []);
			allAsset.map((asset) => {
				if (asset.id == AssetEnum.NEO) {
					asset.name = [{ lang: 'en', name: 'NEO' }];
				}
				if (asset.id == AssetEnum.GAS) {
					asset.name = [{ lang: 'en', name: "GAS" }];
				}
			});

			let arr = new Array<any>();
			for (let index = 0; index < vins.length; index++) {
				const vin = vins[index];
				try {
					let txInfos: Tx[] = await ajax.post('getrawtransaction', [vin.txid]);
					// let vout = [];
					// let address: string = vout.address;
					// let value: string = vout.value;
					// let name = allAsset.find(val => val.id == vout.asset).name.map(name => { return name.name }).join("|");
					// arr.push({ vin: vin.txid, vout: vin.vout, addr: address, name: name, amount: value });
				} catch (error) {

				}
			}
			let arra = Transaction.groupByaddr(arr);
			let form = "";
			for (let index = 0; index < arra.length; index++) {
				const item = arra[index];
				let li = '';
				for (let i = 0; i < item.data.length; i++) {
					const element = item.data[i];
					li += `<li>` + element.amount + ` ` + element.name + `</li>`;
				}
				form +=
					`
                <div class="item"><div class="address"><a>`+ item.addr + `</a></div><ul class="amount">` + li + `</ul></div>
                `;
			}

			let tostr = "";
			vouts.forEach(vout => {
				let name = allAsset.find(val => val.id == vout.asset).name.map(name => name.name).join("|");
				let sign: string = "";
				if (arra.find(item => item.addr == vout.address)) {
					sign = "(change)"
				}
				tostr +=
					`
                <div class="item">
                    <div class="address"><a>`+ vout.address + `</a></div>
                    <ul class="amount"><li>`+ vout.value + ` ` + name + sign + `</li></ul>
                </div>
                `
			});

			var res = `
            <div class="formaddr" style="width:41.3%">
                `+ form + `
            </div>
            <div class="turnto"><img src="./img/turnto.svg" /></div>
            <div class="toaddr" style="width:41.3%">
                `+ tostr + `
            </div>
            <div style="width:60px;"></div>
            `
			div.innerHTML = res;
		}
	}
}