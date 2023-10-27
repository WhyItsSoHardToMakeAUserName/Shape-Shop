// self.addEventListener('message', (e) => {
//     const {cubeBody} = e.data;
  
//     // Perform some task in response to the message
//     const result = delayedLoop(5,970,cubeBody);
  
//     // Send the result back to the main thread
//     self.postMessage(result);
//   });
  
//   function delayedLoop(iterations, delay,cubeBody) {
//     let count = 0;
  
//     function loop() {
//       if (count < iterations) {
//           setTimeout(loop, delay);
//           cubeBody.applyForce(
//             new CANNON.Vec3(500000,0,0),
//             new CANNON.Vec3(0,0,0)
//           )
  
//           count++;
//         }
//     }
  
//     loop();
//   }
