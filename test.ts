// tests go here; this will not be compiled when this package is used as a library
badge.setName("Cortana")
badge.setCompany("NA")
badge.setLogo("NA", 3);
badge.start();

// user config
badge.setSocial("https://www.linkedin.com/in/xyz/")

badge.setProgram({
    days: [
        {
            title: "Day one",
            weekday: "Monday",
            monthday: 6
        },
        {
            title: "Day two",
            weekday: "Tuesday",
            monthday: 7
        },
        {
            title: "Day three",
            weekday: "Wednesday",
            monthday: 8
        }
    ],
    sessions: [
        {
            name: "Yadi",
            presenter: "Yada",
            info: "Yoda",
            location: "WSCC:Room 608",
            startTime: 1500,
            endTime: 1600
        },
        {
            name: "Mosi",
            presenter: "Masa",
            info: "Miso.",
            location: "WSCC:Room 402",
            startTime: 1600,
            endTime: 1630
        }
    ],
    questions: [
        {
            text: "Did you like it?",
            options: ["Yeah!", "Nah"]
        }
    ]
})

storyboard.loaderBootSequence.register();
badge.start()