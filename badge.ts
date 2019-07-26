/**
 * A conference badge
 */
//% weight=90 icon="\uf2bb" color="#606000"
//% groups='["User", "Conference"]'
namespace badge {
    export const font = image.font8;
    export const font16 = image.doubledFont(font);
    export const font32 = image.doubledFont(font16);

    export let name: string;
    export let logoImage: Image;
    export let company: string;
    export let socialUrl: string;
    export let qrimg: Image;
    export let lightStrip: light.LightStrip;
    export let notificationText: string;

    //% blockId=logoImageEditor block="%img"
    //% shim=TD_ID
    //% img.fieldEditor="sprite"
    //% img.fieldOptions.taggedTemplate="img"
    //% img.fieldOptions.decompileIndirectFixedInstances="true"
    //% img.fieldOptions.sizes="16,112"
    //% weight=100 group="Create" duplicateShadowOnDrag
    //% blockHidden=1
    export function __logoImageEditor(img: Image) {
        return img
    }

    /**
     * Sets the name of the attendee
     * @param name 
     */
    //% blockId=badgesetname block="badge set name to $name"
    //% group="User"
    export function setName(name: string) {
        badge.name = name;
    }

    /**
     * Sets the company displayed on the badge
     * @param company 
     */
    //% blockId=badgesetcompany block="badge set company to $company"
    //% group="User"
    export function setCompany(company: string) {
        badge.company = company;
    }

    /**
     * Sets the social profile URL (LinkedIn, twitter, github)
     * @param url URL to social profile 
     */
    //% blockId=badgesetsocial block="badge set social to $url"
    //% group="User"
    export function setSocial(url: string) {
        // normalize
        if (url) {
            // minify linkedin
            ["https://www.linkedin.com/in/", "https://linkedin.com/in/"]
                .filter(prefix => url.indexOf(prefix) == 0)
                .forEach(prefix => url = "https://linked.in/in/" + url.slice(prefix.length));
        }
        // update qrcode
        if (url != badge.socialUrl) {
            badge.socialUrl = socialUrl;
            badge.qrimg = undefined;
        }
    }


    /**
     * Sets the light strip used by the badge
     * @param strip 
     */
    //% blockId=badgesetlightstrip block="badge set light strip $strip"
    //% group="Effects"
    export function setLightStrip(strip: light.LightStrip) {
        lightStrip = strip;
    }

    /**
     * Sets the logo image
     * @param logo 
     */
    //% blockId=badgesetlogoimage block="badge set logo %logo=logoImageEditor"
    //% group="Conference"
    export function setLogoImage(logo: Image) {
        badge.logoImage = logo;
    }

    /**
     * Sets the conference logo
     * @param logo 
     */
    //% blockId=badgesetlogo block="badge set logo to $logo of color $color"
    //% group="Conference"
    export function setLogo(logo: string, color: number) {
        const i = image.create(96, 16);
        i.printCenter(logo, 0, color, font16)
        setLogoImage(i);
    }

    export interface Session {
        name: string;
        presenter: string;
        info: string;
        startTime: number;
        endTime: number;
        location: string;
    }

    export interface Day {
        title: string;
        weekday: string;
        monthday: number;
    }

    export interface FeedbackQuestion {
        text: string;
        options: string[];
    }

    export interface Program {
        days: Day[];
        sessions: Session[];
        questions: FeedbackQuestion[];
    }

    export let program: Program;

    /**
     * Sets the conference program if any
     * @param program 
     */
    //% group="Conference"
    export function setProgram(program: Program) {
        badge.program = program;
    }

    /**
     * Starts the badge engine
     */
    //% blockId=badgestart block="badge start"
    //% group="User"
    export function start() {
        power.setDeepSleepTimeout(-1); // disable sleep        
        if (badge.logoImage)
            new storyboard.BootSequence(logoBoot, 0).register();
        storyboard.start("home");
    }

    function logoBoot(done: () => void) {
        let imageSprite = sprites.create(badge.logoImage);
        let m = 40;
        let w = screen.width - 2 * m;
        let c = 2;
        let y = screen.height / 2 - c;
        imageSprite.bottom = y - 2 * c;
        let x = 0;
        game.onPaint(function () {
            screen.drawRect(m, y, w, 2 * c, 1)
            screen.fillRect(m, y + 1, x, 2 * c - 2, 3);

            x++;
            if (x == w) done();
        })
    }
}
