namespace ui {
    export function width(val: number): Style {
        return new Style(StyleName.width, val);
    }

    export function height(val: number): Style {
        return new Style(StyleName.height, val);
    }

    export function paddingLeft(val: number): Style {
        return new Style(StyleName.paddingLeft, val);
    }

    export function paddingTop(val: number): Style {
        return new Style(StyleName.paddingTop, val);
    }

    export function paddingRight(val: number): Style {
        return new Style(StyleName.paddingRight, val);
    }

    export function paddingBottom(val: number): Style {
        return new Style(StyleName.paddingBottom, val);
    }

    export function borderColor(val: number): Style {
        return new Style(StyleName.borderColor, val);
    }

    export function borderLeft(val: number): Style {
        return new Style(StyleName.borderLeft, val);
    }

    export function borderTop(val: number): Style {
        return new Style(StyleName.borderTop, val);
    }

    export function borderRight(val: number): Style {
        return new Style(StyleName.borderRight, val);
    }

    export function borderBottom(val: number): Style {
        return new Style(StyleName.borderBottom, val);
    }

    export function color(val: number): Style {
        return new Style(StyleName.color, val);
    }

    export function padding(val: number): Style {
        return new Style(StyleName.padding, val);
    }

    export function border(val: number): Style {
        return new Style(StyleName.border, val);
    }

    export function alignLeft(): Style {
        return new Style(StyleName.contentAlign, ContentAlign.Left);
    }

    export function alignCenter(): Style {
        return new Style(StyleName.contentAlign, ContentAlign.Center);
    }

    export function alignRight(): Style {
        return new Style(StyleName.contentAlign, ContentAlign.Right);
    }

    export function smallFont(): Style {
        return new Style(StyleName.font, Font.Small);
    }

    export function animate(doAnimate: boolean) {
        return new Style(StyleName.animate, doAnimate ? 1 : 0)
    }

    export function className(name: string): Style {
        const res = new Style(StyleName.className);
        res.stringValue = name;
        return res;
    }
}

namespace ui {
    export const WRAP = -1;
    export const FILL = -2;

    export enum StyleName {
        width,
        height,
        paddingLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        padding,
        borderColor,
        borderLeft,
        borderTop,
        borderRight,
        borderBottom,
        border,
        color,
        contentAlign,
        font,
        className,
        animate
    }

    export enum ContentAlign {
        Left,
        Center,
        Right
    }

    export enum Font {
        Normal,
        Small
    }

    export class Style {
        readonly name: StyleName;
        value: number;
        stringValue: string;

        constructor(name: StyleName, value?: number) {
            this.name = name;
            this.value = value;
        }
    }

    export class StyleRule {
        readonly className: string;
        protected styles: Style[];

        constructor(className: string, styles: Style[]) {
            this.className = className;
            this.styles = styles || [];
        }

        getStyles() {
            return this.styles;
        }

        add(s: Style) {
            if (s) {
                for (const style of this.styles) {
                    if (style.name === s.name) {
                        style.value = s.value;
                        return;
                    }
                }
                this.styles.push(s);
            }
        }
    }

    export class StyleSheet {
        protected rules: StyleRule[];

        constructor() {
            this.rules = [];
        }

        createClass(name: string, styles: Style[]) {
            this.addRule(new StyleRule(name, styles));
        }

        addRule(r: StyleRule) {
            for (const rule of this.rules) {
                if (rule.className === r.className) {
                    for (const s of r.getStyles()) {
                        rule.add(s);
                    }
                    return;
                }
            }
            this.rules.push(r);
        }

        getStylesForClass(className: string): Style[] {
            for (const rule of this.rules) {
                if (rule.className === className) {
                    return rule.getStyles();
                }
            }
            return [];
        }
    }
}


namespace ui {
    export class BoundingBox {
        left: number;
        top: number;
        width: number;
        height: number;
    }

    export class BoxValues {
        protected data: Buffer;

        constructor() {
            this.data = control.createBuffer(4);
        }

        get left() {
            return this.data[0];
        }

        set left(val: number) {
            this.data[0] = val & 0xff;
        }

