/// <reference path="../app.ts"/>
/// <reference path="../tools/AppChainTool.ts"/> 
/// <reference path="../tools/wwwtool.ts"/> 
/// <reference path="../gui/Base.ts"/>
/// <reference path="../gui/Login.ts"/>
/// <reference path="../gui/Wallet.ts"/>
/// <reference path="../gui/MainView.ts"/>
/// <reference path="../gui/GUIRoute.ts"/>
namespace WebBrowser
{
    export class GUI implements Page
    {
        app: App

        langType: string;
               
        getLangs() {
            if (this.langType != this.app.langmgr.type) {
                this.langType = this.app.langmgr.type
            }
        }

        initPage(){
            GUI_Route.instance.pushUI(PageName.Login, new GUI_Login(this.div));
            GUI_Route.instance.pushUI(PageName.Wallet, new GUI_Wallet(this.div));
            GUI_Route.instance.pushUI(PageName.MainView, new GUI_Main(this.div));
        }

        div: HTMLDivElement = document.getElementById('gui-info') as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        constructor(app: App = null)  {
            this.app = app
            Neo.Cryptography.RandomNumberGenerator.startCollectors();
            AppChainTool.initAppChainSelectList();
            this.initPage();
        }                           
      
        start(): void
        {
            this.getLangs();

            GUI_Route.instance.showUI(PageName.Login);     

            this.div.hidden = false;
			this.footer.hidden = false;
        }
        close(): void
        {
            GUI_Route.instance.hideUI(PageName.Title);
            this.div.hidden = true;
			this.footer.hidden = true;
        }
    }
}