namespace WebBrowser {

    /**
     * @class 交易详情
     */
	export class Transaction implements Page {
		app: App
		langType: string;
		constructor(app: App) {
			this.app = app
		}

		getLangs() {
			if (this.langType != this.app.langmgr.type) {
				let page_lang = [
					"tran_title",
					"tran_title_1",
					"tran_txid",
					"tran_type",
					"tran_netfee",
					"tran_sysfee",
					"tran_size",
					"tran_height",
					"tran_time",
					"tran_input",
					"tran_output",

					"tran_nep5",
					"tran_nep5_asset",
					"tran_nep5_from",
					"tran_nep5_to",
					"tran_nep5_value",

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
		div: HTMLDivElement = document.getElementById("transaction-info") as HTMLDivElement;
		footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;

		start() {
			this.getLangs()

			//this.div.innerHTML = pages.transaction;
			var appchain = locationtool.getParam2();
            if (appchain && appchain.length == 40){
				this.updateTxInfo(locationtool.getParam3()); 
				var href = locationtool.getUrl() + "/transactions/" + appchain;
			}else{
				this.updateTxInfo(locationtool.getParam());
				var href = locationtool.getUrl() + "/transactions"; 
			}
			
			let html = '<a href="' + href + '" target="_self">&lt&lt&lt' + this.app.langmgr.get("tran_goalltran") + '</a>'; 

			$("#goalltrans").empty();
			$("#goalltrans").append(html);
			this.div.hidden = false;
			this.footer.hidden = false;
		}
		public async updateTxInfo(txid: string) {
			var appchain = locationtool.getParam2();
            if (appchain && appchain.length == 40){
				var txInfo: Tx = await WWW.getappchainrawtransaction(appchain, txid);
			}else{
				var txInfo: Tx = await WWW.getrawtransaction(txid);
			}
			$("#type").text(txInfo.type.replace("Transaction", ""));
			$("#txid").text(txInfo.txid);
			$("#blockindex").empty();
			$("#blockindex").append("<a href='" + Url.href_block(txInfo.blockindex) + "'>" + txInfo.blockindex + "</a>");
			$("#txsize").text(txInfo.size + " bytes");
			$("#sysfee").text(txInfo["sys_fee"] + " gas");
			$("#netfee").text(txInfo["net_fee"] + " gas");
			let ajax: Ajax = new Ajax();
			
			let blocks: Block[] = await WWW.getblock(txInfo.blockindex); //let blocks: Block[] = await ajax.post('getblock', [txInfo.blockindex]); 
			let block: Block = blocks[0];
			let time = DateTool.getTime(block.time); 

			$("#transaction-time").text(time);
			//txInfo.vin = JSON.parse(txInfo.vin.toString());
			//let allAsset: Asset[] = await WWW.api_getAllAssets();

			let arr = new Array<any>();
			// for (let index = 0; index < txInfo.vin.length; index++) {
			// 	const vin = txInfo.vin[index];
			// 	try {
			// 		let txInfo: Tx = await WWW.getrawtransaction(vin.txid);
			// 		let vout = txInfo.vout[vin.vout]
			// 		let address: string = vout.address;
			// 		let value: string = vout.value;
			// 		let name = CoinTool.assetID2name[vout.asset];
			// 		arr.push({ vin: vin.txid, vout: vin.vout, addr: address, name: name, amount: value }); //  fro
			// 	} catch (error) {

			// 	}
			// }
			$("#from").empty();
			let array = Transaction.groupByaddr(arr);
			for (let index = 0; index < array.length; index++) {
				const item = array[index];
				let html = "";

				html += '<div class="line" > <div class="title-nel" > <span>Address </span></div >';
				html += '<div class="content-nel" > <span id="size" >' + item.addr + ' </span></div > </div>';
				for (let i = 0; i < item.data.length; i++) {
					const element = item.data[i];
					html += '<div class="line" > <div class="title-nel" > <span>' + element.name + ' </span></div >';
					html += '<div class="content-nel" > <span id="size" >' + element.amount + ' </span></div > </div>';
				}
				$("#from").append(html);
			}
			$("#to").empty();
			// txInfo.vout = JSON.parse(txInfo.vout.toString());
			// txInfo.vout.forEach(vout => {
			// 	let name = CoinTool.assetID2name[vout.asset];
			// 	let sign: string = "";
			// 	if (array.find(item => item.addr == vout.address)) {
			// 		sign = "(change)"
			// 	}
			// 	let html = "";
			// 	html += '<div class="line" > <div class="title-nel" > <span>Address </span></div >';
			// 	html += '<div class="content-nel" > <span id="size" >' + vout.address + ' </span></div > </div>';
			// 	html += '<div class="line" > <div class="title-nel" > <span>' + name + ' </span></div >';
			// 	html += '<div class="content-nel" > <span id="size" >' + vout.value + sign + ' </span></div > </div>';
			// 	$("#to").append(html);
			// });

			$("#txidnep5").empty();
			var appchain = locationtool.getParam2();
            if (appchain && appchain.length == 40){
				var txidNep = await WWW.api_getappchainnep5transferbytxid(appchain, txid);
			}else{
				var txidNep = await WWW.api_getnep5transferbytxid(txid);
			}
			//console.log(txidNep);
			if (txidNep) {
				$(".txidnep-warp").show();
				txidNep.forEach((item) => {
					this.loadTxidNep5View(item.asset, item.from, item.to, item.value);
				})
			} else {
				$(".txidnep-warp").hide();
			}
		}

		async loadTxidNep5View(asset: string, from: string, to: string, value: number) {
			let href = Url.href_nep5(asset);
			//let nep5Name = await WWW.api_getnep5(asset); 
			let html = `
                    <tr>
                    <td> <a href="`+ href + `" target="_self">` + asset + `</a></td>
                    <td>` + from + `</td>
                    <td>` + to + `</td>
                    <td>` + value + `</td>
                    </tr>`
			$("#txidnep5").append(html);
		}

		public static groupByaddr(arr: any[]) {
			var map = {},
				dest = [];
			for (var i = 0; i < arr.length; i++) {
				var ai = arr[i];
				if (!map[ai.addr]) {
					dest.push({
						addr: ai.addr,
						data: [ai]
					});
					map[ai.addr] = ai;
				} else {
					for (var j = 0; j < dest.length; j++) {
						var dj = dest[j];
						if (dj.addr == ai.addr) {
							dj.data.push(ai);
							break;
						}
					}
				}
			}
			return dest;
		}

	}

}
