import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import { computed, customElement, property } from "../src/index";
const should = chai.should();
//import {suite} from "mocha";
suite("property fixture", () => {
    test("property created", () => {
        @customElement("my-element")
        class Component extends PolymerElement {
            @property() myProperty: string;
        }
        should.exist(Component["properties"]["myProperty"]);
        should.equal(Component["properties"]["myProperty"].type, String);
    });
    test("computed default value", () => {
        @customElement("my-element1")
        class Component extends PolymerElement {
            static get template() {
                return html`<h1 id="header">hello</h1>`;
            }
            myDefValue: boolean;
            @property() myProperty: string;
            @computed("myDefValue", ["myProperty"], undefined, Boolean, false)
            computeMyProperty(p) {
                return p == "hello";
            }
            connectedCallback() {
                super.connectedCallback();
            }
        }
        const fixtureElementName = "polymer-decorators-fixture";
        let container: HTMLDivElement = fixture(fixtureElementName);
        let component: Component = <any>document.createElement("my-element1");
        container.appendChild(<any>component);
        should.equal(component.myDefValue, false);
        component.myProperty = "hello";
        should.equal(component.myDefValue, true);
    });
});
