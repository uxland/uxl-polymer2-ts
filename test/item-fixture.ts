import { customElement, item } from "../src/index";
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
const should = chai.should();
suite("item-fixture", () => {
    const fixtureElementName = "polymer-decorators-fixture";
    test("create item", () => {
        @customElement("custom-element")
        class Component extends PolymerElement {
            static get template() {
                return html`<h1 id="header">MyComponent</h1>`;
            }
            @item("header") h1: HTMLHeadElement;
        }
        let container: HTMLDivElement = fixture(fixtureElementName);
        let component: Component = <any>document.createElement("custom-element");
        container.appendChild(<any>component);
        should.exist(component.h1);
        should.equal(component.h1.innerText, "MyComponent");
    });
});
