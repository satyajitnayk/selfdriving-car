class NeuralNetwork {
  constructor(neuronCounts) {
    this.level = []
    for (let i = 0; i < neuronCounts.length; ++i) {
      this.level.push(new Level(
        neuronCounts[i], neuronCounts[i + 1]
      ))
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(
      givenInputs, network.level[0]
    )

    for (let i = 1; i < network.level.length; ++i) {
      outputs = Level.feedForward(outputs, network.level[i])
    }

    return outputs
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount)
    this.outputs = new Array(outputCount)
    // threshold values above which neuron will fire
    this.biases = new Array(outputCount)

    // connect every input neuron to output neuron
    this.weights = []
    for (let i = 0; i < inputCount; ++i) {
      this.weights[i] = new Array(outputCount)
    }
    // set the weights to some values

    Level.#randomize(this)
  }

  // generate outputs based on weights & biases
  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; ++i) {
      level.inputs[i] = givenInputs[i]
    }

    for (let i = 0; i < level.outputs.length; ++i) {
      let sum = 0
      for (let j = 0; j < level.inputs.length; ++j) {
        sum += level.inputs[j] * level.weights[j][i]
      }

      if (sum > level.biases[i]) {
        level.outputs[i] = 1
      } else {
        level.outputs[i] = 0
      }
    }
    return level.outputs
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; ++i) {
      for (let j = 0; j < level.outputs; ++j) {
        level.weights[i][j] = Math.random() * 2 - 1 // random value b/w -1 and 1
      }
    }

    for (let i = 0; i < level.biases.length; ++i) {
      level.biases[i] = Math.random() * 2 - 1
    }
  }
}
