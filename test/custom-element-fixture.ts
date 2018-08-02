import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {customElement} from "../src/index";
import {LitElement, html as litHtml} from "@polymer/lit-element";
const assert = chai.assert;
const isRegistered = function(name) {
    return document.createElement(name).constructor !== HTMLElement;
}
suite('custom element fixture', () => {
    const fixtureElementName = 'polymer-decorators-fixture';
    test('register element', () => {
            @customElement('custom-element')
            class Component extends PolymerElement {
                static get template(){
                    return html `<h1 id="header">MyComponent</h1>`;
                }
            }
            assert.isTrue(isRegistered('custom-element'));
        }
    )
    test('lit element', () =>{
        @customElement('custom-lit-element')
        class Component extends LitElement{
            _render(){
                return litHtml `<div>hello</div>`;
            }
        }
        assert.isTrue(isRegistered('custom-lit-element'));
    })
});