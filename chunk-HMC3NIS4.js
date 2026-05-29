import{a as Me}from"./chunk-YNUT7U53.js";import{a as Oe,b as We}from"./chunk-4MSY57FM.js";import{a as ze,b as Fe}from"./chunk-Z2SGOUW4.js";import{a as je,b as Je}from"./chunk-LJNBHYK5.js";import{a as ke,d as Ne}from"./chunk-5V635Z4R.js";import{b as Ee,c as Se,i as D,p as Ie,r as De,s as Be,u as Ae,v as Pe}from"./chunk-4WGVVDHT.js";import{c as ye,f as Ce,l as we,z as Te}from"./chunk-OOVPJAYP.js";import{ha as N,ia as j,ua as he}from"./chunk-BUCZD23N.js";import{a as xe}from"./chunk-OKSKZ43J.js";import"./chunk-2R3ADUO6.js";import"./chunk-HBDPK3DB.js";import"./chunk-LCTQUIF2.js";import{d as ve}from"./chunk-TDLJ26WS.js";import"./chunk-CRU4LWNS.js";import"./chunk-R2DJ7RBN.js";import{g as be,i as fe,k as _e,p as F}from"./chunk-GY2M5X7I.js";import{$ as G,Ac as ge,Ca as B,Cb as P,Da as K,Db as S,Hb as w,Ia as r,Ic as L,J as R,Jb as c,K as q,Kb as ie,Lb as se,M as U,Mb as ae,O as h,Ob as k,Pb as I,Sb as re,T as x,U as y,Ub as le,V as Q,Vb as W,Wb as v,Xb as d,Ya as A,Yb as ue,Za as X,Zb as z,ac as T,bb as Y,bc as M,cb as Z,cc as E,db as f,ea as C,ec as ce,fc as V,gc as de,ia as O,kb as b,lb as $,mb as ee,nb as p,ob as m,qb as te,rb as ne,rc as pe,sb as oe,tb as u,ub as i,vb as s,wb as g,wc as me}from"./chunk-CGR4FBK6.js";import{a as J}from"./chunk-C6Q5SG76.js";var Ve=`
    .p-message {
        display: grid;
        grid-template-rows: 1fr;
        border-radius: dt('message.border.radius');
        outline-width: dt('message.border.width');
        outline-style: solid;
    }

    .p-message-content-wrapper {
        min-height: 0;
    }

    .p-message-content {
        display: flex;
        align-items: center;
        padding: dt('message.content.padding');
        gap: dt('message.content.gap');
    }

    .p-message-icon {
        flex-shrink: 0;
    }

    .p-message-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-inline-start: auto;
        overflow: hidden;
        position: relative;
        width: dt('message.close.button.width');
        height: dt('message.close.button.height');
        border-radius: dt('message.close.button.border.radius');
        background: transparent;
        transition:
            background dt('message.transition.duration'),
            color dt('message.transition.duration'),
            outline-color dt('message.transition.duration'),
            box-shadow dt('message.transition.duration'),
            opacity 0.3s;
        outline-color: transparent;
        color: inherit;
        padding: 0;
        border: none;
        cursor: pointer;
        user-select: none;
    }

    .p-message-close-icon {
        font-size: dt('message.close.icon.size');
        width: dt('message.close.icon.size');
        height: dt('message.close.icon.size');
    }

    .p-message-close-button:focus-visible {
        outline-width: dt('message.close.button.focus.ring.width');
        outline-style: dt('message.close.button.focus.ring.style');
        outline-offset: dt('message.close.button.focus.ring.offset');
    }

    .p-message-info {
        background: dt('message.info.background');
        outline-color: dt('message.info.border.color');
        color: dt('message.info.color');
        box-shadow: dt('message.info.shadow');
    }

    .p-message-info .p-message-close-button:focus-visible {
        outline-color: dt('message.info.close.button.focus.ring.color');
        box-shadow: dt('message.info.close.button.focus.ring.shadow');
    }

    .p-message-info .p-message-close-button:hover {
        background: dt('message.info.close.button.hover.background');
    }

    .p-message-info.p-message-outlined {
        color: dt('message.info.outlined.color');
        outline-color: dt('message.info.outlined.border.color');
    }

    .p-message-info.p-message-simple {
        color: dt('message.info.simple.color');
    }

    .p-message-success {
        background: dt('message.success.background');
        outline-color: dt('message.success.border.color');
        color: dt('message.success.color');
        box-shadow: dt('message.success.shadow');
    }

    .p-message-success .p-message-close-button:focus-visible {
        outline-color: dt('message.success.close.button.focus.ring.color');
        box-shadow: dt('message.success.close.button.focus.ring.shadow');
    }

    .p-message-success .p-message-close-button:hover {
        background: dt('message.success.close.button.hover.background');
    }

    .p-message-success.p-message-outlined {
        color: dt('message.success.outlined.color');
        outline-color: dt('message.success.outlined.border.color');
    }

    .p-message-success.p-message-simple {
        color: dt('message.success.simple.color');
    }

    .p-message-warn {
        background: dt('message.warn.background');
        outline-color: dt('message.warn.border.color');
        color: dt('message.warn.color');
        box-shadow: dt('message.warn.shadow');
    }

    .p-message-warn .p-message-close-button:focus-visible {
        outline-color: dt('message.warn.close.button.focus.ring.color');
        box-shadow: dt('message.warn.close.button.focus.ring.shadow');
    }

    .p-message-warn .p-message-close-button:hover {
        background: dt('message.warn.close.button.hover.background');
    }

    .p-message-warn.p-message-outlined {
        color: dt('message.warn.outlined.color');
        outline-color: dt('message.warn.outlined.border.color');
    }

    .p-message-warn.p-message-simple {
        color: dt('message.warn.simple.color');
    }

    .p-message-error {
        background: dt('message.error.background');
        outline-color: dt('message.error.border.color');
        color: dt('message.error.color');
        box-shadow: dt('message.error.shadow');
    }

    .p-message-error .p-message-close-button:focus-visible {
        outline-color: dt('message.error.close.button.focus.ring.color');
        box-shadow: dt('message.error.close.button.focus.ring.shadow');
    }

    .p-message-error .p-message-close-button:hover {
        background: dt('message.error.close.button.hover.background');
    }

    .p-message-error.p-message-outlined {
        color: dt('message.error.outlined.color');
        outline-color: dt('message.error.outlined.border.color');
    }

    .p-message-error.p-message-simple {
        color: dt('message.error.simple.color');
    }

    .p-message-secondary {
        background: dt('message.secondary.background');
        outline-color: dt('message.secondary.border.color');
        color: dt('message.secondary.color');
        box-shadow: dt('message.secondary.shadow');
    }

    .p-message-secondary .p-message-close-button:focus-visible {
        outline-color: dt('message.secondary.close.button.focus.ring.color');
        box-shadow: dt('message.secondary.close.button.focus.ring.shadow');
    }

    .p-message-secondary .p-message-close-button:hover {
        background: dt('message.secondary.close.button.hover.background');
    }

    .p-message-secondary.p-message-outlined {
        color: dt('message.secondary.outlined.color');
        outline-color: dt('message.secondary.outlined.border.color');
    }

    .p-message-secondary.p-message-simple {
        color: dt('message.secondary.simple.color');
    }

    .p-message-contrast {
        background: dt('message.contrast.background');
        outline-color: dt('message.contrast.border.color');
        color: dt('message.contrast.color');
        box-shadow: dt('message.contrast.shadow');
    }

    .p-message-contrast .p-message-close-button:focus-visible {
        outline-color: dt('message.contrast.close.button.focus.ring.color');
        box-shadow: dt('message.contrast.close.button.focus.ring.shadow');
    }

    .p-message-contrast .p-message-close-button:hover {
        background: dt('message.contrast.close.button.hover.background');
    }

    .p-message-contrast.p-message-outlined {
        color: dt('message.contrast.outlined.color');
        outline-color: dt('message.contrast.outlined.border.color');
    }

    .p-message-contrast.p-message-simple {
        color: dt('message.contrast.simple.color');
    }

    .p-message-text {
        font-size: dt('message.text.font.size');
        font-weight: dt('message.text.font.weight');
    }

    .p-message-icon {
        font-size: dt('message.icon.size');
        width: dt('message.icon.size');
        height: dt('message.icon.size');
    }

    .p-message-sm .p-message-content {
        padding: dt('message.content.sm.padding');
    }

    .p-message-sm .p-message-text {
        font-size: dt('message.text.sm.font.size');
    }

    .p-message-sm .p-message-icon {
        font-size: dt('message.icon.sm.size');
        width: dt('message.icon.sm.size');
        height: dt('message.icon.sm.size');
    }

    .p-message-sm .p-message-close-icon {
        font-size: dt('message.close.icon.sm.size');
        width: dt('message.close.icon.sm.size');
        height: dt('message.close.icon.sm.size');
    }

    .p-message-lg .p-message-content {
        padding: dt('message.content.lg.padding');
    }

    .p-message-lg .p-message-text {
        font-size: dt('message.text.lg.font.size');
    }

    .p-message-lg .p-message-icon {
        font-size: dt('message.icon.lg.size');
        width: dt('message.icon.lg.size');
        height: dt('message.icon.lg.size');
    }

    .p-message-lg .p-message-close-icon {
        font-size: dt('message.close.icon.lg.size');
        width: dt('message.close.icon.lg.size');
        height: dt('message.close.icon.lg.size');
    }

    .p-message-outlined {
        background: transparent;
        outline-width: dt('message.outlined.border.width');
    }

    .p-message-simple {
        background: transparent;
        outline-color: transparent;
        box-shadow: none;
    }

    .p-message-simple .p-message-content {
        padding: dt('message.simple.content.padding');
    }

    .p-message-outlined .p-message-close-button:hover,
    .p-message-simple .p-message-close-button:hover {
        background: transparent;
    }

    .p-message-enter-active {
        animation: p-animate-message-enter 0.3s ease-out forwards;
        overflow: hidden;
    }

    .p-message-leave-active {
        animation: p-animate-message-leave 0.15s ease-in forwards;
        overflow: hidden;
    }

    @keyframes p-animate-message-enter {
        from {
            opacity: 0;
            grid-template-rows: 0fr;
        }
        to {
            opacity: 1;
            grid-template-rows: 1fr;
        }
    }

    @keyframes p-animate-message-leave {
        from {
            opacity: 1;
            grid-template-rows: 1fr;
        }
        to {
            opacity: 0;
            margin: 0;
            grid-template-rows: 0fr;
        }
    }
`;var Qe=["container"],Ge=["icon"],Ke=["closeicon"],Xe=["*"],Ye=t=>({closeCallback:t});function Ze(t,a){t&1&&P(0)}function $e(t,a){if(t&1&&f(0,Ze,1,0,"ng-container",4),t&2){let e=c();u("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)}}function et(t,a){if(t&1&&g(0,"i",1),t&2){let e=c();v(e.cn(e.cx("icon"),e.icon)),u("pBind",e.ptm("icon")),b("data-p",e.dataP)}}function tt(t,a){t&1&&P(0)}function nt(t,a){if(t&1&&f(0,tt,1,0,"ng-container",5),t&2){let e=c();u("ngTemplateOutlet",e.containerTemplate||e._containerTemplate)("ngTemplateOutletContext",de(2,Ye,e.closeCallback))}}function ot(t,a){if(t&1&&g(0,"span",9),t&2){let e=c(3);u("pBind",e.ptm("text"))("ngClass",e.cx("text"))("innerHTML",e.text,B),b("data-p",e.dataP)}}function it(t,a){if(t&1&&(i(0,"div"),f(1,ot,1,4,"span",8),s()),t&2){let e=c(2);r(),u("ngIf",!e.escape)}}function st(t,a){if(t&1&&(i(0,"span",7),d(1),s()),t&2){let e=c(3);u("pBind",e.ptm("text"))("ngClass",e.cx("text")),b("data-p",e.dataP),r(),ue(e.text)}}function at(t,a){if(t&1&&f(0,st,2,4,"span",10),t&2){let e=c(2);u("ngIf",e.escape&&e.text)}}function rt(t,a){if(t&1&&(f(0,it,2,1,"div",6)(1,at,1,1,"ng-template",null,0,pe),i(3,"span",7),se(4),s()),t&2){let e=re(2),o=c();u("ngIf",!o.escape)("ngIfElse",e),r(3),u("pBind",o.ptm("text"))("ngClass",o.cx("text")),b("data-p",o.dataP)}}function lt(t,a){if(t&1&&g(0,"i",7),t&2){let e=c(2);v(e.cn(e.cx("closeIcon"),e.closeIcon)),u("pBind",e.ptm("closeIcon"))("ngClass",e.closeIcon),b("data-p",e.dataP)}}function ut(t,a){t&1&&P(0)}function ct(t,a){if(t&1&&f(0,ut,1,0,"ng-container",4),t&2){let e=c(2);u("ngTemplateOutlet",e.closeIconTemplate||e._closeIconTemplate)}}function dt(t,a){if(t&1&&(Q(),g(0,"svg",14)),t&2){let e=c(2);v(e.cx("closeIcon")),u("pBind",e.ptm("closeIcon")),b("data-p",e.dataP)}}function pt(t,a){if(t&1){let e=S();i(0,"button",11),w("click",function(n){x(e);let l=c();return y(l.close(n))}),p(1,lt,1,5,"i",12),p(2,ct,1,1,"ng-container"),p(3,dt,1,4,":svg:svg",13),s()}if(t&2){let e=c();v(e.cx("closeButton")),u("pBind",e.ptm("closeButton")),b("aria-label",e.closeAriaLabel)("data-p",e.dataP),r(),m(e.closeIcon?1:-1),r(),m(e.closeIconTemplate||e._closeIconTemplate?2:-1),r(),m(!e.closeIconTemplate&&!e._closeIconTemplate&&!e.closeIcon?3:-1)}}var mt={root:({instance:t})=>["p-message p-component p-message-"+t.severity,t.variant&&"p-message-"+t.variant,{"p-message-sm":t.size==="small","p-message-lg":t.size==="large"}],contentWrapper:"p-message-content-wrapper",content:"p-message-content",icon:"p-message-icon",text:"p-message-text",closeButton:"p-message-close-button",closeIcon:"p-message-close-icon"},Le=(()=>{class t extends he{name="message";style=Ve;classes=mt;static \u0275fac=(()=>{let e;return function(n){return(e||(e=O(t)))(n||t)}})();static \u0275prov=R({token:t,factory:t.\u0275fac})}return t})();var He=new U("MESSAGE_INSTANCE"),H=(()=>{class t extends Se{componentName="Message";_componentStyle=h(Le);bindDirectiveInstance=h(D,{self:!0});$pcMessage=h(He,{optional:!0,skipSelf:!0})??void 0;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}severity="info";text;escape=!0;style;styleClass;closable=!1;icon;closeIcon;life;showTransitionOptions="300ms ease-out";hideTransitionOptions="200ms cubic-bezier(0.86, 0, 0.07, 1)";size;variant;motionOptions=ge(void 0);computedMotionOptions=me(()=>J(J({},this.ptm("motion")),this.motionOptions()));onClose=new G;get closeAriaLabel(){return this.config.translation.aria?this.config.translation.aria.close:void 0}visible=C(!0);containerTemplate;iconTemplate;closeIconTemplate;templates;_containerTemplate;_iconTemplate;_closeIconTemplate;closeCallback=e=>{this.close(e)};onInit(){this.life&&setTimeout(()=>{this.visible.set(!1)},this.life)}onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"container":this._containerTemplate=e.template;break;case"icon":this._iconTemplate=e.template;break;case"closeicon":this._closeIconTemplate=e.template;break}})}close(e){this.visible.set(!1),this.onClose.emit({originalEvent:e})}get dataP(){return this.cn({outlined:this.variant==="outlined",simple:this.variant==="simple",[this.severity]:this.severity,[this.size]:this.size})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=O(t)))(n||t)}})();static \u0275cmp=A({type:t,selectors:[["p-message"]],contentQueries:function(o,n,l){if(o&1&&ae(l,Qe,4)(l,Ge,4)(l,Ke,4)(l,N,4),o&2){let _;k(_=I())&&(n.containerTemplate=_.first),k(_=I())&&(n.iconTemplate=_.first),k(_=I())&&(n.closeIconTemplate=_.first),k(_=I())&&(n.templates=_)}},hostAttrs:["role","alert","aria-live","polite"],hostVars:5,hostBindings:function(o,n){o&1&&($(function(){return"p-message-enter-active"}),ee(function(){return"p-message-leave-active"})),o&2&&(b("data-p",n.dataP),v(n.cn(n.cx("root"),n.styleClass)),le("p-message-leave-active",!n.visible()))},inputs:{severity:"severity",text:"text",escape:[2,"escape","escape",L],style:"style",styleClass:"styleClass",closable:[2,"closable","closable",L],icon:"icon",closeIcon:"closeIcon",life:"life",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",size:"size",variant:"variant",motionOptions:[1,"motionOptions"]},outputs:{onClose:"onClose"},features:[ce([Le,{provide:He,useExisting:t},{provide:Ee,useExisting:t}]),Y([D]),Z],ngContentSelectors:Xe,decls:7,vars:12,consts:[["escapeOut",""],[3,"pBind"],[3,"pBind","class"],["pRipple","","type","button",3,"pBind","class"],[4,"ngTemplateOutlet"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngIf","ngIfElse"],[3,"pBind","ngClass"],[3,"pBind","ngClass","innerHTML",4,"ngIf"],[3,"pBind","ngClass","innerHTML"],[3,"pBind","ngClass",4,"ngIf"],["pRipple","","type","button",3,"click","pBind"],[3,"pBind","class","ngClass"],["data-p-icon","times",3,"pBind","class"],["data-p-icon","times",3,"pBind"]],template:function(o,n){o&1&&(ie(),i(0,"div",1)(1,"div",1),p(2,$e,1,1,"ng-container"),p(3,et,1,4,"i",2),p(4,nt,1,4,"ng-container")(5,rt,5,5),p(6,pt,4,8,"button",3),s()()),o&2&&(v(n.cx("contentWrapper")),u("pBind",n.ptm("contentWrapper")),b("data-p",n.dataP),r(),v(n.cx("content")),u("pBind",n.ptm("content")),b("data-p",n.dataP),r(),m(n.iconTemplate||n._iconTemplate?2:-1),r(),m(n.icon?3:-1),r(),m(n.containerTemplate||n._containerTemplate?4:5),r(2),m(n.closable?6:-1))},dependencies:[F,be,fe,_e,ke,Ie,j,D,Ne],encapsulation:2,changeDetection:0})}return t})(),Re=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=X({type:t});static \u0275inj=q({imports:[H,j,j]})}return t})();var bt=()=>({width:"35vw"}),ft=()=>({width:"100%",maxWidth:"300px"});function _t(t,a){if(t&1&&(i(0,"div",21),g(1,"img",27)(2,"div",28),i(3,"div",29),g(4,"p-tag",30),i(5,"h1",31),d(6),s()()()),t&2){let e=c();r(),u("src",e.preview,K)("alt",e.title),r(3),u("severity",e.status==="active"?"success":"danger")("value",e.status==="active"?"\u0410\u043A\u0442\u0438\u0432\u043D\u0430":"\u0417\u0430\u043A\u0440\u0438\u0442\u0430"),r(2),z(" ",e.title," ")}}function vt(t,a){if(t&1){let e=S();i(0,"p-button",36),w("onClick",function(){x(e);let n=c(3);return y(n.openApplyModal())}),s()}}function ht(t,a){if(t&1&&(i(0,"div",22)(1,"div",32)(2,"div"),g(3,"p-tag",33),i(4,"h1",34),d(5),s()(),p(6,vt,1,0,"p-button",35),s()()),t&2){let e=c();r(3),u("severity",e.status==="active"?"success":"danger")("value",e.status==="active"?"\u0410\u043A\u0442\u0438\u0432\u043D\u0430":"\u0417\u0430\u043A\u0440\u0438\u0442\u0430"),r(2),z(" ",e.title," "),r(),m(e.status==="active"?6:-1)}}function xt(t,a){if(t&1&&(i(0,"span",38),d(1),s()),t&2){let e=a.$implicit;r(),z(" ",e," ")}}function yt(t,a){if(t&1&&(i(0,"div")(1,"h3",24),d(2,"\u0412\u0438\u043C\u043E\u0433\u0438"),s(),i(3,"div",37),ne(4,xt,2,1,"span",38,te),s()()),t&2){let e=c();r(4),oe(e.requirements)}}function Ct(t,a){if(t&1){let e=S();i(0,"div",26)(1,"h2",39),d(2,"\u0413\u043E\u0442\u043E\u0432\u0456 \u043F\u0440\u0438\u0454\u0434\u043D\u0430\u0442\u0438\u0441\u044F?"),s(),i(3,"p",40),d(4," \u041C\u0438 \u0448\u0443\u043A\u0430\u0454\u043C\u043E \u0442\u0430\u043B\u0430\u043D\u043E\u0432\u0438\u0442\u0438\u0445 \u043B\u044E\u0434\u0435\u0439, \u044F\u043A\u0456 \u0445\u043E\u0447\u0443\u0442\u044C \u0440\u043E\u0437\u0432\u0438\u0432\u0430\u0442\u0438 IT-\u0441\u043F\u0456\u043B\u044C\u043D\u043E\u0442\u0443 \u043D\u0430\u0448\u043E\u0433\u043E \u043C\u0456\u0441\u0442\u0430. "),s(),i(5,"p-button",41),w("onClick",function(){x(e);let n=c(2);return y(n.openApplyModal())}),s()()}t&2&&(r(5),W(V(2,ft)))}function wt(t,a){if(t&1&&(i(0,"div",4),p(1,_t,7,5,"div",21)(2,ht,7,4,"div",22),i(3,"div",23),p(4,yt,6,0,"div"),i(5,"div")(6,"h3",24),d(7,"\u041E\u043F\u0438\u0441 \u0432\u0430\u043A\u0430\u043D\u0441\u0456\u0457"),s(),g(8,"div",25),s()(),p(9,Ct,6,3,"div",26),s()),t&2){let e=a;r(),m(e.preview?1:2),r(3),m(e.requirements&&e.requirements.length>0?4:-1),r(4),u("innerHTML",e.description,B),r(),m(e.status==="active"?9:-1)}}function Tt(t,a){t&1&&(i(0,"div",5),g(1,"div",42),i(2,"p",43),d(3,"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0434\u0435\u0442\u0430\u043B\u0435\u0439 \u0432\u0430\u043A\u0430\u043D\u0441\u0456\u0457..."),s()())}function Mt(t,a){if(t&1){let e=S();i(0,"p-button",44),w("onClick",function(){x(e);let n=c();return y(n.closeApplyModal())}),s(),i(1,"p-button",45),w("onClick",function(){x(e);let n=c();return y(n.submitApplication())}),s()}if(t&2){let e=c();u("text",!0),r(),u("loading",e.isSending())("disabled",!e.proposal.candidateName||!e.proposal.email)}}function Et(t,a){t&1&&(i(0,"div",20),g(1,"p-message",46),s())}var qe=class t{id;jobService=h(xe);jobProposalService=h(Me);job=C(null);isApplying=C(!1);isSubmitted=C(!1);isSending=C(!1);proposal={candidateName:"",email:"",phone:"",cvUrl:"",message:""};ngOnInit(){this.id&&this.jobService.fetch(this.id).subscribe({next:a=>this.job.set(a),error:a=>console.error("Error fetching job:",a)})}openApplyModal(){this.isApplying.set(!0)}closeApplyModal(){this.isApplying.set(!1)}submitApplication(){let a=this.job();!a?._id||this.isSending()||(this.isSending.set(!0),this.jobProposalService.create({candidateName:this.proposal.candidateName,email:this.proposal.email,phone:this.proposal.phone,cvUrl:this.proposal.cvUrl,message:this.proposal.message,jobId:a._id,status:"new"}).subscribe({next:e=>{this.isSending.set(!1),e&&(this.isSubmitted.set(!0),this.isApplying.set(!1),this.proposal={candidateName:"",email:"",phone:"",cvUrl:"",message:""})},error:e=>{this.isSending.set(!1),console.error("Apply error:",e)}}))}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=A({type:t,selectors:[["app-public-job"]],inputs:{id:"id"},decls:31,vars:14,consts:[[1,"job-detail-page","bg-slate-50","dark:bg-slate-900","min-h-screen","py-12","px-4","sm:px-6","lg:px-8"],[1,"max-w-4xl","mx-auto"],["routerLink","/jobs",1,"inline-flex","items-center","text-sm","font-bold","text-[var(--c-primary)]","hover:underline","mb-8","gap-2"],[1,"pi","pi-arrow-left","text-sm"],[1,"bg-[var(--c-bg-secondary)]","rounded-[3rem]","border","border-[var(--c-border)]","overflow-hidden","shadow-sm"],[1,"flex","flex-col","items-center","justify-center","py-32"],["header","\u041F\u043E\u0434\u0430\u0442\u0438 \u0437\u0430\u044F\u0432\u043A\u0443",3,"visibleChange","visible","modal","draggable","resizable"],[1,"flex","flex-col","gap-4","py-4"],[1,"flex","flex-col","gap-2"],["for","name",1,"font-bold"],["pInputText","","id","name","placeholder","\u0406\u0432\u0430\u043D \u0406\u0432\u0430\u043D\u043E\u0432",3,"ngModelChange","ngModel"],["for","email",1,"font-bold"],["pInputText","","id","email","placeholder","ivan@example.com",3,"ngModelChange","ngModel"],["for","phone",1,"font-bold"],["pInputText","","id","phone","placeholder","+380...",3,"ngModelChange","ngModel"],["for","cv",1,"font-bold"],["pInputText","","id","cv","placeholder","https://linkedin.com/in/...",3,"ngModelChange","ngModel"],["for","message",1,"font-bold"],["pInputTextarea","","id","message","rows","4","placeholder","\u0427\u043E\u043C\u0443 \u0441\u0430\u043C\u0435 \u0432\u0438?",3,"ngModelChange","ngModel"],["pTemplate","footer"],[1,"fixed","bottom-10","right-10","z-50"],[1,"relative","h-64","sm:h-80","w-full","overflow-hidden","bg-[var(--c-bg-primary)]"],[1,"p-8","sm:p-12","border-b","border-[var(--c-border)]"],[1,"p-8","sm:p-12","space-y-12"],[1,"text-sm","font-black","uppercase","tracking-widest","text-[var(--c-text-muted)]","mb-4"],[1,"prose","prose-lg","dark:prose-invert","max-w-none","text-[var(--c-text-secondary)]",3,"innerHTML"],[1,"p-8","sm:p-12","bg-[var(--c-bg-primary)]/50","border-t","border-[var(--c-border)]","text-center"],[1,"h-full","w-full","object-cover",3,"src","alt"],[1,"absolute","inset-0","bg-gradient-to-t","from-[var(--c-bg-secondary)]","via-[var(--c-bg-secondary)]/20","to-transparent"],[1,"absolute","bottom-0","left-0","right-0","p-8","sm:p-12"],[1,"mb-3",3,"severity","value"],[1,"text-3xl","sm:text-5xl","font-black","text-white","leading-tight","drop-shadow-lg"],[1,"flex","flex-col","sm:flex-row","sm:items-center","justify-between","gap-6"],[1,"mb-4",3,"severity","value"],[1,"text-3xl","sm:text-5xl","font-black","text-[var(--c-text-secondary)]","leading-tight","mt-2"],["label","\u0412\u0456\u0434\u0433\u0443\u043A\u043D\u0443\u0442\u0438\u0441\u044F","icon","pi pi-send","size","large"],["label","\u0412\u0456\u0434\u0433\u0443\u043A\u043D\u0443\u0442\u0438\u0441\u044F","icon","pi pi-send","size","large",3,"onClick"],[1,"flex","flex-wrap","gap-2"],[1,"px-4","py-2","bg-[var(--c-bg-primary)]","border","border-[var(--c-border)]","rounded-xl","text-sm","font-bold","text-[var(--c-text-secondary)]"],[1,"text-2xl","font-black","mb-4"],[1,"text-[var(--c-text-muted)]","mb-8","max-w-md","mx-auto","font-medium"],["label","\u041F\u043E\u0434\u0430\u0442\u0438 \u0437\u0430\u044F\u0432\u043A\u0443 \u0437\u0430\u0440\u0430\u0437","severity","primary","size","large",3,"onClick"],[1,"animate-spin","rounded-full","h-12","w-12","border-t-2","border-b-2","border-[var(--c-primary)]"],[1,"mt-4","text-[var(--c-text-muted)]","font-bold"],["label","\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438","severity","secondary",3,"onClick","text"],["label","\u0412\u0456\u0434\u043F\u0440\u0430\u0432\u0438\u0442\u0438","icon","pi pi-check",3,"onClick","loading","disabled"],["severity","success","text","\u0412\u0430\u0448\u0443 \u0437\u0430\u044F\u0432\u043A\u0443 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u043D\u0430\u0434\u0456\u0441\u043B\u0430\u043D\u043E! \u041C\u0438 \u0437\u0432'\u044F\u0436\u0435\u043C\u043E\u0441\u044F \u0437 \u0432\u0430\u043C\u0438 \u043D\u0430\u0439\u0431\u043B\u0438\u0436\u0447\u0438\u043C \u0447\u0430\u0441\u043E\u043C."]],template:function(e,o){if(e&1&&(i(0,"div",0)(1,"div",1)(2,"a",2),g(3,"span",3),d(4," \u041D\u0430\u0437\u0430\u0434 \u0434\u043E \u0432\u0441\u0456\u0445 \u0432\u0430\u043A\u0430\u043D\u0441\u0456\u0439 "),s(),p(5,wt,10,4,"div",4)(6,Tt,4,0,"div",5),s(),i(7,"p-dialog",6),E("visibleChange",function(l){return M(o.isApplying,l)||(o.isApplying=l),l}),i(8,"div",7)(9,"div",8)(10,"label",9),d(11,"\u0412\u0430\u0448\u0435 \u0456\u043C'\u044F"),s(),i(12,"input",10),E("ngModelChange",function(l){return M(o.proposal.candidateName,l)||(o.proposal.candidateName=l),l}),s()(),i(13,"div",8)(14,"label",11),d(15,"Email \u0434\u043B\u044F \u0437\u0432'\u044F\u0437\u043A\u0443"),s(),i(16,"input",12),E("ngModelChange",function(l){return M(o.proposal.email,l)||(o.proposal.email=l),l}),s()(),i(17,"div",8)(18,"label",13),d(19,"\u0422\u0435\u043B\u0435\u0444\u043E\u043D (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)"),s(),i(20,"input",14),E("ngModelChange",function(l){return M(o.proposal.phone,l)||(o.proposal.phone=l),l}),s()(),i(21,"div",8)(22,"label",15),d(23,"\u041F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F \u043D\u0430 CV / \u041F\u043E\u0440\u0442\u0444\u043E\u043B\u0456\u043E"),s(),i(24,"input",16),E("ngModelChange",function(l){return M(o.proposal.cvUrl,l)||(o.proposal.cvUrl=l),l}),s()(),i(25,"div",8)(26,"label",17),d(27,"\u0421\u0443\u043F\u0440\u043E\u0432\u0456\u0434\u043D\u0438\u0439 \u0442\u0435\u043A\u0441\u0442 (\u043D\u0435\u043E\u0431\u043E\u0432'\u044F\u0437\u043A\u043E\u0432\u043E)"),s(),i(28,"textarea",18),E("ngModelChange",function(l){return M(o.proposal.message,l)||(o.proposal.message=l),l}),s()()(),f(29,Mt,2,3,"ng-template",19),s(),p(30,Et,2,0,"div",20),s()),e&2){let n;r(5),m((n=o.job())?5:6,n),r(2),W(V(13,bt)),T("visible",o.isApplying),u("modal",!0)("draggable",!1)("resizable",!1),r(5),T("ngModel",o.proposal.candidateName),r(4),T("ngModel",o.proposal.email),r(4),T("ngModel",o.proposal.phone),r(4),T("ngModel",o.proposal.cvUrl),r(4),T("ngModel",o.proposal.message),r(2),m(o.isSubmitted()?30:-1)}},dependencies:[F,Te,ye,Ce,we,ve,Be,De,N,Pe,Ae,Fe,ze,Je,je,We,Oe,Re,H],encapsulation:2,changeDetection:0})};export{qe as PublicJobComponent};
