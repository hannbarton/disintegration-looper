import React from 'react'
import Tone from 'tone'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';


const context = new (window.AudioContext || window.webkitAudioContext)()
const dist = new Tone.Distortion(0.8)
let thebuff = new Tone.Buffer(`./uploads/flawless.mp3`)

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
    width: 300,
  },
  slider: {
    padding: '22px 0px',
  },
};

let grainer;

class Sound extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      distortion: 50
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    Tone.Buffer.on('load', function() {
      grainer = new Tone.GrainPlayer(thebuff)
      grainer.toMaster()
    })
  }

  handleClickPlay() {
    event.preventDefault()
    grainer.start()
  }

  handleClickStop() {
    event.preventDefault()
    grainer.stop()
  }

  handleClick() {

  }

  handleChange(event, distortion) {
    console.log(this.state)
    this.setState({distortion})
  }

  render() {
    return (
      <div>
        <br />
        <div className='slider'>
        <div className={this.props.classes.root}>
        <Typography id="label">Slider label</Typography>
        <Slider
          classes={{ container: this.props.classes.slider }}
          value={this.state.distortion}
          aria-labelledby="label"
          onChange={this.handleChange}
        />
      </div>
        <div className='distortion'>{this.state.distortion}</div>
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
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sound);

