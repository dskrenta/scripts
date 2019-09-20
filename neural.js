'use strict';

function sigmoid(x) {
  return 1 / (1 + (Math.E ** -x));
}

function sigmoidDerivative(x) {
  return x * (1 - x);
}

function dotProduct(a, b) {
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    total += a[i] * b[i];
  }
  return total;
}

function transposeArray(array) {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    newArray.push([]);
  }

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      newArray[j].push(array[i][j]);
    }
  }

  return newArray;
}

class NeuralNetwork {
  constructor(x, y) {
    this.input = x;
    this.weights1 = [1, 1, 1, 1];
    this.weights2 = [1, 1, 1, 1];
    this.y = y;
    this.output = [0];
  }

  feedforward() {
    this.layer1 = sigmoid(dotProduct(this.input, this.weights1));
    this.output = sigmoid(dotProduct(this.layer1, this.weights2));
  }

  backprop() {
    const dWeights1 = dotProduct(
      transposeArray(this.input),
      dotProduct(
        2 * (this.y - this.output) * sigmoidDerivative(this.output), transposeArray(this.weights2) * sigmoidDerivative(this.layer2)
      )
    );
    const dWeights2 = dotProduct(
      transposeArray(this.layer1),
      (2 * (this.y - this.output)) * sigmoidDerivative(this.output)
    );

    this.weights1 += dWeights1;
    this.weights2 += dWeights2;
  }
}

function init() {
  const X = [
    [0, 0, 1],
    [0, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
  ];
  const y = [
    [0],
    [1],
    [1],
    [0]
  ];

  const nn = new NeuralNetwork(X, y);

  for (let i = 0; i < 1500; i++) {
    nn.feedforward();
    nn.backprop();
  }

  console.log(nn.output);
}

init();

/*
import numpy as np

def sigmoid(x):
    return 1.0/(1+ np.exp(-x))

def sigmoid_derivative(x):
    return x * (1.0 - x)

class NeuralNetwork:
    def __init__(self, x, y):
        self.input      = x
        self.weights1   = np.random.rand(self.input.shape[1],4)
        self.weights2   = np.random.rand(4,1)
        self.y          = y
        self.output     = np.zeros(self.y.shape)

    def feedforward(self):
        self.layer1 = sigmoid(np.dot(self.input, self.weights1))
        self.output = sigmoid(np.dot(self.layer1, self.weights2))

    def backprop(self):
        # application of the chain rule to find derivative of the loss function with respect to weights2 and weights1
        d_weights2 = np.dot(self.layer1.T, (2*(self.y - self.output) * sigmoid_derivative(self.output)))
        d_weights1 = np.dot(self.input.T,  (np.dot(2*(self.y - self.output) * sigmoid_derivative(self.output), self.weights2.T) * sigmoid_derivative(self.layer1)))

        # update the weights with the derivative (slope) of the loss function
        self.weights1 += d_weights1
        self.weights2 += d_weights2


if __name__ == "__main__":
    X = np.array([[0,0,1],
                  [0,1,1],
                  [1,0,1],
                  [1,1,1]])
    y = np.array([[0],[1],[1],[0]])
    nn = NeuralNetwork(X,y)

    for i in range(1500):
        nn.feedforward()
        nn.backprop()

    print(nn.output)
*/
