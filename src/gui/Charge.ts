/// <reference path="./Base.ts"/>
namespace WebBrowser
{
    export class GUI_Charge implements GUI_Base
    {
        div:HTMLDivElement;
        constructor(div:HTMLDivElement){
            this.div = div;   
        }

        showUI(){
            this.mainCharge(this.div);
            GUI_Route.instance.hideUI(PageName.Title);
        }        

        hideUI(){

        }

        mainCharge(div:HTMLDivElement):void{
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var chargeBackGround = document.createElement('div') as HTMLDivElement;
            chargeBackGround.style.width = "100%";
            chargeBackGround.style.cssFloat = "left";
            div.appendChild(chargeBackGround);

            var upBackGround = document.createElement('div') as HTMLDivElement;
            upBackGround.style.width = "100%";
            upBackGround.style.cssFloat = "left";
            chargeBackGround.appendChild(upBackGround);

            var downBackGround = document.createElement('div') as HTMLDivElement;
            downBackGround.style.width = "100%";
            downBackGround.style.cssFloat = "left";
            chargeBackGround.appendChild(downBackGround);

            var normalcharge = document.createElement("button") as HTMLButtonElement;
            upBackGround.appendChild(normalcharge)
            normalcharge.style.cssFloat = "left";
            normalcharge.style.width = "33%";
            normalcharge.textContent = "普通转账";
            normalcharge.onclick = () => {
                this.normalCharge(downBackGround);
            }
            normalcharge.click();

            var singlecharge = document.createElement("button") as HTMLButtonElement;
            upBackGround.appendChild(singlecharge)
            singlecharge.style.cssFloat = "left";
            singlecharge.style.width = "33%";
            singlecharge.textContent = "单链转账";
            singlecharge.onclick = () => {
                this.singleCharge(downBackGround);
            }

            var chainCharge = document.createElement("button") as HTMLButtonElement;
            upBackGround.appendChild(chainCharge)
            chainCharge.style.cssFloat = "left";
            chainCharge.style.width = "33%";
            chainCharge.textContent = "跨链转账";
            chainCharge.onclick = () => {
                this.chainCharge(downBackGround);
            }
        }

        async singleCharge(div:HTMLDivElement){
            if (div.firstChild)div.removeChild(div.firstChild);

            var singlebackground = document.createElement('div') as HTMLDivElement;
            div.appendChild(singlebackground);

            var asset = document.createElement('span') as HTMLSpanElement;
            singlebackground.appendChild(asset);
            asset.style.color = "#eeeeee";
            asset.textContent = "链名";

            var select = document.createElement("select") as HTMLSelectElement;
            singlebackground.appendChild(select);
            AppChainTool.getChain(select);

            var coin = document.createElement('span') as HTMLSpanElement;
            singlebackground.appendChild(coin);
            coin.style.color = "#eeeeee";
            coin.textContent = "余额";

            var coinNum = document.createElement('span') as HTMLSpanElement;
            singlebackground.appendChild(coinNum);
            coinNum.style.color = "#eeeeee";
            coinNum.textContent = await CoinTool.getGold("default", GUITool.address, "NEO");
            select.onchange = async (e) => {
                coinNum.textContent = await CoinTool.getGold("default", GUITool.address, (select.childNodes[select.selectedIndex] as HTMLOptionElement).value);
            }

            var button = document.createElement("button") as HTMLButtonElement;
            singlebackground.appendChild(button);
            button.textContent = "刷新";
            button.onclick = async () => {
                coinNum.textContent = await CoinTool.getGold("default", GUITool.address, (select.childNodes[select.selectedIndex] as HTMLOptionElement).value);
            }

            var addrText = document.createElement('span') as HTMLSpanElement;
            singlebackground.appendChild(addrText);
            addrText.style.color = "#eeeeee";
            addrText.textContent = "地址";

            var addr = document.createElement('input') as HTMLInputElement;
            singlebackground.appendChild(addr);

            var goldText = document.createElement('span') as HTMLSpanElement;
            singlebackground.appendChild(goldText);
            goldText.style.color = "#eeeeee";
            goldText.textContent = "金额";

            var gold = document.createElement('input') as HTMLInputElement;
            singlebackground.appendChild(gold);

            var btnSend = document.createElement('button') as HTMLButtonElement;
            singlebackground.appendChild(btnSend);
            btnSend.textContent = "发送";
            btnSend.onclick = async () => {
                if (coinNum.textContent == "0") return;
                switch((select.childNodes[select.selectedIndex] as HTMLOptionElement).value){                   
                    case "NEO":
                    var utxo = await WWW.rpc_getUTXO(GUITool.address);
                    return await AppChainTool.MakeInvokeTransaction(CoinTool.getassets(utxo),GUITool.address, addr.value, AppChainTool.neoBCP, parseInt(gold.value), GUITool.prikey, GUITool.pubkey);
                    default:
                    return await AppChainTool.MakeZoroTransaction(GUITool.address,addr.value, parseInt(gold.value), 
                    AppChainTool.zoroBCP, AppChainTool.zoroBCP, GUITool.prikey, GUITool.pubkey, (select.childNodes[select.selectedIndex] as HTMLOptionElement).value);
                }
            }
        }

