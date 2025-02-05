(()=>{const c="--dialog-animDuration",l="--dialog--color--body",a="--dialog--color--border",i="--dialog--color--title--bg",n="--dialog--color--title--text",d="dialogClosed",t="dialog",m="#eee",p="#000",h="#333",u="#eee",b="[BODY]";class _ extends HTMLElement{get modal(){return this.hasAttribute("modal")}set modal(e){e===""||e==="true"||e===!0?this.setAttribute("modal",""):this.removeAttribute("modal"),this.render()}get open(){return this.hasAttribute("open")}set open(e){e===""||e==="true"||e===!0?(this.render(),this.setAttribute("open",""),this.els.dialog.setAttribute("open",""),this.els.wrapper.classList.add("in"),setTimeout(()=>{this.els.wrapper.addEventListener("click",this.handleCloseClick),window.addEventListener("keydown",this.handleKeyDown)},300)):(this.els.wrapper.removeEventListener("click",this.handleCloseClick),window.removeEventListener("keydown",this.handleKeyDown),this.els.wrapper.classList.add("out"),setTimeout(()=>{this.els.wrapper.classList.remove("in","out"),this.removeAttribute("open"),this.els.dialog.removeAttribute("open"),this.dispatchEvent(new CustomEvent(d,{bubbles:!0,detail:{modal:this.modal}}))},300))}static get observedAttributes(){return["modal","open"]}static get events(){return{closed:d}}attributeChangedCallback(e,o,s){if(!(o===""&&s==null)&&o!==s){let $=s;switch(e){default:this[e]=$}}}constructor(){super(),this.attachShadow({mode:"open"});const{shadowRoot:e}=this;e.innerHTML=`
        <style>
          @keyframes dialogIn {
            0% {
              opacity: 0;
              transform: translate(-50%, -90%);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
          @keyframes dialogOut {
            0% {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -10%);
            }
          }
          @keyframes maskIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes maskOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
          }
          
          *, *::after, *::before {
            box-sizing: border-box;
          }
          
          :host {
            ${c}: 300ms;
            ${l}: ${m};
            ${a}: ${p};
            ${i}: ${h};
            ${n}: ${u};
            
            font: 16px Helvetica, Arial, sans-serif;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 10;
          }
          :host(:not([open])) {
            display: none;
          }
          
          button,
          input,
          select,
          textarea {
        		fill: orange;
        	}
          button:not(disabled) {
            cursor: pointer;
          }
          
          .${t}__body button {
            color: #fff;
            width: 100%;
            padding: 0.75em 1em;
            border: none;
            border-radius: 0.25em;
            background: #000;
            position: relative;
          }
          .${t}__body button:focus {
            outline: none;
          }
          .${t}__body button:focus::after {
            content: '';
            position: absolute;
            border: solid 2px currentColor;
            border-radius: 0.25em;
            top: 2px;
            left: 2px;
            bottom: 2px;
            right: 2px;
          }
          
          .${t} {
            max-width: calc(100vw - 2em);
            max-height: calc(100vh - 2em);
            overflow: hidden;
            padding: 0;
            border: solid 4px var(${a});
            border-radius: 0.5em;
            margin: 0;
            background: var(${a});
            box-shadow: 0 0.75em 2em 0.25em rgba(0, 0, 0, 0.75);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          
          .${t}__nav {
            min-height: 2em;
            font-size: 1.25em;
            border-bottom: solid 1px;
            background-color: var(${i});
            display: flex;
          }
          
          .${t}__title {
            width: 100%;
            color: var(${n});
            padding: 0.5em;
            padding-right: 1em;
            background: var(${i});
          }
          
          .${t}__body {
            background: var(${l});
          }
          
          .${t}__close-btn {
            color: var(${n});
            font-size: 1.25em;
            padding: 0 0.5em;
            border: none;
            background: var(${i});
          }
          :host([modal]) .${t}__close-btn {
            display: none;
          }
          
          .${t}-mask {
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.5);
            position: absolute;
            top: 0;
            left: 0;
            backdrop-filter: blur(10px);
          }
          
          .${t}-wrapper.in .${t}-mask {
            animation: maskIn 300ms;
          }
          .${t}-wrapper.out .${t}-mask {
            animation: maskOut 300ms forwards;
          }
          .${t}-wrapper.in .${t} {
            animation: dialogIn 300ms;
          }
          .${t}-wrapper.out .${t} {
            animation: dialogOut 300ms forwards;
          }
        </style>
        
        <div class="${t}-wrapper">
          <div class="${t}-mask"></div>
          <dialog class="${t}" tabindex="0"></dialog>
        </div>
      `,this.els={dialog:e.querySelector(`.${t}`),wrapper:e.querySelector(`.${t}-wrapper`)},this.handleCloseClick=this.handleCloseClick.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this)}handleCloseClick({keyClose:e,target:o}){!this.modal&&(e||o&&(o.classList.contains(`${t}-mask`)||o.classList.contains(`${t}__close-btn`)))&&(this.open=!1)}handleKeyDown({key:e}){switch(e){case"Escape":this.handleCloseClick({keyClose:!0});break}}render(){const e=this.querySelector('[slot="dialogTitle"]');let o="";if(!this.modal||this.modal&&e){let s="";this.modal||(s=`
            <button type="button" class="${t}__close-btn" title="Close Dialog">
              &#10005;
            </button>
          `),o=`
          <nav class="${t}__nav">
            <div class="${t}__title">
              <slot name="dialogTitle"></slot>
            </div>
            ${s}
          </nav>
        `}this.els.dialog.innerHTML=`
        ${o}
        <div class="${t}__body">
          <slot name="dialogBody">${b}</slot>
        </div>
      `}}const r="custom-dialog";window.customElements.get(r)?console.warn(`${r} already defined`):(window.customElements.define(r,_),window.CustomDialog=_)})();
