/// <reference path="./Base.ts"/>
namespace WebBrowser
{
    export class GUI_Route{
        pageName:GUI_Base[] = [];

        private static route:GUI_Route = null;
        public static get instance():GUI_Route{
            if (this.route == null){
                this.route = new GUI_Route();
            }
            return this.route;
        }

        public showUI(pageName:PageName){
            if (this.pageName[pageName])
            this.pageName[pageName].showUI();
        }

        public pushUI(pageName:PageName, base:GUI_Base){
            this.pageName[pageName] = base;
        }

        public hideUI(pageName:PageName){
            if (this.pageName[pageName])
            this.pageName[pageName].hideUI();
        }

        public getUI(pageName:PageName){
            if (this.pageName[pageName])
            return this.pageName[pageName];
            return null;
        }
    }

    export enum PageName{
        Login,
        Wallet,
        MainView,
        Title,
        Asset,
        Charge,
        AppChain,
        Contract,
        TxMessage
    }
}