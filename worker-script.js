// import * as THREE from 'three';
// import * as CANNON from 'cannon-es';

// function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
//     world.step(timeStep);
//     plane.position.copy(planeBody.position);
//     plane.quaternion.copy(planeBody.quaternion);
  
//     if (Cube) {
//       spotLight.target = Cube;
//     }
  
//     Cube.position.copy(cubeBody.position);
//     Cube.quaternion.copy(cubeBody.quaternion);
  
//     Ball.position.copy(BallBody.position);
//     Ball.quaternion.copy(BallBody.quaternion);
  
//     spotLight.position.setX(cubeBody.position.x + 10);
  
//     if (window.innerWidth <= 1570 && window.innerWidth >= 785) {
//       spotLight.angle = window.innerWidth * 0.00028;
//     }
  
//     // camera position log
//     const cameraPosition = camera.position;
//     const cameraX = cameraPosition.x;
//     const cameraY = cameraPosition.y;
//     const cameraZ = cameraPosition.z;
//     console.log(`Camera Position: x=${cameraX}, y=${cameraY}, z=${cameraZ}`);
//   }
  
//   animate();