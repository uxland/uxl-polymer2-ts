import {customElement, item} from "../src/index";
import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
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
});