const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const screenId = window.name
const sizeSegment = 300
const horizontalSegment = Math.floor(screen.availWidth/sizeSegment)-1
const verticalSegment = Math.floor(screen.availHeight/sizeSegment)-1
let windowList = []
let $container = document.getElementById('container');
let $btnContainer = document.getElementById('btn-container');
let $instruction = document.getElementById('instruction');
let $restart = document.getElementById('restart');
let $buttons = document.querySelectorAll('.button');

$container.style.top = `${screen.availHeight/2-40}px`
$container.style.left = `${screen.availWidth/4}px`
$container.style.width = `${screen.availWidth/2}px`
$container.style.height = `80px`
if(!!screenId) $container.classList.add('hidden')

function drawLines(){
  localStorage.setItem(screenId, JSON.stringify({x: canvas.width/2 + window.screenX, y: canvas.height/2 + window.screenY}));
  screens = Object.keys(localStorage).filter(x => x.startsWith('screen-'))

  ctx.beginPath();
  ctx.fillStyle = '#F0F000';
  screens.forEach(screen => {
    s = JSON.parse(localStorage[screen])
    if(screen == screens[0]){
      ctx.moveTo(s.x - window.screenX, s.y - window.screenY)
    }else{
      ctx.lineTo(s.x - window.screenX, s.y - window.screenY)
    }
    ctx.fillText(screen, s.x - window.screenX, s.y - window.screenY);
  });
  ctx.closePath();
  ctx.strokeStyle = 'white'
  ctx.stroke();
}

function drawRectangle(){
  ctx.beginPath()
  ctx.setLineDash([2,3]);
  ctx.strokeStyle = 'white'
  ctx.strokeRect(screen.availWidth/4 - window.screenX, screen.availHeight/4 - window.screenY, screen.availWidth/2, screen.availHeight/2);
  ctx.stroke();
}

function generateScreens(number){
  localStorage.clear();
  windowList.forEach(win => {
    win.close()
  })

  for (var i = 0; i < number; i++) {
    curWin = window.open('#',`screen-${i}`,`width=500,height=500,top=${Math.random()*verticalSegment*sizeSegment},left=${Math.random()*horizontalSegment*sizeSegment}`);
    windowList.push(curWin)
  }
}

function evaluateWindow(){
  let activeWindows = windowList.filter(x => x.closed != true)
  let inactiveWindows = windowList.filter(x => x.closed == true)

  if(inactiveWindows.length != 0) localStorage.clear()
  windowList = activeWindows;
}

function draw(){
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(!!screenId) drawLines()
  if(!!window.name || windowList.length == 0) drawRectangle()
}

$buttons.forEach(button => {
  button.addEventListener('click', function(e) {
    if(e.target.id == 'restart') return

    curClass = e.target.classList[1]
    verticesNumber = curClass.replace('button-', '');

    $btnContainer.classList.add('hidden');
    $instruction.classList.remove('hidden');
    generateScreens(parseInt(verticesNumber));
  });
})

$restart.addEventListener('click', function(e){
  $btnContainer.classList.remove('hidden');
  $instruction.classList.add('hidden');
  e.stopPropagation();
  generateScreens(0);
})

setInterval(function () {
  draw()
  evaluateWindow()
}, 1000 / 60)
