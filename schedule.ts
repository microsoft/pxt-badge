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

        let el: dom.Element;
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
        let el: dom.Element;

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

    function createStyles(el: dom.Element) {
        el.defineStyleClass("text-box", [
            dom.padding(2),
            dom.alignLeft(),
            dom.width(dom.FILL)
        ]);

        el.defineStyleClass("card-title", [
            dom.color(1),
        ]);

        el.defineStyleClass("selected", [
            dom.animate(true),
        ]);

        el.defineStyleClass("card-detail", [
            dom.color(15),
            dom.smallFont()
        ]);

        el.defineStyleClass("container", [
            dom.width(screen.width),
            dom.padding(5),
            dom.color(12)
        ]);

        el.defineStyleClass("container-header", [
            dom.color(1)
        ]);

        el.defineStyleClass("button", [
            dom.color(11),
            dom.width(75),
            dom.padding(2)
        ]);

        el.defineStyleClass("button-selected", [
            dom.color(3)
        ]);

        el.defineStyleClass("button-text", [
            dom.color(1)
        ]);
    }

    function dayView() {
        const state = getState();
        const program = badge.program;

        return titleView("Schedule", listFlow(program.days.map((day, i) =>
            cardView(day.title, i === state.selectedDay, day.weekday, `May ${day.monthday}th`)
        )));
    }

    function titleView(title: string, content: dom.Element) {
        return dom.verticalFlow([
            dom.box(
                dom.text(title),
                [dom.className("container"), dom.className("container-header")]
            ),
            dom.box(
                content,
                [dom.className("container")]
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

    function listFlow(items: dom.Element[]) {
        const content: dom.Element[] = [];

        for (const item of items) {
            content.push(item);

            // Empty 1-pixel spacer
            content.push(dom.box(null, [dom.padding(1)]))
        }
        return dom.verticalFlow(content, [dom.width(dom.FILL)]);
    }

    function sessionCard(s: badge.Session, cardWidth: number, selected = false) {
        const select = selected && dom.className("selected");

        return cardView(s.name, selected, formatTime(s.startTime), s.presenter);
    }

    function cardView(title: string, selected: boolean, detail: string, detailRight: string) {
        const select = selected && dom.className("selected");

        return dom.verticalFlow([
            dom.box(
                dom.scrollingLabel(title, screen.width - 10, [dom.className("card-title"), select]),
                [dom.color(selected ? 3 : 11), dom.className("text-box")]
            ),
            dom.box(dom.horizontalFlow([
                dom.scrollingLabel(detail, 65, [dom.className("card-detail"), select]),
                dom.box(
                    dom.scrollingLabel(detailRight, 50, [dom.className("card-detail"), select]),
                    [dom.width(65), dom.alignRight()])
            ]), [dom.color(1), dom.className("text-box")]),
        ], [dom.width(dom.FILL)]);
    }

    function eventFeedbackView() {
        const state = getState();
        const program = badge.program;
        const sessions = program.sessions;
        const days = program.days;
        const event = sessions[state.selectedEvent];
        const day = days[state.selectedDay];

        return titleView("Rate this session",
            dom.verticalFlow([
                dom.box(
                    dom.text("1 - :C", [dom.className("button-text")]),
                    [dom.className("button"), state.selectedButton === 1 && dom.className("button-selected")]
                ),
                dom.box(null, [dom.padding(1)]),
                dom.box(
                    dom.text("2 - :(", [dom.className("button-text")]),
                    [dom.className("button"), state.selectedButton === 2 && dom.className("button-selected")]
                ),
                dom.box(null, [dom.padding(1)]),
                dom.box(
                    dom.text("3 - :|", [dom.className("button-text")]),
                    [dom.className("button"), state.selectedButton === 3 && dom.className("button-selected")]
                ),
                dom.box(null, [dom.padding(1)]),
                dom.box(
                    dom.text("4 - :)", [dom.className("button-text")]),
                    [dom.className("button"), state.selectedButton === 4 && dom.className("button-selected")]
                ),
                dom.box(null, [dom.padding(1)]),
                dom.box(
                    dom.text("5 - :D", [dom.className("button-text")]),
                    [dom.className("button"), state.selectedButton === 0 && dom.className("button-selected")]
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
            dom.verticalFlow([
                dom.box(
                    dom.scrollingLabel(`${formatTime(event.startTime)} at ${event.location}`, screen.width - 20, [dom.animate(true), dom.color(1), dom.smallFont()]),
                    [dom.padding(2), dom.width(154)]),
                dom.box(
                    dom.longText(event.info, [dom.width(158), dom.height(60)]),
                    [dom.paddingBottom(5), dom.paddingTop(5)]
                ),
                dom.horizontalFlow([
                    dom.box(
                        dom.text("Info", [dom.className("button-text")]),
                        [dom.className("button"), state.selectedButton === 0 && dom.className("button-selected")]
                    ),
                    dom.box(null, [dom.padding(1)]),
                    dom.box(
                        dom.text("Feedback", [dom.className("button-text")]),
                        [dom.className("button"), state.selectedButton === 1 && dom.className("button-selected")]
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
        return dom.box(
            dom.horizontalFlow([
                dom.box(
                    dom.text(title + ":", [dom.color(1)]),
                    [dom.color(3), dom.padding(2), dom.width(dom.WRAP)]),
                dom.box(
                    dom.scrollingLabel(value, 90, [dom.animate(true)]),
                    [dom.padding(2)]
                )
            ]),
            [dom.color(1), dom.alignLeft(), dom.width(dom.FILL)])
    }

    function formatTime(time: number) {
        const hour = Math.idiv(time, 100) % 12;
        const minute = time % 100;

        return `${hour}:${minute < 10 ? "0" + minute : minute}${time >= 1200 ? "pm" : "am"}`
    }

    storyboard.registerScene("schedule", main)
}
