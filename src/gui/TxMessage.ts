/// <reference path="./Base.ts"/>
namespace WebBrowser
{
    export class GUI_TxMessage implements GUI_Base
    {
        div:HTMLDivElement;
        constructor(div:HTMLDivElement){
            this.div = div;   
        }

        showUI(){
            this.mainTransaction(this.div);
            GUI_Route.instance.hideUI(PageName.Title);
        }        

        hideUI(){

        }

        mainTransaction(div:HTMLDivElement):void{
            if (div.firstChild)
            div.removeChild(div.firstChild);

            var transactionBackGround = document.createElement('div') as HTMLDivElement;
            transactionBackGround.style.width = "100%";
            transactionBackGround.style.cssFloat = "left";
            div.appendChild(transactionBackGround);

            var TransactionText = document.createElement('span') as HTMLSpanElement;
            TransactionText.style.color = "#eeeeee";
            TransactionText.textContent = "交易记录";
            transactionBackGround.appendChild(TransactionText);

            var txidText = document.createElement('span') as HTMLSpanElement;
            txidText.style.color = "#eeeeee";
            txidText.textContent = "TXID";
            transactionBackGround.appendChild(txidText);

            var timeText = document.createElement('span') as HTMLSpanElement;
            timeText.style.color = "#eeeeee";
            timeText.textContent = "Date";
            transactionBackGround.appendChild(timeText);
        }
    }
}