        async normalCharge(div:HTMLDivElement){
            if (div.firstChild)div.removeChild(div.firstChild);

            var normalbackground = document.createElement('div') as HTMLDivElement;
            div.appendChild(normalbackground);

            var up = document.createElement('div') as HTMLDivElement;
            up.style.width = "100%"
            up.style.cssFloat = "left";
            normalbackground.appendChild(up);

            var asset = document.createElement('span') as HTMLSpanElement;
            up.appendChild(asset);
            asset.style.color = "#eeeeee";
            asset.textContent = "资产";

            var select = CoinTool.ZoroAsset();
            up.appendChild(select);            

            var coin = document.createElement('span') as HTMLSpanElement;
            up.appendChild(coin);
            coin.style.color = "#eeeeee";
            coin.textContent = "余额";

            var coinNum = document.createElement('span') as HTMLSpanElement;
            up.appendChild(coinNum);
            coinNum.style.color = "#eeeeee";
            coinNum.textContent = await CoinTool.getGold((select.childNodes[select.selectedIndex] as HTMLOptionElement).value, GUITool.address, AppChainTool.RootChain);
            select.onchange = async () => {
                coinNum.textContent = await CoinTool.getGold((select.childNodes[select.selectedIndex] as HTMLOptionElement).value, GUITool.address, AppChainTool.RootChain);
            }

            var addrText = document.createElement('span') as HTMLSpanElement;
            normalbackground.appendChild(addrText);
            addrText.style.color = "#eeeeee";
            addrText.textContent = "地址";

            var addr = document.createElement('input') as HTMLInputElement;
            normalbackground.appendChild(addr);

            var goldText = document.createElement('span') as HTMLSpanElement;
            normalbackground.appendChild(goldText);
            goldText.style.color = "#eeeeee";
            goldText.textContent = "金额";

            var gold = document.createElement('input') as HTMLInputElement;
            normalbackground.appendChild(gold);

            var btnSend = document.createElement('button') as HTMLButtonElement;
            normalbackground.appendChild(btnSend);
            btnSend.textContent = "发送";
            btnSend.onclick = async () => {
                if (coinNum.textContent == "0") return;
                switch((select.childNodes[select.selectedIndex] as HTMLOptionElement).value){
                    case "ZOROBCP":
                    return await AppChainTool.MakeZoroTransaction(GUITool.address,addr.value, parseInt(gold.value), 
                    AppChainTool.zoroBCP, AppChainTool.zoroBCP, GUITool.prikey, GUITool.pubkey, GUITool.chainHash);
                    case "NEOBCP":
                    var utxo = await WWW.rpc_getUTXO(GUITool.address);
                    return await AppChainTool.MakeInvokeTransaction(CoinTool.getassets(utxo),GUITool.address, addr.value, AppChainTool.neoBCP, parseInt(gold.value), GUITool.prikey, GUITool.pubkey);
                    case "NEO":
                    var utxo = await WWW.rpc_getUTXO(GUITool.address);
                    return await AppChainTool.MakeTransaction(CoinTool.getassets(utxo),addr.value, AppChainTool.id_NEO, parseInt(gold.value), GUITool.prikey, GUITool.pubkey);
                    case "GAS":
                    var utxo = await WWW.rpc_getUTXO(GUITool.address);
                    return await AppChainTool.MakeTransaction(CoinTool.getassets(utxo),addr.value, AppChainTool.id_GAS, parseInt(gold.value), GUITool.prikey, GUITool.pubkey);
                }
            }
        }

