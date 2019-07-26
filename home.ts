namespace home {
    let steps = 0;

    class HighlightIcon {
        sprite: Sprite;
        color: number;
        handler: () => void;

        constructor(sprite: Sprite, color: number, handler: () => void) {
            sprite.setImage(sprite.image.clone());
            this.sprite = sprite;
            this.color = color;
            this.handler = handler;
        }
    }

    /*
    class WifiIcon {
        connected: boolean;
        sprite: Sprite;
        bgColor: number;
        imColor: number;

        private imWifi: Image;
        private imWifiOff: Image;
        private imMsg: Image;
        private scene: scene.Scene;

        constructor(sprite: Sprite, bgColor: number, imColor: number) {
            this.sprite = sprite;
            this.connected = iot.isConnected();
            this.bgColor = bgColor;
            this.imColor = imColor;

            this.imWifi = im_wifi.clone();
            colorIcon(this.imWifi, iconColor, this.imColor);
            this.imWifiOff = im_wifi_off.clone();
            colorIcon(this.imWifiOff, iconColor, this.imColor);
            this.imMsg = im_msg.clone();
            colorIcon(this.imMsg, iconColor, this.imColor);

            this.scene = game.currentScene();
            this.drawConnectionState();
        }

        drawConnectionState() {
            if (!this.isValidScene()) return;
            this.sprite.image.fill(this.bgColor);
            this.sprite.image.drawTransparentImage(this.connected ? this.imWifi : this.imWifiOff, 0, 0);
        }

        drawMessageState(sent: boolean) {
            if (!this.isValidScene()) return;

            let i = (sent ? 0 : -1) * this.sprite.image.width;
            while (i < (1 + (sent ? this.sprite.image.width : 0))) {
                this.sprite.image.fill(this.bgColor);
                this.sprite.image.drawTransparentImage(this.imMsg, i, 0);
                pause(50);
                i++;
            }

            if (!this.isValidScene()) return;
            this.sprite.startEffect(effects.ashes, 1000);
            pause(2000);
            this.drawConnectionState();
        }

        private isValidScene() {
            return game.currentScene() === this.scene;
        }

        connectionChanged() {
            if (iot.isConnected() != this.connected) {
                this.connected = iot.isConnected();
                this.drawConnectionState();
            }
        }

        messageReceived() {
            this.drawMessageState(false);
        }

        sendMessage(msg: any) {
            iot.postMessage(msg);
            this.drawMessageState(true);
        }

        registerCloudHandlers() {
            iot.onConnectionChanged(() => { this.connectionChanged() });
            // iot.onMessageReceived(() => { this.messageReceived() });
        }
    }
    */


    /*
     background setup
    */
    const w = screen.width;
    const h = screen.height;
    const font = image.font8;
    const font16 = image.doubledFont(font);
    const font32 = image.doubledFont(font16);
    const iconSize = 16;
    const mu = 5;
    const mu2 = mu * 2;

    // name sprite
    const sprite_padding = mu * 2;
    let nameFont = font32;
    const nameColor = 8;

    const colors = [0x000000,
        0xebebeb,
        0xcbcbcb,
        0x3a877d,
        0xf59356,
        0x4cdfcd,
        0xf5b834,
        0xc795f4,
        0x493d61,
        0x8565c2,
        0x000000,
        0x000000,
        0x000000,
        0x000000,
        0x000000,
        0x000000];
    const p = color.createBuffer(colors);

    const im_cal = img`
        0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
        0 0 0 1 1 0 0 0 0 0 0 1 1 0 0 0
        0 0 0 1 1 0 0 0 0 0 0 1 1 0 0 0
        0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0
        0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0
        0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0
        0 1 0 0 0 0 0 0 0 0 0 0 0 0 1 0
        0 1 0 1 1 0 0 1 1 0 0 1 1 0 1 0
        0 1 0 1 1 0 0 1 1 0 0 1 1 0 1 0
        0 1 0 0 0 0 0 0 0 0 0 0 0 0 1 0
        0 1 0 0 0 0 0 0 0 0 0 0 0 0 1 0
        0 1 0 1 1 0 0 1 1 0 0 1 1 0 1 0
        0 1 0 1 1 0 0 1 1 0 0 1 1 0 1 0
        0 1 0 0 0 0 0 0 0 0 0 0 0 0 1 0
        0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0
        0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    `;
    const im_social = img`
        . . . . . . . . . . . . 1 . . .
        . . . . . . . . . . . 1 1 1 . .
        . . . . . . . . . . 1 1 1 1 1 .
        . . . . . . . . . . 1 . 1 1 . .
        . . . . . . . . 1 1 . . 1 . . .
        . . 1 . . . 1 1 1 . . . . . . .
        . 1 1 1 . 1 1 . . . . . . . . .
        1 1 1 1 1 . . . . . . . . . . .
        . 1 1 1 . . . . . . . . . . . .
        . . 1 . 1 1 . . . . . . . . . .
        . . . . . 1 1 1 . . . . . . . .
        . . . . . . . 1 1 . . . 1 . . .
        . . . . . . . . 1 1 . 1 1 1 . .
        . . . . . . . . . . 1 1 1 1 1 .
        . . . . . . . . . . . 1 1 1 . .
        . . . . . . . . . . . . 1 . . .
    `;
    const im_linkedin = img`
        0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
        0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
        0 0 1 1 1 0 0 0 0 0 0 0 0 0 0 0
        0 0 1 1 1 0 0 0 0 0 0 0 0 0 0 0
        0 0 1 1 1 0 0 0 0 0 0 0 0 0 0 0
        0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
        0 0 1 1 1 0 1 1 1 0 1 1 1 0 0 0
        0 0 1 1 1 0 1 1 1 1 1 1 1 1 0 0
        0 0 1 1 1 0 1 1 1 1 1 1 1 1 0 0
        0 0 1 1 1 0 1 1 1 1 0 1 1 1 0 0
        0 0 1 1 1 0 1 1 1 0 0 1 1 1 0 0
        0 0 1 1 1 0 1 1 1 0 0 1 1 1 0 0
        0 0 1 1 1 0 1 1 1 0 0 1 1 1 0 0
        0 0 1 1 1 0 1 1 1 0 0 1 1 1 0 0
        0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
        0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    `;
    const im_github = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . 1 1 1 1 1 1 1 1 1 1 1 1 . .
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 .
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 . . . 1 1 1 . . . 1 1 1
        1 1 1 . . . . . 1 . . . . . 1 1
        1 1 1 1 . . . 1 1 1 . . . 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 .
        . . 1 1 1 1 1 1 1 1 1 1 1 1 . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    const im_twitter = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . 1 . . . . . . 1 1 . . . .
        . . . 1 . . . . . 1 1 1 . . . .
        . . . 1 1 . . . 1 1 1 1 1 . . .
        . . . 1 1 1 1 1 1 1 1 1 . . . .
        . . . . 1 1 1 1 1 1 1 1 . . . .
        . . . . 1 1 1 1 1 1 1 1 . . . .
        . . . . 1 1 1 1 1 1 1 . . . . .
        . . . . . 1 1 1 1 1 . . . . . .
        . . . 1 1 1 1 1 1 . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    const im_step = img`
        0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
        0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0
        0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0
        0 0 0 1 1 1 1 0 0 0 0 0 0 0 0 0
        0 0 0 1 1 1 1 0 0 0 1 1 0 0 0 0
        0 0 0 1 1 1 1 0 0 1 1 1 1 0 0 0
        0 0 0 0 1 1 1 0 0 1 1 1 1 0 0 0
        0 0 0 0 1 1 0 0 0 1 1 1 1 0 0 0
        0 0 0 0 0 0 0 0 0 1 1 1 1 0 0 0
        0 0 0 0 0 1 1 1 0 1 1 1 1 0 0 0
        0 0 0 0 0 1 1 1 0 0 1 1 0 0 0 0
        0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0
        0 0 0 0 0 0 0 0 0 0 1 1 1 0 0 0
        0 0 0 0 0 0 0 0 0 0 1 1 1 0 0 0
        0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0
        0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    `;
    const im_pg = img`
        0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
        0 0 0 1 1 1 1 1 1 1 1 0 0 0 0 0
        0 0 0 1 0 0 0 0 0 1 1 1 0 0 0 0
        0 0 0 1 0 0 0 0 0 1 0 1 1 0 0 0
        0 0 0 1 0 1 1 1 0 1 1 1 1 1 0 0
        0 0 0 1 0 0 0 0 0 0 0 0 1 1 0 0
        0 0 0 1 0 0 0 0 0 0 0 0 1 1 0 0
        0 0 0 1 0 1 1 1 1 1 1 0 1 1 0 0
        0 0 0 1 0 0 0 0 0 0 0 0 1 1 0 0
        0 0 0 1 0 0 0 0 0 0 0 0 1 1 0 0
        0 0 0 1 0 1 1 1 1 1 1 0 1 1 0 0
        0 0 0 1 0 0 0 0 0 0 0 0 1 1 0 0
        0 0 0 1 0 0 0 0 0 0 0 0 1 1 0 0
        0 0 0 1 1 1 1 1 1 1 1 1 1 1 0 0
        0 0 0 1 1 1 1 1 1 1 1 1 1 1 0 0
        0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
    `;
    const im_sword = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . 1 1 1 .
        . . . . . . . . . . . 1 1 1 1 .
        . . . . . . . . . . 1 1 1 1 1 .
        . . . . . . . . . 1 1 1 1 1 . .
        . . . 1 1 . . . 1 1 1 1 1 . . .
        . . . 1 1 1 . 1 1 1 1 1 . . . .
        . . . . 1 1 1 1 1 1 1 . . . . .
        . . . . 1 1 1 1 1 1 . . . . . .
        . . . . . 1 1 1 1 . . . . . . .
        . . . . 1 1 1 1 1 1 . . . . . .
        . . . 1 1 1 . 1 1 1 1 . . . . .
        . 1 1 1 1 . . . . 1 1 . . . . .
        . 1 1 1 . . . . . . . . . . . .
        . 1 1 1 . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    const im_sel = img`
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 . . . . . . . . . . . . . . . . 4
        4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
    `
    const im_wifi = img`
        . . . . . . . . . . . . . . . .
        . . . . . . 1 1 1 1 . . . . . .
        . . . . 1 1 1 1 1 1 1 1 . . . .
        . . . 1 1 1 1 1 1 1 1 1 1 . . .
        . . 1 1 1 . . . . . . 1 1 1 . .
        . 1 1 1 . . . . . . . . 1 1 1 .
        1 1 1 . . . 1 1 1 1 . . . 1 1 1
        . 1 . . . 1 1 1 1 1 1 . . . 1 .
        . . . . 1 1 1 1 1 1 1 1 . . . .
        . . . 1 1 1 . . . . 1 1 1 . . .
        . . . . 1 . . . . . . 1 . . . .
        . . . . . . . 1 1 . . . . . . .
        . . . . . . 1 1 1 1 . . . . . .
        . . . . . . 1 1 1 1 . . . . . .
        . . . . . . . 1 1 . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    const im_wifi_off = img`
        . . . . . . . . . . . . . . . .
        . . . . . . 1 1 . 1 1 . . . 1 1
        . . . . 1 1 1 1 . . 1 1 . 1 1 .
        . . . 1 1 1 1 1 1 . . 1 1 1 . .
        . . 1 1 1 . . . . . . 1 1 1 . .
        . 1 1 1 . . . . . . 1 1 . 1 1 .
        1 1 1 . . . 1 1 . 1 1 . . . 1 1
        . 1 . . . 1 1 1 . . . . . . . .
        . . . . 1 1 1 1 1 1 1 1 . . . .
        . . . 1 1 1 . . . . 1 1 1 . . .
        . . . . 1 . . . . . . 1 . . . .
        . . . . . . . 1 1 . . . . . . .
        . . . . . . 1 1 1 1 . . . . . .
        . . . . . . 1 1 1 1 . . . . . .
        . . . . . . . 1 1 . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    const im_msg = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 . . . . . . . . . . . . 1 1
        1 . 1 . . . . . . . . . . 1 . 1
        1 . . 1 . . . . . . . . 1 . . 1
        1 . . . 1 . . . . . . 1 . . . 1
        1 . . . . 1 . . . . 1 . . . . 1
        1 . . . 1 . 1 . . 1 . 1 . . . 1
        1 . . 1 . . . 1 1 . . . 1 . . 1
        1 . 1 . . . . . . . . . . 1 . 1
        1 1 . . . . . . . . . . . . 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;

    // background
    const bkgColor = 8;
    const iconColor = 1;

    // name strip
    const top_offset = mu * 2 + font16.charHeight;
    const white_bar = mu2 * 2 + font32.charHeight + font16.charHeight;

    function highlightIcon(selected: number, move: number, selector: Sprite, icons: HighlightIcon[]): number {
        if (selected == null) {
            selected = move > 0 ? 0 : icons.length - 1;
            selector.x = scene.screenWidth() - mu - iconSize / 2 - (mu + iconSize) * selected;

            let hi = icons[selected];
            //colorIcon(selector.image, iconColor, hi.color);
            colorIcon(hi.sprite.image, iconColor, hi.color);
        } else if ((selected + move) < 0 || (selected + move) >= icons.length) {
            let hi = icons[selected];
            //colorIcon(selector.image, hi.color, iconColor);
            colorIcon(hi.sprite.image, hi.color, iconColor);

            selected = null;
            selector.x = scene.screenWidth() + iconSize * 2;
        } else {
            let hi = icons[selected];
            colorIcon(hi.sprite.image, hi.color, iconColor);

            selected += move;
            selector.x = scene.screenWidth() - mu - iconSize / 2 - (mu + iconSize) * selected;

            let hi2 = icons[selected];
            //colorIcon(selector.image, hi.color, hi2.color);
            colorIcon(hi2.sprite.image, iconColor, hi2.color);
        }

        return selected;
    }

    // "shake" characters in name
    // requires pxt-common-packages text update
    function stepEffect(duration: number, sprite: Sprite, name: string, ts: texteffects.TextSprite) {
        let i = 0;
        let inc = 20;
        while (i < duration) {
            ts.updateState();
            sprite.image.fill(1);
            sprite.image.print(name, 0, 0, nameColor, nameFont, ts.state);
            pause(inc)
            i += inc;
        }

        sprite.image.fill(1);
        sprite.image.print(name, 0, 0, nameColor, nameFont);
    }

    function getStepString(steps: number): string {
        let digits = Math.floor(Math.log(steps) / Math.LN10 + 1);
        if (digits > 5) {
            return Math.round(steps / 1000).toString() + "K";
        } else if (digits > 4) {
            return (Math.round(steps / 100) / 10).toString() + "K";
        } else {
            return steps.toString();
        }
    }

    /*
     interactions
    */
    function step(sprite: Sprite, name: string, steps: number, stepSprite: Sprite, stepFont: image.Font, ts: texteffects.TextSprite): number {
        steps += 1;
        stepSprite.image.fill(bkgColor);
        stepSprite.image.print(getStepString(steps), 0, 0, 1, stepFont);

        effects.confetti.startScreenEffect(500)
        const strip = badge.lightStrip;
        if (strip) {
            strip.setAll(0xff00ff);
            strip.startBrightnessTransition(24, 0, 400, 1, false, new light.EasingBrightnessTransition(easing.outQuad, easing.inOutQuad));
        }
        stepEffect(500, sprite, name, ts);

        /*
        iot.postMessage({
            steps: 1,
            totalSteps: steps
        });
        */

        return steps;
    }

    function social() {
        storyboard.replace("social");
    }

    function colorIcon(im: Image, prevColor: number, newColor: number) {
        let indices = control.createBuffer(16);
        indices[prevColor] = newColor;
        im.mapRect(0, 0, im.width, im.height, indices);
        return im;
    }

    function main() {
        const bkg = scene.backgroundImage();
        const name = badge.name || "???";
        const company = badge.company;
        const logoImage = badge.logoImage;

        let selected: number = null;
        const icons: HighlightIcon[] = [];

        palette.setColors(p);

        // draw background
        bkg.fill(bkgColor)
        bkg.fillRect(0, top_offset, w, white_bar, 1)

        // the name sprite cannot exceed 255 pixels, otherwise hardware crashes
        let maxMult = Math.idiv(255, name.length * image.font8.charWidth)
        if (maxMult > 4) maxMult = 4
        else nameFont = image.scaledFont(image.font8, maxMult)

        /* name sprite */
        const nameSprite = sprites.create(image.create(nameFont.charWidth * name.length, 4 * 8));

        nameSprite.image.print(name, 0, 0, nameColor, nameFont);
        nameSprite.y = top_offset + nameSprite.height / 2 + mu * 1.5;
        nameSprite.x = 80;

        // only marquee if name is too long
        let nameSpriteShadow: Sprite;
        let shadowMargin = 40;
        if (nameSprite.width > scene.screenWidth()) {
            nameSprite.vx = -40;

            nameSpriteShadow = sprites.create(nameSprite.image);
            nameSpriteShadow.y = nameSprite.y;
            nameSpriteShadow.x = nameSprite.x + nameSprite.width + shadowMargin;
            nameSpriteShadow.vx = -40;
        }
        game.onUpdateInterval(50, function () {
            if (nameSprite.vx != 0) {
                if (nameSprite.x < -(nameSprite.width / 2)) {
                    nameSprite.x = nameSpriteShadow.x + nameSpriteShadow.width + shadowMargin;
                }

                if (nameSpriteShadow && nameSpriteShadow.x < -(nameSpriteShadow.width / 2)) {
                    nameSpriteShadow.x = nameSprite.x + nameSprite.width + shadowMargin;
                }
            }
        })

        /*
        iot.onMessageReceived(function (message: any) {
            const msgType = message["type"] as string;
            switch (msgType) {
                case "echo": {
                    badge.notificationText = message.displayedValue;
                    storyboard.push("notification");
                    break;
                }
                case "github": {
                    const stars = message["stars"] as number;
                    info.setScore(stars);
                    break;
                }
            }
        })
        */

        const ts = new texteffects.TextSprite(name, nameFont, 0, texteffects.shake);

        /* static text (company, build logo) */
        let companyColor = 4;
        let name_offset = top_offset + mu * 2 + font16.charHeight + (nameSprite.height) / 2;
        if (company)
            bkg.printCenter(company, name_offset, companyColor, font16);
        if (logoImage) {
            const logo = sprites.create(logoImage);
            logo.left = screen.width - logoImage.width - mu;
            logo.top = mu;
        }

        /* bottom icons */
        // calendar
        if (badge.program) {
            const calIcon = sprites.create(im_cal);
            icons.push(new HighlightIcon(calIcon, 4, () => storyboard.replace("schedule")));
        }

        // Rock Paper Scissors
        //const rpsIcon = sprites.create(im_sword);
        //icons.push(new HighlightIcon(rpsIcon, 4, () => storyboard.replace("rps")));

        // social URL
        if (badge.socialUrl) {
            let isocial = im_social;
            if (badge.socialUrl.indexOf("https://linked.in/in/") == 0)
                isocial = im_linkedin;
            else if (badge.socialUrl.indexOf("https://twitter.com/") == 0) {
                isocial = im_twitter;
            } else if (badge.socialUrl.indexOf("https://github.com/") == 0) {
                isocial = im_github;
            }
            const liIcon = sprites.create(isocial);
            icons.push(new HighlightIcon(liIcon, 4, social));
        }

        for (let i = 0; i < icons.length; i++) {
            let icon = icons[i].sprite;
            icon.x = scene.screenWidth() - mu - iconSize / 2 - (mu + iconSize) * i;
            icon.y = scene.screenHeight() - mu - iconSize / 2;
        }

        const selector = sprites.create(im_sel);
        selector.y = scene.screenHeight() - mu - iconSize / 2;
        selector.x = scene.screenWidth() + iconSize * 2;

        /* step counter */
        const stepFont = font16;
        const stepColor = 1;
        const stepSprite = sprites.create(image.create(scene.screenWidth() / 2 - iconSize, stepFont.charHeight));

        stepSprite.image.print(getStepString(steps), 0, 0, stepColor, stepFont);
        stepSprite.y = scene.screenHeight() - mu - stepSprite.height / 2;
        stepSprite.x = stepSprite.width / 2 + mu + iconSize;

        // footsteps icon
        const stepIcon = sprites.create(image.create(iconSize, iconSize));
        stepIcon.image.drawTransparentImage(im_step, 0, 0)
        stepIcon.x = stepIcon.width / 2 + mu;
        stepIcon.y = scene.screenHeight() - mu - iconSize / 2;

        /* top icons (decorative at the moment) */
        let top_icons: Sprite[] = []

        /*
        const wifiSprite = sprites.create(image.create(iconSize, iconSize));
        const wifiIcon = new WifiIcon(wifiSprite, color, 7);
        wifiIcon.registerCloudHandlers();
        top_icons.push(wifiIcon.sprite);
        */

        const top_2 = sprites.create(image.create(iconSize, iconSize));
        top_2.image.fill(4)
        top_icons.push(top_2);

        for (let i = 0; i < top_icons.length; i++) {
            let icon = top_icons[i];

            icon.x = mu + iconSize / 2 + (mu + iconSize) * i;
            icon.y = mu + iconSize / 2;
        }

        /* icon selection code */
        if (icons.length) {
            controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
                selected = highlightIcon(selected, 1, selector, icons);
            })
            controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
                selected = highlightIcon(selected, -1, selector, icons);
            })
        }

        // step counter
        controller.onGesture(ControllerGesture.TwoG, function () {
            steps = step(nameSprite, name, steps, stepSprite, stepFont, ts);
        });

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
            let icon = icons[selected];
            if (icon && icon.handler)
                icon.handler();
        })

        /*
        controller.combos.setTimeout(2000);
        controller.combos.setCountAsOnePressTimer(0)
        controller.combos.attachSpecialCode(() => badge.transition("duck"));
        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            wifiIcon.sendMessage({ ButtonBPressed: 1 });
        })
        */
    }

    storyboard.registerScene("home", main);
}
