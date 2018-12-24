let perspectiveBool = document.getElementById("perspectiveBool");
let sliderDistance = document.getElementById("distance");
let sliderBoxSize = document.getElementById("boxSize");
let sliderX = document.getElementById("x-rot");
let sliderY = document.getElementById("y-rot");
let sliderZ = document.getElementById("z-rot");
let sliderXW = document.getElementById("xw-rot");
let sliderYW = document.getElementById("yw-rot");
let sliderZW = document.getElementById("zw-rot");

let distance = sliderDistance.value;
let projectionMatrix = new Matrix([
  [1,0,0],
  [0,1,0],
  [0,0,0]
]);
let projectionMatrix4D = new Matrix([
  [1,0,0,0],
  [0,1,0,0],
  [0,0,1,0],
  [0,0,0,0]
])

let isPerspective = false;
function setPerspective(){
  if(isPerspective)
    isPerspective = false;
  else
    isPerspective = true;

  projectionMatrix = new Matrix([
    [1,0,0],
    [0,1,0],
    [0,0,0]
  ]);
}

function setProjection(z) {
  if(!isPerspective)
    return;

  let distort = 1/(distance - z);
  projectionMatrix = new Matrix([
    [distort,0,0],
    [0,distort,0],
    [0,0,0]
  ]);
}

function connect(arr, a, b){
  ctx.beginPath();
  ctx.moveTo(arr[a].x, arr[a].y);
  ctx.lineTo(arr[b].x, arr[b].y);
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.closePath();
}

function close(arr, a, b, c, d){
  ctx.beginPath();
  ctx.moveTo(arr[a].x, arr[a].y);
  ctx.lineTo(arr[b].x, arr[b].y);
  ctx.lineTo(arr[c].x, arr[c].y);
  ctx.lineTo(arr[d].x, arr[d].y);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function Point(x, y){
  this.x = x;
  this.y = y;
}

function Box(x, y, z, size){
  this.center = new Vector3(x,y,z);
  this.rotation = new Vector3(0,0,0);
  this.size = size;
  //Points in 3d space
  this.points = [
    new Vector3(-1, -1, 1),
    new Vector3(1, -1, 1),
    new Vector3(1, 1, 1),
    new Vector3(-1, 1, 1),
    new Vector3(-1, -1, -1),
    new Vector3(1, -1, -1),
    new Vector3(1, 1, -1),
    new Vector3(-1, 1, -1)
  ];
  for (let i = 0; i < this.points.length; i++) {
    this.points[i] = this.points[i].add(this.center);
  }
  //Points projected to 2D
  this.projectedPoints = [];
  for (let i = 0; i < this.points.length; i++) {
    setProjection(this.points[i].z);
    let normal = this.points[i].toMatrix();
    normal = normal.multiply(this.size);
    let projected = projectionMatrix.matMultiply(normal);
    let point = projected.toVector3();
    this.projectedPoints.push(new Point(point.x, point.y));
  }

  this.draw = ()=>{
    //Draws points
    for (point of this.projectedPoints) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2*Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
    }

    //Draws polygons
    /*for(let i = 0; i < 2; i++){
      close(this.projectedPoints, (i*4), (i*4)+1, (i*4)+2, (i*4)+3);
      close(this.projectedPoints, i, i+1, i+5, i+4);
      close(this.projectedPoints, i*2, 3, 7, 2*i+4);
    }*/

    //Draws edges
    for (let i = 0; i < 4; i++) {
      connect(this.projectedPoints, i, (i+1)%4);
      connect(this.projectedPoints, i+4, (i+1)%4+4);
      connect(this.projectedPoints, i, i+4);
    }
  }

  this.update = ()=>{
    this.draw();
    this.rotateX();
    this.rotateY();
    this.rotateZ();
    this.size = sliderBoxSize.value;
  }

  //Apply rotation
  this.rotateVector = (rotationMatrix)=>{
    for (let i = 0; i < this.points.length; i++) {
      let point = this.points[i].subtract(this.center);
      let rotated = rotationMatrix.matMultiply(point.toMatrix());
      this.points[i] = rotated.toVector3().add(this.center);
      setProjection(rotated.toVector3().z);
      rotated = rotated.multiply(this.size);
      let projectedPoint = projectionMatrix.matMultiply(rotated).toVector3();
      projectedPoint = projectedPoint.add(this.center);
      this.projectedPoints[i] = new Point(projectedPoint.x, projectedPoint.y);
    }
  }

  this.rotateX = ()=>{
    let rotationMatrix = new Matrix([
      [1, 0, 0],
      [0, Math.cos(this.rotation.x), -Math.sin(this.rotation.x)],
      [0, Math.sin(this.rotation.x), Math.cos(this.rotation.x)]
    ]);
    this.rotateVector(rotationMatrix);
  }

  this.rotateY = ()=>{
    let rotationMatrix = new Matrix([
      [Math.cos(this.rotation.y), 0, -Math.sin(this.rotation.y)],
      [0, 1, 0],
      [Math.sin(this.rotation.y), 0, Math.cos(this.rotation.y)]
    ]);
    this.rotateVector(rotationMatrix);
  }

  this.rotateZ = ()=>{
    let rotationMatrix = new Matrix([
      [Math.cos(this.rotation.z), -Math.sin(this.rotation.z), 0],
      [Math.sin(this.rotation.z), Math.cos(this.rotation.z), 0],
      [0, 0, 1]
    ]);
    this.rotateVector(rotationMatrix);
  }

}

