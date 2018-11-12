import p5 from 'p5'
import React from 'react'
import "p5/lib/addons/p5.sound";

export default function (s) {
    s.props = {}
    s.onSetAppState = () => {}

    let mic, fft
    s.setup = function() {
        s.createCanvas(900, 300)
        mic = new p5.AudioIn();
        mic.start();
        fft = new p5.FFT();
        fft.setInput(mic);
    }

    s.draw = function() {

        s.background('#f08080');

        var spectrum = fft.analyze();

        s.beginShape();
        for (let i = 0; i<spectrum.length; i++) {

         s.vertex(i, s.map(spectrum[i], 0, s.height, s.height, 0));
        }
        s.endShape();

    }
}

//#add8e6
