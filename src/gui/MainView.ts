/// <reference path="./Base.ts"/>
/// <reference path="./Title.ts"/>
namespace WebBrowser
{
    export class GUI_Main implements GUI_Base
    {
        div:HTMLDivElement;
        constructor(div:HTMLDivElement){
            this.div = div;                          
        }

        showUI(){
            
            this.mainMenu();
        }        

        hideUI(){

        }

        mainMenu():void{
            this.div.removeChild(this.div.firstChild);

            var background = document.createElement('div') as HTMLDivElement;
            this.div.appendChild(background);
            
            GUI_Route.instance.pushUI(PageName.Title, new GUI_Title(background)); 
            
            GUI_Route.instance.showUI(PageName.Title);
        }
    }
}