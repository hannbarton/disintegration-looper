import React from 'react'
import Tone from 'tone'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/lab/Slider'

const context = new (window.AudioContext || window.webkitAudioContext)()
const dist = new Tone.Distortion(0.8)
let thebuff = new Tone.Buffer(`./uploads/drone.mp3`)

// Tone.Buffer.on('load', function() {
//   grainer = new Tone.GrainPlayer(thebuff)
//   grainer.loop = true
//   grainer.loopStart = 190.50;
//   grainer.loopEnd = 197.60
//   grainer.grainSize = 0.1
//   grainer.playbackRate = .99
//   grainer.detune = .09
//   grainer.overlap = 0.01
//   grainer.chain(dist).toMaster()
// })

const styles = {
  root: {
    width: 300
  },
  slider: {
    padding: '22px 0px'
  },
  root1: {
    width: 300
  },
  slider1: {
    padding: '22px 0px'
  }
}

let grainer

class Sound extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      distortion: 0.5,
      grainSize: 0.5,
      detune: 0.5,
      overlap: 0.5,
      playbackRate: 0.5
    }

    this.handleChangeDist = this.handleChangeDist.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClickPlay = this.handleClickPlay.bind(this)
    this.handleClickStop = this.handleClickStop.bind(this)
  }

  componentDidMount() {
    Tone.Buffer.on('load', function() {
      grainer = new Tone.GrainPlayer(thebuff).toMaster()
    })
  }

  componentDidUpdate() {
    event.preventDefault()
    console.log('distortion', this.state.distortion)

    let distor = new Tone.Distortion(this.state.distortion)

    grainer.detune = this.state.distortion
    grainer.grainSize = this.state.grainSize
    grainer.overlap = this.state.distortion
    grainer.playbackRate = this.state.distortion
    grainer.chain(distor).toMaster()
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
    console.log('value', value)

    this.setState({
      distortion: value,
      // grainSize: value
    })
  }

  handleChange(event, value) {
    console.log('value', value)

    this.setState({
      grainSize: value,
      // grainSize: value
    })
  }

  render() {
    console.log('classes', this.props.classes)
    return (
      <div>
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
            /> {this.state.distortion}
          </div>

          <div className={this.props.classes.root1}>
            <Typography id="label">GrainSize</Typography>
            <Slider
              classes={{container: this.props.classes.slider1}}
              min={0}
              max={1}
              step={0.01}
              value={this.state.grainSize}
              aria-labelledby="label"
              onChange={this.handleChange}
            />
            {this.state.grainSize}
          </div>
        </div>
        <br />
        <button type="button" onClick={() => this.handleClickPlay()}>
          Start
        </button>
        <button type="button" onClick={() => this.handleClickStop()}>
          Stop
        </button>
        <br />
        <br />
        <form action="/api/sounds" method="post" encType="multipart/form-data">
          <input type="file" name="soundFile" />
          <br />
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
        <br />
      </div>
    )
  }
}
Sound.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Sound)
