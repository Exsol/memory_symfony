import e from "../utils/classSet";
import t from "../utils/hasClass";
import s from "./Framework";

export default class n extends s {
    constructor(e) {
        super(Object.assign({}, {
            formClass: "fv-plugins-bootstrap3",
            messageClass: "help-block",
            rowClasses: "has-feedback",
            rowInvalidClass: "has-error",
            rowPattern: /^(.*)(col|offset)-(xs|sm|md|lg)-[0-9]+(.*)$/,
            rowSelector: ".form-group",
            rowValidClass: "has-success"
        }, e))
    }

    onIconPlaced(s) {
        e(s.iconElement, {"form-control-feedback": true});
        const n = s.element.parentElement;
        if (t(n, "input-group")) {
            n.parentElement.insertBefore(s.iconElement, n.nextSibling)
        }
        const r = s.element.getAttribute("type");
        if ("checkbox" === r || "radio" === r) {
            const e = n.parentElement;
            if (t(n, r)) {
                n.parentElement.insertBefore(s.iconElement, n.nextSibling)
            } else if (t(n.parentElement, r)) {
                e.parentElement.insertBefore(s.iconElement, e.nextSibling)
            }
        }
    }
}