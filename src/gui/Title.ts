/// <reference path="./Base.ts"/>
/// <reference path="./Asset.ts"/>
/// <reference path="./Charge.ts"/>
/// <reference path="./AppChain.ts"/>
/// <reference path="./Contract.ts"/>
/// <reference path="./TxMessage.ts"/>
namespace WebBrowser
{
    export class GUI_Title implements GUI_Base
    {
        div:HTMLDivElement;
        title:HTMLDivElement;
        mainValueBackGround:HTMLDivElement;

        public height:HTMLSpanElement;
        selectAppChain:HTMLSelectElement;
        selectIndex:number;   

        constructor(div:HTMLDivElement){
            this.div = div;   

            this.title = document.createElement('div') as HTMLDivElement;
            this.title.style.width = "100%";
            this.div.appendChild(this.title);

            this.mainValueBackGround = document.createElement('div') as HTMLDivElement;
            this.mainValueBackGround.style.width = "100%";
            this.div.appendChild(this.mainValueBackGround);

            GUI_Route.instance.pushUI(PageName.Asset, new GUI_Asset(this.mainValueBackGround));
            GUI_Route.instance.pushUI(PageName.Charge, new GUI_Charge(this.mainValueBackGround));
            GUI_Route.instance.pushUI(PageName.AppChain, new GUI_AppChain(this.mainValueBackGround));
            GUI_Route.instance.pushUI(PageName.Contract, new GUI_Contract(this.mainValueBackGround));
            GUI_Route.instance.pushUI(PageName.TxMessage, new GUI_TxMessage(this.mainValueBackGround));
        }

        showUI(){           
            this.showTitle(this.title);
        }        

        hideUI(){
            this.stopUpdate();
            if (this.title){
                if (this.height){this.title.removeChild(this.height);this.height = null}
                if (this.selectAppChain){this.title.removeChild(this.selectAppChain);this.selectAppChain = null}
            }           
        }

        showTitle(title):void{                       
            var asset = document.createElement("button") as HTMLButtonElement;
            title.appendChild(asset)
            asset.style.cssFloat = "left";
            asset.style.width = "10%";
            asset.textContent = "资产";
            asset.onclick = () => {
                GUI_Route.instance.showUI(PageName.Asset);
                this.addSelect();
            }
            asset.click();

            var charge = document.createElement("button") as HTMLButtonElement;
            title.appendChild(charge)
            charge.style.cssFloat = "left";
            charge.style.width = "10%";
            charge.textContent = "转账";
            charge.onclick = () => {
                GUI_Route.instance.showUI(PageName.Charge);
            }

            var appChain = document.createElement("button") as HTMLButtonElement;
            title.appendChild(appChain)
            appChain.style.cssFloat = "left";
            appChain.style.width = "10%";
            appChain.textContent = "应用链";
            appChain.onclick = () => {
                GUI_Route.instance.showUI(PageName.AppChain);
            }

            var contract = document.createElement("button") as HTMLButtonElement;
            title.appendChild(contract)
            contract.style.cssFloat = "left";
            contract.style.width = "10%";
            contract.textContent = "发布合约";
            contract.onclick = () => {
                GUI_Route.instance.showUI(PageName.Contract);
            }

            var transaction = document.createElement("button") as HTMLButtonElement;
            title.appendChild(transaction)
            transaction.style.cssFloat = "left";
            transaction.style.width = "10%";
            transaction.textContent = "交易记录";
            transaction.onclick = () => {
                GUI_Route.instance.showUI(PageName.TxMessage);
            }

            var message = document.createElement("button") as HTMLButtonElement;
            title.appendChild(message)
            message.style.cssFloat = "left";
            message.style.width = "10%";
            message.textContent = "信息";
            message.onclick = () => {
                
            }                    
        }

        addSelect(){
            this.hideUI();
            this.initAppChain();
            this.update();

            this.selectAppChain = document.createElement("select") as HTMLSelectElement;     
            this.selectAppChain.style.cssFloat = "right";
            this.selectAppChain.style.width = "15%";
            this.title.appendChild(this.selectAppChain);  

            this.height = document.createElement("span") as HTMLSpanElement;
            this.height.style.color = "#eeeeee";
            this.title.appendChild(this.height)
            this.height.style.cssFloat = "right";
            this.height.style.width = "6%";
            this.height.textContent = "0";    
        }

        timeOut;
        async update(): Promise<void>
        {                
            if (GUITool.chainHash){
                if (GUITool.chainHash == "NEO"){
                    var height = await WWW.api_getNEOHeight();
                }else{
                    var height = await WWW.api_getZoroHeight(GUITool.chainHash);
                }
                this.height.textContent = isNaN(height)?"N/A":height.toString();
            }else{
                GUITool.chainHash = "NEO";
                if (GUITool.chainHash == "NEO"){
                    var height = await WWW.api_getNEOHeight();
                }else{
                    var height = await WWW.api_getZoroHeight(GUITool.chainHash);
                } 
                this.height.textContent = isNaN(height)?"N/A":height.toString();      
            }                

            if (height > WWW.blockHeight){
                WWW.blockHeight = height;
                AppChainTool.updateAllAppChain();
                if (WWW.chainHashLength < AppChainTool.appChainLength){
                    WWW.chainHashLength = AppChainTool.appChainLength;
                    this.updateAppChain();
                }               
            }
            this.timeOut = setTimeout(() => { this.update() }, 1000);
        }

        stopUpdate(){
            clearTimeout(this.timeOut);
        }

        selectClear():void{
            if (this.selectAppChain)
            while(this.selectAppChain.childNodes.length > 0){                
                this.selectAppChain.removeChild(this.selectAppChain.options[0]);
                this.selectAppChain.remove(0);   
                this.selectAppChain.options[0] = null;            
            }
        }

        async updateAppChain(){
            this.selectClear();
            var name2Hash = await AppChainTool.initAllAppChain();
            for (var chainName in name2Hash){
                var sitem = document.createElement("option");
                sitem.text = chainName;
                sitem.value = name2Hash[chainName];
                this.selectAppChain.appendChild(sitem);
            }
            this.selectAppChain.selectedIndex = this.selectIndex;
        }

        async initAppChain(){  
            this.selectClear();
            var name2Hash = await AppChainTool.initAllAppChain()
            for (var chainName in name2Hash){
                var sitem = document.createElement("option");
                sitem.text = chainName;
                sitem.value = name2Hash[chainName];
                this.selectAppChain.appendChild(sitem);
            }
            this.selectAppChain.onchange = (ev) =>{
                this.updateHeight();
                GUI_Route.instance.showUI(PageName.Asset);
            }
        }

        async updateHeight(){
            this.selectIndex = this.selectAppChain.selectedIndex;
            GUITool.chainHash = (this.selectAppChain.childNodes[this.selectIndex] as HTMLOptionElement).value; 
            if (GUITool.chainHash == "NEO"){
                var height = await WWW.api_getNEOHeight();
            }else{
                var height = await WWW.api_getZoroHeight(GUITool.chainHash);
            }            
            this.height.textContent = isNaN(height)?"N/A":height.toString(); 
        }
    }
}