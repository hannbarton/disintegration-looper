import React from 'react'
import Tone from 'tone'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/lab/Slider'
// import {Upload} from './Upload'
// import {SongSelection} from './SongSelection'
import sketch1 from './Canvas'
import p5 from 'p5'

const styles = {
  root: {
    width: 250,
  },
  slider: {
    padding: '10px 0px',
    margin: '0px 0px'
  },
}

let song = 'disintegration'
// let song = 'earthbound-sanctuary'
// let song = 'yumenikki-07'
// let song = 'orcas3'
// let song = 'yumenikki-10'
let thebuff = new Tone.Buffer(`./uploads/${song}.mp3`)

let grainer
let incrementer = 0;
let setInt;

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
    }

    this.handleChangeDetune = this.handleChangeDetune.bind(this)
    this.handleChangeGrainSize = this.handleChangeGrainSize.bind(this)
    this.handleChangeOverlap = this.handleChangeOverlap.bind(this)
    this.handleLooperStart = this.handleLooperStart.bind(this)
    this.handleLooperStop = this.handleLooperStop.bind(this)
  }

  componentDidMount() {
    // load all the buffers
    Tone.Buffer.on('load', function() {
      grainer = new Tone.GrainPlayer(thebuff).toMaster()
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

  handleLooperStart() {
    event.preventDefault()

    const play = () => {
      grainer.start()
      grainer.loop = true
    }

    setInt = setInterval(() => {
      grainer.volume.value -= 2.5
      console.log('volume', grainer.volume.value)
      grainer.grainSize += 0.005
      console.log('grainsize', grainer.grainSize)
      grainer.detune -= 2.5
      console.log('detune', grainer.detune)
      grainer.overlap += 0.08

      let freeverb = new Tone.Freeverb().toMaster();
      freeverb.dampening.value -= 5;
      incrementer += .04
      let reverb = new Tone.JCReverb(incrementer).toMaster()
      grainer.chain(freeverb, reverb).toMaster()

    }, 5200)

    Tone.Transport.schedule(play, 0)

    Tone.Transport.start()
  }

  handleLooperStop() {
    event.preventDefault()
    grainer.stop()
    clearInterval(setInt)
  }

  render() {
    return (
      <div className='main-container'>
      <p>Instructions: Begin the loop and hear the music distort with every loop</p>
        <div
          id="canvas1-container"
          justify="center"
          style={{width: '100%', textAlign: 'center'}}
        />
        <div className='align-box'>
        <br />
        <div className="adjustment">
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
            {Number.parseFloat(this.state.detune).toFixed(0)}
          </div>
          <br/>
          <div className={this.props.classes.root}>
            <Typography id="label">GrainSize</Typography>
            <Slider
              classes={{container: this.props.classes.slider}}
              min={0}
              max={1}

              value={this.state.grainSize}
              aria-labelledby="label"
              onChange={this.handleChangeGrainSize}
            />
            {Number.parseFloat(this.state.grainSize).toFixed(2)}
          </div>
          <br/>
          <div className={this.props.classes.root}>
            <Typography id="label">Overlap</Typography>
            <Slider
              classes={{container: this.props.classes.slider}}
              min={0}
              max={1}

              value={this.state.overlap}
              aria-labelledby="label"
              onChange={this.handleChangeOverlap}
            />{' '}
            {Number.parseFloat(this.state.overlap).toFixed(2)}
          </div>
          <br/>
          {/* <button type='button' onClick={() => this.handleChangeReverse}>Reverse</button> */}
        </div>
        <br />
        <button type="button" onClick={() => this.handleLooperStart()}>
          START LOOP
        </button>
        <button type="button" onClick={() => this.handleLooperStop()}>
          STOP LOOP
          </button>

        <br />
        <br />
        <br />
        </div>
      </div>
    )
  }
}
Sound.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Sound)
