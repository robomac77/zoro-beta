namespace WebBrowser
{
    export class ACBlock implements Page
    {
        app: App
        langType: string;
        constructor(app: App) {
            this.app = app
        }

        getLangs()
		{

			


            if (this.langType != this.app.langmgr.type) {
                let page_lang = [
                    "acblock_info_title",
                    "acblock_info_block",
                    "acblock_info_appchain",
                    "acblock_info_hash",
                    "acblock_info_time",
                    "acblock_info_size",
                    "acblock_info_pre",
                    "acblock_info_next",
                    "acblock_info_tran", "acblock_info_txid", "acblock_info_type", "acblock_info_txsize", "acblock_info_ver"
                ]
                page_lang.forEach(
                    lang => {
                        document.getElementById(lang).textContent = this.app.langmgr.get(lang)
                    }
                )
                
                this.langType = this.app.langmgr.type
            }
            
        }
        
        div: HTMLDivElement = document.getElementById("acblock-info") as HTMLDivElement;
		footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;

		
        private pageUtil: PageUtil;
        private txs: Tx[];
        public ac:string = locationtool.getParam2();
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }

        start()
        {
            this.getLangs()


			

            this.ac = locationtool.getParam2();
            //this.div.innerHTML = pages.block;
            this.queryBlock(this.ac, locationtool.getParam3() as number);
            let href = locationtool.getUrl() + "/asset/" + this.ac;
            let html = '<a href="' + href + '" target="_self">&lt&lt&lt'+this.app.langmgr.get("acblock_goallblock")+'</a>';
            $("#acgoallblock").empty();
            $("#acgoallblock").append(html);

            $("#acblock-tran-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    this.updateBlockTrans(this.ac,this.pageUtil);                    
                }
            });
            $("#acblock-tran-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.updateBlockTrans(this.ac ,this.pageUtil);  
                }
            });
            this.div.hidden = false;
            this.footer.hidden = false;
        }

        public async queryBlock(ac :string, index: number )
        {
            //let ajax: Ajax = new Ajax();
            let blocks: Block[] = await WWW.getacblock(ac ,index);
            let block: Block = blocks[0];
			let time = DateTool.getTime(block.time);

			var id = block.hash
			id = id.replace('0x', '');
			//id = id.substring(0, 4) + '...' + id.substring(id.length - 4);

	
			$("#acchain").text(ac);
			$("#achash").text(id);

            $("#acsize" ).text( block.size + ' bytes' );
            $("#actime").text(time);
            $("#acversion" ).text( block.version );
			$("#acindex").text(block.index);
			//$("#acindex").html(`<a href="` + Url.href_appchainblock(this.ac, block.index) + `" target="_self">` + (block.index) + `</a>`);
		   //	$("#acindex").html(`<a href="` + Url.href_appchainblock(this.ac, block.index) + `" target="_self">` + (block.index) + `</a>`);

            //`<a href="`+ Url.href_block(item.index) + `" target="_self">`
            $("#acprevios-block").html(`<a href="` + Url.href_appchainblock(ac, block.index - 1) + `" target="_self">` + (block.index - 1)+`</a>`);
			$("#acnext-block").html(`<a href="` + Url.href_appchainblock(ac, parseInt(block.index.toString()) + 1) + `" target="_self">` + (parseInt(block.index.toString()) + 1) + `</a>`);
            this.txs = block.tx;
            let txsLength = this.txs.length;
            this.pageUtil = new PageUtil(this.txs.length, 10);
            if (txsLength > this.pageUtil.pageSize) {
                $(".acblock-tran-page").show();
            } else {
                $(".acblock-tran-page").hide();
            }
            this.updateBlockTrans(this.ac ,this.pageUtil);
        }
        updateBlockTrans(appchain:string ,pageUtil: PageUtil) {
            $("#actxs").empty();
            let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            let maxNum = pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > pageUtil.pageSize) {
                maxNum = pageUtil.currentPage * pageUtil.pageSize;
            } else {
                maxNum = pageUtil.totalCount;
            }
            let arrtxs = new Array();
            for (let i = minNum; i < maxNum; i++) {
                arrtxs.push(this.txs[i]);
            }
            arrtxs.forEach(tx => {
                var id = tx.txid.replace('0x', '');
                id = id.substring(0, 6) + '...' + id.substring(id.length - 6);
                this.loadBlockTransView(tx.txid, id, tx.type, tx.size, tx.version);
            });

            let pageMsg = "Transactions " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            $("#acblock-tran-msg").html(pageMsg);
            if (pageUtil.totalPage - this.pageUtil.currentPage) {
                $("#acblock-tran-next").removeClass('disabled');
            } else {
                $("#acblock-tran-next").addClass('disabled');
            }
            if (pageUtil.currentPage - 1) {
                $("#acblock-tran-previous").removeClass('disabled');
            } else {
                $("#acblock-tran-previous").addClass('disabled');
            }
        }
        loadBlockTransView(txid: string, id: string, type: string, size: number, version: number) {
            let html = `
                    <tr>
                        <td><a href="` + Url.href_appchaintransaction(this.ac,txid) + `" target="_self">` + id + `</a></td>
                        <td>` + type.replace("Transaction", "") + `</td>
                        <td>` + size + ` bytes</td>
                        <td>` + version + `</td>
                    </tr>`;
            $("#actxs").append(html);
        }
    }
}