// Safari polyfill
window.OffscreenCanvas ? OffscreenCanvas : function(w, h){let cvs = document.createElement('canvas');cvs.height = h;cvs.width = w;cvs.convertToBlob = data => new Promise(res => cvs.toBlob(blob => res(blob), data.type, data.quality));return cvs;}

// start script
(async url => {
    // canvas Draw
    let waveform = (buff, ctx) => {
        let {width, height} = ctx.canvas,
            c = buff.getChannelData(0),
            len = c.length,
            b = Math.floor(len / width);
        ctx.translate(0, height / 2);
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(let i=0; i <= width; i += 3){
            let k = Math.floor(b * i),
                x = i * 1,
                y = c[k] * height / 2;
            ctx.moveTo(x, y);
            ctx.lineTo(x, (y * -1));
        }
       ctx.stroke();
       ctx.restore();
    }

    // init
    let buff = await new AudioContext().decodeAudioData(await (await fetch(url)).arrayBuffer()),
        cvs = new OffscreenCanvas(buff.duration * 1440, 48),
        ctx = cvs.getContext('2d');

    // style
    ctx.globalAlpha = .5
    ctx.strokeStyle = '#555';
    ctx.globalCompositeOperation = 'lighter';

    waveform(buff, ctx);

    // create img
    let $img = new Image();
    $img.src = URL.createObjectURL(await cvs.convertToBlob({type: "image/webp", quality: 0.75}))
    document.body.appendChild($img);

})(/* Audio File URL */);
