import { LitElement } from "lit-element/lit-element.js";
import {
  observable,
  makeObservable,
  computed,
  configure,
  autorun,
  toJS,
} from "mobx";
configure({ enforceActions: false, useProxies: "ifavailable" }); // strict mode off

class GradeBookStoreClass extends LitElement {
  static get tag() {
    return "grade-book-store";
  }
  constructor() {
    super();
    this.gradeScale = [];
    this.activeStudent = 0;
    this.activeAssignment = 0;
    makeObservable(this, {
      gradeScale: observable,
      activeStudent: observable,
      activeAssignment: observable,
    });
  }
}
customElements.define(GradeBookStoreClass.tag, GradeBookStoreClass);
export { GradeBookStoreClass };
window.GradeBookStore = window.GradeBookStore || {};
window.GradeBookStore.requestAvailability = function () {
  if (!window.GradeBookStore.instance) {
    window.GradeBookStore.instance = document.createElement("grade-book-store");
    document.body.appendChild(window.GradeBookStore.instance);
  }
  return window.GradeBookStore.instance;
};
// export the singleton so everyone can directly reference it
export const GradeBookStore = window.GradeBookStore.requestAvailability();