        get top() {
            return this.data[1];
        }

        set top(val: number) {
            this.data[1] = val & 0xff;
        }

        get right() {
            return this.data[2];
        }

        set right(val: number) {
            this.data[2] = val & 0xff;
        }

        get bottom() {
            return this.data[3];
        }

        set bottom(val: number) {
            this.data[3] = val & 0xff;
        }
    }

    export class ContentBox {
        padding: BoxValues;
        border: BoxValues;
        align: ContentAlign;
        borderColor: number;

        constructor() {
            this.padding = new BoxValues();
            this.border = new BoxValues();
            this.borderColor = 0;
            this.align = ContentAlign.Center;
        }

        getElementBounds(left: number, top: number, outerWidth: number, outerHeight: number) {
            const r = new BoundingBox();
            r.left = left + this.border.left;
            r.top = top + this.border.top;
            r.width = outerWidth - this.border.left - this.border.right;
            r.height = outerHeight - this.border.top - this.border.bottom;
            return r;
        }

        getContentBounds(element: BoundingBox, contentWidth: number, contentHeight: number) {
            const r = new BoundingBox();
            r.top = element.top + this.padding.top;
            r.width = contentWidth;
            r.height = contentHeight;

            switch (this.align) {
                case ContentAlign.Left:
                    r.left = element.left + this.padding.left;
                    break;
                case ContentAlign.Center:
                    r.left = element.left + (element.width >> 1) - (contentWidth >> 1);
                    break;
                case ContentAlign.Right:
                    r.left = (element.left + element.width - this.padding.right - contentWidth);
                    break;
            }

            return r;
        }
    }

    export class Element {
        parent: Element;
        children: Element[];
        contentBox: ContentBox;

        verticalFlow: boolean;

        width: number;
        height: number;

        _cachedWidth: number;
        _cachedHeight: number;
        _renderedBounds: BoundingBox;

        protected sheet: StyleSheet;
        protected classes: string[];

        constructor() {
            this.verticalFlow = true;
            this.width = WRAP;
            this.height = WRAP;
            this.contentBox = new ContentBox();
        }

        appendChild(child: Element) {
            if (!this.children) this.children = [];

            if (child.parent) {
                child.parent.removeChild(child);
            }

            child.parent = this;
            this.children.push(child);
        }

        removeChild(child: Element) {
            if (this.children) this.children.removeElement(child);
        }

        defineStyleClass(className: string, styles?: Style[]) {
            if (!this.sheet) this.sheet = new StyleSheet();
            const rule = new StyleRule(className, styles);
            this.sheet.addRule(rule);
            return rule;
        }

        draw() {
            if (!this._renderedBounds) {
                this.render();
            }

            this.drawSelf(this._renderedBounds);
            this.drawBorder();

            if (this.children) {
                for (const child of this.children) {
                    child.draw();
                }
            }
        }

        render(bounds?: BoundingBox) {
            if (this._renderedBounds) return;
            this.applyClassStyles();

            if (bounds) {
                this._renderedBounds = this.contentBox.getElementBounds(bounds.left, bounds.top, bounds.width, bounds.height)
            }
            else {
                this._renderedBounds = this.contentBox.getElementBounds(0, 0, calculateWidth(this), calculateHeight(this));
            }

            this.onDidReceiveBounds(this._renderedBounds);

            if (this.children) {
                if (this.verticalFlow) this.renderVerticalFlow();
                else this.renderHorizontalFlow();
            }
        }

        markDirty() {
            this._cachedWidth = undefined;
            this._cachedHeight = undefined;
            this._renderedBounds = undefined;

            if (this.children) this.children.forEach(c => c.markDirty());
        }

        applyStyles(styles: Style[]) {
            for (const style of styles) {
                if (style) this.applyStyle(style);
            }
        }

        protected applyClassStyles() {
            if (this._renderedBounds) return;
            if (this.classes) this.classes.forEach(c => this.applyStylesForClass(c));
            if (this.children) this.children.forEach(c => c.applyClassStyles());
        }

