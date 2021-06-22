const amountReelsRow = 5;
const amountReelsColumn = 3;
const amountSymbol = 13;
const reelWidth = 150;
const symbolSize = 140;

let app = new PIXI.Application({
  width: reelWidth * amountReelsRow - 10,
  height: symbolSize * amountReelsColumn,
  backgroundColor: 0x005588
});
document.body.appendChild(app.view);

app.loader
  .add("../images/M00_000.jpg")
  .add("../images/M01_000.jpg")
  .add("../images/M02_000.jpg")
  .add("../images/M03_000.jpg")
  .add("../images/M04_000.jpg")
  .add("../images/M05_000.jpg")
  .add("../images/M06_000.jpg")
  .add("../images/M07_000.jpg")
  .add("../images/M08_000.jpg")
  .add("../images/M09_000.jpg")
  .add("../images/M10_000.jpg")
  .add("../images/M11_000.jpg")
  .add("../images/M12_000.jpg")
  .load(setup);

function setup() {

  const textures = [
    PIXI.Texture.from("../images/M00_000.jpg"),
    PIXI.Texture.from("../images/M01_000.jpg"),
    PIXI.Texture.from("../images/M02_000.jpg"),
    PIXI.Texture.from("../images/M03_000.jpg"),
    PIXI.Texture.from("../images/M04_000.jpg"),
    PIXI.Texture.from("../images/M05_000.jpg"),
    PIXI.Texture.from("../images/M06_000.jpg"),
    PIXI.Texture.from("../images/M07_000.jpg"),
    PIXI.Texture.from("../images/M08_000.jpg"),
    PIXI.Texture.from("../images/M09_000.jpg"),
    PIXI.Texture.from("../images/M10_000.jpg"),
    PIXI.Texture.from("../images/M11_000.jpg"),
    PIXI.Texture.from("../images/M12_000.jpg"),
  ];

  const reels = [];
  const reelContainer = new PIXI.Container();

  for (let i = 0; i < amountReelsRow; i++) {
    const container = new PIXI.Container();
    container.x = i * reelWidth;
    reelContainer.addChild(container);

    const newReel = {
        container,
        symbols: [],
        position: 0
    };

    for (let j = 0; j <= amountReelsColumn; j++) {
        const symbol = new PIXI.Sprite(textures[Math.floor(Math.random() * textures.length)]);
        symbol.y = j * symbolSize;
        symbol.scale.x = symbol.scale.y = Math.min(symbolSize / symbol.width, symbolSize / symbol.height);
        symbol.x = 0;
        newReel.symbols.push(symbol);
        container.addChild(symbol);
    }
    reels.push(newReel);
  }

  app.stage.addChild(reelContainer);

  const buttonSpinStart = document.getElementById("start");
  buttonSpinStart.addEventListener("click", () => {
        startPlay();
    });

  let running = false;
  
  function startPlay() {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
      const reel = reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = reel.position + 20 + i * 5 + extra;
      const time = 1000 + i * 600;
      tweenTo(reel, 'position', target, time, turn(), null, i === reels.length - 1 ? reelsComplete : null);
    }
  }
  
  function reelsComplete() {
    running = false;
  }

  app.ticker.add(() => {

        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];

            for (let j = 0; j < reel.symbols.length; j++) {
                const symbol = reel.symbols[j];
                const prevY = symbol.y;
                symbol.y = ((reel.position + j) % reel.symbols.length) * symbolSize - symbolSize;
                if (symbol.y < 0 && prevY > symbolSize) {
                   
                    symbol.texture = textures[Math.floor(Math.random() * textures.length)];
                    symbol.scale.x = symbol.scale.y = Math.min(symbolSize / symbol.texture.width, symbolSize / symbol.texture.height);
                    symbol.x = Math.round((symbolSize - symbol.width) / 2);
                }
            }
        }
  });
  
  const tweening = [];
  function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };
  
    tweening.push(tween);
    return tween;
  }

  app.ticker.add(() => {
      const now = Date.now();
      const remove = [];
      for (let i = 0; i < tweening.length; i++) {
          const tween = tweening[i];
          const phase = Math.min(1, (now - tween.start) / tween.time);

          tween.object[tween.property] = getProperty(tween.propertyBeginValue, tween.target, tween.easing(phase));
          if (tween.change) tween.change(tween);
          if (phase === 1) {
              tween.object[tween.property] = tween.target;
              if (tween.complete) tween.complete(tween);
              remove.push(tween);
          }
      }
      for (let i = 0; i < remove.length; i++) {
          tweening.splice(tweening.indexOf(remove[i]), 1);
      }
  });


  function getProperty(a1, a2, tween) {
      return a1 * (1 - tween) + a2 * tween;
  }

  function turn() {
    return (t) => (--t * t * t + 1);
  }
}