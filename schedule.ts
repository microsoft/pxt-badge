
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
