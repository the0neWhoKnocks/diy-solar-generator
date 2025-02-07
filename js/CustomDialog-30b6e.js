(()=>{const _="--dialog-animDuration",l="--dialog--color--body",a="--dialog--color--border",i="--dialog--color--title--bg",n="--dialog--color--title--text",d="dialogClosed",e="dialog",m="#eee",h="#000",p="#333",u="#eee",b="[BODY]";class c extends HTMLElement{get modal(){return this.hasAttribute("modal")}set modal(t){t===""||t==="true"||t===!0?this.setAttribute("modal",""):this.removeAttribute("modal"),this.render()}get open(){return this.hasAttribute("open")}set open(t){t===""||t==="true"||t===!0?(this.prevFocused=document.activeElement,this.render(),this.setAttribute("open",""),this.els.dialog.setAttribute("open",""),this.els.wrapper.classList.add("in"),setTimeout(()=>{this.els.wrapper.addEventListener("click",this.handleCloseClick),window.addEventListener("keydown",this.handleKeyDown),this.els.dialog.focus()},300)):(this.els.wrapper.removeEventListener("click",this.handleCloseClick),window.removeEventListener("keydown",this.handleKeyDown),this.els.wrapper.classList.add("out"),setTimeout(()=>{this.els.wrapper.classList.remove("in","out"),this.removeAttribute("open"),this.els.dialog.removeAttribute("open"),this.prevFocused&&this.prevFocused.focus(),this.dispatchEvent(new CustomEvent(d,{bubbles:!0,detail:{modal:this.modal}}))},300))}static get observedAttributes(){return["modal","open"]}static get events(){return{closed:d}}attributeChangedCallback(t,o,s){if(!(o===""&&s==null)&&o!==s){let $=s;switch(t){default:this[t]=$}}}constructor(){super(),this.attachShadow({mode:"open"});const{shadowRoot:t}=this;t.innerHTML=`
        <style>
          @keyframes dialogIn {
            0% {
              opacity: 0;
              transform: translateY(-30%);
            }
            100% {
              opacity: 1;
              transform: translateY(0%);
            }
          }
          @keyframes dialogOut {
            0% {
              opacity: 1;
              transform: translateY(0%);
            }
            100% {
              opacity: 0;
              transform: translateY(30%);
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
            ${_}: 300ms;
            ${l}: ${m};
            ${a}: ${h};
            ${i}: ${p};
            ${n}: ${u};
            
            font: 16px Helvetica, Arial, sans-serif;
            position: fixed;
            inset: 0;
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
          
          .${e}-wrapper {
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .${e}__body button {
            color: #fff;
            width: 100%;
            padding: 0.75em 1em;
            border: none;
            border-radius: 0.25em;
            background: #000;
            position: relative;
          }
          .${e}__body button:focus {
            outline: none;
          }
          .${e}__body button:focus::after {
            content: '';
            position: absolute;
            border: solid 2px currentColor;
            border-radius: 0.25em;
            top: 2px;
            left: 2px;
            bottom: 2px;
            right: 2px;
          }
          
          .${e} {
            max-width: calc(100vw - 2em);
            max-height: calc(100vh - 2em);
            overflow: hidden;
            padding: 0;
            border: solid 4px var(${a});
            border-radius: 0.5em;
            background: var(${a});
            box-shadow: 0 0.75em 2em 0.25em rgba(0, 0, 0, 0.75);
          }
          
          .${e}__nav {
            min-height: 2em;
            font-size: 1.25em;
            border-bottom: solid 1px;
            background-color: var(${i});
            display: flex;
          }
          
          .${e}__title {
            width: 100%;
            color: var(${n});
            padding: 0.5em;
            padding-right: 1em;
            background: var(${i});
          }
          
          .${e}__body {
            background: var(${l});
          }
          
          .${e}__close-btn {
            color: var(${n});
            font-size: 1.25em;
            padding: 0 0.5em;
            border: none;
            border-radius: 0.3em; /* for focus border */
            background: var(${i});
          }
          .${e}__close-btn:focus-visible {
            outline: solid 2px color-mix(in srgb, currentColor 40%, transparent);
            outline-offset: -4px;
          }
          :host([modal]) .${e}__close-btn {
            display: none;
          }
          
          .${e}-mask {
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.5);
            position: absolute;
            top: 0;
            left: 0;
            backdrop-filter: blur(10px);
          }
          
          .${e}-wrapper.in .${e}-mask {
            animation: maskIn 300ms;
          }
          .${e}-wrapper.out .${e}-mask {
            animation: maskOut 300ms forwards;
          }
          .${e}-wrapper.in .${e} {
            animation: dialogIn 300ms;
          }
          .${e}-wrapper.out .${e} {
            animation: dialogOut 300ms forwards;
          }
        </style>
        
        <div class="${e}-wrapper">
          <div class="${e}-mask"></div>
          <dialog class="${e}" tabindex="0"></dialog>
        </div>
      `,this.els={dialog:t.querySelector(`.${e}`),wrapper:t.querySelector(`.${e}-wrapper`)},this.handleCloseClick=this.handleCloseClick.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this)}handleCloseClick({keyClose:t,target:o}){!this.modal&&(t||o&&(o.classList.contains(`${e}-mask`)||o.classList.contains(`${e}__close-btn`)))&&(this.open=!1)}handleKeyDown({key:t}){switch(t){case"Escape":this.handleCloseClick({keyClose:!0});break}}render(){const t=this.querySelector('[slot="dialogTitle"]');let o="";if(!this.modal||this.modal&&t){let s="";this.modal||(s=`
            <button type="button" class="${e}__close-btn" title="Close Dialog">
              &#10005;
            </button>
          `),o=`
          <nav class="${e}__nav">
            <div class="${e}__title">
              <slot name="dialogTitle"></slot>
            </div>
            ${s}
          </nav>
        `}this.els.dialog.innerHTML=`
        ${o}
        <div class="${e}__body">
          <slot name="dialogBody">${b}</slot>
        </div>
      `}}const r="custom-dialog";window.customElements.get(r)?console.warn(`${r} already defined`):(window.customElements.define(r,c),window.CustomDialog=c)})();