        protected onDidReceiveBounds(bounds: BoundingBox) {
            // subclass
        }

        protected applyStylesForClass(className: string) {
            let classStyles: Style[];
            let current: Element = this;

            while (current) {
                if (current.sheet) {
                    classStyles = current.sheet.getStylesForClass(className);
                    if (classStyles) {
                        break;
                    }
                }

                current = current.parent;
            }

            if (classStyles && classStyles.length) {
                for (const style of classStyles) {
                    if (style) this.applyStyle(style);
                }
            }
        }

        protected renderVerticalFlow() {
            let y = this._renderedBounds.top + this.contentBox.padding.top + this.contentBox.border.top;

            let current: BoundingBox;

            for (const child of this.children) {
                current = this.contentBox.getContentBounds(this._renderedBounds, calculateWidth(child), calculateHeight(child));
                current.top = y;
                child.render(current);
                y += current.height;
            }
        }

        protected renderHorizontalFlow() {
            let x = this._renderedBounds.left + this.contentBox.padding.left + this.contentBox.border.left;
            let current: BoundingBox;

            for (const child of this.children) {
                current = this.contentBox.getContentBounds(this._renderedBounds, calculateWidth(child), calculateHeight(child));
                current.left = x;
                child.render(current);

                x += current.width;
            }
        }

        protected drawSelf(bounds: BoundingBox) {
            // subclass
        }

        protected applyStyle(style: Style) {
            switch (style.name) {
                case StyleName.width: this.width = style.value; return;
                case StyleName.height: this.height = style.value; return;
                case StyleName.borderColor: this.contentBox.borderColor = style.value; return;
                case StyleName.borderLeft: this.contentBox.border.left = style.value; return;
                case StyleName.borderRight: this.contentBox.border.right = style.value; return;
                case StyleName.borderTop: this.contentBox.border.top = style.value; return;
                case StyleName.borderBottom: this.contentBox.border.bottom = style.value; return;
                case StyleName.contentAlign: this.contentBox.align = style.value; break;
                case StyleName.paddingLeft: this.contentBox.padding.left = style.value; return;
                case StyleName.paddingRight: this.contentBox.padding.right = style.value; return;
                case StyleName.paddingTop: this.contentBox.padding.top = style.value; return;
                case StyleName.paddingBottom: this.contentBox.padding.bottom = style.value; return;
                case StyleName.padding:
                    this.contentBox.padding.left = style.value;
                    this.contentBox.padding.right = style.value;
                    this.contentBox.padding.top = style.value;
                    this.contentBox.padding.bottom = style.value;
                    break;
                case StyleName.border:
                    this.contentBox.border.left = style.value;
                    this.contentBox.border.right = style.value;
                    this.contentBox.border.top = style.value;
                    this.contentBox.border.bottom = style.value;
                    break;
                case StyleName.className:
                    if (!this.classes) this.classes = [];
                    this.classes.push(style.stringValue);
                    break;
            }
        }

        protected drawBorder() {
            if (this.contentBox.borderColor === 0) return;

            if (this.contentBox.border.left) {
                screen.fillRect(
                    this._renderedBounds.left - this.contentBox.border.left,
                    this._renderedBounds.top - this.contentBox.border.top,
                    this.contentBox.border.left,
                    this._renderedBounds.height + this.contentBox.border.top + this.contentBox.border.bottom,
                    this.contentBox.borderColor
                );
            }

            if (this.contentBox.border.right) {
                screen.fillRect(
                    this._renderedBounds.left + this._renderedBounds.width,
                    this._renderedBounds.top - this.contentBox.border.top,
                    this.contentBox.border.right,
                    this._renderedBounds.height + this.contentBox.border.top + this.contentBox.border.bottom,
                    this.contentBox.borderColor
                );
            }

            if (this.contentBox.border.top) {
                screen.fillRect(
                    this._renderedBounds.left - this.contentBox.border.left,
                    this._renderedBounds.top - this.contentBox.border.top,
                    this._renderedBounds.width + this.contentBox.border.left + this.contentBox.border.right,
                    this.contentBox.border.top,
                    this.contentBox.borderColor
                );
            }

            if (this.contentBox.border.bottom) {
                screen.fillRect(
                    this._renderedBounds.left - this.contentBox.border.left,
                    this._renderedBounds.top + this._renderedBounds.height,
                    this._renderedBounds.width + this.contentBox.border.left + this.contentBox.border.right,
                    this.contentBox.border.bottom,
                    this.contentBox.borderColor
                );
            }
        }
    }

