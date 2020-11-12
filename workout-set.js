const countDirections = {
  DOWN: 1,
  UP: 2,
}

const restRoundNumber = 'r'

function padNumberString(number) {
  return String(number).padStart(2, '0')
}

class Round {
  constructor({
    roundNumber,
    duration,
    isRest,
    countDirection = countDirections.DOWN,
  }) {
    this.roundNumber = isRest ? restRoundNumber : padNumberString(roundNumber)
    this.duration = duration
    this.countDirection = countDirection
    this.elapsedTime = 0
    return this
  }

  get displayTime() {
    if (!this.elapsedTime) {
      return { minutes: '00', seconds: '00'}
    }

    const currentTime =
      this.countDirection === countDirections.UP
        ? this.elapsedTime - 1
        : this.duration - this.elapsedTime + 1
    const minutes = padNumberString(Math.floor(currentTime / 60))
    const seconds = padNumberString(currentTime - minutes * 60)

    return { minutes, seconds }
  }
  
  get ended() {
    return this.elapsedTime === this.duration
  }

  tick() {
    this.elapsedTime = Math.min(this.elapsedTime + 1, this.duration)

    return this
  }
}

class Countdown extends Round {
  constructor() {
    super({
      duration: 9,
      countDirection: countDirections.DOWN
    })
    this.roundNumber = ''
    this.isCountdown = true
  }
  
  get displayTime() {
      return {seconds:String(this.duration - this.elapsedTime + 1)}
  }
}

class WorkoutSet {
  constructor({
    roundCount,
    timePerRound,
    restTimeBetweenRounds,
    countDirection = countDirections.DOWN,
  }) {
    this.rounds = this.__buildRounds(
      roundCount,
      timePerRound,
      restTimeBetweenRounds,
      countDirection
    )
    this.roundCount = this.rounds.length
    this.currentRound = 0
    this.isStarted = false
  }

  start() {
    this.isStarted = true
    this.tick()
    return this
  }

  tick() {
    if (this.round && this.round.ended) {
      this.currentRound = Math.min(
        this.currentRound + 1,
        this.rounds.length - 1
      )

      if (!this.round) {
        return this
      }
    }
    this.round.tick()
    return this
  }

  get round() {
    return this.rounds[this.currentRound]
  }

  get roundNumber() {
    return this.round && this.round.roundNumber
  }

  get time() {
    return this.round && this.round.displayTime
  }
  
  get isCountdown() {
    return this.round.isCountdown
  }

  state() {
    return {
      isCountdown: this.isCountdown,
      time: this.time,
      roundNumber: this.roundNumber,
      tick: () => this.tick(),
      start: () => this.start(),
      isStarted: this.isStarted,
    }
  }

  __buildRounds(
    roundCount,
    timePerRound,
    restTimeBetweenRounds,
    countDirection
  ) {
    const rounds = [
      new Countdown()
    ]

    for (let roundNumber = 1; roundNumber <= roundCount; roundNumber++) {
      rounds.push(
        new Round({ roundNumber, duration: timePerRound, countDirection })
      )

      if (restTimeBetweenRounds) {
        rounds.push(
          new Round({
            isRest: true,
            duration: restTimeBetweenRounds,
            countDirection: countDirections.DOWN,
          })
        )
      }
    }

    rounds.push(new Round({ duration: 0, roundNumber: 0 })) // empty last round
    return rounds
  }
}
