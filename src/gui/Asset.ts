/// <reference path="./Base.ts"/>
namespace WebBrowser
{
    export class GUI_Asset implements GUI_Base
    {
        div:HTMLDivElement;
        constructor(div:HTMLDivElement){
            this.div = div;   
        }

        showUI(){
            this.mainAsset(this.div);
        }        

        hideUI(){

        }

        async mainAsset(div:HTMLDivElement){
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var zoroChainBackGround = document.createElement('div') as HTMLDivElement;
            zoroChainBackGround.style.width = "100%";
            zoroChainBackGround.style.cssFloat = "left";
            div.appendChild(zoroChainBackGround);
            //zoro
            var zoroChain = document.createElement('div') as HTMLDivElement;
            zoroChain.style.width = "30%";
            zoroChain.style.cssFloat = "left";
            zoroChainBackGround.appendChild(zoroChain);

            var name = document.createElement('span') as HTMLSpanElement;
            name.style.width = "100%";
            name.style.cssFloat = "left";
            name.style.color = "#eeeeee";
            name.textContent = 'ZORO CHAIN';
            zoroChain.appendChild(name);

            var BCP = document.createElement('span') as HTMLSpanElement;
            BCP.style.width = "100%";
            BCP.style.cssFloat = "left";
            var bcpnum = await WWW.rpc_getBalanceOf(AppChainTool.zoroBCP, GUITool.address, "0000000000000000000000000000000000000000");
            BCP.style.color = "#eeeeee";
            BCP.textContent = 'BCP = ' + bcpnum;
            zoroChain.appendChild(BCP);
            //neo
            var neoChain = document.createElement('div') as HTMLDivElement;
            neoChain.style.width = "30%";
            neoChain.style.cssFloat = "left";
            zoroChainBackGround.appendChild(neoChain);

            var name = document.createElement('span') as HTMLSpanElement;
            name.style.width = "100%";
            name.style.cssFloat = "left";
            name.style.color = "#eeeeee";
            name.textContent = 'NEO CHAIN';
            neoChain.appendChild(name);

            var utxo = await WWW.rpc_getUTXO(GUITool.address);
            var GAS = document.createElement('span') as HTMLSpanElement;
            GAS.style.width = "100%";
            GAS.style.cssFloat = "left";
            GAS.style.color = "#eeeeee";
            GAS.textContent = 'GAS = ' + AppChainTool.GAS;
            neoChain.appendChild(GAS);

            var CGAS = document.createElement('span') as HTMLSpanElement;
            CGAS.style.width = "100%";
            CGAS.style.cssFloat = "left";
            CGAS.style.color = "#eeeeee";
            var CgasNum = await WWW.rpc_getBalanceOf(AppChainTool.CGAS, GUITool.address);
            CGAS.textContent = 'CGAS = ' + CgasNum;
            neoChain.appendChild(CGAS);

            var NEO = document.createElement('span') as HTMLSpanElement;
            NEO.style.width = "100%";
            NEO.style.cssFloat = "left";
            NEO.style.color = "#eeeeee";            
            NEO.textContent = 'NEO = ' + AppChainTool.NEO;
            neoChain.appendChild(NEO);

            var CNEO = document.createElement('span') as HTMLSpanElement;
            CNEO.style.width = "100%";
            CNEO.style.cssFloat = "left";
            CNEO.style.color = "#eeeeee";
            var CneoNum = await WWW.rpc_getBalanceOf(AppChainTool.CNEO, GUITool.address);
            CNEO.textContent = 'CNEO = ' + CneoNum;
            neoChain.appendChild(CNEO);

            var NBCP = document.createElement('span') as HTMLSpanElement;
            NBCP.style.width = "100%";
            NBCP.style.cssFloat = "left";
            NBCP.style.color = "#eeeeee";
            var bcpnum = await WWW.rpc_getBalanceOf(AppChainTool.neoBCP, GUITool.address);
            NBCP.textContent = 'BCP = ' + bcpnum;
            neoChain.appendChild(NBCP);

            //appchain
            let title = GUI_Route.instance.getUI(PageName.Title) as GUI_Title;
            if (GUITool.chainHash == "0000000000000000000000000000000000000000" || GUITool.chainHash == "NEO" || title.height.textContent == "N/A"){
                return;
            }
            var appChain = document.createElement('div') as HTMLDivElement;
            appChain.style.width = "30%";
            appChain.style.cssFloat = "left";
            zoroChainBackGround.appendChild(appChain);

            var name = document.createElement('span') as HTMLSpanElement;
            name.style.width = "100%";
            name.style.cssFloat = "left";
            name.style.color = "#eeeeee";
            name.textContent = 'APP CHAIN';
            appChain.appendChild(name);

            var BCP = document.createElement('span') as HTMLSpanElement;
            BCP.style.width = "100%";
            BCP.style.cssFloat = "left";
            BCP.style.color = "#eeeeee";
            var bcpnum = await WWW.rpc_getBalanceOf(AppChainTool.appChainBCP, GUITool.address, GUITool.chainHash);
            BCP.textContent = 'BCP = ' + bcpnum;
            appChain.appendChild(BCP);
        }

    }
}