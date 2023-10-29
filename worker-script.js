import * as CANNON from 'cannon-es';
const bodies = []

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-20.81,0),
});

const planeBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC
});
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBody);

const BallBody = new CANNON.Body({
    shape: new CANNON.Sphere(5),
    mass: 1000,
    position: new CANNON.Vec3(100, 5, 30)
});
world.addBody(BallBody);



bodies.push(BallBody);


let windowWidthReceived = 0;

self.addEventListener('message', (event) => {
    const { timeStep, positions, quaternions,windowWidth} = event.data;

    // Check if positions and quaternions are defined
    if(windowWidthReceived == 0){
        windowWidthReceived = 1;
        const cubeBody = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(5, 5, 5)),
            mass: 10000,
            position: new CANNON.Vec3(-windowWidth * 0.001 - 48, 50, 30)
        });
        world.addBody(cubeBody);
        bodies.push(cubeBody);
    }

    // Step the world

    world.fixedStep(timeStep);

    // Create new Float32Arrays to avoid ArrayBuffer transfer issues
    const newPositionArray = new Float32Array(positions);
    const newQuaternionArray = new Float32Array(quaternions);

    // Copy the cannon.js data into the new arrays
    for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];

        newPositionArray[i * 3 + 0] = body.position.x;
        newPositionArray[i * 3 + 1] = body.position.y;
        newPositionArray[i * 3 + 2] = body.position.z;
        newQuaternionArray[i * 4 + 0] = body.quaternion.x;
        newQuaternionArray[i * 4 + 1] = body.quaternion.y;
        newQuaternionArray[i * 4 + 2] = body.quaternion.z;
        newQuaternionArray[i * 4 + 3] = body.quaternion.w;
    }

    // Send data back to the main thread
    self.postMessage(
        {
            positions: newPositionArray,
            quaternions: newQuaternionArray,
        }
    );
});

// document.getElementById("BallButton").addEventListener("click",  function() {
//   BallBody.applyForce(
//     new CANNON.Vec3(-2000000,0,0),
//     new CANNON.Vec3(0,0,0)
//   )
//   )
// });