    function calculateWidth(element: Element): number {
        if (!element) return screen.width;
        else if (element._cachedWidth != undefined) return element._cachedWidth;
        else if (element.width === WRAP) return getWRAPWidth(element);
        else if (element.width === FILL) return element._cachedWidth = contentWidth(element.parent);
        else return element._cachedWidth = element.width;
    }

    function calculateHeight(element: Element): number {
        if (!element) return screen.height;
        else if (element._cachedHeight != undefined) return element._cachedHeight;
        else if (element.height === WRAP) return getWRAPHeight(element);
        else if (element.height === FILL) return element._cachedHeight = contentHeight(element.parent);
        else return element._cachedHeight = element.height;
    }

    function getWRAPWidth(element: Element) {
        if (element._cachedWidth != undefined) return element._cachedWidth;

        let childWidth = 0;

        if (element.width !== WRAP && element.width !== FILL) {
            return element._cachedWidth = element.width;
        }
        else if (element.children) {
            if (element.verticalFlow) {
                let maxWidth = 0;
                for (const child of element.children) {
                    maxWidth = Math.max(getWRAPWidth(child), maxWidth)
                }
                childWidth = maxWidth;
            }
            else {
                let totalWidth = 0;
                for (const child of element.children) {
                    totalWidth += getWRAPWidth(child);
                }
                childWidth = totalWidth;
            }
        }

        childWidth += element.contentBox.padding.left +
            element.contentBox.padding.right +
            element.contentBox.border.left +
            element.contentBox.border.right;

        if (element.width === WRAP) {
            element._cachedWidth = childWidth;
        }

        return childWidth;
    }

    function getWRAPHeight(element: Element) {
        if (element._cachedHeight != undefined) return element._cachedHeight;

        let childHeight = 0;

        if (element.height !== WRAP && element.height !== FILL) {
            return element._cachedHeight = element.height;
        }
        else if (element.children) {
            if (element.verticalFlow) {
                let totalHeight = 0;
                for (const child of element.children) {
                    totalHeight += getWRAPHeight(child);
                }
                childHeight = totalHeight;
            }
            else {
                let maxHeight = 0;
                for (const child of element.children) {
                    maxHeight = Math.max(getWRAPHeight(child), maxHeight)
                }
                childHeight = maxHeight;
            }
        }

        childHeight += element.contentBox.padding.top +
            element.contentBox.padding.bottom +
            element.contentBox.border.top +
            element.contentBox.border.bottom;

        if (element.height === WRAP) {
            element._cachedHeight = childHeight;
        }

        return childHeight;
    }

    function contentWidth(element: Element) {
        if (!element) return screen.width;
        else {
            return calculateWidth(element) -
                element.contentBox.padding.left -
                element.contentBox.padding.right -
                element.contentBox.border.left -
                element.contentBox.border.right;
        }
    }

    function contentHeight(element: Element) {
        if (!element) return screen.height;
        else {
            return calculateHeight(element) -
                element.contentBox.padding.top -
                element.contentBox.padding.bottom -
                element.contentBox.border.top -
                element.contentBox.border.bottom;
        }
    }
}

namespace ui {
    export function box(child?: Element, styles?: Style[]) {
        const box = new BoxElement();

        if (child) {
            box.appendChild(child);
        }
        if (styles) {
            box.applyStyles(styles);
        }
        return box;
    }

    export function text(content: string, styles?: Style[]) {
        const text = new TextElement(content);
        if (styles) {
            text.applyStyles(styles);
        }
        return text;
    }

    export function longText(content: string, styles?: Style[]) {
        const text = new LongTextElement(content);
        if (styles) {
            text.applyStyles(styles);
        }
        return text;
    }

