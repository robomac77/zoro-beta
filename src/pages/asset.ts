﻿namespace WebBrowser
{
    export class AssetInfo implements Page
    {
        app: App
        langType: string;
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
    
                    "asset_title2",
                    "asset_rank",
                    "asset_addr",
                    "asset_balance",
    
                    "asset_title3",
                    "asset_txid",
                    "asset_from",
                    "asset_to",
                    "asset_height",
                ]
                page_lang.forEach(
                    lang => {
                        document.getElementById(lang).textContent = this.app.langmgr.get(lang)
                    }
                )

                this.langType = this.app.langmgr.type
            }
            
        }
        
        div: HTMLDivElement = document.getElementById("asset-info") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        name: HTMLSpanElement;
        type: HTMLSpanElement;
        id: HTMLSpanElement;
        available: HTMLSpanElement;
        precision: HTMLSpanElement;
        admin: HTMLSpanElement;
		//rankPageUtil: PageUtil;
		pageUtil: PageUtil;
		transpageUtil: PageUtil;

		private chaintxlist: JQuery<HTMLElement>;

		public actxcount: number;
		public acblockcount: number;
        async start()
        {
            this.getLangs()
            
			var appchain = locationtool.getParam();
			appchain = appchain.replace('0x', '');
            let href = locationtool.getUrl() + "/assets";
			let html = '<a href="' + href + '" target="_self">&lt&lt&lt' + this.app.langmgr.get('asset_goallasset') + '</a>';

			//this.txlist = $("#txlist-page");

            $("#goallasset").empty();
			$("#goallasset").append(html);

			
            this.loadAssetInfoView(appchain);
			

			var count = await WWW.api_getAppchainBlockcount(appchain);
			this.acblockcount = count;
			this.pageUtil = new PageUtil(count, 15); 
			await this.updateBlocks(appchain, this.pageUtil);

			let txCount = await WWW.getappchaintxcount(appchain); // change this to call getappchainrawtxcount
			this.actxcount = txCount;
			let type = <string>$("#ChainTxType").val();
			this.transpageUtil = new PageUtil(txCount, 15);
			this.updateTransactions(appchain,this.transpageUtil);
			

			this.div.hidden = false;
			this.footer.hidden = false;
			
			$("#assets-balance-next").off("click").click(() => {
				if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
					this.pageUtil.currentPage = this.pageUtil.totalPage;
				} else {
					this.pageUtil.currentPage += 1;
					this.updateBlocks(appchain,this.pageUtil);
				}
			});
			$("#assets-balance-previous").off("click").click(() => {
				if (this.pageUtil.currentPage <= 1) {
					this.pageUtil.currentPage = 1;
				} else {
					this.pageUtil.currentPage -= 1;
					this.updateBlocks(appchain ,this.pageUtil);
				}
			});

			this.chaintxlist = $("#assets-tran-list");
			//监听交易列表选择框
			$("#TxType").change(() => {
				this.pageUtil.currentPage = 1;
				this.updateTransactions(appchain ,this.pageUtil);
			});

			$("#assets-tran-next").off("click").click(() => {
				if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
					this.pageUtil.currentPage = this.pageUtil.totalPage;
				} else {
					this.pageUtil.currentPage += 1;
					this.updateTransactions(appchain,this.pageUtil);
				}
			});
			$("#assets-tran-previous").off("click").click(() => {
				if (this.pageUtil.currentPage <= 1) {
					this.pageUtil.currentPage = 1;
				} else {
					this.pageUtil.currentPage -= 1;
					this.updateTransactions(appchain,this.pageUtil);
				}
			});

            this.div.hidden = false;
            this.footer.hidden = false;
        }
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        loadAssetInfoView(appchain: string)
        {            
            //this.div.innerHTML = pages.asset;
               WWW.api_getAppchain(appchain).then((data) =>
            {
				var appchain = data[0];

				
				var appchainblockcount = WWW.api_getAppchainBlockcount((appchain.hash).toString());
          

				var appchaintrxcount =  WWW.getappchaintxcount((appchain.hash).toString());
				var appchainaddrcount = WWW.api_getAppchainBlockcount((appchain.hash).toString());

				let time = DateTool.getTime(appchain.timestamp);
                   $("#name").text(appchain.name);
                   $("#type").text(time);
				   $("#id").text(appchain.hash);
				   $("#available").text(appchainblockcount.toString); //this.acblockcount
				   $("#precision").text(appchaintrxcount.toString); //this.actxcount
				   $("#admin").text(appchaintrxcount.toString);                
			})

			
        }
		public async updateBlocks(appchain: string, pageUtil: PageUtil) {

			let blocks: Block[] = await WWW.getappchainblocks(appchain ,pageUtil.pageSize, pageUtil.currentPage); 
			$("#assets-balance-list").children("table").children("tbody").empty();
			if (pageUtil.totalPage - pageUtil.currentPage) {
				$("#assets-balance-next").removeClass('disabled');
			} else {
				$("#assets-balance-next").addClass('disabled');
			}
			if (pageUtil.currentPage - 1) {
				$("#assets-balance-previous").removeClass('disabled');
			} else {
				$("#assets-balance-previous").addClass('disabled');
			}

			let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
			let maxNum = pageUtil.totalCount;
			let diffNum = maxNum - minNum;
			if (diffNum > 15) {
				maxNum = pageUtil.currentPage * pageUtil.pageSize;
			}
			let pageMsg = "Blocks " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
			$("#assets-balance-msg").html(pageMsg);

		
			//let newDate = new Date();
			blocks.forEach((item, index, input) => {
				//newDate.setTime(item.time * 1000);
				let time = DateTool.getTime(item.time);
				let txcounts = item.tx.length
				var id = item.hash
				id = id.replace('0x', '');
				//id = id.substring(0, 4) + '...' + id.substring(id.length - 4);

				let html = `
                <tr>
                <td><a href="`+ Url.href_appchain(id) + `" target="_self">` + id + `</a></td>
                <td>` + item.size + ` bytes</td><td>` + time + `</td><td><a href="` + Url.href_block(item.index) + `" target="_self">` + item.index + `</a></td>
                <td>` + txcounts + `</td>
                </tr>`
				$("#assets-balance-list").append(html);
			});
		}

		
		 public async updateTransactions(appchain:string ,pageUtil: PageUtil, ) {
			$("#assets-tran-list").empty();
			//分页查询交易记录

			let txs: Tx[] = await WWW.getappchainrawtransactions(appchain,pageUtil.pageSize, pageUtil.currentPage);

			let txCount = await WWW.getappchaintxcount(appchain);
			pageUtil.totalCount = txCount;

			let listLength = 0;
			if (txs.length < 15) {
				this.chaintxlist.find(".page").hide();
				listLength = txs.length;
			} else {
				this.chaintxlist.find(".page").show();
				listLength = pageUtil.pageSize;
			}
			for (var n = 0; n < listLength; n++) {
				let txid = txs[n].txid;
				let html: string = await this.getTxLine(txid, txs[n].type, txs[n].size.toString(), txs[n].blockindex.toString(), txs[n].vin, txs[n].vout);
				$("#assets-tran-list").append(html);
			}

			let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize; //
			let maxNum = pageUtil.totalCount;
			let diffNum = maxNum - minNum;
			if (diffNum > 15) {
				maxNum = pageUtil.currentPage * pageUtil.pageSize;
			}
			let pageMsg = "Chain Transactions " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
			$("#assets-trans-msg").html(pageMsg);
			if (pageUtil.totalPage - pageUtil.currentPage) {
				$("#assets-tran-next").removeClass('disabled');
			} else {
				$("#assets-tran-next").addClass('disabled');
			}
			if (pageUtil.currentPage - 1) {
				$("#assets-tran-previous").removeClass('disabled');
			} else {
				$("#assets-tran-previous").addClass('disabled');
			}
		}
		 

		
		 async getTxLine(txid: string, type: string, size: string, index: string, vins,	vouts) 
		{
			console.log(vins)
			console.log(JSON.stringify(vins));
			console.log("--------------")
			console.log(vouts)
			console.log(JSON.stringify(vouts));
			var id = txid.replace('0x', '');
			id = id.substring(0, 6) + '...' + id.substring(id.length - 6);
			if (vins.length == 0 && vouts.length == 0) {
				return `<div class="line">
                            <div class="line-general">
                                <div class="content-nel"><span><a href="`+ Url.href_transaction(txid) + `" target="_self">` + id + `</a></span></div>
                                <div class="content-nel"><span>`+ type.replace("Transaction", "") + `</span></div>
                                <div class="content-nel"><span>`+ size + ` bytes</span></div>
                                <div class="content-nel"><span><a href="`+ Url.href_block(parseInt(index)) + `" target="_self">` + index + `</a></span></div>
                            </div>
                            <a class="end" id="genbtn" style="border-left:none;"></a>
                        </div>`;
			}
			return `
            <div class="line">
                <div class="line-general">
                    <div class="content-nel"><span><a href="`+ Url.href_transaction(txid) + `" target="_self">` + id + `</a></span></div>
                    <div class="content-nel"><span>`+ type.replace("Transaction", "") + `</span></div>
                    <div class="content-nel"><span>`+ size + ` bytes</span></div>
                    <div class="content-nel"><span><a href="`+ Url.href_block(parseInt(index)) + `" target="_self">` + index + `</a></span></div>
                </div>
                <a onclick="txgeneral(this)" class="end" id="genbtn"><img src="./img/open.svg" /></a>
                <div class="transaction" style="width:100%;display: none;" vins='`+ JSON.stringify(vins) + `' vouts='` + JSON.stringify(vouts) + `'>
                </div>
            </div>
            `;
		}
    }
}