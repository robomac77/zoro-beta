namespace WebBrowser {

    /**
     * @class 交易详情
     */
	export class ACTransaction implements Page {
		app: App
		langType: string;
		constructor(app: App) {
			this.app = app
		}

		getLangs() {
			if (this.langType != this.app.langmgr.type) {
				let page_lang = [
					"actran_title",
					"actran_title_1",
					"actran_txid",
					"actran_type",
					"actran_netfee",
					"actran_sysfee",
					"actran_size",
					"actran_height",
					"actran_time",
					"actran_input",
					"actran_output",

					"actran_nep5",
					"actran_nep5_asset",
					"actran_nep5_from",
					"actran_nep5_to",
					"actran_nep5_value",

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
		div: HTMLDivElement = document.getElementById("actransaction-info") as HTMLDivElement;
		footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;

		public ac:string = locationtool.getParam2();

		start() {
			this.getLangs()

			//this.div.innerHTML = pages.transaction;
			this.updateTxInfo(this.ac,locationtool.getParam3());
			
			let href = locationtool.getUrl() + "/asset";
			let html = '<a href="' + href + '" target="_self">&lt&lt&lt' + this.app.langmgr.get("actran_goalltran") + '</a>';

			$("#acgoalltrans").empty();
			$("#acgoalltrans").append(html);
			this.div.hidden = false;
			this.footer.hidden = false;
		}
		public async updateTxInfo(ac: string, txid: string) {
			let t = await WWW.getappchainrawtransaction(ac, txid);
			let txInfo: Tx = await WWW.getappchainrawtransaction(ac ,txid);
			$("#actype").text(txInfo.type.replace("Transaction", "")); //txInfo.type.replace("Transaction", "")
			$("#actxid").text(txInfo.txid); //txInfo.txid
			$("#acblockindex").empty();
			$("#acblockindex").append("<a href='" + Url.href_acblock(txInfo.blockindex) + "'>" + txInfo.blockindex + "</a>"); //txInfo.blockindex
			$("#actxsize").text(txInfo.size  + " bytes"); //txInfo.size 
			$("#acsysfee").text(txInfo["sys_fee"] + " gas"); //txInfo["sys_fee"] + " gas"
			$("#acnetfee").text(txInfo["net_fee"] + " gas"); //txInfo["net_fee"] + " gas"
			//let ajax: Ajax = new Ajax();
			
			let blocks: Block[] = await WWW.getacblock(ac,txInfo.blockindex); //let blocks: Block[] = await ajax.post('getblock', [txInfo.blockindex]);
			let block: Block = blocks[0];
			let time = DateTool.getTime(block.time);

			$("#actransaction-time").text(time);
			//let allAsset: Asset[] = await WWW.api_getAllAssets();
			// txInfo.vin = JSON.parse(txInfo.vin.toString());
			let arr = new Array<any>();
			// for (let index = 0; index < txInfo.vin.length; index++) {
			// 	const vin = txInfo.vin[index];
			// 	try {
			// 		let txInfo: Tx = await WWW.getappchainrawtransaction(ac,vin.txid);
			// 		let vout = txInfo.vout[vin.vout]
			// 		let address: string = vout.address;
			// 		let value: string = vout.value;
			// 		let name = CoinTool.assetID2name[vout.asset];
			// 		arr.push({ vin: vin.txid, vout: vin.vout, addr: address, name: name, amount: value });
			// 	} catch (error) {

			// 	}
			// }
			$("#acfrom").empty();
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
				$("#acfrom").append(html);
			}
			$("#acto").empty();
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
			// 	$("#acto").append(html);
			// });

			$("#actxidnep5").empty();
			let txidNep = await WWW.api_getnep5transferbytxid(txid);
			//console.log(txidNep);
			if (txidNep) {
				$(".actxidnep-warp").show();
				txidNep.forEach((item) => {
					this.loadTxidNep5View(item.asset, item.from, item.to, item.value);
				})
			} else {
				$(".actxidnep-warp").hide();
			}
		}

		async loadTxidNep5View(asset: string, from: string, to: string, value: number) {
			let href = Url.href_nep5(asset);
			let nep5Name = await WWW.api_getnep5(asset);
			let html = `
                    <tr>
                    <td> <a href="`+ href + `" target="_self">` + nep5Name[0].name + `</a></td>
                    <td>` + from + `</td>
                    <td>` + to + `</td>
                    <td>` + value + `</td>
                    </tr>`
			$("#actxidnep5").append(html);
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