    export function verticalFlow(children: Element[], styles?: Style[]) {
        const container = new Element();
        if (styles) {
            container.applyStyles(styles);
        }

        for (const child of children) {
            container.appendChild(child)
        }

        return container;
    }

    export function horizontalFlow(children: Element[], styles?: Style[]) {
        const res = verticalFlow(children, styles);
        res.verticalFlow = false;
        return res;
    }

    export function scrollingLabel(label: string, maxWidth: number, styles?: Style[]) {
        const el = new ScrollingTextElement(label, maxWidth);
        if (styles) {
            el.applyStyles(styles);
        }
        return el;
    }
}
namespace ui {
    export class ShapeElement extends Element {
        color: number;

        constructor() {
            super();

            this.color = 0;
        }

        protected drawSelf(bounds: BoundingBox) {
            if (this.color) this.drawShape(bounds);
        }

        protected drawShape(bounds: BoundingBox) {
            screen.drawRect(bounds.left, bounds.top, bounds.width, bounds.height, this.color);
        }

        applyStyle(style: Style) {
            if (style.name === StyleName.color) {
                this.color = style.value
            }
            else {
                super.applyStyle(style);
            }
        }
    }

    export class BoxElement extends ShapeElement {
        protected drawShape(bounds: BoundingBox) {
            screen.fillRect(bounds.left, bounds.top, bounds.width, bounds.height, this.color);
        }
    }

    export class TextElement extends ShapeElement {
        text: string;
        font: Font;

        constructor(text?: string) {
            super();
            this.setText(text);
            this.color = 15;
            this.font = Font.Normal;
        }

        setText(text: string) {
            this.text = text;
            this.updateBounds();
        }

        applyStyle(style: Style) {
            if (style.name === StyleName.font) {
                this.font = style.value;
                this.updateBounds();
            }
            else {
                super.applyStyle(style);
            }
        }

        protected updateBounds() {
            const f = this.renderFont();
            this.height = f.charHeight;
            if (this.text) {
                this.width = this.text.length * f.charWidth;
            }
            else {
                this.width = 0;
            }
        }

        protected drawShape(bounds: BoundingBox) {
            screen.print(this.text, bounds.left, bounds.top, this.color, this.renderFont());
        }

        protected renderFont() {
            if (this.font === Font.Small) {
                return image.font5
            }
            return image.font8;
        }
    }

    export class ScrollingTextElement extends TextElement {
        protected partialCanvas: Image;
        protected offset: number;
        protected pauseTime: number;
        protected stage: number;
        protected timer: number;
        protected maxCharacters: number;
        protected maxOffset: number;
        protected scrolling: boolean;

        constructor(text: string, maxWidth: number) {
            super(text);

            this.pauseTime = 1000;
            this.timer = this.pauseTime;
            this.stage = 0;
            this.offset = 0;
            this.width = maxWidth;

            this.updateBounds();
        }

        applyStyle(style: Style) {
            if (style.name === StyleName.animate) {
                this.scrolling = !!style.value
            }
            else {
                super.applyStyle(style);
            }
        }

        protected updateBounds() {
            const f = this.renderFont();
            this.height = f.charHeight;

            const fullLength = this.text.length * f.charWidth;
            this.maxCharacters = Math.idiv(this.width, f.charWidth);
            this.maxOffset = fullLength - this.maxCharacters * f.charWidth;
            this.partialCanvas = image.create(f.charWidth, f.charHeight);
        }

