/* Support and Inspiration Resources:
 * - https://ih1.redbubble.net/image.191562619.4480/st,small,507x507-pad,600x600,f8f8f8.jpg
 * - https://ih1.redbubble.net/image.689614231.8610/st,small,507x507-pad,600x600,f8f8f8.u4.jpg
 * - http://labs.phaser.io/view.html?src=src%5Cgame%20objects%5Cparticle%20emitter%5Cdigital%20rain.js
 * - https://rexrainbow.github.io/phaser3-rex-notes/docs/site/shader-pixelation/
 * - https://codepen.io/riazxrazor/pen/Gjomdp?editors=0110
 * - https://www.ediblemuseum.com/product/white-chocolate-human-heart-pre-order/
 * - https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
 * - https://pixabay.com/illustrations/broken-heart-sketch-drawing-6533396/
*/

var config = {
    type: Phaser.WEBGL,
    backgroundColor: '#000',
    scale: {
        parent: 'canvas',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth - 10,
        height: window.innerHeight - 10,
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var game = new Phaser.Game(config);
var bunniest;
var bunniestPipelineInstance;
var mask;
var maskPipelineInstance;
var heart;
var heartPipelineInstance;
var updateFunctions = [];
var emitter;
var miss;
var you;
var end_text;

function preload ()
{
    this.load.spritesheet('font', 'assets/fonts.png', { frameWidth: 32, frameHeight: 25 });
    this.load.image('bunnist', 'assets/bunnist.png');
    this.load.image('mask', 'assets/mask.png');
    this.load.plugin('rexpixelationpipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexpixelationpipelineplugin.min.js', true);
    this.load.image('heart', 'assets/broken-heart.png');
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
}

function create ()
{
    emitter = this.add.particles('font').createEmitter({
        alpha: { start: 1, end: 0.1, ease: "Expo.easeOut" },
        angle: 0,
        blendMode: 'ADD',
        x: { min: 0, max: game.config.width },
        y: { min: game.config.height + 50, max: game.config.height + 1000 },
        speedY: { min: -400, max: -200 },
        frame: Phaser.Utils.Array.NumberArray(8, 58),
        frequency: 100,
        lifespan: 4000,
        quantity: 100,
        scale: 1.5,
        tint: 0xffff6600,
    });
    emitter.stop();

    var center_x = this.cameras.main.centerX;
    var center_y = this.cameras.main.centerY;

    bunniest = this.add.sprite(center_x, center_y, 'bunnist');
    bunniest.setOrigin(0.5, 0.5);
    bunniest.scale = 0.4;
    bunniest.alpha = 0;

    bunniestPipelineInstance = game.plugins.get('rexpixelationpipelineplugin').add(bunniest, {
        pixelWidth: 20,
        pixelHeight: 20,
    });

    mask = this.add.sprite(center_x, center_y, 'mask');
    mask.setOrigin(0.5, 0.5);
    mask.scale = 0.4;
    mask.alpha = 1;
    mask.tint = 0;

    maskPipelineInstance = game.plugins.get('rexpixelationpipelineplugin').add(mask, {
        pixelWidth: 20,
        pixelHeight: 20,
    });

    heart = this.add.sprite(center_x, center_y, 'heart');
    heart.setOrigin(0.5, 0.5);
    heart.scale = 0.5;
    heart.alpha = 0;

    heartPipelineInstance = game.plugins.get('rexpixelationpipelineplugin').add(heart, {
        pixelWidth: 30,
        pixelHeight: 30,
    });

    var that = this;
    WebFont.load({
        google: {
            families: [ 'Ubuntu' ]
        },
        testStrings: "missyou",
        active: function() {
            miss = that.add.text(center_x, center_y - 45, 'miss', { font: 'bold 128px "Ubuntu"', color: '#24aff2' });
            miss.alpha = 0;
            miss.setOrigin(0.5, 0.5);
            miss.setStroke("#ffffff", 6);

            you = that.add.text(center_x, center_y + 45, 'you', { font: 'bold 128px "Ubuntu"', color: '#24aff2' });
            you.alpha = 0;
            you.setOrigin(0.5, 0.5);
            you.setStroke("#ffffff", 6);

            end_text = that.add.text(center_x, center_y, 'end', { font: 'bold 64px "Ubuntu"', color: '#ff6600' });
            end_text.alpha = 0;
            end_text.setOrigin(0.5, 0.5);
            end_text.setStroke("#ffffff", 3);

            updateFunctions = [wait];
        },
    });
}

function addPix(p, s) {
    p.pixelWidth += s;
    p.pixelHeight += s;
}

function setPix(p, s) {
    p.pixelWidth = s;
    p.pixelHeight = s;
}

var wait_tick = 200;
function wait(context) {
    wait_tick -= 1;
    if (wait_tick == 100) {
        emitter.start();
    }
    if (wait_tick < 0) {
        updateFunctions = [show];
    }
}

var flash = false;
var show_tick = 50;
function show(context) {
    var speed = 0.002;
    bunniest.scale += speed;
    mask.scale += speed;

    show_tick -= 1;
    if (flash) {
        mask.alpha = 0;
        bunniest.alpha += 0.05;
        if (show_tick == 0) {
            flash = false;
            show_tick = Phaser.Math.RND.between(10,50);
            mask.alpha = 2;
            addPix(maskPipelineInstance, -2);
            addPix(bunniestPipelineInstance, -2);

        }
    }
    else if (show_tick == 0) {
        flash = true;
        show_tick = Phaser.Math.RND.between(2,3);
    }

    if (mask.scale >= 1) {
        mask.destroy();
        bunniest.alpha = 1;
        setPix(maskPipelineInstance, 1);
        setPix(bunniestPipelineInstance, 1);
        updateFunctions = [heart_beat];
    }
}

var heart_tick = 0;
var pix_rate = -2;
var slow_beat = 26;
var fast_beat = 3;
var beat = slow_beat + fast_beat;
var heart_grow = 0;
var heart_big = 0.5;
var heart_small = 0.4;
function heart_beat(context) {
    heart_tick += 1;

    // change background
    if (heart_tick == 100) {
        bunniest.destroy();
        emitter.stop();
        context.cameras.main.setBackgroundColor(0xffffdd00);
    }
    else if (heart_tick == 105) {
        context.cameras.main.setBackgroundColor(0);
        emitter.killAll();
        // These two lines are needed to ensure the particles do not
        // inherit any position data from the dead ones
        emitter.dead.length = 0;
        emitter.alive.length = 0;
        emitter.setQuantity(50);
        emitter.setTint(0xff24aff2);
        emitter.setPosition(
            { min: 0, max: context.game.config.width },
            { min: -500, max: -50 }
        );
        emitter.setSpeedY({ min: 100, max: 200 });
        emitter.start();
    }

    // heart beat
    if (heart_tick >= 110) {
        var is_slow_beat = (heart_tick - 110) % beat == 0;
        var is_fast_beat = (heart_tick - 110) % beat == slow_beat;
        if (is_slow_beat) {
            heart.scale = heart_big + heart_grow;
            addPix(heartPipelineInstance, pix_rate);
            heart.alpha += 0.2;
        }
        if (is_fast_beat) {
            heart.scale = heart_small + heart_grow;
            if (heart_tick <= 110 + (beat * 12)) {
                heart_grow += 0.1;
            }
        }
    }

    // miss you text
    if (heart_tick >= 110 + (beat * 8)) {
        miss.alpha += 0.01;
        you.alpha += 0.01;
    }

    // end
    if (heart_tick >= 110 + (beat * 20)) {
        miss.destroy();
        you.destroy();
        heart.destroy();
        emitter.stop();
        end_text.alpha += 0.01;
        if (end_text.alpha >= 0.8) {
            updateFunctions = [];    
        }
        if (emitter.alive.length == 0) {
            context.game.destroy();
        }
    }
}


function update(time, delta) {
    for (var i = 0; i < updateFunctions.length; i++) updateFunctions[i](this);
}