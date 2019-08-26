namespace badge {
    function notification() {
        music.baDing.play()

        controller.B.onEvent(ControllerButtonEvent.Pressed, () => {
            storyboard.replace("home");
        })


        scene.setBackgroundImage(image.create(screen.width, screen.height));
        scene.backgroundImage().printCenter(badge.notificationText, 30, 7, image.font8);
        badge.notificationText = undefined;
        scene.cameraShake()
        controller.startLightPulse(0xff0000, 400);
    }

    storyboard.registerScene("notification", notification);
}