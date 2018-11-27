namespace WebBrowser
{
    export class Nep5Info implements Page
    {
        div: HTMLDivElement = document.getElementById("asset-info") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        name: HTMLSpanElement;
        type: HTMLSpanElement;
        id: HTMLSpanElement;
        available: HTMLSpanElement;
        precision: HTMLSpanElement;
        admin: HTMLSpanElement;
        rankPageUtil: PageUtil;
        async start()
        {
            
            var nep5assetid = locationtool.getParam();
            let href = locationtool.getUrl() + "/assets";
            let html = '<a href="' + href + '" target="_self">&lt&lt&ltBack to all assets</a>';
            if (location.pathname == '/zh/') {
                html = '<a href="' + href + '" target="_self">&lt&lt&lt返回</a>';
            }
            $("#nep5asset").empty();
            $("#nep5asset").append(html);

            this.loadAssetInfoView(assetid);

            var assetType = locationtool.getType();
            if (assetType == 'nep5') {
                //$(".asset-nep5-warp").show();
                $(".nep5-tran-warp").show();
            } else {
                //$(".asset-nep5-warp").hide();
                $(".nep5-tran-warp").hide();
            }
            //资产排行
            var rankcount = await WWW.api_getrankbyassetcount(nep5assetid);
            this.rankPageUtil = new PageUtil(rankcount[0].count, 10);
            this.updateAssetBalanceView(nep5assetid, this.rankPageUtil);
            //排行翻页
            $("#assets-balance-next").off("click").click(() => {
                if (this.rankPageUtil.currentPage == this.rankPageUtil.totalPage) {
                    this.rankPageUtil.currentPage = this.rankPageUtil.totalPage;
                } else {
                    this.rankPageUtil.currentPage += 1;
                    this.updateAssetBalanceView(nep5assetid, this.rankPageUtil);
                }
            });
            $("#assets-balance-previous").off("click").click(() => {
                if (this.rankPageUtil.currentPage <= 1) {
                    this.rankPageUtil.currentPage = 1;
                } else {
                    this.rankPageUtil.currentPage -= 1;
                    this.updateAssetBalanceView(nep5assetid, this.rankPageUtil);
                }
            });
            $("#assets-input").val('');
            $("#assets-input").off("input").on('input', () => {
                this.doGoPage(nep5assetid,false)
            });
            $("#assets-input").off("keydown").keydown((e) => {
                if (e.keyCode == 13) {
                    this.doGoPage(nep5assetid,true);
                }
            });
            $("#assets-gopage").off("click").click(() => {
                this.doGoPage(nep5assetid,true)
            });

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
        loadAssetInfoView(nep5assetid: string)
        {            
            //this.div.innerHTML = pages.asset;
            WWW.api_getasset(nep5assetid).then((data) =>
            {
                var asset = data[0];
                
                asset.names = CoinTool.assetID2name[asset.id];
                $("#nep5name").text(asset.names);
                $("#nep5asset-info-type").text(asset.type);
                $("#nep5id").text(asset.id);
                $("#nep5available").text(asset.available);
                $("#nep5precision").text(asset.precision);
                $("#nep5admin").text(asset.admin);                
            })
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