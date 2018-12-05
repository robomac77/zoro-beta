namespace WebBrowser
{
    export class GUITool{
        static chainHash: any;
        static prikey:any;
        static pubkey:any;
        static address:string;
    }
    export interface GUI_Base
    {
        div:HTMLDivElement;
        showUI():void;
        hideUI():void;
    }
}