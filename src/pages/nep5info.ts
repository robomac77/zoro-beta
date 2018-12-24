namespace WebBrowser
{
	export class Nep5Info implements Page {
		app: App
		langType: string;
		constructor(app: App) {
			this.app = app
		}

		getLangs() {
			if (this.langType != this.app.langmgr.type) {
				let page_lang = [	
                    "nep5asset_title",			
					"nep5assetid",
					"nep5name",
					"nep5assettotalsupply",
					"nep5symbol",
					"nep5decimals",
				]
				page_lang.forEach(
					lang => {
						document.getElementById(lang).textContent = this.app.langmgr.get(lang)
					}
				)

				this.langType = this.app.langmgr.type
			}

		}

        div: HTMLDivElement = document.getElementById("nep5asset-info") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        nep5name: HTMLSpanElement;
        nep5type: HTMLSpanElement;
        nep5id: HTMLSpanElement;
        nep5available: HTMLSpanElement;
        nep5precision: HTMLSpanElement;
        nep5admin: HTMLSpanElement;
        rankPageUtil: PageUtil;
        async start()
        {
            this.getLangs();
            
            var nep5assetid = locationtool.getParam3();
            var appchain = locationtool.getParam2();
            if (appchain && appchain.length == 40){
                var href = locationtool.getUrl() + "/asset/" + appchain;
            }else{
                var href = locationtool.getUrl();
            }
            let html = '<a href="' + href + '" target="_self">&lt&lt&lt' + this.app.langmgr.get("back_chainmessage") + '</a>';
            $("#nep5asset").empty();
            $("#nep5asset").append(html);

            this.loadAssetInfoView(nep5assetid);

            // var assetType = locationtool.getType();
            // if (assetType == 'nep5') {
            //     //$(".asset-nep5-warp").show();
            //     $(".nep5-tran-warp").show();
            // } else {
            //     //$(".asset-nep5-warp").hide();
            //     $(".nep5-tran-warp").hide();
            // }
            //资产排行
            // var rankcount = await WWW.api_getrankbyassetcount(nep5assetid);
            // this.rankPageUtil = new PageUtil(rankcount[0].count, 10);
            //this.updateAssetBalanceView(nep5assetid, this.rankPageUtil);
            //排行翻页
            // $("#assets-balance-next").off("click").click(() => {
            //     if (this.rankPageUtil.currentPage == this.rankPageUtil.totalPage) {
            //         this.rankPageUtil.currentPage = this.rankPageUtil.totalPage;
            //     } else {
            //         this.rankPageUtil.currentPage += 1;
            //         this.updateAssetBalanceView(nep5assetid, this.rankPageUtil);
            //     }
            // });
            // $("#assets-balance-previous").off("click").click(() => {
            //     if (this.rankPageUtil.currentPage <= 1) {
            //         this.rankPageUtil.currentPage = 1;
            //     } else {
            //         this.rankPageUtil.currentPage -= 1;
            //         this.updateAssetBalanceView(nep5assetid, this.rankPageUtil);
            //     }
            // });
            // $("#assets-input").val('');
            // $("#assets-input").off("input").on('input', () => {
            //     this.doGoPage(nep5assetid,false)
            // });
            // $("#assets-input").off("keydown").keydown((e) => {
            //     if (e.keyCode == 13) {
            //         this.doGoPage(nep5assetid,true);
            //     }
            // });
            // $("#assets-gopage").off("click").click(() => {
            //     this.doGoPage(nep5assetid,true)
            // });

            this.div.hidden = false;
            this.footer.hidden = false;
        }
        //跳转页面
        public doGoPage(nep5assetid:string,gopage: boolean) {
            let page: number = parseInt($("#nep5assets-input").val() as string);
            if (page && page > this.rankPageUtil.totalPage) {
                page = this.rankPageUtil.totalPage;
                $("#nep5assets-input").val(this.rankPageUtil.totalPage);
            } else if (page < 0) {
                page = 1;
                $("#nep5assets-input").val(1);
            }
            if (gopage) {
                this.rankPageUtil.currentPage = page;
                this.updateAssetBalanceView(nep5assetid, this.rankPageUtil);
                $("#nep5assets-input").val('');
            }
        }
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        async loadAssetInfoView(nep5assetid: string)
        {            
            var appchain = locationtool.getParam2();
            if (appchain && appchain.length == 40){
                var asset = await WWW.api_getappchainnep5(appchain, nep5assetid);
            }else{
                var asset = await WWW.api_getnep5(nep5assetid)
            }   
            if (asset.symbol.indexOf("{") >= 0){
                var json = JSON.parse(asset.symbol);
                for (var i = 0; i < json.length; i++){
                    if (this.app.langmgr.type == "cn" && json[i].lang == "zh-CN"){
                        asset.symbol = json[i].name;
                        break;
                    }else if (this.app.langmgr.type == json[i].lang) {
                        asset.symbol = json[i].name;
                        break;
                    }
                }
                var json = JSON.parse(asset.name);
                for (var i = 0; i < json.length; i++){
                    if (this.app.langmgr.type == "cn" && json[i].lang == "zh-CN"){
                        asset.name = json[i].name;
                        break;
                    }else if (this.app.langmgr.type == json[i].lang) {
                        asset.name = json[i].name;
                        break;
                    }
                }
            }
            
            $("#nep5_assetid").text(asset.assetid);
            $("#nep5_name").text(asset.name);
            $("#nep5_assettotalsupply").text(asset.totalsupply);
            $("#nep5_symbol").text(asset.symbol);
            $("#nep5_decimals").text(asset.decimals);         
        }
        async updateAssetBalanceView(nep5assetid: string, pageUtil: PageUtil) {
            let balanceList = await WWW.getrankbyasset(nep5assetid, pageUtil.pageSize, pageUtil.currentPage);
            $("#nep5assets-balance-list").empty();

            if (balanceList) {
                let rank = (pageUtil.currentPage - 1) * 10 + 1;
                balanceList.forEach((item) => {
                    let href = Url.href_address(item.addr);
                    this.loadAssetBalanceView(rank, href, item.addr, item.balance);
                    rank++;
                });
            }
            else {
                let html = `<tr><td colspan="3" >There is no data</td></tr>`;
                if (location.pathname == '/zh/') {
                    html = `<tr><td colspan="3" >没有数据</td></tr>`;
                }
                $("#nep5assets-balance-list").append(html);
                if (pageUtil.currentPage == 1) {
                    $(".nep5asset-balance-page").hide();
                } else {
                    $("#nep5assets-balance-next").addClass('disabled');
                    $(".nep5asset-balance-page").show();
                }
            }
            if (pageUtil.totalCount > 10) {
                if (pageUtil.totalPage - pageUtil.currentPage) {
                    $("#nep5assets-balance-next").removeClass('disabled');
                } else {
                    $("#nep5assets-balance-next").addClass('disabled');
                }
                if (pageUtil.currentPage - 1) {
                    $("#nep5assets-balance-previous").removeClass('disabled');
                } else {
                    $("#nep5assets-balance-previous").addClass('disabled');
                }
                //let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                //let maxNum = pageUtil.totalCount;
                //let diffNum = maxNum - minNum;
                //if (diffNum > 10) {
                //    maxNum = pageUtil.currentPage * pageUtil.pageSize;
                //}
                //let pageMsg = "Banlance Rank " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                let pageMsg = "Page " + pageUtil.currentPage + " , " + pageUtil.totalPage + " pages in total";
                if (location.pathname == '/zh/') {
                    pageMsg = "第 " + pageUtil.currentPage + " 页，共 " + pageUtil.totalPage + " 页"
                }
                $("#nep5assets-balance-msg").html(pageMsg);
                $(".nep5asset-balance-page").show();
            }
            else {
                $(".nep5asset-balance-page").hide();
            }
        }
        loadAssetBalanceView(rank: number, href: string, address: string, balance: number) {
            let html = `
                    <tr>
                    <td>` + rank + `
                    </td>
                    <td><a target="_self" href="`+ href + `">` + address + `
                    </a></td>
                    <td>` + balance + `</td>
                    </tr>`
            $("#nep5assets-balance-list").append(html);
        }
    }
}