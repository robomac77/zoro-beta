namespace WebBrowser {
	export class AssetInfo implements Page {
		app: App
		langType: string;

		private assetlist: JQuery<HTMLElement>;
		private appchains: Appchain[];
		private nep5s: nep5Asset[];
		private assetType: string;
		constructor(app: App) {
			this.app = app			
		}

		getLangs() {
			if (this.langType != this.app.langmgr.type) {
				let page_lang = [
					"asset_title",
					"asset_id",
					"asset_asset",
					"asset_type",
					"asset_ava",
					"asset_pre",
					"asset_adm",

					"ac_summary",
                    "ac_lastblock", "ac_allblock",
                    "ac_totaltrans", "ac_alltxlist",
                    "ac_walletcreate", "ac_alladdress",
                    
                    "ac_assets_title","ac_nep5assets_val","ac_nep5assets_asset",
                    "ac_nep5assets_ava","ac_nep5assets_pre","ac_nep5assets_id",

					"ac_last10",
					"ac_appchain",
					"ac_last10_height",
					"ac_last10_size",
					"ac_last10_ctm",
					"ac_last10_txcount",
					"ac_viewblocks",
					"ac_last10t",
					"ac_last10t_txid",
					"ac_last10t_type",
					"ac_last10t_height",
					"ac_last10t_size",
					"ac_viewtxlist",
					"ac_chaindata",
				]
				page_lang.forEach(
					lang => {
						document.getElementById(lang).textContent = this.app.langmgr.get(lang)
					}
				)

				this.langType = this.app.langmgr.type
			}

		}

		viewtxlist: HTMLAnchorElement = document.getElementById( "ac_viewtxlist" ) as HTMLAnchorElement;
		viewblocks: HTMLAnchorElement = document.getElementById("ac_viewblocks") as HTMLAnchorElement;

		acblockssection: HTMLDivElement = document.getElementById("assets-balance-list") as HTMLDivElement;
		actranssection: HTMLDivElement = document.getElementById("assets-trans-list") as HTMLDivElement;

		div: HTMLDivElement = document.getElementById("asset-info") as HTMLDivElement;
		footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;

		acalladdress: HTMLAnchorElement = document.getElementById("ac_alladdress") as HTMLAnchorElement;
		acallblock: HTMLAnchorElement = document.getElementById("ac_allblock") as HTMLAnchorElement;
        acalltxlist: HTMLAnchorElement = document.getElementById("ac_alltxlist") as HTMLAnchorElement;

		name: HTMLSpanElement;
		type: HTMLSpanElement;
		id: HTMLSpanElement;
		available: HTMLSpanElement;
		precision: HTMLSpanElement;
		admin: HTMLSpanElement;
		//rankPageUtil: PageUtil;
		pageUtil: PageUtil;
		transpageUtil: PageUtil;

		public actxcount: number = 0;
		public acblockcount: number = 0;
		public acaddcount: number = 0;
		public txx: Tx[];

		public ac :string  = null;
		async start() {			
			
			this.assetlist = $("#asset-page");

			this.acalladdress.href = Url.href_addresses();// document.getElementById("i_acalladdress") as HTMLAnchorElement;  // 
			this.acallblock.href = Url.href_blocks(); // addeventlistener // this.acblockssection
			this.acalltxlist.href = Url.href_transactions(); // location.getUrl()   //  window.location.href()          
			
			
			this.ac = locationtool.getParam();
			var ap = this.ac
			ap = locationtool.getParam();
			ap = ap.replace('0x', '');
			let href = locationtool.getUrl() + "/assets";
			let html = '<a href="' + href + '" target="_self">&lt&lt&lt' + this.app.langmgr.get('asset_goallasset') + '</a>';


			$("#goallasset").empty();
			$("#goallasset").append(html);


			this.loadAssetInfoView(ap);

			this.acblockcount = await WWW.api_getappchainHeight(ap) as number;
			this.actxcount = await WWW.getappchaintxcount(ap) as number;
			this.acaddcount = await WWW.api_getAppchainAddrcount(ap) as number;

			$("#ac_blockHeight").text(this.acblockcount); //$("#blockHeight").text(NumberTool.toThousands(this.acblockcount)); 

			$("#ac_txcount").text(this.actxcount);//$("#txcount").text(NumberTool.toThousands(this.actxcount)); // 

			$("#ac_addrCount").text(this.acaddcount); //$("#addrCount").text(NumberTool.toThousands(this.acaddcount));

			//分页查询区块数据
			let blocks: Block[] = await WWW.getappchainblocksdesc( ap, 10, 0 );
			this.getTenBlock(blocks);
			//分页查询交易记录
			let txs: Tx[] = await WWW.getappchainrawtransactionsdesc(ap, 10, 0);
			this.getTenTx(txs);

			this.nep5s = await WWW.getappchainallnep5asset(ap);
			if (this.nep5s){
				this.pageUtil = new PageUtil(this.nep5s.length, 15);
				this.pageUtil.currentPage = 1;
				if (this.nep5s.length > 15) {
					this.updateNep5s(this.pageUtil);
					this.assetlist.find(".page").show();
				} else {
					this.loadNep5View(this.nep5s);
					let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
					$("#asset-page").find("#asset-page-msg").html(pageMsg);
					this.assetlist.find(".page").hide();
				}
	
				$("#asset-page-next").off("click").click(() => {
					if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
						this.pageUtil.currentPage = this.pageUtil.totalPage;
					} else {
						this.pageUtil.currentPage += 1;
						if (this.assetType == "Nep5") {
							this.updateNep5s(this.pageUtil);
						}
					}
				});
				$("#asset-page-previous").off("click").click(() => {
					if (this.pageUtil.currentPage <= 1) {
						this.pageUtil.currentPage = 1;
					} else {
						this.pageUtil.currentPage -= 1;
						if (this.assetType == "Nep5") {
							this.updateNep5s(this.pageUtil);
						}
					}
				});

				this.pageUtil = new PageUtil(this.nep5s.length, 15);
				if (this.nep5s.length > 15) {
					this.updateNep5s(this.pageUtil);
					this.assetlist.find(".page").show();
				} else {
					this.loadNep5View(this.nep5s);
					let pageMsg = "AppChains 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
					$("#asset-page").find("#asset-page-msg").html(pageMsg);
					this.assetlist.find(".page").hide();
				}
			}						

			this.getLangs();

			this.div.hidden = false;
			this.footer.hidden = false;

			/*$("#i_acallblock").off("click").click(() => { //
				if (this.pageUtil.currentPage <= 1) {
					this.pageUtil.currentPage = 1;
				} else {
					this.pageUtil.currentPage -= 1;
					this.updateNep5TransView(ap, this.pageUtil); // this is for the ac blocks click button

				//this.allacblock.href = document.getElementById("assets-balance-list") as HTMLAnchorElement; //
				}
			});*/ 
		}
		close(): void {
			this.div.hidden = true;
			this.footer.hidden = true;
		}
		loadAssetInfoView(appchain: string) {
			$("#appchain_list").empty();
			var html = `<div class="line"></div>
				<div class="line"><div class="title-nel"><span id="asset_id">ID</span></div> <div class="content-nel"><span id="id"></span></div></div>
				<div class="line"><div class="title-nel"><span id="asset_asset">Asset</span></div> <div class="content-nel"><span id="name"></span></div></div>
				<div class="line"><div class="title-nel"><span id="asset_type">Type</span></div> <div class="content-nel"><span id="type"></span></div></div>					
				<div class="line"><div class="title-nel"><span id="asset_adm">Admin</span></div><div class="content-nel"><span id="admin"></span></div></div>`;
			$("#appchain_list").append(html);
			//this.div.innerHTML = pages.asset; 
			WWW.api_getAppchain(appchain).then((data) => {
				var appchain = data[0];
				var seedlist = appchain.seedlist;
				var valsplit = appchain.validators;

				let time = DateTool.getTime(appchain.timestamp);
				$("#id").text(appchain.hash);
				$("#name").text(appchain.name);
				$("#type").text(time);				
				$("#admin").text(appchain.owner); 
			
				for (var i = 0; i < seedlist.length; i++) {
					var html = `<div class="line"><div class="title-nel"><span id="asset_ava"></span></div><div class="content-nel">
					<span>` + seedlist[i] + `</span>
					</div></div>`;
					$("#appchain_list").append(html);
				}
				for (var i = 0; i < valsplit.length; i++) {
					var html = `<div class="line"><div class="title-nel"><span id="asset_pre"></span></div><div class="content-nel">
					<span>` + valsplit[i] + `</span>
					</div></div>`
					$("#appchain_list").append(html);
				}			
			})

		}
				
        loadAssetTranView(txid:string,from:string,to:number,blockindex:number)
        {
            let html = `
                    <tr>
                    <td><a class="code omit" href="`+ Url.href_appchaintransaction(this.ac ,txid) + `" target="_self">` + txid.replace('0x', '') + `
                    </a></td>
                    <td>` + from + `
                    </td>
                    <td>` + to + `
                    </td>
                    <td>` + blockindex + `</td>
                    </tr>`
            $("#assets-tran-list").append(html);
        }
		
		public loadNep5View(nep5s: nep5Asset[]) {
			$("#nep5s").empty();
			nep5s.forEach((nep5s: nep5Asset) => {
				let href = Url.href_nep5info(nep5s.assetid);
				let assetId = nep5s.assetid.substring(2, 6) + '...' + nep5s.assetid.substring(nep5s.assetid.length - 4);
				if (nep5s.symbol.indexOf("{") >= 0){
					var json = JSON.parse(nep5s.symbol);
					for (var i = 0; i < json.length; i++){
						if (this.app.langmgr.type == "cn" && json[i].lang == "zh-CN"){
							nep5s.symbol = json[i].name;
							break;
						}else if (this.app.langmgr.type == json[i].lang) {
							nep5s.symbol = json[i].name;
							break;
						}
					}
					var json = JSON.parse(nep5s.name);
					for (var i = 0; i < json.length; i++){
						if (this.app.langmgr.type == "cn" && json[i].lang == "zh-CN"){
							nep5s.name = json[i].name;
							break;
						}else if (this.app.langmgr.type == json[i].lang) {
							nep5s.name = json[i].name;
							break;
						}
					}
				}
				let htmlnep5 = `
					<tr>
					<td>` + nep5s.symbol + `</td>
                    <td> <a href="`+ href + `" target="_self">` +  assetId + `</a></td>
                    <td>` + nep5s.name + `</td>
                    <td>` + nep5s.totalsupply + `</td>                    
                    <td>` + nep5s.decimals + `</td>
                    </tr>`;
				$("#nep5s").append(htmlnep5);
			});
		}

		//更新asset表格
		public async updateNep5s(pageUtil: PageUtil) {
			$("#asset-page").find("#asset-page-msg").html("");
			let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
			let maxNum = pageUtil.totalCount;
			let diffNum = maxNum - minNum;
			if (diffNum > 15) {
				maxNum = pageUtil.currentPage * pageUtil.pageSize;
			} else {
				maxNum = pageUtil.totalCount;
			}
			let arrNep5s = new Array();
			for (let i = minNum; i < maxNum; i++) {
				arrNep5s.push(this.nep5s[i]);
			}
			this.loadNep5View(arrNep5s);

			let pageMsg = "Assets " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
			$("#asset-page").find("#asset-page-msg").html(pageMsg);
			if (this.pageUtil.totalPage - this.pageUtil.currentPage) {
				$("#asset-page-next").removeClass('disabled');
			} else {
				$("#asset-page-next").addClass('disabled');
			}
			if (this.pageUtil.currentPage - 1) {
				$("#asset-page-previous").removeClass('disabled');
			} else {
				$("#asset-page-previous").addClass('disabled');
			}
		}

		public getTenBlock(blocks:Block[]){
			$( "#asset-info" ).find( "#ac_blocks" ).children("tbody" ).empty();
			let html_blocks = ``;
            
            blocks.forEach( ( item, index, input ) =>
            {
				let time = DateTool.getTime(item.time);
				var id = item.hash
				id.replace('0x', '');
				id = id.substring(0, 4) + '...' + id.substring(id.length - 4);

                html_blocks += `
                <tr><td>
                <a class="code" target="_self" href ='`+ Url.href_blockh(item.hash) + `' > 
                `+ id + `</a></td>
                <td>` + item.size + ` bytes</td>
                <td>` + time + `</td>
                <td><a class="code" target="_self" href ='`+ Url.href_block(item.index) + `' > 
                `+ item.index + `</a></td>
                <td>` + item.tx.length + `</td></tr>`;
            } );
            $( "#asset-info" ).find( "#ac_blocks" ).children("tbody" ).append( html_blocks );
		}

		public getTenTx(txs:Tx[]){
			$("#asset-info").find("#ac_transactions").children("tbody" ).empty();
			let html_txs = ``;
			txs.forEach( ( tx ) =>
            {
                let txid: string = tx.txid;
                let txtype = tx.type.replace( "Transaction", "" );
                txid = txid.replace( '0x', '' );
                txid = txid.substring( 0, 4 ) + '...' + txid.substring( txid.length - 4 );
                html_txs += `
                <tr>
                <td><a class='code' target='_self'
                 href ='`+ Url.href_transaction( tx.txid ) + `' > ` + txid + ` </a>
                </td>
                <td>` + txtype + `
                </td>
                <td> `+ tx.blockindex + `
                </td>
                <td> `+ tx.size + ` bytes
                </td>
                </tr>`;
			} );
			$("#asset-info").find("#ac_transactions").children("tbody" ).append(html_txs);
		}
	}
}
