import{a as Re}from"./chunk-4QILNO5K.js";import{a as Je,b as Ke}from"./chunk-LJNBHYK5.js";import{a as Qe,c as Ye,d as Xe,g as de}from"./chunk-5V635Z4R.js";import{a as A,b as Ge,c as Ce,i as $,n as W,q as le,s as ue,u as $e,v as qe}from"./chunk-4WGVVDHT.js";import{c as je,f as We,l as He,z as Ue}from"./chunk-OOVPJAYP.js";import{_ as be,a as Ze,ea as D,ha as re,ia as Q,ua as ze}from"./chunk-BUCZD23N.js";import{a as Ne}from"./chunk-HBDPK3DB.js";import"./chunk-LCTQUIF2.js";import{g as Le}from"./chunk-R2DJ7RBN.js";import{g as Pe,h as ae,i as j,k as Ve,p as L}from"./chunk-GY2M5X7I.js";import{$ as G,Ab as K,Ac as ie,Bb as ee,Cb as he,Da as J,Db as k,Eb as z,F as fe,Hb as C,Ia as l,Ic as se,J as X,Jb as d,Jc as R,K as ye,M as ve,Mb as Se,N as xe,O as b,Ob as te,Pb as ne,Ra as Ie,Sb as Ae,T as v,U as x,V as f,Vb as oe,Wb as y,Xb as c,Ya as h,Yb as O,Za as Ee,Zb as De,aa as we,ac as B,bb as Me,bc as F,cb as T,cc as P,db as g,ea as w,ec as V,fc as ke,ga as Te,gc as Oe,hc as Be,ia as S,kb as m,nb as N,ob as Z,tb as u,ub as a,vb as s,wb as p,wc as Fe,xb as I,yb as E,zb as M,zc as _e}from"./chunk-CGR4FBK6.js";import{a as ge}from"./chunk-C6Q5SG76.js";var q="/api/itcourse",H=class t{constructor(i){this.http=i}getCourses(){return this.http.get(`${q}/get`).pipe(fe(i=>console.log("getCourses response:",i)))}fetchCourse(i){return this.http.post(`${q}/fetch`,{_id:i})}createCourse(i){return console.log("Creating course with data:",i),this.http.post(`${q}/create`,{data:i}).pipe(fe(e=>{console.log("createCourse response:",e)}))}updateCourse(i,e){return this.http.post(`${q}/update`,{_id:i,data:e})}deleteCourse(i){return this.http.post(`${q}/delete`,{_id:i})}static \u0275fac=function(e){return new(e||t)(xe(Ne))};static \u0275prov=X({token:t,factory:t.\u0275fac,providedIn:"root"})};var lt=["data-p-icon","exclamation-triangle"],et=(()=>{class t extends W{pathId;onInit(){this.pathId="url(#"+A()+")"}static \u0275fac=(()=>{let e;return function(o){return(e||(e=S(t)))(o||t)}})();static \u0275cmp=h({type:t,selectors:[["","data-p-icon","exclamation-triangle"]],features:[T],attrs:lt,decls:7,vars:2,consts:[["d","M13.4018 13.1893H0.598161C0.49329 13.189 0.390283 13.1615 0.299143 13.1097C0.208003 13.0578 0.131826 12.9832 0.0780112 12.8932C0.0268539 12.8015 0 12.6982 0 12.5931C0 12.4881 0.0268539 12.3848 0.0780112 12.293L6.47985 1.08982C6.53679 1.00399 6.61408 0.933574 6.70484 0.884867C6.7956 0.836159 6.897 0.810669 7 0.810669C7.103 0.810669 7.2044 0.836159 7.29516 0.884867C7.38592 0.933574 7.46321 1.00399 7.52015 1.08982L13.922 12.293C13.9731 12.3848 14 12.4881 14 12.5931C14 12.6982 13.9731 12.8015 13.922 12.8932C13.8682 12.9832 13.792 13.0578 13.7009 13.1097C13.6097 13.1615 13.5067 13.189 13.4018 13.1893ZM1.63046 11.989H12.3695L7 2.59425L1.63046 11.989Z","fill","currentColor"],["d","M6.99996 8.78801C6.84143 8.78594 6.68997 8.72204 6.57787 8.60993C6.46576 8.49782 6.40186 8.34637 6.39979 8.18784V5.38703C6.39979 5.22786 6.46302 5.0752 6.57557 4.96265C6.68813 4.85009 6.84078 4.78686 6.99996 4.78686C7.15914 4.78686 7.31179 4.85009 7.42435 4.96265C7.5369 5.0752 7.60013 5.22786 7.60013 5.38703V8.18784C7.59806 8.34637 7.53416 8.49782 7.42205 8.60993C7.30995 8.72204 7.15849 8.78594 6.99996 8.78801Z","fill","currentColor"],["d","M6.99996 11.1887C6.84143 11.1866 6.68997 11.1227 6.57787 11.0106C6.46576 10.8985 6.40186 10.7471 6.39979 10.5885V10.1884C6.39979 10.0292 6.46302 9.87658 6.57557 9.76403C6.68813 9.65147 6.84078 9.58824 6.99996 9.58824C7.15914 9.58824 7.31179 9.65147 7.42435 9.76403C7.5369 9.87658 7.60013 10.0292 7.60013 10.1884V10.5885C7.59806 10.7471 7.53416 10.8985 7.42205 11.0106C7.30995 11.1227 7.15849 11.1866 6.99996 11.1887Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(n,o){n&1&&(f(),I(0,"g"),M(1,"path",0)(2,"path",1)(3,"path",2),E(),I(4,"defs")(5,"clipPath",3),M(6,"rect",4),E()()),n&2&&(m("clip-path",o.pathId),l(5),z("id",o.pathId))},encapsulation:2})}return t})();var ut=["data-p-icon","info-circle"],tt=(()=>{class t extends W{pathId;onInit(){this.pathId="url(#"+A()+")"}static \u0275fac=(()=>{let e;return function(o){return(e||(e=S(t)))(o||t)}})();static \u0275cmp=h({type:t,selectors:[["","data-p-icon","info-circle"]],features:[T],attrs:ut,decls:5,vars:2,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M3.11101 12.8203C4.26215 13.5895 5.61553 14 7 14C8.85652 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85652 14 7C14 5.61553 13.5895 4.26215 12.8203 3.11101C12.0511 1.95987 10.9579 1.06266 9.67879 0.532846C8.3997 0.00303296 6.99224 -0.13559 5.63437 0.134506C4.2765 0.404603 3.02922 1.07129 2.05026 2.05026C1.07129 3.02922 0.404603 4.2765 0.134506 5.63437C-0.13559 6.99224 0.00303296 8.3997 0.532846 9.67879C1.06266 10.9579 1.95987 12.0511 3.11101 12.8203ZM3.75918 2.14976C4.71846 1.50879 5.84628 1.16667 7 1.16667C8.5471 1.16667 10.0308 1.78125 11.1248 2.87521C12.2188 3.96918 12.8333 5.45291 12.8333 7C12.8333 8.15373 12.4912 9.28154 11.8502 10.2408C11.2093 11.2001 10.2982 11.9478 9.23232 12.3893C8.16642 12.8308 6.99353 12.9463 5.86198 12.7212C4.73042 12.4962 3.69102 11.9406 2.87521 11.1248C2.05941 10.309 1.50384 9.26958 1.27876 8.13803C1.05367 7.00647 1.16919 5.83358 1.61071 4.76768C2.05222 3.70178 2.79989 2.79074 3.75918 2.14976ZM7.00002 4.8611C6.84594 4.85908 6.69873 4.79698 6.58977 4.68801C6.48081 4.57905 6.4187 4.43185 6.41669 4.27776V3.88888C6.41669 3.73417 6.47815 3.58579 6.58754 3.4764C6.69694 3.367 6.84531 3.30554 7.00002 3.30554C7.15473 3.30554 7.3031 3.367 7.4125 3.4764C7.52189 3.58579 7.58335 3.73417 7.58335 3.88888V4.27776C7.58134 4.43185 7.51923 4.57905 7.41027 4.68801C7.30131 4.79698 7.1541 4.85908 7.00002 4.8611ZM7.00002 10.6945C6.84594 10.6925 6.69873 10.6304 6.58977 10.5214C6.48081 10.4124 6.4187 10.2652 6.41669 10.1111V6.22225C6.41669 6.06754 6.47815 5.91917 6.58754 5.80977C6.69694 5.70037 6.84531 5.63892 7.00002 5.63892C7.15473 5.63892 7.3031 5.70037 7.4125 5.80977C7.52189 5.91917 7.58335 6.06754 7.58335 6.22225V10.1111C7.58134 10.2652 7.51923 10.4124 7.41027 10.5214C7.30131 10.6304 7.1541 10.6925 7.00002 10.6945Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(n,o){n&1&&(f(),I(0,"g"),M(1,"path",0),E(),I(2,"defs")(3,"clipPath",1),M(4,"rect",2),E()()),n&2&&(m("clip-path",o.pathId),l(3),z("id",o.pathId))},encapsulation:2})}return t})();var dt=["data-p-icon","times-circle"],nt=(()=>{class t extends W{pathId;onInit(){this.pathId="url(#"+A()+")"}static \u0275fac=(()=>{let e;return function(o){return(e||(e=S(t)))(o||t)}})();static \u0275cmp=h({type:t,selectors:[["","data-p-icon","times-circle"]],features:[T],attrs:dt,decls:5,vars:2,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M7 14C5.61553 14 4.26215 13.5895 3.11101 12.8203C1.95987 12.0511 1.06266 10.9579 0.532846 9.67879C0.00303296 8.3997 -0.13559 6.99224 0.134506 5.63437C0.404603 4.2765 1.07129 3.02922 2.05026 2.05026C3.02922 1.07129 4.2765 0.404603 5.63437 0.134506C6.99224 -0.13559 8.3997 0.00303296 9.67879 0.532846C10.9579 1.06266 12.0511 1.95987 12.8203 3.11101C13.5895 4.26215 14 5.61553 14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14ZM7 1.16667C5.84628 1.16667 4.71846 1.50879 3.75918 2.14976C2.79989 2.79074 2.05222 3.70178 1.61071 4.76768C1.16919 5.83358 1.05367 7.00647 1.27876 8.13803C1.50384 9.26958 2.05941 10.309 2.87521 11.1248C3.69102 11.9406 4.73042 12.4962 5.86198 12.7212C6.99353 12.9463 8.16642 12.8308 9.23232 12.3893C10.2982 11.9478 11.2093 11.2001 11.8502 10.2408C12.4912 9.28154 12.8333 8.15373 12.8333 7C12.8333 5.45291 12.2188 3.96918 11.1248 2.87521C10.0308 1.78125 8.5471 1.16667 7 1.16667ZM4.66662 9.91668C4.58998 9.91704 4.51404 9.90209 4.44325 9.87271C4.37246 9.84333 4.30826 9.8001 4.2544 9.74557C4.14516 9.6362 4.0838 9.48793 4.0838 9.33335C4.0838 9.17876 4.14516 9.0305 4.2544 8.92113L6.17553 7L4.25443 5.07891C4.15139 4.96832 4.09529 4.82207 4.09796 4.67094C4.10063 4.51982 4.16185 4.37563 4.26872 4.26876C4.3756 4.16188 4.51979 4.10066 4.67091 4.09799C4.82204 4.09532 4.96829 4.15142 5.07887 4.25446L6.99997 6.17556L8.92106 4.25446C9.03164 4.15142 9.1779 4.09532 9.32903 4.09799C9.48015 4.10066 9.62434 4.16188 9.73121 4.26876C9.83809 4.37563 9.89931 4.51982 9.90198 4.67094C9.90464 4.82207 9.84855 4.96832 9.74551 5.07891L7.82441 7L9.74554 8.92113C9.85478 9.0305 9.91614 9.17876 9.91614 9.33335C9.91614 9.48793 9.85478 9.6362 9.74554 9.74557C9.69168 9.8001 9.62748 9.84333 9.55669 9.87271C9.4859 9.90209 9.40996 9.91704 9.33332 9.91668C9.25668 9.91704 9.18073 9.90209 9.10995 9.87271C9.03916 9.84333 8.97495 9.8001 8.9211 9.74557L6.99997 7.82444L5.07884 9.74557C5.02499 9.8001 4.96078 9.84333 4.88999 9.87271C4.81921 9.90209 4.74326 9.91704 4.66662 9.91668Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(n,o){n&1&&(f(),I(0,"g"),M(1,"path",0),E(),I(2,"defs")(3,"clipPath",1),M(4,"rect",2),E()()),n&2&&(m("clip-path",o.pathId),l(3),z("id",o.pathId))},encapsulation:2})}return t})();var ot=`
    .p-toast {
        width: dt('toast.width');
        white-space: pre-line;
        word-break: break-word;
    }

    .p-toast-message {
        margin: 0 0 1rem 0;
        display: grid;
        grid-template-rows: 1fr;
    }

    .p-toast-message-icon {
        flex-shrink: 0;
        font-size: dt('toast.icon.size');
        width: dt('toast.icon.size');
        height: dt('toast.icon.size');
    }

    .p-toast-message-content {
        display: flex;
        align-items: flex-start;
        padding: dt('toast.content.padding');
        gap: dt('toast.content.gap');
        min-height: 0;
        overflow: hidden;
        transition: padding 250ms ease-in;
    }

    .p-toast-message-text {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        gap: dt('toast.text.gap');
    }

    .p-toast-summary {
        font-weight: dt('toast.summary.font.weight');
        font-size: dt('toast.summary.font.size');
    }

    .p-toast-detail {
        font-weight: dt('toast.detail.font.weight');
        font-size: dt('toast.detail.font.size');
    }

    .p-toast-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        background: transparent;
        transition:
            background dt('toast.transition.duration'),
            color dt('toast.transition.duration'),
            outline-color dt('toast.transition.duration'),
            box-shadow dt('toast.transition.duration');
        outline-color: transparent;
        color: inherit;
        width: dt('toast.close.button.width');
        height: dt('toast.close.button.height');
        border-radius: dt('toast.close.button.border.radius');
        margin: -25% 0 0 0;
        right: -25%;
        padding: 0;
        border: none;
        user-select: none;
    }

    .p-toast-close-button:dir(rtl) {
        margin: -25% 0 0 auto;
        left: -25%;
        right: auto;
    }

    .p-toast-message-info,
    .p-toast-message-success,
    .p-toast-message-warn,
    .p-toast-message-error,
    .p-toast-message-secondary,
    .p-toast-message-contrast {
        border-width: dt('toast.border.width');
        border-style: solid;
        backdrop-filter: blur(dt('toast.blur'));
        border-radius: dt('toast.border.radius');
    }

    .p-toast-close-icon {
        font-size: dt('toast.close.icon.size');
        width: dt('toast.close.icon.size');
        height: dt('toast.close.icon.size');
    }

    .p-toast-close-button:focus-visible {
        outline-width: dt('focus.ring.width');
        outline-style: dt('focus.ring.style');
        outline-offset: dt('focus.ring.offset');
    }

    .p-toast-message-info {
        background: dt('toast.info.background');
        border-color: dt('toast.info.border.color');
        color: dt('toast.info.color');
        box-shadow: dt('toast.info.shadow');
    }

    .p-toast-message-info .p-toast-detail {
        color: dt('toast.info.detail.color');
    }

    .p-toast-message-info .p-toast-close-button:focus-visible {
        outline-color: dt('toast.info.close.button.focus.ring.color');
        box-shadow: dt('toast.info.close.button.focus.ring.shadow');
    }

    .p-toast-message-info .p-toast-close-button:hover {
        background: dt('toast.info.close.button.hover.background');
    }

    .p-toast-message-success {
        background: dt('toast.success.background');
        border-color: dt('toast.success.border.color');
        color: dt('toast.success.color');
        box-shadow: dt('toast.success.shadow');
    }

    .p-toast-message-success .p-toast-detail {
        color: dt('toast.success.detail.color');
    }

    .p-toast-message-success .p-toast-close-button:focus-visible {
        outline-color: dt('toast.success.close.button.focus.ring.color');
        box-shadow: dt('toast.success.close.button.focus.ring.shadow');
    }

    .p-toast-message-success .p-toast-close-button:hover {
        background: dt('toast.success.close.button.hover.background');
    }

    .p-toast-message-warn {
        background: dt('toast.warn.background');
        border-color: dt('toast.warn.border.color');
        color: dt('toast.warn.color');
        box-shadow: dt('toast.warn.shadow');
    }

    .p-toast-message-warn .p-toast-detail {
        color: dt('toast.warn.detail.color');
    }

    .p-toast-message-warn .p-toast-close-button:focus-visible {
        outline-color: dt('toast.warn.close.button.focus.ring.color');
        box-shadow: dt('toast.warn.close.button.focus.ring.shadow');
    }

    .p-toast-message-warn .p-toast-close-button:hover {
        background: dt('toast.warn.close.button.hover.background');
    }

    .p-toast-message-error {
        background: dt('toast.error.background');
        border-color: dt('toast.error.border.color');
        color: dt('toast.error.color');
        box-shadow: dt('toast.error.shadow');
    }

    .p-toast-message-error .p-toast-detail {
        color: dt('toast.error.detail.color');
    }

    .p-toast-message-error .p-toast-close-button:focus-visible {
        outline-color: dt('toast.error.close.button.focus.ring.color');
        box-shadow: dt('toast.error.close.button.focus.ring.shadow');
    }

    .p-toast-message-error .p-toast-close-button:hover {
        background: dt('toast.error.close.button.hover.background');
    }

    .p-toast-message-secondary {
        background: dt('toast.secondary.background');
        border-color: dt('toast.secondary.border.color');
        color: dt('toast.secondary.color');
        box-shadow: dt('toast.secondary.shadow');
    }

    .p-toast-message-secondary .p-toast-detail {
        color: dt('toast.secondary.detail.color');
    }

    .p-toast-message-secondary .p-toast-close-button:focus-visible {
        outline-color: dt('toast.secondary.close.button.focus.ring.color');
        box-shadow: dt('toast.secondary.close.button.focus.ring.shadow');
    }

    .p-toast-message-secondary .p-toast-close-button:hover {
        background: dt('toast.secondary.close.button.hover.background');
    }

    .p-toast-message-contrast {
        background: dt('toast.contrast.background');
        border-color: dt('toast.contrast.border.color');
        color: dt('toast.contrast.color');
        box-shadow: dt('toast.contrast.shadow');
    }
    
    .p-toast-message-contrast .p-toast-detail {
        color: dt('toast.contrast.detail.color');
    }

    .p-toast-message-contrast .p-toast-close-button:focus-visible {
        outline-color: dt('toast.contrast.close.button.focus.ring.color');
        box-shadow: dt('toast.contrast.close.button.focus.ring.shadow');
    }

    .p-toast-message-contrast .p-toast-close-button:hover {
        background: dt('toast.contrast.close.button.hover.background');
    }

    .p-toast-top-center {
        transform: translateX(-50%);
    }

    .p-toast-bottom-center {
        transform: translateX(-50%);
    }

    .p-toast-center {
        min-width: 20vw;
        transform: translate(-50%, -50%);
    }

    .p-toast-message-enter-active {
        animation: p-animate-toast-enter 300ms ease-out;
    }

    .p-toast-message-leave-active {
        animation: p-animate-toast-leave 250ms ease-in;
    }

    .p-toast-message-leave-to .p-toast-message-content {
        padding-top: 0;
        padding-bottom: 0;
    }

    @keyframes p-animate-toast-enter {
        from {
            opacity: 0;
            transform: scale(0.6);
        }
        to {
            opacity: 1;
            grid-template-rows: 1fr;
        }
    }

     @keyframes p-animate-toast-leave {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            margin-bottom: 0;
            grid-template-rows: 0fr;
            transform: translateY(-100%) scale(0.6);
        }
    }
`;var ct=(t,i)=>({$implicit:t,closeFn:i}),mt=t=>({$implicit:t});function pt(t,i){t&1&&he(0)}function gt(t,i){if(t&1&&g(0,pt,1,0,"ng-container",3),t&2){let e=d();u("ngTemplateOutlet",e.headlessTemplate)("ngTemplateOutletContext",Be(2,ct,e.message,e.onCloseIconClick))}}function ft(t,i){if(t&1&&p(0,"span",4),t&2){let e=d(3);y(e.cn(e.cx("messageIcon"),e.message==null?null:e.message.icon)),u("pBind",e.ptm("messageIcon"))}}function ht(t,i){if(t&1&&(f(),p(0,"svg",11)),t&2){let e=d(4);y(e.cx("messageIcon")),u("pBind",e.ptm("messageIcon")),m("aria-hidden",!0)}}function _t(t,i){if(t&1&&(f(),p(0,"svg",12)),t&2){let e=d(4);y(e.cx("messageIcon")),u("pBind",e.ptm("messageIcon")),m("aria-hidden",!0)}}function bt(t,i){if(t&1&&(f(),p(0,"svg",13)),t&2){let e=d(4);y(e.cx("messageIcon")),u("pBind",e.ptm("messageIcon")),m("aria-hidden",!0)}}function Ct(t,i){if(t&1&&(f(),p(0,"svg",14)),t&2){let e=d(4);y(e.cx("messageIcon")),u("pBind",e.ptm("messageIcon")),m("aria-hidden",!0)}}function yt(t,i){if(t&1&&(f(),p(0,"svg",12)),t&2){let e=d(4);y(e.cx("messageIcon")),u("pBind",e.ptm("messageIcon")),m("aria-hidden",!0)}}function vt(t,i){if(t&1&&N(0,ht,1,4,":svg:svg",7)(1,_t,1,4,":svg:svg",8)(2,bt,1,4,":svg:svg",9)(3,Ct,1,4,":svg:svg",10)(4,yt,1,4,":svg:svg",8),t&2){let e,n=d(3);Z((e=n.message.severity)==="success"?0:e==="info"?1:e==="error"?2:e==="warn"?3:4)}}function xt(t,i){if(t&1&&(K(0),N(1,ft,1,3,"span",2)(2,vt,5,1),a(3,"div",6)(4,"div",6),c(5),s(),a(6,"div",6),c(7),s()(),ee()),t&2){let e=d(2);l(),Z(e.message.icon?1:2),l(2),u("pBind",e.ptm("messageText"))("ngClass",e.cx("messageText")),m("data-p",e.dataP),l(),u("pBind",e.ptm("summary"))("ngClass",e.cx("summary")),m("data-p",e.dataP),l(),De(" ",e.message.summary," "),l(),u("pBind",e.ptm("detail"))("ngClass",e.cx("detail")),m("data-p",e.dataP),l(),O(e.message.detail)}}function wt(t,i){t&1&&he(0)}function Tt(t,i){if(t&1&&p(0,"span",4),t&2){let e=d(4);y(e.cn(e.cx("closeIcon"),e.message==null?null:e.message.closeIcon)),u("pBind",e.ptm("closeIcon"))}}function It(t,i){if(t&1&&g(0,Tt,1,3,"span",17),t&2){let e=d(3);u("ngIf",e.message.closeIcon)}}function Et(t,i){if(t&1&&(f(),p(0,"svg",18)),t&2){let e=d(3);y(e.cx("closeIcon")),u("pBind",e.ptm("closeIcon")),m("aria-hidden",!0)}}function Mt(t,i){if(t&1){let e=k();a(0,"div")(1,"button",15),C("click",function(o){v(e);let r=d(2);return x(r.onCloseIconClick(o))})("keydown.enter",function(o){v(e);let r=d(2);return x(r.onCloseIconClick(o))}),N(2,It,1,1,"span",2)(3,Et,1,4,":svg:svg",16),s()()}if(t&2){let e=d(2);l(),u("pBind",e.ptm("closeButton")),m("class",e.cx("closeButton"))("aria-label",e.closeAriaLabel)("data-p",e.dataP),l(),Z(e.message.closeIcon?2:3)}}function St(t,i){if(t&1&&(a(0,"div",4),g(1,xt,8,12,"ng-container",5)(2,wt,1,0,"ng-container",3),N(3,Mt,4,5,"div"),s()),t&2){let e=d();y(e.cn(e.cx("messageContent"),e.message==null?null:e.message.contentStyleClass)),u("pBind",e.ptm("messageContent")),l(),u("ngIf",!e.template),l(),u("ngTemplateOutlet",e.template)("ngTemplateOutletContext",Oe(7,mt,e.message)),l(),Z((e.message==null?null:e.message.closable)!==!1?3:-1)}}var At=["message"],Dt=["headless"];function kt(t,i){if(t&1){let e=k();a(0,"p-toastItem",1),C("onClose",function(o){v(e);let r=d();return x(r.onMessageClose(o))})("onAnimationEnd",function(){v(e);let o=d();return x(o.onAnimationEnd())})("onAnimationStart",function(){v(e);let o=d();return x(o.onAnimationStart())}),s()}if(t&2){let e=i.$implicit,n=i.index,o=d();u("message",e)("index",n)("life",o.life)("clearAll",o.clearAllTrigger())("template",o.template||o._template)("headlessTemplate",o.headlessTemplate||o._headlessTemplate)("pt",o.pt)("unstyled",o.unstyled())("motionOptions",o.computedMotionOptions())}}var Ot={root:({instance:t})=>{let{_position:i}=t;return{position:"fixed",top:i==="top-right"||i==="top-left"||i==="top-center"?"20px":i==="center"?"50%":null,right:(i==="top-right"||i==="bottom-right")&&"20px",bottom:(i==="bottom-left"||i==="bottom-right"||i==="bottom-center")&&"20px",left:i==="top-left"||i==="bottom-left"?"20px":i==="center"||i==="top-center"||i==="bottom-center"?"50%":null}}},Bt={root:({instance:t})=>["p-toast p-component",`p-toast-${t._position}`],message:({instance:t})=>({"p-toast-message":!0,"p-toast-message-info":t.message.severity==="info"||t.message.severity===void 0,"p-toast-message-warn":t.message.severity==="warn","p-toast-message-error":t.message.severity==="error","p-toast-message-success":t.message.severity==="success","p-toast-message-secondary":t.message.severity==="secondary","p-toast-message-contrast":t.message.severity==="contrast"}),messageContent:"p-toast-message-content",messageIcon:({instance:t})=>({"p-toast-message-icon":!0,[`pi ${t.message.icon}`]:!!t.message.icon}),messageText:"p-toast-message-text",summary:"p-toast-summary",detail:"p-toast-detail",closeButton:"p-toast-close-button",closeIcon:({instance:t})=>({"p-toast-close-icon":!0,[`pi ${t.message.closeIcon}`]:!!t.message.closeIcon})},ce=(()=>{class t extends ze{name="toast";style=ot;classes=Bt;inlineStyles=Ot;static \u0275fac=(()=>{let e;return function(o){return(e||(e=S(t)))(o||t)}})();static \u0275prov=X({token:t,factory:t.\u0275fac})}return t})();var it=new ve("TOAST_INSTANCE"),Ft=(()=>{class t extends Ce{zone;message;index;life;template;headlessTemplate;showTransformOptions;hideTransformOptions;showTransitionOptions;hideTransitionOptions;motionOptions=ie();clearAll=ie(null);onAnimationStart=_e();onAnimationEnd=_e();onBeforeEnter(e){this.onAnimationStart.emit(e.element)}onAfterLeave(e){!this.visible()&&!this.isDestroyed&&(this.onClose.emit({index:this.index,message:this.message}),this.isDestroyed||this.onAnimationEnd.emit(e.element))}onClose=new G;_componentStyle=b(ce);timeout;visible=w(void 0);isDestroyed=!1;isClosing=!1;constructor(e){super(),this.zone=e,Te(()=>{this.clearAll()&&this.visible.set(!1)})}onAfterViewInit(){this.message?.sticky&&this.visible.set(!0),this.initTimeout()}initTimeout(){this.message?.sticky||(this.clearTimeout(),this.zone.runOutsideAngular(()=>{this.visible.set(!0),this.timeout=setTimeout(()=>{this.visible.set(!1)},this.message?.life||this.life||3e3)}))}clearTimeout(){this.timeout&&(clearTimeout(this.timeout),this.timeout=null)}onMouseEnter(){this.clearTimeout()}onMouseLeave(){this.isClosing||this.initTimeout()}onCloseIconClick=e=>{this.isClosing=!0,this.clearTimeout(),this.visible.set(!1),e.preventDefault()};get closeAriaLabel(){return this.config.translation.aria?this.config.translation.aria.close:void 0}onDestroy(){this.isDestroyed=!0,this.clearTimeout(),this.visible.set(!1)}get dataP(){return this.cn({[this.message?.severity]:this.message?.severity})}static \u0275fac=function(n){return new(n||t)(Ie(we))};static \u0275cmp=h({type:t,selectors:[["p-toastItem"]],inputs:{message:"message",index:[2,"index","index",R],life:[2,"life","life",R],template:"template",headlessTemplate:"headlessTemplate",showTransformOptions:"showTransformOptions",hideTransformOptions:"hideTransformOptions",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",motionOptions:[1,"motionOptions"],clearAll:[1,"clearAll"]},outputs:{onAnimationStart:"onAnimationStart",onAnimationEnd:"onAnimationEnd",onClose:"onClose"},features:[V([ce]),T],decls:4,vars:10,consts:[["container",""],["role","alert","aria-live","assertive","aria-atomic","true",3,"pMotionOnBeforeEnter","pMotionOnAfterLeave","mouseenter","mouseleave","pMotion","pMotionAppear","pMotionName","pMotionOptions","pBind"],[3,"pBind","class"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"pBind"],[4,"ngIf"],[3,"pBind","ngClass"],["data-p-icon","check",3,"pBind","class"],["data-p-icon","info-circle",3,"pBind","class"],["data-p-icon","times-circle",3,"pBind","class"],["data-p-icon","exclamation-triangle",3,"pBind","class"],["data-p-icon","check",3,"pBind"],["data-p-icon","info-circle",3,"pBind"],["data-p-icon","times-circle",3,"pBind"],["data-p-icon","exclamation-triangle",3,"pBind"],["type","button","autofocus","",3,"click","keydown.enter","pBind"],["data-p-icon","times",3,"pBind","class"],[3,"pBind","class",4,"ngIf"],["data-p-icon","times",3,"pBind"]],template:function(n,o){n&1&&(a(0,"div",1,0),C("pMotionOnBeforeEnter",function(_){return o.onBeforeEnter(_)})("pMotionOnAfterLeave",function(_){return o.onAfterLeave(_)})("mouseenter",function(){return o.onMouseEnter()})("mouseleave",function(){return o.onMouseLeave()}),N(2,gt,1,5,"ng-container")(3,St,4,9,"div",2),s()),n&2&&(y(o.cn(o.cx("message"),o.message==null?null:o.message.styleClass)),u("pMotion",o.visible())("pMotionAppear",!0)("pMotionName","p-toast-message")("pMotionOptions",o.motionOptions())("pBind",o.ptm("message")),m("id",o.message==null?null:o.message.id)("data-p",o.dataP),l(2),Z(o.headlessTemplate?2:3))},dependencies:[L,Pe,j,Ve,Re,et,tt,Qe,nt,Q,$,Xe,Ye],encapsulation:2,changeDetection:0})}return t})(),Y=(()=>{class t extends Ce{componentName="Toast";$pcToast=b(it,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=b($,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}key;autoZIndex=!0;baseZIndex=0;life=3e3;styleClass;get position(){return this._position}set position(e){this._position=e,this.cd.markForCheck()}preventOpenDuplicates=!1;preventDuplicates=!1;showTransformOptions="translateY(100%)";hideTransformOptions="translateY(-100%)";showTransitionOptions="300ms ease-out";hideTransitionOptions="250ms ease-in";motionOptions=ie(void 0);computedMotionOptions=Fe(()=>ge(ge({},this.ptm("motion")),this.motionOptions()));breakpoints;onClose=new G;template;headlessTemplate;messageSubscription;clearSubscription;messages;messagesArchieve;_position="top-right";messageService=b(D);_componentStyle=b(ce);styleElement;id=A("pn_id_");templates;clearAllTrigger=w(null);constructor(){super()}onInit(){this.messageSubscription=this.messageService.messageObserver.subscribe(e=>{if(e)if(Array.isArray(e)){let n=e.filter(o=>this.canAdd(o));this.add(n)}else this.canAdd(e)&&this.add([e])}),this.clearSubscription=this.messageService.clearObserver.subscribe(e=>{e?this.key===e&&this.clearAll():this.clearAll(),this.cd.markForCheck()})}clearAll(){this.clearAllTrigger.set({})}_template;_headlessTemplate;onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"message":this._template=e.template;break;case"headless":this._headlessTemplate=e.template;break;default:this._template=e.template;break}})}onAfterViewInit(){this.breakpoints&&this.createStyle()}add(e){this.messages=this.messages?[...this.messages,...e]:[...e],this.preventDuplicates&&(this.messagesArchieve=this.messagesArchieve?[...this.messagesArchieve,...e]:[...e]),this.cd.markForCheck()}canAdd(e){let n=this.key===e.key;return n&&this.preventOpenDuplicates&&(n=!this.containsMessage(this.messages,e)),n&&this.preventDuplicates&&(n=!this.containsMessage(this.messagesArchieve,e)),n}containsMessage(e,n){return e?e.find(o=>o.summary===n.summary&&o.detail==n.detail&&o.severity===n.severity)!=null:!1}onMessageClose(e){this.messages?.splice(e.index,1),this.onClose.emit({message:e.message}),this.onAnimationEnd(),this.cd.detectChanges()}onAnimationStart(){this.renderer.setAttribute(this.el?.nativeElement,this.id,""),this.autoZIndex&&this.el?.nativeElement.style.zIndex===""&&de.set("modal",this.el?.nativeElement,this.baseZIndex||this.config.zIndex.modal)}onAnimationEnd(){this.autoZIndex&&Ze(this.messages)&&de.clear(this.el?.nativeElement)}createStyle(){if(!this.styleElement){this.styleElement=this.renderer.createElement("style"),this.styleElement.type="text/css",be(this.styleElement,"nonce",this.config?.csp()?.nonce),this.renderer.appendChild(this.document.head,this.styleElement);let e="";for(let n in this.breakpoints){let o="";for(let r in this.breakpoints[n])o+=r+":"+this.breakpoints[n][r]+" !important;";e+=`
                    @media screen and (max-width: ${n}) {
                        .p-toast[${this.id}] {
                           ${o}
                        }
                    }
                `}this.renderer.setProperty(this.styleElement,"innerHTML",e),be(this.styleElement,"nonce",this.config?.csp()?.nonce)}}destroyStyle(){this.styleElement&&(this.renderer.removeChild(this.document.head,this.styleElement),this.styleElement=null)}onDestroy(){this.messageSubscription&&this.messageSubscription.unsubscribe(),this.el&&this.autoZIndex&&de.clear(this.el.nativeElement),this.clearSubscription&&this.clearSubscription.unsubscribe(),this.destroyStyle()}get dataP(){return this.cn({[this.position]:this.position})}static \u0275fac=function(n){return new(n||t)};static \u0275cmp=h({type:t,selectors:[["p-toast"]],contentQueries:function(n,o,r){if(n&1&&Se(r,At,5)(r,Dt,5)(r,re,4),n&2){let _;te(_=ne())&&(o.template=_.first),te(_=ne())&&(o.headlessTemplate=_.first),te(_=ne())&&(o.templates=_)}},hostVars:5,hostBindings:function(n,o){n&2&&(m("data-p",o.dataP),oe(o.sx("root")),y(o.cn(o.cx("root"),o.styleClass)))},inputs:{key:"key",autoZIndex:[2,"autoZIndex","autoZIndex",se],baseZIndex:[2,"baseZIndex","baseZIndex",R],life:[2,"life","life",R],styleClass:"styleClass",position:"position",preventOpenDuplicates:[2,"preventOpenDuplicates","preventOpenDuplicates",se],preventDuplicates:[2,"preventDuplicates","preventDuplicates",se],showTransformOptions:"showTransformOptions",hideTransformOptions:"hideTransformOptions",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",motionOptions:[1,"motionOptions"],breakpoints:"breakpoints"},outputs:{onClose:"onClose"},features:[V([ce,{provide:it,useExisting:t},{provide:Ge,useExisting:t}]),Me([$]),T],decls:1,vars:1,consts:[[3,"message","index","life","clearAll","template","headlessTemplate","pt","unstyled","motionOptions","onClose","onAnimationEnd","onAnimationStart",4,"ngFor","ngForOf"],[3,"onClose","onAnimationEnd","onAnimationStart","message","index","life","clearAll","template","headlessTemplate","pt","unstyled","motionOptions"]],template:function(n,o){n&1&&g(0,kt,1,9,"p-toastItem",0),n&2&&u("ngForOf",o.messages)},dependencies:[L,ae,Ft,Q],encapsulation:2,changeDetection:0})}return t})(),me=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=Ee({type:t});static \u0275inj=ye({imports:[Y,Q,Q]})}return t})();var Lt=()=>({width:"600px"});function Nt(t,i){t&1&&(a(0,"span",13),c(1,"\u0414\u043E\u0434\u0430\u0442\u0438 \u043A\u0443\u0440\u0441"),s())}function Zt(t,i){if(t&1&&(a(0,"div",14),p(1,"img",15),s()),t&2){let e=d();l(),u("src",e.photoUrl,J)}}function zt(t,i){if(t&1){let e=k();a(0,"div",16)(1,"button",17),C("click",function(){v(e);let o=d();return x(o.clear())}),s(),a(2,"button",18),C("click",function(){v(e);let o=d();return x(o.submit())}),s()()}if(t&2){let e=d();l(),u("disabled",e.isSubmitting()),l(),u("loading",e.isSubmitting())("disabled",e.isSubmitting())}}var pe=class t{courseAdded=new G;open=w(!1);isSubmitting=w(!1);photo=null;photoUrl=null;form={title:"",description:"",tags:"",github:"",website:"",team:""};courseService=b(H);messageService=b(D);show(){this.open.set(!0)}closeDialog(){this.open.set(!1)}onFileChange(i){let e=i.target.files[0];if(this.photo=e,e){let n=new FileReader;n.onload=()=>{this.photoUrl=n.result},n.readAsDataURL(e)}else this.photoUrl=null}clear(){this.form={title:"",description:"",tags:"",github:"",website:"",team:""},this.photo=null,this.photoUrl=null}submit(){if(!this.form.title?.trim()){this.messageService.add({severity:"warn",summary:"\u0423\u0432\u0430\u0433\u0430",detail:"\u0411\u0443\u0434\u044C \u043B\u0430\u0441\u043A\u0430, \u0432\u0432\u0435\u0434\u0456\u0442\u044C \u043D\u0430\u0437\u0432\u0443 \u043A\u0443\u0440\u0441\u0443"});return}if(!this.form.description?.trim()){this.messageService.add({severity:"warn",summary:"\u0423\u0432\u0430\u0433\u0430",detail:"\u0411\u0443\u0434\u044C \u043B\u0430\u0441\u043A\u0430, \u0432\u0432\u0435\u0434\u0456\u0442\u044C \u043E\u043F\u0438\u0441 \u043A\u0443\u0440\u0441\u0443"});return}let i={title:this.form.title,description:this.form.description,tags:this.form.tags.split(",").map(e=>e.trim()).filter(Boolean),github:this.form.github,website:this.form.website,team:this.form.team.split(",").map(e=>e.trim()).filter(Boolean),photo:this.photoUrl};this.isSubmitting.set(!0),this.courseService.createCourse(i).subscribe({next:()=>{this.messageService.add({severity:"success",summary:"\u0423\u0441\u043F\u0456\u0445",detail:"\u041A\u0443\u0440\u0441 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0434\u043E\u0434\u0430\u043D\u043E!"}),this.courseAdded.emit(),this.closeDialog(),this.clear(),this.isSubmitting.set(!1)},error:e=>{console.error("\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u0434\u043E\u0434\u0430\u0432\u0430\u043D\u043D\u0456 \u043A\u0443\u0440\u0441\u0443:",e),this.messageService.add({severity:"error",summary:"\u041F\u043E\u043C\u0438\u043B\u043A\u0430",detail:e?.error?.message||"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0434\u043E\u0434\u0430\u0442\u0438 \u043A\u0443\u0440\u0441. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0449\u0435 \u0440\u0430\u0437."}),this.isSubmitting.set(!1)}})}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=h({type:t,selectors:[["add-course-dialog"]],outputs:{courseAdded:"courseAdded"},features:[V([D])],decls:35,vars:20,consts:[[3,"visibleChange","onHide","visible","modal","closable"],["pTemplate","header"],[1,"space-y-4"],[1,"block","font-semibold","mb-1"],["type","file","accept","image/*",1,"block","w-full","border","rounded","p-2",3,"change","disabled"],["class","mt-2",4,"ngIf"],["pInputText","",1,"w-full",3,"ngModelChange","ngModel","disabled"],["rows","3",1,"w-full","border","rounded","px-3","py-2","resize-none","focus:outline-none","focus:ring-2","focus:ring-blue-500",3,"ngModelChange","ngModel","disabled"],["pInputText","","placeholder","\u0412\u0432\u0435\u0434\u0456\u0442\u044C \u0442\u0435\u0433\u0438 \u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443",1,"w-full",3,"ngModelChange","ngModel","disabled"],[1,"flex","gap-4"],[1,"flex-1"],["pInputText","","placeholder","\u0412\u0432\u0435\u0434\u0456\u0442\u044C \u0456\u043C\u0435\u043D\u0430 \u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443",1,"w-full",3,"ngModelChange","ngModel","disabled"],["pTemplate","footer"],[1,"text-xl","font-bold"],[1,"mt-2"],["alt","preview",1,"w-24","h-24","object-cover","rounded","border",3,"src"],[1,"flex","gap-2","justify-end","mt-4"],["pButton","","type","button","label","\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438",1,"p-button-secondary",3,"click","disabled"],["pButton","","type","button","label","\u041E\u043F\u0443\u0431\u043B\u0456\u043A\u0443\u0432\u0430\u0442\u0438",1,"p-button-primary",3,"click","loading","disabled"]],template:function(e,n){e&1&&(p(0,"p-toast"),a(1,"p-dialog",0),C("visibleChange",function(r){return n.open.set(r)})("onHide",function(){return n.closeDialog()}),g(2,Nt,2,0,"ng-template",1),a(3,"div",2)(4,"div")(5,"label",3),c(6,"\u0424\u043E\u0442\u043E \u043A\u0443\u0440\u0441\u0443"),s(),a(7,"input",4),C("change",function(r){return n.onFileChange(r)}),s(),g(8,Zt,2,1,"div",5),s(),a(9,"div")(10,"label",3),c(11,"\u041D\u0430\u0437\u0432\u0430 \u043A\u0443\u0440\u0441\u0443"),s(),a(12,"input",6),P("ngModelChange",function(r){return F(n.form.title,r)||(n.form.title=r),r}),s()(),a(13,"div")(14,"label",3),c(15,"\u041E\u043F\u0438\u0441 \u043A\u0443\u0440\u0441\u0443"),s(),a(16,"textarea",7),P("ngModelChange",function(r){return F(n.form.description,r)||(n.form.description=r),r}),s()(),a(17,"div")(18,"label",3),c(19,"\u0422\u0435\u0433\u0438 \u043A\u0443\u0440\u0441\u0443"),s(),a(20,"input",8),P("ngModelChange",function(r){return F(n.form.tags,r)||(n.form.tags=r),r}),s()(),a(21,"div",9)(22,"div",10)(23,"label",3),c(24,"GitHub"),s(),a(25,"input",6),P("ngModelChange",function(r){return F(n.form.github,r)||(n.form.github=r),r}),s()(),a(26,"div",10)(27,"label",3),c(28,"\u0412\u0435\u0431\u0441\u0430\u0439\u0442"),s(),a(29,"input",6),P("ngModelChange",function(r){return F(n.form.website,r)||(n.form.website=r),r}),s()()(),a(30,"div")(31,"label",3),c(32,"\u041A\u043E\u043C\u0430\u043D\u0434\u0430 \u043A\u0443\u0440\u0441\u0443"),s(),a(33,"input",11),P("ngModelChange",function(r){return F(n.form.team,r)||(n.form.team=r),r}),s()()(),g(34,zt,3,3,"ng-template",12),s()),e&2&&(l(),oe(ke(19,Lt)),u("visible",n.open())("modal",!0)("closable",!0),l(6),u("disabled",n.isSubmitting()),l(),u("ngIf",n.photoUrl),l(4),B("ngModel",n.form.title),u("disabled",n.isSubmitting()),l(4),B("ngModel",n.form.description),u("disabled",n.isSubmitting()),l(4),B("ngModel",n.form.tags),u("disabled",n.isSubmitting()),l(5),B("ngModel",n.form.github),u("disabled",n.isSubmitting()),l(4),B("ngModel",n.form.website),u("disabled",n.isSubmitting()),l(4),B("ngModel",n.form.team),u("disabled",n.isSubmitting()))},dependencies:[L,j,Ue,je,We,He,Ke,Je,re,ue,le,qe,$e,me,Y],encapsulation:2})};function jt(t,i){if(t&1&&(a(0,"div",10)(1,"p",11),c(2,"\u274C \u041F\u043E\u043C\u0438\u043B\u043A\u0430"),s(),a(3,"p"),c(4),s()()),t&2){let e=d();l(4),O(e.error())}}function Wt(t,i){t&1&&(a(0,"div",12)(1,"p",13),c(2,"\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u043A\u0443\u0440\u0441\u0456\u0432..."),s()())}function Ht(t,i){t&1&&(a(0,"div",12)(1,"p",13),c(2,"\u041A\u0443\u0440\u0441\u0456\u0432 \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E. \u0414\u043E\u0434\u0430\u0439\u0442\u0435 \u043F\u0435\u0440\u0448\u0438\u0439 \u043A\u0443\u0440\u0441, \u0449\u043E\u0431 \u043F\u043E\u0447\u0430\u0442\u0438."),s()())}function Ut(t,i){if(t&1&&p(0,"img",29),t&2){let e=d().$implicit;u("src",e.photo,J)}}function Gt(t,i){t&1&&p(0,"span",30)}function Rt(t,i){if(t&1&&(a(0,"span",32),c(1),s()),t&2){let e=i.$implicit;l(),O(e)}}function Qt(t,i){if(t&1&&(K(0),g(1,Rt,2,1,"span",31),ee()),t&2){let e=i.ngIf;l(),u("ngForOf",e)}}function $t(t,i){if(t&1&&(a(0,"tr",19)(1,"td",20),g(2,Ut,1,1,"img",21)(3,Gt,1,0,"span",22),s(),a(4,"td",23),c(5),s(),a(6,"td",20),c(7),s(),a(8,"td",20),g(9,Qt,2,1,"ng-container",24),s(),a(10,"td",25),p(11,"button",26)(12,"button",27)(13,"button",28),s()()),t&2){let e=i.$implicit;l(2),u("ngIf",e.photo),l(),u("ngIf",!e.photo),l(2),O(e.title),l(2),O(e.description),l(2),u("ngIf",e.tags)}}function qt(t,i){if(t&1&&(a(0,"div",14)(1,"table",15)(2,"thead",16)(3,"tr")(4,"th",17),c(5,"\u0424\u043E\u0442\u043E"),s(),a(6,"th",17),c(7,"\u041D\u0430\u0437\u0432\u0430"),s(),a(8,"th",17),c(9,"\u041E\u043F\u0438\u0441"),s(),a(10,"th",17),c(11,"\u0422\u0435\u0433\u0438"),s(),a(12,"th",17),c(13,"\u0414\u0456\u0457"),s()()(),a(14,"tbody"),g(15,$t,14,5,"tr",18),s()()()),t&2){let e=d();l(15),u("ngForOf",e.courses())}}var rt=class t{courseService=b(H);messageService=b(D);_courses=w([]);_isLoading=w(!1);_error=w(null);courses=this._courses.asReadonly();isLoading=this._isLoading.asReadonly();error=this._error.asReadonly();reload(){this._isLoading.set(!0),this._error.set(null),this.courseService.getCourses().subscribe({next:i=>{console.log("API Response:",i);let e=i?.data||i?.courses||i||[];console.log("Parsed courses:",e),this._courses.set(Array.isArray(e)?e:[]),this._isLoading.set(!1)},error:i=>{console.error("\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u043A\u0443\u0440\u0441\u0456\u0432:",i);let e=i?.error?.message||"\u041D\u0435 \u0432\u0434\u0430\u043B\u043E\u0441\u044F \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0438\u0442\u0438 \u043A\u0443\u0440\u0441\u0438";this._error.set(e),this.messageService.add({severity:"error",summary:"\u041F\u043E\u043C\u0438\u043B\u043A\u0430",detail:e}),this._isLoading.set(!1)}})}onCourseAdded(){this.messageService.add({severity:"success",summary:"\u0423\u0441\u043F\u0456\u0445",detail:"\u041A\u0443\u0440\u0441 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0434\u043E\u0434\u0430\u043D\u043E"}),this.reload()}ngOnInit(){this.reload()}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=h({type:t,selectors:[["course-manage-courses-page"]],features:[V([D])],decls:14,vars:4,consts:[["addDialog",""],[1,"p-6","max-w-7xl","mx-auto"],[3,"courseAdded"],[1,"flex","items-center","justify-between","mb-2"],[1,"text-2xl","font-bold"],["pButton","","type","button","label","\u0414\u043E\u0434\u0430\u0442\u0438 \u043A\u0443\u0440\u0441",1,"p-button-sm","bg-blue-500","hover:bg-blue-600","text-white","shadow-lg",2,"min-width","160px",3,"click"],[1,"text-gray-500","mb-6"],["class","bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4",4,"ngIf"],["class","text-center py-8",4,"ngIf"],["class","overflow-x-auto rounded-lg border border-gray-200 bg-white",4,"ngIf"],[1,"bg-red-100","border","border-red-400","text-red-700","px-4","py-3","rounded","mb-4"],[1,"font-semibold"],[1,"text-center","py-8"],[1,"text-gray-500"],[1,"overflow-x-auto","rounded-lg","border","border-gray-200","bg-white"],[1,"min-w-full","text-sm","align-middle"],[1,"bg-gray-50"],[1,"px-4","py-3","text-left","font-semibold"],["class","border-b last:border-b-0",4,"ngFor","ngForOf"],[1,"border-b","last:border-b-0"],[1,"px-4","py-2"],["alt","course","class","w-14 h-14 rounded object-cover border",3,"src",4,"ngIf"],["class","block w-14 h-14 bg-gray-100 rounded",4,"ngIf"],[1,"px-4","py-2","font-medium"],[4,"ngIf"],[1,"px-4","py-2","flex","gap-2"],["pButton","","type","button","label","\u041F\u0435\u0440\u0435\u0433\u043B\u044F\u0434",1,"p-button-sm"],["pButton","","type","button","label","\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438",1,"p-button-sm","p-button-secondary"],["pButton","","type","button","label","\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438",1,"p-button-sm","p-button-danger"],["alt","course",1,"w-14","h-14","rounded","object-cover","border",3,"src"],[1,"block","w-14","h-14","bg-gray-100","rounded"],["class","inline-block bg-gray-100 rounded px-2 py-1 text-xs mr-1 mb-1",4,"ngFor","ngForOf"],[1,"inline-block","bg-gray-100","rounded","px-2","py-1","text-xs","mr-1","mb-1"]],template:function(e,n){if(e&1){let o=k();p(0,"p-toast"),a(1,"div",1)(2,"add-course-dialog",2,0),C("courseAdded",function(){return n.onCourseAdded()}),s(),a(4,"div",3)(5,"h1",4),c(6,"\u041A\u0443\u0440\u0441\u0438 (Admin)"),s(),a(7,"button",5),C("click",function(){v(o);let _=Ae(3);return x(_.show())}),s()(),a(8,"div",6),c(9,"\u041A\u0435\u0440\u0443\u0439\u0442\u0435 \u043F\u0443\u0431\u043B\u0456\u043A\u0430\u0446\u0456\u044F\u043C\u0438 \u043A\u0443\u0440\u0441\u0456\u0432: \u0441\u0442\u0432\u043E\u0440\u044E\u0439\u0442\u0435, \u043F\u0435\u0440\u0435\u0433\u043B\u044F\u0434\u0430\u0439\u0442\u0435, \u0440\u0435\u0434\u0430\u0433\u0443\u0439\u0442\u0435 \u0442\u0430 \u0432\u0438\u0434\u0430\u043B\u044F\u0439\u0442\u0435 \u0437\u0430\u043F\u0438\u0441\u0438."),s(),g(10,jt,5,1,"div",7)(11,Wt,3,0,"div",8)(12,Ht,3,0,"div",8)(13,qt,16,1,"div",9),s()}e&2&&(l(10),u("ngIf",n.error()),l(),u("ngIf",n.isLoading()),l(),u("ngIf",!n.isLoading()&&n.courses().length===0&&!n.error()),l(),u("ngIf",!n.isLoading()&&n.courses().length>0))},dependencies:[L,ae,j,Le,ue,le,me,Y,pe],encapsulation:2})};export{rt as ManageCoursesPage};
