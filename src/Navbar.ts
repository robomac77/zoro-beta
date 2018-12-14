﻿/// <reference path="./tools/neotool.ts" />

namespace WebBrowser
{
    export class Navbar
    {
        app: App

        constructor(app: App) {
            this.app = app
        }

        indexBtn: HTMLLIElement = document.getElementById("index-btn") as HTMLLIElement;
        indexa: HTMLAnchorElement = document.getElementById("indexa") as HTMLAnchorElement;
        browBtn: HTMLLIElement = document.getElementById("brow-btn") as HTMLLIElement;
        browsea: HTMLLinkElement = document.getElementById("browsea") as HTMLLinkElement;
        blockBtn: HTMLLIElement = document.getElementById("blocks-btn") as HTMLLIElement;
        blocka: HTMLAnchorElement = document.getElementById("blocksa") as HTMLAnchorElement;
        txlistBtn: HTMLLIElement = document.getElementById("txlist-btn") as HTMLLIElement;
        txlista: HTMLAnchorElement = document.getElementById("txlista") as HTMLAnchorElement;
        addrsBtn: HTMLLIElement = document.getElementById("addrs-btn") as HTMLLIElement;
        addrsa: HTMLAnchorElement = document.getElementById("addrsa") as HTMLAnchorElement;
        assetBtn: HTMLLIElement = document.getElementById("asset-btn") as HTMLLIElement;
        asseta: HTMLAnchorElement = document.getElementById("assetsa") as HTMLAnchorElement;
        guiBtn: HTMLLIElement = document.getElementById("gui-btn") as HTMLLIElement;
        guia: HTMLAnchorElement = document.getElementById("guia") as HTMLAnchorElement;
        // walletBtn: HTMLLIElement = document.getElementById("wallet-btn") as HTMLLIElement;
        // walleta: HTMLAnchorElement = document.getElementById("walleta") as HTMLAnchorElement;
        // nnsBtn: HTMLLIElement = document.getElementById("nns-btn") as HTMLLIElement;
        // nnsa: HTMLAnchorElement = document.getElementById("nnssa") as HTMLAnchorElement;
        searchBtn: HTMLButtonElement = document.getElementById( "searchBtn" ) as HTMLButtonElement;
        searchText: HTMLInputElement = document.getElementById("searchText") as HTMLInputElement;
        searchList: HTMLUListElement = document.getElementById("seach_list") as HTMLUListElement;
        cpLock: boolean = false;
        currentLine: number = 0;

        getLangs() {
            let page_lang = ["indexa", "browsea", "blocka", "txlista", "addrsa", "asseta", "guia"]
            page_lang.forEach(
                lang => {
                    this[lang].textContent = this.app.langmgr.get("nav_" + lang)
                }
            )
        }

        start()
        {

            this.getLangs()
            
            this.indexa.onclick = () =>
            {
                this.skip("");
            }
            this.blocka.onclick = () =>
            {
                this.skip("/blocks");                
            }
            this.txlista.onclick = () =>
            {
                this.skip("/transactions");  
            }
            this.addrsa.onclick = () =>
            {
                this.skip("/addresses");  
            }
            this.asseta.onclick = () =>
            {
                this.skip("/assets");  
            }
            this.guia.onclick = () =>
            {
                this.skip("/gui");  
            }
            // this.nnsa.onclick = () => {
            //     this.skip("/nnsevent");
            // }
            this.searchBtn.onclick = () =>
            {
                this.jump();
            }
            this.searchText.addEventListener('compositionstart', ()=> {
                this.cpLock = true;
            })
            this.searchText.addEventListener('compositionend', () =>{
                this.cpLock = false;
                if (!this.cpLock) this.fuzzyseach();
            })
            this.searchText.addEventListener('input', () => {
                if (!this.cpLock) this.fuzzyseach();
            });
            this.searchText.onkeydown = (e) =>
            {
                if (e.keyCode == 13) {
                    this.jump();
                } else if (e.keyCode == 38) {
                    this.changeItem();
                    this.currentLine--;
                } else if (e.keyCode == 40) {
                    this.changeItem();
                    this.currentLine++;
                } 
            }
            this.searchList.onclick = (e) =>
            {
                let event: Event = e || window.event as Event;
                let target: Element = event.target as Element || event.srcElement as Element;
                if (target.nodeName.toLowerCase() == 'li') {
                    this.searchText.value = target.innerHTML;
                    let data = target.getAttribute("data");
                    window.open(locationtool.getUrl() + '/asset/' + data);
                }
                $("#seach_list").empty();
            }
            // this.walletBtn.onclick = () =>
            // {
            //     if ( locationtool.getNetWork() == 'testnet' )
            //         window.open( "https://testwallet.nel.group/" );
            //     else
            //         window.open( "https://wallet.nel.group/" );
            // }
            document.onclick = (ev) =>
            {
                let event: Event = ev || window.event as Event;
                let target: Element = event.target as Element || event.srcElement as Element;
                if (target.nodeName.toLowerCase() != 'li') {
                    $("#seach_list").empty();
                }
            } 
        }

