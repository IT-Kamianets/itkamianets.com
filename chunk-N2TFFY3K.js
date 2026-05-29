import{a as ae}from"./chunk-4QILNO5K.js";import{b as oe,i as f,j as ie,n as ce,t as re}from"./chunk-4WGVVDHT.js";import{a as ne,e as te}from"./chunk-OOVPJAYP.js";import{f as J,g as W,ha as Y,ia as B,ua as ee}from"./chunk-BUCZD23N.js";import{g as K,i as X,k as U,p as Z}from"./chunk-GY2M5X7I.js";import{$ as v,Ab as D,Ac as l,Bb as N,Hb as q,I as F,Ia as s,Ic as r,J as E,Jb as k,Jc as G,K as S,M as z,Mb as H,Nb as L,O as g,Ob as I,Pb as M,V as x,Vb as Q,Wb as u,Ya as _,Za as A,_a as O,bb as $,cb as b,db as m,ea as C,ec as j,ia as h,ic as R,kb as p,tb as a,ub as V,vb as T,wb as y,wc as w,zb as P}from"./chunk-CGR4FBK6.js";var se=(()=>{class n extends re{required=l(void 0,{transform:r});invalid=l(void 0,{transform:r});disabled=l(void 0,{transform:r});name=l();_disabled=C(!1);$disabled=w(()=>this.disabled()||this._disabled());onModelChange=()=>{};onModelTouched=()=>{};writeDisabledState(e){this._disabled.set(e)}writeControlValue(e,o){}writeValue(e){this.writeControlValue(e,this.writeModelValue.bind(this))}registerOnChange(e){this.onModelChange=e}registerOnTouched(e){this.onModelTouched=e}setDisabledState(e){this.writeDisabledState(e),this.cd.markForCheck()}static \u0275fac=(()=>{let e;return function(t){return(e||(e=h(n)))(t||n)}})();static \u0275dir=O({type:n,inputs:{required:[1,"required"],invalid:[1,"invalid"],disabled:[1,"disabled"],name:[1,"name"]},features:[b]})}return n})();var ke=["data-p-icon","minus"],le=(()=>{class n extends ce{static \u0275fac=(()=>{let e;return function(t){return(e||(e=h(n)))(t||n)}})();static \u0275cmp=_({type:n,selectors:[["","data-p-icon","minus"]],features:[b],attrs:ke,decls:1,vars:0,consts:[["d","M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z","fill","currentColor"]],template:function(o,t){o&1&&(x(),P(0,"path",0))},encapsulation:2})}return n})();var he=`
    .p-checkbox {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('checkbox.width');
        height: dt('checkbox.height');
    }

    .p-checkbox-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: dt('checkbox.border.radius');
    }

    .p-checkbox-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: dt('checkbox.border.radius');
        border: 1px solid dt('checkbox.border.color');
        background: dt('checkbox.background');
        width: dt('checkbox.width');
        height: dt('checkbox.height');
        transition:
            background dt('checkbox.transition.duration'),
            color dt('checkbox.transition.duration'),
            border-color dt('checkbox.transition.duration'),
            box-shadow dt('checkbox.transition.duration'),
            outline-color dt('checkbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('checkbox.shadow');
    }

    .p-checkbox-icon {
        transition-duration: dt('checkbox.transition.duration');
        color: dt('checkbox.icon.color');
        font-size: dt('checkbox.icon.size');
        width: dt('checkbox.icon.size');
        height: dt('checkbox.icon.size');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        border-color: dt('checkbox.hover.border.color');
    }

    .p-checkbox-checked .p-checkbox-box {
        border-color: dt('checkbox.checked.border.color');
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked .p-checkbox-icon {
        color: dt('checkbox.icon.checked.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
        border-color: dt('checkbox.checked.hover.border.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {
        color: dt('checkbox.icon.checked.hover.color');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.focus.border.color');
        box-shadow: dt('checkbox.focus.ring.shadow');
        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');
        outline-offset: dt('checkbox.focus.ring.offset');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.checked.focus.border.color');
    }

    .p-checkbox.p-invalid > .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }

    .p-checkbox.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.filled.background');
    }

    .p-checkbox-checked.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
    }

    .p-checkbox.p-disabled {
        opacity: 1;
    }

    .p-checkbox.p-disabled .p-checkbox-box {
        background: dt('checkbox.disabled.background');
        border-color: dt('checkbox.checked.disabled.border.color');
    }

    .p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {
        color: dt('checkbox.icon.disabled.color');
    }

    .p-checkbox-sm,
    .p-checkbox-sm .p-checkbox-box {
        width: dt('checkbox.sm.width');
        height: dt('checkbox.sm.height');
    }

    .p-checkbox-sm .p-checkbox-icon {
        font-size: dt('checkbox.icon.sm.size');
        width: dt('checkbox.icon.sm.size');
        height: dt('checkbox.icon.sm.size');
    }

    .p-checkbox-lg,
    .p-checkbox-lg .p-checkbox-box {
        width: dt('checkbox.lg.width');
        height: dt('checkbox.lg.height');
    }

    .p-checkbox-lg .p-checkbox-icon {
        font-size: dt('checkbox.icon.lg.size');
        width: dt('checkbox.icon.lg.size');
        height: dt('checkbox.icon.lg.size');
    }
`;var xe=["icon"],me=["input"],fe=(n,d,e)=>({checked:n,class:d,dataP:e});function ge(n,d){if(n&1&&y(0,"span",8),n&2){let e=k(3);u(e.cx("icon")),a("ngClass",e.checkboxIcon)("pBind",e.ptm("icon")),p("data-p",e.dataP)}}function ve(n,d){if(n&1&&(x(),y(0,"svg",9)),n&2){let e=k(3);u(e.cx("icon")),a("pBind",e.ptm("icon")),p("data-p",e.dataP)}}function Ce(n,d){if(n&1&&(D(0),m(1,ge,1,5,"span",6)(2,ve,1,4,"svg",7),N()),n&2){let e=k(2);s(),a("ngIf",e.checkboxIcon),s(),a("ngIf",!e.checkboxIcon)}}function _e(n,d){if(n&1&&(x(),y(0,"svg",10)),n&2){let e=k(2);u(e.cx("icon")),a("pBind",e.ptm("icon")),p("data-p",e.dataP)}}function ye(n,d){if(n&1&&(D(0),m(1,Ce,3,2,"ng-container",3)(2,_e,1,4,"svg",5),N()),n&2){let e=k();s(),a("ngIf",e.checked),s(),a("ngIf",e._indeterminate())}}function Ie(n,d){}function Me(n,d){n&1&&m(0,Ie,0,0,"ng-template")}var we=`
    ${he}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`,Be={root:({instance:n})=>["p-checkbox p-component",{"p-checkbox-checked p-highlight":n.checked,"p-disabled":n.$disabled(),"p-invalid":n.invalid(),"p-variant-filled":n.$variant()==="filled","p-checkbox-sm p-inputfield-sm":n.size()==="small","p-checkbox-lg p-inputfield-lg":n.size()==="large"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},pe=(()=>{class n extends ee{name="checkbox";style=we;classes=Be;static \u0275fac=(()=>{let e;return function(t){return(e||(e=h(n)))(t||n)}})();static \u0275prov=E({token:n,factory:n.\u0275fac})}return n})();var ue=new z("CHECKBOX_INSTANCE"),Ve={provide:ne,useExisting:F(()=>be),multi:!0},be=(()=>{class n extends se{componentName="Checkbox";hostName="";value;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;inputStyle;styleClass;inputClass;indeterminate=!1;formControl;checkboxIcon;readonly;autofocus;trueValue=!0;falseValue=!1;variant=l();size=l();onChange=new v;onFocus=new v;onBlur=new v;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.modelValue()===this.trueValue:W(this.value,this.modelValue())}_indeterminate=C(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;focused=!1;_componentStyle=g(pe);bindDirectiveInstance=g(f,{self:!0});$pcCheckbox=g(ue,{optional:!0,skipSelf:!0})??void 0;$variant=w(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"icon":this._checkboxIconTemplate=e.template;break;case"checkboxicon":this._checkboxIconTemplate=e.template;break}})}onChanges(e){e.indeterminate&&this._indeterminate.set(e.indeterminate.currentValue)}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}updateModel(e){let o,t=this.injector.get(te,null,{optional:!0,self:!0}),i=t&&!this.formControl?t.value:this.modelValue();this.binary?(o=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.writeModelValue(o),this.onModelChange(o)):(this.checked||this._indeterminate()?o=i.filter(c=>!J(c,this.value)):o=i?[...i,this.value]:[this.value],this.onModelChange(o),this.writeModelValue(o),this.formControl&&this.formControl.setValue(o)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:o,originalEvent:e})}handleChange(e){this.readonly||this.updateModel(e)}onInputFocus(e){this.focused=!0,this.onFocus.emit(e)}onInputBlur(e){this.focused=!1,this.onBlur.emit(e),this.onModelTouched()}focus(){this.inputViewChild?.nativeElement.focus()}writeControlValue(e,o){o(e),this.cd.markForCheck()}get dataP(){return this.cn({invalid:this.invalid(),checked:this.checked,disabled:this.$disabled(),filled:this.$variant()==="filled",[this.size()]:this.size()})}static \u0275fac=(()=>{let e;return function(t){return(e||(e=h(n)))(t||n)}})();static \u0275cmp=_({type:n,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(o,t,i){if(o&1&&H(i,xe,4)(i,Y,4),o&2){let c;I(c=M())&&(t.checkboxIconTemplate=c.first),I(c=M())&&(t.templates=c)}},viewQuery:function(o,t){if(o&1&&L(me,5),o&2){let i;I(i=M())&&(t.inputViewChild=i.first)}},hostVars:6,hostBindings:function(o,t){o&2&&(p("data-p-highlight",t.checked)("data-p-checked",t.checked)("data-p-disabled",t.$disabled())("data-p",t.dataP),u(t.cn(t.cx("root"),t.styleClass)))},inputs:{hostName:"hostName",value:"value",binary:[2,"binary","binary",r],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",G],inputId:"inputId",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",r],formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",r],autofocus:[2,"autofocus","autofocus",r],trueValue:"trueValue",falseValue:"falseValue",variant:[1,"variant"],size:[1,"size"]},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[j([Ve,pe,{provide:ue,useExisting:n},{provide:oe,useExisting:n}]),$([f]),b],decls:5,vars:26,consts:[["input",""],["type","checkbox",3,"focus","blur","change","checked","pBind"],[3,"pBind"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],[3,"class","ngClass","pBind",4,"ngIf"],["data-p-icon","check",3,"class","pBind",4,"ngIf"],[3,"ngClass","pBind"],["data-p-icon","check",3,"pBind"],["data-p-icon","minus",3,"pBind"]],template:function(o,t){o&1&&(V(0,"input",1,0),q("focus",function(c){return t.onInputFocus(c)})("blur",function(c){return t.onInputBlur(c)})("change",function(c){return t.handleChange(c)}),T(),V(2,"div",2),m(3,ye,3,2,"ng-container",3)(4,Me,1,0,null,4),T()),o&2&&(Q(t.inputStyle),u(t.cn(t.cx("input"),t.inputClass)),a("checked",t.checked)("pBind",t.ptm("input")),p("id",t.inputId)("value",t.value)("name",t.name())("tabindex",t.tabindex)("required",t.required()?"":void 0)("readonly",t.readonly?"":void 0)("disabled",t.$disabled()?"":void 0)("aria-labelledby",t.ariaLabelledBy)("aria-label",t.ariaLabel),s(2),u(t.cx("box")),a("pBind",t.ptm("box")),p("data-p",t.dataP),s(),a("ngIf",!t.checkboxIconTemplate&&!t._checkboxIconTemplate),s(),a("ngTemplateOutlet",t.checkboxIconTemplate||t._checkboxIconTemplate)("ngTemplateOutletContext",R(22,fe,t.checked,t.cx("icon"),t.dataP)))},dependencies:[Z,K,X,U,B,ae,le,ie,f],encapsulation:2,changeDetection:0})}return n})(),rn=(()=>{class n{static \u0275fac=function(o){return new(o||n)};static \u0275mod=A({type:n});static \u0275inj=S({imports:[be,B,B]})}return n})();export{se as a,be as b,rn as c};
