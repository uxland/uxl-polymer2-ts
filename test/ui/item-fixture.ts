import {customElement, item} from "../../src/index";
import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {html as litHtml, LitElement} from '@polymer/lit-element/lit-element';
const assert = chai.assert;
suite('item-fixture', () =>{
    const fixtureElementName = 'polymer-decorators-fixture';
    test('create item', () =>{
        @customElement('custom-element')
        class Component extends PolymerElement {
            static get template(){
                return html `<h1 id="header">MyComponent</h1>`;
            }
            @item('header')
            h1: HTMLHeadElement;
        }
        let container: HTMLDivElement = fixture(fixtureElementName);
        let component: Component = <any>document.createElement('custom-element');
        container.appendChild(<any>component);
        assert.exists(component.h1);
        assert.equal(component.h1.innerText, 'MyComponent');
    });
    test('lit element', async() =>{
        @customElement('custom-lit-element')
        class Component extends LitElement{
            _render(props: LitElement){
                return litHtml `<span id="my-span">Hello world</span>`
            }
            @item('my-span')
            mySpan: HTMLSpanElement;
        }
        let container: HTMLDivElement = fixture(fixtureElementName);
        let component: Component = <any>document.createElement('custom-lit-element');
        container.appendChild(<any>component);
        component.requestRender();
        await component.renderComplete;
        assert.exists(component.mySpan);
        assert.equal(component.mySpan.constructor, HTMLSpanElement);
    });
});