const Command = require('./command.js');
const Message = require('./message.js');
class Rover {
   constructor(position) {
      this.position = position;
      this.mode = "NORMAL";
      this.generatorWatts = 110;
   };
   receiveMessage(message){
      let response = {
         message: message.name,
         results: []
      } 
      let currentCommands = message.commands
      for (let i = 0; i < currentCommands.length; i++ ){
         if (currentCommands[i].commandType === "STATUS_CHECK"){
           let statusCheckResults = {
            completed: true,
            roverStatus : {
               mode : this.mode,
               generatorWatts : this.generatorWatts,
               position : this.position
            }
           }
           response.results.push(statusCheckResults);
         } else if(currentCommands[i].commandType === "MODE_CHANGE"){
            let modeChangeResults = {
               completed: true
            }
            this.mode = currentCommands[i].value
            response.results.push(modeChangeResults);
         } else if (currentCommands[i].commandType === "MOVE") {
            if (this.mode === "LOW_POWER"){
               let moveResults = {
                  completed: false
               }
               response.results.push(moveResults)
            } else {
               let moveResults = {
                  completed: true
               }
               this.position = currentCommands[i].value
               response.results.push(moveResults)
            }
         }
      };
     return response
   }
}



module.exports = Rover;