        skip(page: string)
        {
            window.location.href =locationtool.getUrl() + page;
        }
        jump()
        {           
            let appchain = locationtool.getParam2();
            let search: string = this.searchText.value;
            search = search.trim();
            if (search) {
                if (search.length == 34) {
                    if (Neotool.verifyPublicKey(search)) {                        
                        if (appchain && appchain.length == 40){
                            window.open(locationtool.getUrl() + '/address/' + appchain + "/" +search);
                        }else{
                            window.open(locationtool.getUrl() + '/address/' + search);
                        }                        
                    } else {
                        $("#errContent").text(this.app.langmgr.get('nav_errContent'));
                        $('#errMsg').modal('show');
                        return false;
                    }
                    return;
                } else {
                    search = search.replace('0x', '');
                    if (search.length == 64) {
                        if (appchain){
                            window.open(locationtool.getUrl() + '/transaction/' + appchain + "/" +search);
                        }else{
                            window.open(locationtool.getUrl() + '/transaction/' + search);
                        }
                    }
                    else if (search.length == 40) {
                        if (appchain){
                            window.open(locationtool.getUrl() + '/nep5/' + appchain + "/" +search);
                        }else{
                            window.open(locationtool.getUrl() + '/nep5/' + search);
                        }
                    }
                    else if (!isNaN(Number(search))) {
                        if (appchain){
                            window.open(locationtool.getUrl() + '/block/' + appchain + "/" +search);
                        }else{
                            window.open(locationtool.getUrl() + '/block/' + search);
                        }
                    }
                    else if (search.length > 64) {
                        let length = this.searchList.children.length;
                        if (length) {
                            let data = this.searchList.children[this.currentLine-1].getAttribute("data");
                            if (appchain){
                                window.open(locationtool.getUrl() + '/asset/' + appchain + "/" +search);
                            }else{
                                window.open(locationtool.getUrl() + '/asset/' + data);
                            }
                            $("#seach_list").empty();
                        }
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
            
        }
        async fuzzyseach() {
            $("#seach_list").empty();
            this.currentLine = 0;
            let search: string = this.searchText.value;
            if (search) {
                let list = await WWW.apiaggr_searchAsset(search);
                if (list) {
                    let length = list.length;
                    for (let i = 0; i < length;i++) { 
                        let oLi = '<li data="' + list[i]["assetid"] + '">' + list[i]["name"] + '(' + list[i]["assetid"]+')' + '</li>';
                        $("#seach_list").append(oLi);
                    }
                }
            }
        }
        changeItem() { 
            let length = this.searchList.children.length;
            if (length) {
                for (let i = 0; i < length; i++) {
                    this.searchList.children[i].className = "";
                }
                if (this.currentLine < 0 || this.currentLine == 0) {
                    this.currentLine = 0;
                }
                if (this.currentLine == length || this.currentLine > length) {
                    this.currentLine = length-1;
                }
                //调试使用
                this.searchList.children[this.currentLine].className = "active";
                this.searchText.value = this.searchList.children[this.currentLine].innerHTML;
            }
        }
    }
}