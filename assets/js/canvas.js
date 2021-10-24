function canvas(selector, options)
{
   const canvas = document.querySelector(selector);
   canvas.classList.add('canvas')
   canvas.setAttribute('width', `${options.width || 400}px`)
   canvas.setAttribute('height', `${options.height || 300}px`)


   // отримання контексту для малювання
   const context = canvas.getContext('2d')
  // отримуємо координати canvas відносно viewport
   const rect = canvas.getBoundingClientRect();

  let isPaint = false // чи активно малювання
let points = [] //масив з точками

   // об’являємо функцію додавання точок в масив
const addPoint = (x, y, dragging) => {
   // преобразуємо координати події кліка миші відносно canvas
   points.push({
       x: (x - rect.left),
       y: (y - rect.top),
       dragging: dragging
   })
}

    // головна функція для малювання
   const redraw = () => {
   //очищуємо  canvas
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);

   context.strokeStyle = options.strokeColor;
   context.lineJoin = "round";
   context.lineWidth = options.strokeWidth;
   let prevPoint = null;
   for (let point of points){
       context.beginPath();
       if (point.dragging && prevPoint){
           context.moveTo(prevPoint.x, prevPoint.y)
       } else {
           context.moveTo(point.x - 1, point.y);
       }
       context.lineTo(point.x, point.y)
       context.closePath()
       context.stroke();
       prevPoint = point;
   }
}

    // функції обробники подій миші
const mouseDown = event => {
   isPaint = true
   addPoint(event.pageX, event.pageY);
   redraw();
}

const mouseMove = event => {
   if(isPaint){
       addPoint(event.pageX, event.pageY, true);
       redraw();
   }
}

// додаємо обробку подій
canvas.addEventListener('mousemove', mouseMove)
canvas.addEventListener('mousedown', mouseDown)
canvas.addEventListener('mouseup',() => {
   isPaint = false;
});
canvas.addEventListener('mouseleave',() => {
   isPaint = false;
});

   // TOOLBAR
   const toolBar = document.getElementById('toolbar')
   // clear button
   const clearBtn = document.createElement('button')
   clearBtn.classList.add('btn')
   clearBtn.textContent = 'Clear'

   clearBtn.addEventListener('click', () => {
   // тут необхідно додати код очистки canvas та масиву точок (clearRect)
   points = [];
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);
   })
   toolBar.insertAdjacentElement('afterbegin', clearBtn)


   // Download
   const toolBar2 = document.getElementById('download')
   // download button
   const downloadBtn = document.createElement('button')
   downloadBtn.classList.add('btn')
   downloadBtn.textContent = 'Download'

   downloadBtn.addEventListener('click', () => {

      const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      const newTab = window.open('about:blank','image from canvas');
      newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");


   })
   toolBar2.insertAdjacentElement('afterbegin', downloadBtn)


   // Save
   const toolBar3 = document.getElementById('save')
   // save button
   const saveBtn = document.createElement('button')
   saveBtn.classList.add('btn')
   saveBtn.textContent = 'Save'

   saveBtn.addEventListener('click', () => {

      localStorage.setItem('points', JSON.stringify(points));

   })
   toolBar3.insertAdjacentElement('afterbegin', saveBtn)

   // Restore
   const toolBar4 = document.getElementById('restore')
   // Restore button
   const restoreBtn = document.createElement('button')
   restoreBtn.classList.add('btn')
   restoreBtn.textContent = 'Restore'

   restoreBtn.addEventListener('click', () => {
      points = JSON.parse(localStorage.getItem('points'));
      redraw();
   })
   toolBar4.insertAdjacentElement('afterbegin', restoreBtn)

   // Timestamp
   const toolBar5 = document.getElementById('timestamp')
   // Timestamp button
   const TimestampBtn = document.createElement('button')
   TimestampBtn.classList.add('btn')
   TimestampBtn.textContent = 'Timestamp'

   TimestampBtn.addEventListener('click', () => {
      var ctx = document.getElementById('draw').getContext('2d');
      ctx.font = '48px serif';

         var today = new Date();
         var dd = String(today.getDate()).padStart(2, '0');
         var mm = String(today.getMonth() + 1).padStart(2, '0');
         var yyyy = today.getFullYear();

         today = dd + '/' + mm + '/' + yyyy;

      ctx.fillText(today, 10, 50);
   })
   toolBar5.insertAdjacentElement('afterbegin', TimestampBtn)

 // color
  var theInput = document.getElementById("colorPicker");

   theInput.addEventListener("input", function(){
   options.strokeColor = theInput.value;
  redraw();
  // Do something with `theColor` here.
   }, false);

      var slider = document.getElementById("size");

      slider.addEventListener("input", function(){
         options.strokeWidth =  document.getElementById("size").value;;
         redraw;
      }, false);


            // Background
   const toolBar6 = document.getElementById('background')
   // Background button
   const bgrBtn = document.createElement('button')
   bgrBtn.classList.add('btn')
   bgrBtn.textContent = 'Background'

   bgrBtn.addEventListener('click', () => {
      const img = new Image;
img.src =`https://www.fillmurray.com/200/300)`;
img.onload = () => {
   context.drawImage(img, 0, 0);
}

   })
   toolBar6.insertAdjacentElement('afterbegin', bgrBtn)
   

}

   window.onload = function() 
   {
      var theInput = document.getElementById("colorPicker");
      canvas('#draw', {
      width: 500,
      height: 300,
      strokeWidth: 5,
      strokeColor: theInput.value
   })
};


