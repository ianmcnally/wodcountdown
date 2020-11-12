function toTimeMask(string) {
  const normalizedString = string.replace(/[^0-9]/g, '')
  const secondsStartingPosition = normalizedString.length - 2
  const minutes = normalizedString
    .substring(0, secondsStartingPosition)
    .replace(/^0/, '')
  const seconds = normalizedString
    .substring(secondsStartingPosition)
    .padStart(2, '0')
  return minutes || seconds ? `${minutes}:${seconds}` : ''
}

function fromTimeMaskToSeconds(string) {
  const normalizedString = string.replace(/[^0-9]/g, '')
  const secondsStartingPosition = normalizedString.length - 2
  const minutes = normalizedString.substring(0, secondsStartingPosition)
  const seconds = normalizedString.substring(secondsStartingPosition)
  return Number(minutes || 0) * 60 + Number(seconds || 0)
}

function App() {
  const [roundCount, setRoundCount] = React.useState(1)
  const [timePerRound, setTimePerRound] = React.useState(toTimeMask('60'))
  const [restTimeBetweenRounds, setRestTimeBetweenRounds] = React.useState(
    toTimeMask('0')
  )
  const [countDirection, setCountDirection] = React.useState(
    countDirections.DOWN
  )
  const [workout, setWorkoutState] = React.useState(new WorkoutSet({}).state())

  const handleStartClick = () => {
    const newWorkout = new WorkoutSet({
      roundCount,
      timePerRound: fromTimeMaskToSeconds(timePerRound),
      restTimeBetweenRounds: fromTimeMaskToSeconds(restTimeBetweenRounds),
      countDirection,
    })
    newWorkout.start()
    setWorkoutState(newWorkout.state())
  }

  const handleRoundsInputChange = event => {
    setRoundCount(event.target.value)
  }

  const handleRoundsTimeInputChange = event => {
    const maskedTime = toTimeMask(event.target.value)
    setTimePerRound(maskedTime)
  }

  const handleRestTimeInputChange = event => {
    const maskedTime = toTimeMask(event.target.value)
    setRestTimeBetweenRounds(maskedTime)
  }

  const handleCountDirectionInputChange = event => {
    setCountDirection(event.target.value)
  }

  React.useEffect(() => {
    const id = setTimeout(() => {
      if (workout.isStarted) {
        const updatedWorkout = workout.tick()
        setWorkoutState(updatedWorkout.state())
      }
    }, 1000)
    return () => clearTimeout(id)
  }, [workout.isStarted, workout.time, workout.roundNumber])

  return React.createElement(React.Fragment, {
    children: [
      React.createElement(ClockFace, {
        ...workout.time,
        isCountdown: workout.isCountdown,
        roundNumber: workout.roundNumber,
      }),
      React.createElement(Controls, {
        children: [
          React.createElement(ControlLabels),
          React.createElement('div'),
          React.createElement(RoundsInput, {
            value: roundCount,
            onChange: handleRoundsInputChange,
          }),
          React.createElement(RoundsTimeInput, {
            value: timePerRound,
            onChange: handleRoundsTimeInputChange,
          }),
          React.createElement(RestTimeInput, {
            value: restTimeBetweenRounds,
            onChange: handleRestTimeInputChange,
          }),
          React.createElement(CountDirectionInput, {
            value: countDirection,
            onChange: handleCountDirectionInputChange,
          }),
          React.createElement(StartButton, { onClick: handleStartClick }),
        ],
      }),
    ],
  })
}

function RoundNumber(props) {
  const { roundNumber } = props
  return React.createElement('span', {
    children: roundNumber,
    className: 'digit round-number',
  })
}

function ClockFace(props) {
  const { minutes, seconds, isCountdown, roundNumber } = props
  return React.createElement('div', {
    className: 'clock-face',
    children: [
      React.createElement(RoundNumber, {
        roundNumber: roundNumber,
      }),
      React.createElement('span', {
        children: minutes,
        className: 'number digit',
      }),
      isCountdown
        ? null
        : React.createElement('span', {
            children: ':',
            className: 'number colon',
          }),
      React.createElement('span', {
        children: seconds,
        className: 'number digit',
      }),
    ],
  })
}

function StartButton(props) {
  return React.createElement('button', {
    type: 'button',
    className: 'start control-input',
    children: 'GO',
    ...props,
  })
}

function RoundsInput(props) {
  return React.createElement(React.Fragment, {
    children: [
      React.createElement('input', {
        className: 'control-input',
        type: 'number',
        id: 'rounds-input',
        ...props,
      }),
    ],
  })
}

function RoundsTimeInput(props) {
  return React.createElement(React.Fragment, {
    children: [
      React.createElement('input', {
        className: 'control-input',
        type: 'text',
        maxlength: '5',
        id: 'rounds-time-input',
        ...props,
      }),
    ],
  })
}

function RestTimeInput(props) {
  return React.createElement(React.Fragment, {
    children: [
      React.createElement('input', {
        className: 'control-input',
        type: 'text',
        maxlength: '5',
        id: 'rest-time-input',
        ...props,
      }),
    ],
  })
}

function CountDirectionInput(props) {
  return React.createElement(React.Fragment, {
    children: [
      React.createElement('select', {
        ...props,
        className: 'control-input',
        id: 'count-direction-input',
        children: [
          React.createElement('option', {
            value: countDirections.DOWN,
            children: 'down',
          }),
          React.createElement('option', {
            value: countDirections.UP,
            children: 'up',
          }),
        ],
      }),
    ],
  })
}

function Controls(props) {
  return React.createElement('div', { ...props, className: 'controls' })
}

function ControlLabels() {
  return React.createElement(React.Fragment, {
    children: [
      React.createElement('label', { for: 'rounds-input', children: 'Rounds' }),
      React.createElement('label', {
        for: 'rounds-time-input',
        children: 'Round time',
      }),
      React.createElement('label', {
        for: 'rest-time-input',
        children: 'Rest time',
      }),
      React.createElement('label', {
        for: 'count-direction-input',
        children: 'Up/down',
      }),
    ],
  })
}

ReactDOM.render(React.createElement(App), document.getElementById('root'))
