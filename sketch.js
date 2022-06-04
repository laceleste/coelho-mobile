const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;
var fruit_con_3;
var rope3;

var bg_img;
var food;
var rabbit;

var button,button2,button3;
var bunny;
var blink,eat,sad;
var mute_btn;

var fr;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air

var star
var star_img;
function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');
  star_img = loadImage('star.png');
  
  bk_song = loadSound('sound1.mp3');
  sad_sound = loadSound("sad.wav")
  cut_sound = loadSound('rope_cut.mp3');
  eating_sound = loadSound('eating_sound.mp3');
  air = loadSound('air.wav');

  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  empty_star = loadAnimation("empty.png");
  one_star = loadAnimation("one_star.png");
  two_star = loadAnimation("stars.png");
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() 
{
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = window.innerWidth; 
    canH = window.innerHeight; 
    createCanvas(window.innerWidth+80, window.innerHeight);
  } 
  else {
    canW = windowWidth; 
    canH = windowHeight; 
    createCanvas(windowWidth, windowHeight);
  }
  frameRate(80);

  bk_song.play();
  bk_song.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  //botão 1
  button = createImg('cut_btn.png');
  button.position(canW/2-175,canH/2-230);
  button.size(50,50);
  button.mouseClicked(drop);

   //botão 2
   button2 = createImg('cut_btn.png');
   button2.position(canW/2+150,canH/2-230);
   button2.size(50,50);
   button2.mouseClicked(drop2);
 
   rope = new Rope(6,{x:(canW/2-170),y:(canH/2-220)});
   rope2 = new Rope(6,{x:(canW/2+200),y:(canH/2-220)});


  mute_btn = createImg('mute.png');
  mute_btn.position(canW-200,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);
  
  ground = new Ground(300,canH,canW,20);
  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(canW/2-170,canH-80,150,150);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  star_display = createSprite(canW/4-100,canH/3-150,30,30);
  star_display.scale = 0.2;
  star_display.addAnimation('empty',empty_star);
  star_display.addAnimation('one',one_star);
  star_display.addAnimation('two',two_star);
  star_display.changeAnimation('empty');

  //star sprite
  star = createSprite(canW/2,canH/2-300,20,20);
  star.addImage(star_img);
  star.scale=0.02;

  star2 = createSprite(canW/2-300,canH-400,20,20);
  star2.addImage(star_img);
  star2.scale=0.02;
  
  blower = createImg('baloon2.png');
  blower.position(canW/2,400);
  blower.size(100,100);
  blower.mouseClicked(airblow);

  var ops={
    density:0.001
  }
  fruit = Bodies.circle(canW/2,canH/2,20,ops);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope2,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw() 
{
  background(51);
  image(bg_img,0,0,window.innerWidth+80,window.innerHeight);

  push();
  imageMode(CENTER);
  if(fruit!=null ){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  rope.show();
  rope2.show();

  Engine.update(engine);
  ground.show();

  drawSprites();

  if(collide(fruit,bunny,80)==true)
  {
    World.remove(engine.world,fruit);
    fruit = null;
    bunny.changeAnimation('eating');
    eating_sound.play();
  }

  if(fruit!=null && fruit.position.y>=canH-50)
  {
    bunny.changeAnimation('crying');
    bk_song.stop();
    sad_sound.play();
    fruit=null;
   }
   if(collide(fruit,star,20)==true)
    {
     star.visible = false;
     star_display.changeAnimation('one');
    }

   if(collide(fruit,star2,40)==true)
    {
     star2.visible= false;
     star_display.changeAnimation('two');
    }   
   
  
}

function drop()
{
  cut_sound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
}

function drop2()
{
  cut_sound.play();
  rope2.break();
  fruit_con_2.dettach();
  fruit_con_2 = null;
}

function collide(body,sprite,x)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=x)
            {
               return true; 
            }
            else{
              return false;
            }
         }
}


function mute()
{
  if(bk_song.isPlaying())
     {
      bk_song.stop();
     }
     else{
      bk_song.play();
     }
}

function airblow()
{
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0,y:-0.03});
  air.play();
}
