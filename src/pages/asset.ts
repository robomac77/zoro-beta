namespace WebBrowser
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
        async start()
        {
            this.getLangs()
            
            var appchain = locationtool.getParam();
            let href = locationtool.getUrl() + "/assets";
            let html = '<a href="' + href + '" target="_self">&lt&lt&lt'+this.app.langmgr.get('asset_goallasset')+'</a>';

            $("#goallasset").empty();
            $("#goallasset").append(html);

            this.loadAssetInfoView(appchain);

           // var assetType = locationtool.getType();
          //  if (assetType == 'nep5') {
                //$(".asset-nep5-warp").show();
          //      $(".asset-tran-warp").show();
         //   } else {
                //$(".asset-nep5-warp").hide();
         //       $(".asset-tran-warp").hide();
         //   }
            //资产排行
            //var rankcount = await WWW.api_getrankbyassetcount(assetid);
         //   this.rankPageUtil = new PageUtil(rankcount[0].count, 10);
          //  this.updateAssetBalanceView(assetid, this.rankPageUtil);
            //排行翻页
          //  $("#assets-balance-next").off("click").click(() => {
           //     if (this.rankPageUtil.currentPage == this.rankPageUtil.totalPage) {
          //          this.rankPageUtil.currentPage = this.rankPageUtil.totalPage;
          //      } else {
          //          this.rankPageUtil.currentPage += 1;
          //          this.updateAssetBalanceView(assetid, this.rankPageUtil);
         //       }
         //   });
        //    $("#assets-balance-previous").off("click").click(() => {
         //       if (this.rankPageUtil.currentPage <= 1) {
        //            this.rankPageUtil.currentPage = 1;
        //        } else {
        //            this.rankPageUtil.currentPage -= 1;
         //           this.updateAssetBalanceView(assetid, this.rankPageUtil);
        //        }
       //     });

		

			var count = await WWW.api_getHeight();
			this.pageUtil = new PageUtil(count, 15);
			await this.updateBlocks(appchain , this.pageUtil);
			this.div.hidden = false;
			this.footer.hidden = false;
			$("#blocks-page-next").off("click").click(() => {
				if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
					this.pageUtil.currentPage = this.pageUtil.totalPage;
				} else {
					this.pageUtil.currentPage += 1;
					this.updateBlocks(appchain,this.pageUtil);
				}
			});
			$("#blocks-page-previous").off("click").click(() => {
				if (this.pageUtil.currentPage <= 1) {
					this.pageUtil.currentPage = 1;
				} else {
					this.pageUtil.currentPage -= 1;
					this.updateBlocks(appchain ,this.pageUtil);
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
                
                //asset.names = CoinTool.assetID2name[asset.id];
				let time = DateTool.getTime(appchain.timestamp);
                $("#name").text(appchain.name);
                $("#asset-info-type").text(time);
                $("#id").text(appchain.hash);
                $("#available").text(appchain.name);
                $("#precision").text(appchain.name);
                $("#admin").text(appchain.name);                
            })
        }
		public async updateBlocks(appchain :string , pageUtil: PageUtil) {
			let blocks: Block[] = await WWW.getappchainblocks(appchain ,pageUtil.pageSize, pageUtil.currentPage); // the limit for data display here is 15 after each 15
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

			$("#assets-balance-list").find("tbody").append(`<tr><td>1</td></tr>`);
			//let newDate = new Date();
			blocks.forEach((item, index, input) => {
				//newDate.setTime(item.time * 1000);
				let time = DateTool.getTime(item.time);
				let txcounts = item.tx.length
				var id = item.hash
				id = id.replace('0x', '');
				id = id.substring(0, 4) + '...' + id.substring(id.length - 4);

				let html = `
                <tr>
                <td><a href="`+ Url.href_appchain(id) + `" target="_self">` + id + `</a></td>
                <td>` + item.size + ` bytes</td><td>` + time + `</td><td><a href="` + Url.href_block(item.index) + `" target="_self">` + item.index + `</a></td>
                <td>` + txcounts + `</td>
                </tr>`
				$("#assets-balance-list").append(html);
			});
		}
    }
}