function Tesseract(x, y, z, w, size){
  this.center = new Vector4(x, y, z, w);
  this.rotation = {xy: 0, yz: 0, xz: 0, xw: 0, yw: 0, zw: 0};
  this.size = size;
  this.points = [
    new Vector4(-1, -1, 1, 1),
    new Vector4(1, -1, 1, 1),
    new Vector4(1, 1, 1, 1),
    new Vector4(-1, 1, 1, 1),
    new Vector4(-1, -1, -1, 1),
    new Vector4(1, -1, -1, 1),
    new Vector4(1, 1, -1, 1),
    new Vector4(-1, 1, -1, 1),
    new Vector4(-1, -1, 1, -1),
    new Vector4(1, -1, 1, -1),
    new Vector4(1, 1, 1, -1),
    new Vector4(-1, 1, 1, -1),
    new Vector4(-1, -1, -1, -1),
    new Vector4(1, -1, -1, -1),
    new Vector4(1, 1, -1, -1),
    new Vector4(-1, 1, -1, -1)
  ];

  this.projectedPoints = [];
  for (var i = 0; i < this.points.length; i++) {
    let normal = this.points[i].toMatrix();
    let projected3D = projectionMatrix4D.matMultiply(normal).toVector3().toMatrix();
    let projected = projectionMatrix.matMultiply(projected3D);
    let point = projected.toVector3();
    point.multiply(this.size).add(this.center);
    this.projectedPoints.push(new Point(point.x, point.y));
  }

  this.draw = () => {
    //Draw points
    for (point of this.projectedPoints) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 1, 0, 2*Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
    }

    //Connect points
    for (let i = 0; i < 4; i++) {
      //First Box
      connect(this.projectedPoints, i, (i+1)%4);
      connect(this.projectedPoints, i+4, (i+1)%4+4);
      connect(this.projectedPoints, i, i+4);

      //Second Box
      connect(this.projectedPoints, i+8, (i+1)%4+8);
      connect(this.projectedPoints, i+12, (i+1)%4+12);
      connect(this.projectedPoints, i+8, i+12);
    }
    //Connect boxes
    for (var i = 0; i < 8; i++) {
      connect(this.projectedPoints, i, i+8);
    }

  }

  this.update = ()=> {
    this.draw();

    this.rotateXY();
    this.rotateYZ();
    this.rotateXZ();
    this.rotateXW();
    this.rotateYW();
    this.rotateZW();

    this.center = new Vector4(canvas.width/2, canvas.height/2, 0, 0);
    this.size = sliderBoxSize.value;
    this.rotation.xy = sliderX.value;
    this.rotation.yz = sliderY.value;
    this.rotation.xz = sliderZ.value;
    this.rotation.xw = sliderXW.value;
    this.rotation.yw = sliderYW.value;
    this.rotation.zw = sliderZW.value;
  }

  //Apply rotation
  this.rotateVector = (rotationMatrix)=>{
    for (let i = 0; i < this.points.length; i++) {
      let rotated = rotationMatrix.matMultiply(this.points[i].toMatrix());
      this.points[i] = rotated.toVector4();
      //console.log(rotated.toVector4().x);
      //rotated = rotated.multiply(this.size);
      let projectedPoint3D = projectionMatrix4D.matMultiply(rotated).toVector3().toMatrix();
      let projectedPoint = projectionMatrix.matMultiply(projectedPoint3D).toVector3();
      projectedPoint = projectedPoint.multiply(this.size).add(this.center);
      this.projectedPoints[i] = new Point(projectedPoint.x, projectedPoint.y);
    }
  }

  this.rotateXY = ()=>{
    let rotationMatrix = new Matrix([
      [Math.cos(this.rotation.xy), Math.sin(this.rotation.xy), 0, 0],
      [-Math.sin(this.rotation.xy), Math.cos(this.rotation.xy), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]);
    this.rotateVector(rotationMatrix);
  }

  this.rotateYZ = ()=>{
    let rotationMatrix = new Matrix([
      [1, 0, 0, 0],
      [0, Math.cos(this.rotation.yz), Math.sin(this.rotation.yz), 0],
      [0, -Math.sin(this.rotation.yz), Math.cos(this.rotation.yz), 0],
      [0, 0, 0, 1]
    ]);
    this.rotateVector(rotationMatrix);
  }

  this.rotateXZ = ()=>{
    let rotationMatrix = new Matrix([
      [Math.cos(this.rotation.xz), 0, -Math.sin(this.rotation.xz), 0],
      [0, 1, 0, 0],
      [Math.sin(this.rotation.xz), 0, Math.cos(this.rotation.xz), 0],
      [0, 0, 0, 1]
    ]);
    this.rotateVector(rotationMatrix);
  }

  this.rotateXW = ()=>{
    let rotationMatrix = new Matrix([
      [Math.cos(this.rotation.xw), 0, 0, Math.sin(this.rotation.xw)],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [-Math.sin(this.rotation.xw), 0, 0, Math.cos(this.rotation.xw)]
    ]);
    this.rotateVector(rotationMatrix);
  }

  this.rotateYW = ()=>{
    let rotationMatrix = new Matrix([
      [1, 0, 0, 0],
      [0, Math.cos(this.rotation.yw), 0, -Math.sin(this.rotation.yw)],
      [0, 0, 1, 0],
      [0, Math.sin(this.rotation.yw), 0, Math.cos(this.rotation.yw)]
    ]);
    this.rotateVector(rotationMatrix);
  }

  this.rotateZW = ()=>{
    let rotationMatrix = new Matrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, Math.cos(this.rotation.zw), -Math.sin(this.rotation.zw)],
      [0, 0, Math.sin(this.rotation.zw), Math.cos(this.rotation.zw)]
    ]);
    this.rotateVector(rotationMatrix);
  }

}

let tesseract = new Tesseract(canvas.width/2, canvas.height/2, 0, 0, sliderBoxSize.value);
let box = new Box(canvas.width/2, canvas.height/2, 0, sliderBoxSize.value);

function animate(){
  ctx.clearRect(0,0,canvas.width, canvas.height);

  distance = sliderDistance.value;

  /*
  box.update();
  box.rotation.x = sliderX.value;
  box.rotation.y = sliderY.value;
  box.rotation.z = sliderZ.value;
  */

  tesseract.update();

}