        async chainCharge(div:HTMLDivElement){
            if (div.firstChild)div.removeChild(div.firstChild);

            var chainbackground = document.createElement('div') as HTMLDivElement;
            div.appendChild(chainbackground);

            var asset = document.createElement('span') as HTMLSpanElement;
            chainbackground.appendChild(asset);
            asset.style.color = "#eeeeee";
            asset.textContent = "方法";

            var funcSelect = CoinTool.ZoroFunction();
            chainbackground.appendChild(funcSelect);

            var asset = document.createElement('span') as HTMLSpanElement;
            chainbackground.appendChild(asset);
            asset.style.color = "#eeeeee";
            asset.textContent = "资产";

            var coinSelect = document.createElement('select');
            var sitem = document.createElement("option");
            sitem.text = "BCP";
            sitem.value = "BCP";
            coinSelect.appendChild(sitem);
            chainbackground.appendChild(coinSelect);

            var coin = document.createElement('span') as HTMLSpanElement;
            chainbackground.appendChild(coin);
            coin.style.color = "#eeeeee";
            coin.textContent = "余额";

            var coinNum = document.createElement('span') as HTMLSpanElement;
            chainbackground.appendChild(coinNum);
            coinNum.style.color = "#eeeeee";
            coinNum.textContent = await CoinTool.getGold((funcSelect.childNodes[funcSelect.selectedIndex] as HTMLOptionElement).value, GUITool.address, GUITool.chainHash);

            var goldText = document.createElement('span') as HTMLSpanElement;
            chainbackground.appendChild(goldText);
            goldText.style.color = "#eeeeee";
            goldText.textContent = "金额";

            var gold = document.createElement('input') as HTMLInputElement;
            chainbackground.appendChild(gold);

            var btnSend = document.createElement('button') as HTMLButtonElement;
            chainbackground.appendChild(btnSend);
            btnSend.textContent = "发送";
            btnSend.onclick = async () => {
                if (coinNum.textContent == "0") return;
                switch((funcSelect.childNodes[funcSelect.selectedIndex] as HTMLOptionElement).value){
                    case "ZOROBCP":
                    return await AppChainTool.MakeZoroTransaction(GUITool.address, "AUB7tMoKTzN33iVVqhz98vnT3KiG4bqx3f", parseInt(gold.value), 
                    AppChainTool.Zorotransfer, AppChainTool.Zorotransfer, GUITool.prikey, GUITool.pubkey, GUITool.chainHash);
                    case "NEOBCP":
                    var utxo = await WWW.rpc_getUTXO(GUITool.address);
                    return await AppChainTool.MakeInvokeTransaction(CoinTool.getassets(utxo),GUITool.address, "AMjCDmrbfcBxGPitHcdrUYRyPXD7DfC52c", AppChainTool.Neotransfer, parseInt(gold.value), GUITool.prikey, GUITool.pubkey);
                }
            }
            funcSelect.onchange = async () => {
                coinNum.textContent = await CoinTool.getGold((funcSelect.childNodes[funcSelect.selectedIndex] as HTMLOptionElement).value, GUITool.address, GUITool.chainHash);
            }
        }              
    }
}