import React from 'react'
import Tone from 'tone'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/lab/Slider'
import {Upload} from './Upload'
import sketch1 from './Canvas'
import p5 from 'p5'

const context = new (window.AudioContext || window.webkitAudioContext)()
let thebuff = new Tone.Buffer(`./uploads/trim-flawless.mp3`)

// Tone.Buffer.on('load', function() {
//   let reverb = new Tone.JCReverb(.99)
//   let grainer = new Tone.Convolver('./uploads/flawless.mp3')
//   // let pitch = new Tone.PitchShift(-48)
//   // grainer.loop = true
//   // grainer.loopStart = 200.90;
//   // grainer.loopEnd = 220.60

//   // grainer.grainSize = 0.1
//   // grainer.playbackRate = .99
//   // grainer.detune = .09
//   // grainer.overlap = 0.01
//   grainer.toMaster()
//   grainer.start()
// })

const styles = {
  root: {
    width: 300
  },
  slider: {
    padding: '22px 0px'
  }
}

let grainer

class Sound extends React.Component {
  static propTypes = {
    p5Props: PropTypes.object.isRequired,
    onSetAppState: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)

    this.state = {
      distortion: 0.4,
      grainSize: 0.2,
      bitCrusher: 4
      // detune: 0.5,
      // overlap: 0.5,
      // playbackRate: 0.5
    }

    this.handleChangeDist = this.handleChangeDist.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeBitCrusher = this.handleChangeBitCrusher.bind(this)
    this.handleClickPlay = this.handleClickPlay.bind(this)
    this.handleClickStop = this.handleClickStop.bind(this)
    this.handleLooper = this.handleLooper.bind(this)
  }

  componentDidMount() {
    // load all the buffers
    Tone.Buffer.on('load', function() {
      grainer = new Tone.GrainPlayer(thebuff).toMaster()
    })

    this.canvas1 = new p5(sketch1, 'canvas1-container')
    this.canvas1.props = this.props.p5Props

    // this.canvas1.onSetAppState = this.props.onSetAppState
  }

  componentDidUpdate() {
    event.preventDefault()

    let distor = new Tone.Distortion(this.state.distortion)
    let bitCrush = new Tone.BitCrusher(this.state.bitCrusher)
    let feedbackDelay = new Tone.PingPongDelay('1n', 0.2).toMaster()
    feedbackDelay.wet.value = 0.5
    // let conv = new Tone.Convolver('./uploads/trim-flawless.mp3').toMaster()
    // conv.wet.value = 0.5
    let reverb = new Tone.Reverb(7, 5)
    let tremolo = new Tone.Tremolo(0.9, 1)
    let pitch = new Tone.PitchShift(-48)
    // grainer.detune = this.state.distortion
    // grainer.grainSize = this.state.grainSize
    // grainer.overlap = this.state.distortion
    // grainer.playbackRate = this.state.distortion
    grainer.connect(feedbackDelay).toMaster()
  }

  handleClickPlay() {
    event.preventDefault()
    grainer.start()
  }

  handleClickStop() {
    event.preventDefault()
    grainer.stop()
  }

  handleChangeDist(event, value) {
    this.setState({
      distortion: value
    })
  }

  handleChange(event, value) {
    this.setState({
      grainSize: value
    })
  }

  handleChangeBitCrusher(event, value) {
    this.setState({
      bitCrusher: value
    })
  }

  handleLooper() {
    event.preventDefault()

    const sampler = new Tone.Sampler({
      "C3" : "./uploads/trim-flawless.mp3",
    })
    const play = (time) => {
      // sampler.triggerAttackRelease('C3', 0, time)
      return grainer.start()
    }

    const chainingGrain = (time) => {
      grainer.grainSize += .1
      console.log(grainer.grainSize)

      grainer.chain(new Tone.Signal(.3), Tone.Master)
    }

    Tone.Transport.schedule(play, 0);
    Tone.Transport.schedule(chainingGrain, 0)
    Tone.Transport.loopEnd = '2n';
    Tone.Transport.loop = true;

    //start the transport
    Tone.Transport.start();
  }

  render() {
    return (
      <div>
        <div
          id="canvas2-container"
          style={{width: '100%', textAlign: 'center'}}
        />
        <br />
        <div className="distortion">
          <div className={this.props.classes.root}>
            <Typography id="label">Distortion</Typography>
            <Slider
              classes={{container: this.props.classes.slider}}
              min={0}
              max={1}
              step={0.01}
              value={this.state.distortion}
              aria-labelledby="label"
              onChange={this.handleChangeDist}
            />{' '}
            {this.state.distortion}
          </div>

          <div className={this.props.classes.root}>
            <Typography id="label">GrainSize</Typography>
            <Slider
              classes={{container: this.props.classes.slider}}
              min={0}
              max={1}
              step={0.01}
              value={this.state.grainSize}
              aria-labelledby="label"
              onChange={this.handleChange}
            />
            {this.state.grainSize}
          </div>
          <div className={this.props.classes.root}>
            <Typography id="label">BitCrusher</Typography>
            <Slider
              classes={{container: this.props.classes.slider}}
              min={1}
              max={8}
              step={1}
              value={this.state.bitCrusher}
              aria-labelledby="label"
              onChange={this.handleChangeBitCrusher}
            />{' '}
            {this.state.bitCrusher}
          </div>
        </div>
        <br />
        <button type="button" onClick={() => this.handleClickPlay()}>
          Start
        </button>
        <button type="button" onClick={() => this.handleClickStop()}>
          Stop
        </button>
        <button type="button" onClick={() => this.handleLooper()}>
          LOOP START
        </button>
        <br />
        <br />
        <Upload />
        <br />
      </div>
    )
  }
}
Sound.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Sound)
