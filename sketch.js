// infection diffusion model

let balls, balls2;
let boundaries;
var w, h, deltaH;
let e = 1;  //elasticity
let ballsNo = 100;
let ballsNo_true = 5;
let ballsNo2 = 100;
let datum;
let data = [];
let paused = true ;
let frameCount = 0;
let countNo = ballsNo_true;  // initial target number is ballsNo2
let countCollision = 0;
let count2 = 0;
let count3 = 0;
let t = 0;
let rateOfFrame = 60;
let real_t = 0;
let color_vel, color_vel2;



function setup() {
  w = windowWidth; h = windowHeight;
  createCanvas(w, h);
  world.gravity.y = 0;
  rad = 5;
  
  balls = new Group();
  balls2 = new Group();
  generateBall(balls, ballsNo, 'Normal'); // set howmany, mode = 'trace' / 'normal'
  generateBall2(balls2, ballsNo2, 'Normal'); // set howmany, mode = 'trace' / 'normal' 
  setBoundary();
  //noLoop();
  
  writer = createWriter('InfectionData_' + '.csv');
  //console.log('balls[0].x' + ',' + 'balls[0].y')
  //writer.print('balls[0].x' + ',' + 'balls[0].y');  
  console.log('time' + ',' + 'countNo')
  writer.print('time' + ',' + 'countNo');  
  
  // when collide one another, make properties true
  for (let i of balls) { 
    //console.log(i.property0);
    for (let j of balls) { 
      i.collide(j, () => whenCollision(i, j));      
    }
  }  
  
  frameRate(rateOfFrame); 
}

function draw() {
  t++;    
  DataWrite(t, rateOfFrame, real_t, countNo); 
  
  clear();
  
  if (!paused) {
  	frameCount++;
  } 
  
}




//===================================================================

// when sprites collide each other
function whenCollision(sprite1, sprite2) { 
  //countCollision++;
  //console.log(countCollision);  
  
  //infection
  if (sprite1.property0 && !sprite2.property0) {
    sprite2.shapeColor = (0);
    sprite2.property0 = true;
    countNo++;
    //console.log(countNo);
  } else if (sprite2.property0 && !sprite1.property0) {
    sprite1.shapeColor = (0);
    sprite1.property0 = true;
    countNo++;
    //console.log(countNo);
  }
  
  //color_vel
  color_vel = 80*(abs(sprite1.vel.x) + abs(sprite1.vel.y));
  color_vel2 = 80*(abs(sprite2.vel.x) + abs(sprite2.vel.y));
  
  sprite1.shapeColor = color(color_vel, 50, 250-color_vel);
  sprite2.shapeColor = color(color_vel2, 50, 250-color_vel2);
}

// remove test
function removeTest(sprite1) {  
  count3 = sprite1.length;
  if (0 < count3) {
    sprite1[int(random(count3))].remove();
    
    console.log(sprite1.length);
    //balls[count3].shapeColor = color(255, 255, 0);
  } else {    
    
  }
}
  



function generateBall(balls, howmany, state) {
  //set ball  
    
  for (let i = 0; i < howmany; i++) {
    ball = new Sprite();
    ball.diameter = 2*rad;
    ball.property0 = false;  // set sprites uninfected initially
    
    ball.x = random(rad, 0.5*w-rad);
    ball.y = (i)*h/howmany;
    
    
    ball.vel.x = random(-6, 6);
    ball.vel.y = random(-6, 6);
    color_vel = 80*(abs(ball.vel.x) + abs(ball.vel.y));
    
    ball.shapeColor = color(color_vel, 50, 250-color_vel);
    
    ball.bounciness = e; 
    
    if (state == 'trace') {
      ball.visible = false;
    } else {
      ball.visible = true;      
    } 
    
    balls.add(ball);
  }
}


function generateBall2(balls2, howmany, state) {
  //set ball  
    
  for (let i = 0; i < howmany; i++) {
    ball = new Sprite();
    ball.diameter = 2*rad;
    ball.property0 = false;  // set sprites uninfected initially
    
    ball.x = random(0.5*w+rad, w-rad);
    ball.y = (i)*h/howmany;
    
    
    ball.vel.x = random(-1, 1);
    ball.vel.y = random(-1, 1);
    color_vel = 80*(abs(ball.vel.x) + abs(ball.vel.y));
    
    ball.shapeColor = color(color_vel, 50, 250-color_vel);
    
    ball.bounciness = e; 
    
    if (state == 'trace') {
      ball.visible = false;
    } else {
      ball.visible = true;      
    } 
    
    balls2.add(ball);
  }
}




function setBoundary() {
  //set boundaries
  boundaries = new Group();
  
  //left
  floor = new Sprite();
  floor.collider = 'static';   //floor.collider = 'none';
  floor.w = 10;
  floor.h = 2*h;
  floor.rotation = 0;
  floor.x = 5;
  floor.y = 0;
  boundaries.add(floor);

  //right
  floor = new Sprite();
  floor.collider = 'static';   //floor.collider = 'none';
  floor.w = 10;
  floor.h = 2*h;
  floor.rotation = 0;
  floor.x = w - 0.5*floor.w;
  floor.y = 0;
  boundaries.add(floor);
  
  //up
  floor = new Sprite();
  floor.collider = 'static';   //floor.collider = 'none';
  floor.w = w;
  floor.h = 10;
  floor.rotation = 0;
  floor.x = 0.5*floor.w;
  floor.y = 0;
  boundaries.add(floor);
  
  //down
  floor = new Sprite();
  floor.collider = 'static';   //floor.collider = 'none';
  floor.w = w;
  floor.h = 10;
  floor.rotation = 0;
  floor.x = 0.5*floor.w;
  floor.y = h;
  boundaries.add(floor);

}


function DataWrite(_t, _FrameRate, _real_t, _datum) {
  if (_t%60 == 0) {
    _real_t = _t/_FrameRate;
    //console.log(_real_t);   
    
    datum_out = _real_t + ',' + _datum;
    console.log(datum_out)
    writer.print(datum_out);
  }  
  
}

function DataOut() {
  writer.close();
  writer.clear();  
}


function keyPressed() {	
  if (keyCode === DOWN_ARROW) {
    DataOut();
  } else if (keyCode === 32) { // Stop, when a spacebar is pressed.
    paused = !paused;
    if (paused){
      loop();
    } else {
      noLoop();      
    }
  }	else if (keyCode === LEFT_ARROW) { 
    /*
    balls[count2+1].remove();
    balls[count2].diameter = 5*rad;
    balls[count2].shapeColor = color(255, 255, 0);
    console.log(count2);
    count2 ++;
    */
  }
}

function mousePressed() {
  DataOut();
  //balls2[0].shapeColor = color(255, 255, 0);
  //balls2[0].remove();
  //balls2[0].life = 300;
  //console.log(balls2[0].life);
}
