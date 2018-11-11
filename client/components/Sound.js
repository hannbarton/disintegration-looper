import React from 'react'
import Tone from 'tone'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/lab/Slider'
import {Upload} from './Upload'
import sketch1 from './Canvas'
import {SongSelection} from './SongSelection'
import p5 from 'p5'

const context = new (window.AudioContext || window.webkitAudioContext)()
let thebuff = new Tone.Buffer(`./uploads/disintegration.mp3`)

const styles = {
  root: {
    width: 300
  },
  slider: {
    padding: '22px 0px'
  },
}

let grainer
let volume = 0

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
      bitCrusher: 4,
      // detune: 0,
      // overlap: 0.1,
      // playbackRate: 1,
      // reverse: false
    }

    this.handleChangeDist = this.handleChangeDist.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeBitCrusher = this.handleChangeBitCrusher.bind(this)
    this.handleLooperStart = this.handleLooperStart.bind(this)
    this.handleLooperStop = this.handleLooperStop.bind(this)
  }

  componentDidMount() {
    // load all the buffers
    Tone.Buffer.on('load', function() {
      grainer = new Tone.GrainPlayer(thebuff).toMaster()
      grainer.reverse = false
    })

    this.canvas1 = new p5(sketch1, 'canvas1-container')
    this.canvas1.props = this.props.p5Props

    this.canvas1.onSetAppState = this.props.onSetAppState
  }

  componentDidUpdate() {
    event.preventDefault()

    let distor = new Tone.Distortion(this.state.distortion)
    let bitCrush = new Tone.BitCrusher(this.state.bitCrusher)
    // grainer.detune = this.state.detune
    // grainer.grainSize = this.state.grainSize
    // grainer.overlap = this.state.overlap
    // grainer.playbackRate = this.state.playbackRate
    grainer.connect(distor, bitCrush).toMaster()
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

  handleLooperStart() {
    event.preventDefault()
    const play = () => {
      grainer.start()
      grainer.loop = true
    }

    setInterval(() => {
      grainer.grainSize += 0.1
      // grainer.volume.value -= 2.5
      // grainer.detune = -500

    }, 5100)

    Tone.Transport.schedule(play, 0)

    Tone.Transport.start()
  }

  handleLooperStop() {
    event.preventDefault()
    grainer.stop()
  }

  render() {
    return (
      <div>
        <SongSelection />
        <div
          id="canvas2-container"
          style={{width: '100%', textAlign: 'center'}}
        />
        <br />
        <div className="distortion">
          <div className={this.props.classes.root}>
            <Typography id="label">Detune</Typography>
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
          <button type='button'>Reverse</button>
        </div>
        <br />
        <button type="button" onClick={() => this.handleLooperStart()}>
          LOOP START/RESTART
        </button>
        <button type="button" onClick={() => this.handleLooperStop()}>
          LOOP STOP
          </button>

        <br />
        <br />
        <Upload />
        <br />
        {/* <ReadDir /> */}
      </div>
    )
  }
}
Sound.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Sound)
