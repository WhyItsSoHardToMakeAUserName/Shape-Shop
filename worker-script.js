import * as CANNON from 'cannon-es';
console.log("worker connected")
const bodies = []


const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-20.81,0),
  })
  
  
const planeBody = new CANNON.Body({
shape: new CANNON.Plane(),
type: CANNON.Body.STATIC
})
planeBody.quaternion.setFromEuler(-Math.PI / 2,0,0)
world.addBody(planeBody)


const BallBody = new CANNON.Body({
shape: new CANNON.Sphere(5),
mass:1000,
position: new CANNON.Vec3(100,5,30)
})
world.addBody(BallBody)

// const cubeBody = new CANNON.Body({
//     shape: new CANNON.Box(new CANNON.Vec3(5,5,5)),
//     mass:10000,
//     position: new CANNON.Vec3(-1440*0.001-48,5,30)
    
// })
// world.addBody(cubeBody)

// bodies.push(cubeBody)
bodies.push(BallBody)






self.addEventListener('message', (event) => {
    const { timeStep, positions, quaternions } = event.data;

    // Check if positions and quaternions are defined
        console.log(positions[0])

      // Step the world
      console.log('updated')
      world.fixedStep(timeStep);

      // Copy the cannon.js data into the buffers
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];

        positions[i * 3 + 0] = body.position.x;
        positions[i * 3 + 1] = body.position.y;
        positions[i * 3 + 2] = body.position.z;
        quaternions[i * 4 + 0] = body.quaternion.x;
        quaternions[i * 4 + 1] = body.quaternion.y;
        quaternions[i * 4 + 2] = body.quaternion.z;
        quaternions[i * 4 + 3] = body.quaternion.w;
      

      // Send data back to the main thread
      self.postMessage(
        {
          positions:positions,
          quaternions:quaternions,
        },
        // Specify that we want actually transfer the memory, not copy it over. This is faster.
        [positions.buffer, quaternions.buffer]
      );
    }
});


// document.getElementById("BallButton").addEventListener("click",  function() {
//   BallBody.applyForce(
//     new CANNON.Vec3(-2000000,0,0),
//     new CANNON.Vec3(0,0,0)
//   )
//   )
// });