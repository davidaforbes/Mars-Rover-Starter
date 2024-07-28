const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
  let testRover1 = new Rover(1000);
  
  test("constructor sets position and default values for mode and generatorWatts", function(){
    expect (testRover1.position).toBe(1000);
    expect (testRover1.mode).toBe("NORMAL")
    expect (testRover1.generatorWatts).toBe(110)
  });

  test("response returned by receiveMessage contains the name of the message", function(){
      let commands = [new Command("MOVE",1000), new Command("MOVE", 1000)];
      let testMessage1 = new Message("name of message",commands);
      let testReceivedMessage = testRover1.receiveMessage(testMessage1)
      expect (testReceivedMessage.message).toBe ("name of message")
  });

  test("response returned by receiveMessage includes two results if two commands are sent in the message", function(){
    let commands1 = [new Command("STATUS_CHECK"), new Command("STATUS_CHECK")];  
    let testMessage2 = new Message("message name", commands1)
    let testReceivedMessage = testRover1.receiveMessage(testMessage2)
    expect (testReceivedMessage.results.length).toEqual(testMessage2.commands.length)
    
  });

  test("responds correctly to the status check command", function(){
    let commands2 = [new Command("STATUS_CHECK")]
    let testMessage3 = new Message("message name", commands2);
    expect (testRover1.receiveMessage(testMessage3)).toStrictEqual ({
      message : "message name",
      results : [{ 
      completed: true,
      roverStatus: {
        mode: 'NORMAL', 
        generatorWatts: 110, 
        position: 1000}}]
      });
  });
  test("responds correctly to the mode change command", function(){
    let commands3 = [new Command("MODE_CHANGE","LOW_POWER")];
    let testMessage4 = new Message("message name",commands3);
    expect (testRover1.receiveMessage(testMessage4)).toStrictEqual ({
      message : "message name",
      results : [{
        completed: true
      }]
    });
    expect (testRover1.mode).toBe ("LOW_POWER")
  });
  test ("responds with a false completed value when attempting to move in LOW_POWER mode", function (){
    testRover1.mode = "LOW_POWER";
    let commands4 = [new Command("MOVE", 5000)]
    let testMessage5 = new Message("message name", commands4);
    expect (testRover1.receiveMessage(testMessage5)).toStrictEqual ({
      message: "message name",
      results : [{
        completed: false
      }]
    });
    expect (testRover1.position).toBe (1000)
    testRover1.mode = "NORMAL"
  });
  test ("responds with the position for the move command", function(){
    let commands4 = [new Command("MOVE", 5000)]
    let testMessage5 = new Message("message name", commands4);
    expect (testRover1.receiveMessage(testMessage5)).toStrictEqual ({
      message: "message name",
      results: [{
        completed: true
      }]
    });
    expect (testRover1.position).toBe (5000);
  });
});
