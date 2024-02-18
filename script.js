const carCanvas = document.getElementById('carCanvas')
carCanvas.width = 200

const networkCanvas = document.getElementById('networkCanvas')
networkCanvas.width = 300

const carCtx = carCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)

const N = 100
const cars = generateCars(N)
let bestCar = cars[0]
if (localStorage.getItem('bestBrain')) {
  bestCar = JSON.parse(localStorage.getItem('bestBrain'))
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -100, 30, 50, "DUMMY", 2),
];

animate();

function save() {
  localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
}

function discard() {
  localStorage.removeItem('bestBrain')
}

function generateCars(N) {
  const cars = []
  for (let i = 1; i <= N; ++i) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'))
  }
  return cars
}

function animate(time) {
  for (let i = 0; i < traffic.length; ++i) {
    traffic[i].update(road.borders, [])
  }

  for (let i = 0; i < cars.length; ++i) {
    cars[i].update(road.borders, traffic)
  }

  // car with min y, the one which one chasing the traffic
  // using the below code as fitness function for best car
  const minY = Math.min(...cars.map(car => car.y))
  bestCar = cars.find(car => car.y === minY);

  carCanvas.height = window.innerHeight
  networkCanvas.height = window.innerHeight

  // make it look like a camera is following the car
  carCtx.save()
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)

  road.draw(carCtx)
  for (let i = 0; i < traffic.length; ++i) {
    traffic[i].draw(carCtx, 'red')
  }

  carCtx.globalAlpha = 0.2
  for (let i = 0; i < cars.length; ++i) {
    cars[i].draw(carCtx, 'blue')
  }
  carCtx.globalAlpha = 1
  bestCar.draw(carCtx, 'blue', true)


  carCtx.restore()


  // animate line dash using time param sent by requestAnimationFrame
  networkCtx.lineDashOffset = -time / 50
  Visualizer.drawNetwork(networkCtx, bestCar.brain)
  requestAnimationFrame(animate)
}