        protected drawShape(bounds: BoundingBox) {
            const font = this.renderFont();
            const startIndex = Math.idiv(this.offset, font.charWidth);
            const letterOffset = startIndex * font.charWidth - this.offset;

            if (!this.scrolling) {
                this.offset = 0;
            }
            else if (this.stage === 1) {
                this.offset++;
                if (this.offset >= this.maxOffset) {
                    this.stage++;
                    this.offset = Math.max(this.maxOffset, 0);
                }
            }
            else {
                if (this.stage === 0) {
                    this.offset = 0;
                }
                else if (this.stage === 2) {
                    this.offset = Math.max(this.maxOffset, 0);
                }

                this.timer -= game.currentScene().eventContext.deltaTimeMillis;

                if (this.timer < 0) {
                    this.stage = (this.stage + 1) % 3;
                    this.timer = this.pauseTime;
                }
            }

            if (letterOffset) {
                this.partialCanvas.fill(0);
                this.partialCanvas.print(this.text.charAt(startIndex), letterOffset, 0, this.color, font)
                screen.drawTransparentImage(this.partialCanvas, bounds.left, bounds.top);
            }
            else {
                screen.print(this.text.charAt(startIndex), bounds.left, bounds.top, this.color, font);
            }

            for (let i = 1; i < this.maxCharacters; i++) {
                screen.print(
                    this.text.charAt(startIndex + i),
                    bounds.left + i * font.charWidth + letterOffset,
                    bounds.top,
                    this.color,
                    font
                );
            }
        }
    }

    export class ImageElement extends Element {
        protected src: Image;

        constructor(src: Image) {
            super();

            this.src = src;
        }

        protected drawSelf(bounds: BoundingBox) {
            screen.drawTransparentImage(this.src, bounds.left, bounds.top);
        }
    }

    export class DynamicElement extends Element {
        protected drawFunction: (bounds: BoundingBox) => void;

        constructor(drawFunction: (bounds: BoundingBox) => void) {
            super();
            this.drawFunction = drawFunction;
        }

        protected drawSelf(bounds: BoundingBox) {
            this.drawFunction(bounds);
        }
    }

    export class LongTextElement extends Element {
        protected dialog: game.Dialog;
        protected text: string;

        constructor(text: string) {
            super();

            this.text = text;
        }

        protected onDidReceiveBounds(bounds: BoundingBox) {
            this.dialog = new game.Dialog(bounds.width, bounds.height, null, null, image.create(1, 1))
            this.dialog.setText(this.text);
            this.dialog.update();
        }

        protected drawSelf(bounds: BoundingBox) {
            screen.drawTransparentImage(this.dialog.image, bounds.left, bounds.top);
        }
    }
}
namespace ui {
    let _state: AppState;

    function initState() {
        _state = {
            view: AppView.DaySelection,
            selectedDay: 0,
            selectedEvent: 0,
            selectedButton: 0,
            feedbackStep: 0,
        };
    }

    export function getState() {
        if (!_state) initState();
        return _state;
    }

    export function clearState() {
        _state = undefined;
    }
}
namespace ui {
    export enum AppView {
        DaySelection,
        EventList,
        EventOptions,
        EventFeedback,
        EventInfo
    }

    export interface AppState {
        view: AppView;

        selectedDay: number;
        selectedEvent: number;
        selectedButton: number;
        feedbackStep: number;
    }

