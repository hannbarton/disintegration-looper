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

const styles = {
  root: {
    width: 300
  },
  slider: {
    padding: '22px 0px'
  },
}

let song = 'disintegration'
let thebuff = new Tone.Buffer(`./uploads/${song}.mp3`)

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
      grainSize: 0.2,
      detune: 0,
      overlap: 0.1,
      playbackRate: 1,
      reverse: false
    }

    this.handleChangeDetune = this.handleChangeDetune.bind(this)
    this.handleChangeGrainSize = this.handleChangeGrainSize.bind(this)
    this.handleChangeOverlap = this.handleChangeOverlap.bind(this)
    this.handleChangePlaybackRate = this.handleChangePlaybackRate.bind(this)
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
    grainer.detune = this.state.detune
    grainer.grainSize = this.state.grainSize
    grainer.overlap = this.state.overlap
    grainer.playbackRate = this.state.playbackRate
    grainer.toMaster()
  }

  handleChangeDetune(event, value) {
    this.setState({
      detune: value
    })
  }

  handleChangeGrainSize(event, value) {
    this.setState({
      grainSize: value
    })
  }

  handleChangeOverlap(event, value) {
    this.setState({
      overlap: value
    })
  }

  handleChangePlaybackRate(event, value) {
    this.setState({
      playbackRate: value
    })
  }

  handleChangeReverse() {
    this.setState({
      reverse: !this.state.reverse
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
        <div className="detune">
          <div className={this.props.classes.root}>
            <Typography id="label">Detune</Typography>
            <Slider
              classes={{container: this.props.classes.slider}}
              min={-10}
              max={10}
              step={1}
              value={this.state.detune}
              aria-labelledby="label"
              onChange={this.handleChangeDetune}
            />{' '}
            {this.state.detune}
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
            <Typography id="label">Overlap</Typography>
            <Slider
              classes={{container: this.props.classes.slider}}
              min={1}
              max={8}
              step={1}
              value={this.state.overlap}
              aria-labelledby="label"
              onChange={this.handleChangeOverlap}
            />{' '}
            {this.state.overlap}
          </div>
          <div className={this.props.classes.root}>
            <Typography id="label">PlaybackRate</Typography>
            <Slider
              classes={{container: this.props.classes.slider}}
              min={1}
              max={8}
              step={1}
              value={this.state.playbackRate}
              aria-labelledby="label"
              onChange={this.handleChangePlaybackRate}
            />{' '}
            {this.state.playbackRate}
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
