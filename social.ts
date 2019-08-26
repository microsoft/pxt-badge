namespace badge {
    function socialScene() {
        if (badge.qrimg) {
            sprites.create(badge.qrimg);
            scene.cameraShake()
        }
        else {
            const qr = sprites.create(sprites.duck.duck1)
            control.runInBackground(() => {
                badge.qrimg = qrcode.encodeString(badge.socialUrl);
                qr.setImage(badge.qrimg);
                qr.x = screen.width >> 1;
                qr.y = screen.height >> 1;
                scene.cameraShake()
            })
        }

        controller.B.onEvent(ControllerButtonEvent.Pressed, () => {
            storyboard.replace("home");
        })

        scene.setBackgroundImage(image.create(screen.width, screen.height));
        scene.backgroundImage().printCenter("Connect online", 4, 1, image.font5);
        controller.startLightPulse(0x00ff00, 400);
    }

    storyboard.registerScene("social", socialScene)
}