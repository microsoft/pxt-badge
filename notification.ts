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

        const strip = badge.lightStrip;
        if (strip) {
            strip.setAll(0xff0000);
            strip.startBrightnessTransition(24, 0, 400, 1, false, new light.EasingBrightnessTransition(easing.outQuad, easing.inOutQuad));    
        }
    }

    storyboard.registerScene("notification", notification);
}