    export function main() {
        const state = getState();
        scene.setBackgroundColor(12)

        let el: Element;
        el = mainView();

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            switch (state.view) {
                case AppView.DaySelection:
                    state.view = AppView.EventList;
                    break;
                case AppView.EventList:
                    state.view = AppView.EventOptions;
                    break;
                case AppView.EventOptions:
                    state.view = state.selectedButton ? AppView.EventFeedback : AppView.EventInfo;
                    break;
                case AppView.EventInfo:
                    break;
                case AppView.EventFeedback:
                    break;
            }
            el = mainView();
        });

        controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
            switch (state.view) {
                case AppView.DaySelection:
                    storyboard.replace("home");
                    break;
                case AppView.EventList:
                    state.view = AppView.DaySelection;
                    state.selectedEvent = 0;
                    break;
                case AppView.EventOptions:
                    state.view = AppView.EventList;
                    state.selectedButton = 0;
                    break;
                case AppView.EventInfo:
                    state.view = AppView.EventOptions;
                    break;
                case AppView.EventFeedback:
                    state.view = AppView.EventOptions;
                    state.selectedButton = 0;
                    break;
            }
            el = mainView();
        });

        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            const program = badge.program;
            switch (state.view) {
                case AppView.DaySelection:
                    state.selectedDay = (state.selectedDay + 1) % program.days.length;
                    break;
                case AppView.EventList:
                    state.selectedEvent = (state.selectedEvent + 1) % program.sessions.length;
                    break;
                case AppView.EventOptions:
                    break;
                case AppView.EventInfo:
                    break;
                case AppView.EventFeedback:
                    state.selectedButton = (state.selectedButton + 1) % 5
                    break;
            }
            el = mainView();
        });

        controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
            const program = badge.program;
            switch (state.view) {
                case AppView.DaySelection:
                    state.selectedDay = (state.selectedDay + program.days.length - 1) % program.days.length;
                    break;
                case AppView.EventList:
                    state.selectedEvent = (state.selectedEvent + program.sessions.length - 1) % program.sessions.length;
                    break;
                case AppView.EventOptions:
                    break;
                case AppView.EventInfo:
                    break;
                case AppView.EventFeedback:
                    state.selectedButton = (state.selectedButton - 1) % 5
                    break;
            }
            el = mainView();
        });

        controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
            switch (state.view) {
                case AppView.EventOptions:
                    state.selectedButton = (state.selectedButton + 1) % 2
                    break;
                case AppView.DaySelection:
                case AppView.EventList:
                case AppView.EventFeedback:
                case AppView.EventInfo:
                    break;
            }
            el = mainView();
        });

        controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
            switch (state.view) {
                case AppView.EventOptions:
                    state.selectedButton = (state.selectedButton + 1) % 2
                    break;
                case AppView.DaySelection:
                case AppView.EventList:
                case AppView.EventFeedback:
                case AppView.EventInfo:
                    break;
            }
            el = mainView();
        });

        game.onShade(function () {
            el.draw();
        });
    }

    function mainView() {
        const state = getState();
        let el: Element;

        switch (state.view) {
            case AppView.DaySelection:
                el = dayView();
                break;
            case AppView.EventList:
                el = listView();
                break;
            case AppView.EventOptions:
                el = eventOptionsView();
                break;
            case AppView.EventInfo:
                el = eventInfoView();
                break;
            case AppView.EventFeedback:
                el = eventFeedbackView();
                break;
        }

        createStyles(el)

        return el;
    }

    function createStyles(el: Element) {
        el.defineStyleClass("text-box", [
            padding(2),
            alignLeft(),
            width(FILL)
        ]);

        el.defineStyleClass("card-title", [
            color(1),
        ]);

        el.defineStyleClass("selected", [
            animate(true),
        ]);

        el.defineStyleClass("card-detail", [
            color(15),
            smallFont()
        ]);

        el.defineStyleClass("container", [
            width(screen.width),
            padding(5),
            color(12)
        ]);

        el.defineStyleClass("container-header", [
            color(1)
        ]);

        el.defineStyleClass("button", [
            color(11),
            width(75),
            padding(2)
        ]);

        el.defineStyleClass("button-selected", [
            color(3)
        ]);

        el.defineStyleClass("button-text", [
            color(1)
        ]);
    }

    function dayView() {
        const state = getState();
        const program = badge.program;

        return titleView("Schedule", listFlow(program.days.map((day, i) =>
            cardView(day.title, i === state.selectedDay, day.weekday, `May ${day.monthday}th`)
        )));
    }

    function titleView(title: string, content: Element) {
        return verticalFlow([
            box(
                text(title),
                [className("container"), className("container-header")]
            ),
            box(
                content,
                [className("container")]
            )
        ]);
    }

    function listView() {
        const state = getState();
        const program = badge.program;

        return titleView(program.days[state.selectedDay].title, listFlow(program.sessions.map((s, i) =>
            sessionCard(s, screen.width - 10, i === state.selectedEvent)
        )));
    }

    function listFlow(items: Element[]) {
        const content: Element[] = [];

        for (const item of items) {
            content.push(item);

            // Empty 1-pixel spacer
            content.push(box(null, [padding(1)]))
        }
        return verticalFlow(content, [width(FILL)]);
    }

    function sessionCard(s: badge.Session, cardWidth: number, selected = false) {
        const select = selected && className("selected");

        return cardView(s.name, selected, formatTime(s.startTime), s.presenter);
    }

    function cardView(title: string, selected: boolean, detail: string, detailRight: string) {
        const select = selected && className("selected");

        return verticalFlow([
            box(
                scrollingLabel(title, screen.width - 10, [className("card-title"), select]),
                [color(selected ? 3 : 11), className("text-box")]
            ),
            box(horizontalFlow([
                scrollingLabel(detail, 65, [className("card-detail"), select]),
                box(
                    scrollingLabel(detailRight, 50, [className("card-detail"), select]),
                    [width(65), alignRight()])
            ]), [color(1), className("text-box")]),
        ], [width(FILL)]);
    }

    function eventFeedbackView() {
        const state = getState();
        const program = badge.program;
        const sessions = program.sessions;
        const days = program.days;
        const event = sessions[state.selectedEvent];
        const day = days[state.selectedDay];

        return titleView("Rate this session",
            verticalFlow([
                box(
                    text("1 - :C", [className("button-text")]),
                    [className("button"), state.selectedButton === 1 && className("button-selected")]
                ),
                box(null, [padding(1)]),
                box(
                    text("2 - :(", [className("button-text")]),
                    [className("button"), state.selectedButton === 2 && className("button-selected")]
                ),
                box(null, [padding(1)]),
                box(
                    text("3 - :|", [className("button-text")]),
                    [className("button"), state.selectedButton === 3 && className("button-selected")]
                ),
                box(null, [padding(1)]),
                box(
                    text("4 - :)", [className("button-text")]),
                    [className("button"), state.selectedButton === 4 && className("button-selected")]
                ),
                box(null, [padding(1)]),
                box(
                    text("5 - :D", [className("button-text")]),
                    [className("button"), state.selectedButton === 0 && className("button-selected")]
                )
            ])
        );
    }

    function eventOptionsView() {
        const state = getState();
        const program = badge.program;
        const sessions = program.sessions;
        const days = program.days;
        const event = sessions[state.selectedEvent];
        const day = days[state.selectedDay];

        return titleView(event.name,
            verticalFlow([
                box(
                    scrollingLabel(`${formatTime(event.startTime)} at ${event.location}`, screen.width - 20, [animate(true), color(1), smallFont()]),
                    [padding(2), width(154)]),
                box(
                    longText(event.info, [width(158), height(60)]),
                    [paddingBottom(5), paddingTop(5)]
                ),
                horizontalFlow([
                    box(
                        text("Info", [className("button-text")]),
                        [className("button"), state.selectedButton === 0 && className("button-selected")]
                    ),
                    box(null, [padding(1)]),
                    box(
                        text("Feedback", [className("button-text")]),
                        [className("button"), state.selectedButton === 1 && className("button-selected")]
                    )
                ])
            ])
        );
    }

    function eventInfoView() {
        const state = getState();
        const program = badge.program;
        const sessions = program.sessions;
        const days = program.days;
        const event = sessions[state.selectedEvent];
        const day = days[state.selectedDay];

        return titleView("Event Info", listFlow([
            eventItem("Title", event.name),
            eventItem("Presenter", event.presenter),
            eventItem("Location", event.location),
            eventItem("Time", `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`),
            eventItem("Day", `${day.weekday}, May ${day.monthday}th`),
            eventItem("Type", "Breakout"),
        ]))
    }

    function eventItem(title: string, value: string) {
        return box(
            horizontalFlow([
                box(
                    text(title + ":", [color(1)]),
                    [color(3), padding(2), width(WRAP)]),
                box(
                    scrollingLabel(value, 90, [animate(true)]),
                    [padding(2)]
                )
            ]),
            [color(1), alignLeft(), width(FILL)])
    }

    function formatTime(time: number) {
        const hour = Math.idiv(time, 100) % 12;
        const minute = time % 100;

        return `${hour}:${minute < 10 ? "0" + minute : minute}${time >= 1200 ? "pm" : "am"}`
    }

    storyboard.registerScene("schedule", main)
}
