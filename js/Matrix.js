function Matrix(arr){
  this.matrix = arr;

  this.matMultiply = (b) => {
    if(this.matrix[0].length != b.matrix.length){
      console.error("Matrix a must have the same amount of columns as b has rows");
      return;
    }

    let result = [];
    let sum = 0;

    for(let i = 0; i < this.matrix.length; i++){
      result.push([]);
      for(let j = 0; j < b.matrix[0].length; j++){
        sum = 0;
        for (let k = 0; k < b.matrix.length; k++) {
          sum += this.matrix[i][k] * b.matrix[k][j];
        }
        result[i].push(sum);
      }
    }

    return new Matrix(result);
  }

  this.add = (addition) => {
    for(let i = 0; i < this.matrix.length; i++)
      for(let j = 0; j < this.matrix[i].length; j++)
        this.matrix[i][j] += addition;
  }

  this.multiply = (multiplier) => {
    let product = [];
    for(let i = 0; i < this.matrix.length; i++){
      product.push([]);
      for(let j = 0; j < this.matrix[i].length; j++)
        product[i][j] = this.matrix[i][j] * multiplier;
    }
    return new Matrix(product);
  }

  this.toVector3 = ()=>{
    return new Vector3(
      this.matrix[0][0],
      this.matrix[1][0],
      this.matrix[2][0]
    );
  }

  this.toVector4 = ()=>{
    return new Vector4(
      this.matrix[0][0],
      this.matrix[1][0],
      this.matrix[2][0],
      this.matrix[3][0]
    );
  }
}

function Vector3(x, y, z){
  this.x = x;
  this.y = y;
  this.z = z;

  this.add = (vector)=>{
    return new Vector3(
      this.x + vector.x,
      this.y + vector.y,
      this.z + vector.z
    );
  }

  this.subtract = (vector)=>{
    return new Vector3(
      this.x - vector.x,
      this.y - vector.y,
      this.z - vector.z
    );
  }

  this.multiply = (num)=>{
    return new Vector4(
      this.x * num,
      this.y * num,
      this.z * num
    );
  }

  this.toMatrix = ()=>{
    return new Matrix([[this.x], [this.y], [this.z]]);
  }
}

function Vector4(x, y, z, w){
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;

  this.add = (vector)=>{
    return new Vector4(
      this.x + vector.x,
      this.y + vector.y,
      this.z + vector.z,
      this.w + vector.w
    );
  }

  this.subtract = (vector)=>{
    return new Vector4(
      this.x - vector.x,
      this.y - vector.y,
      this.z - vector.z,
      this.w - vector.w
    );
  }

  this.multiply = (num)=>{
    return new Vector4(
      this.x * num,
      this.y * num,
      this.z * num,
      this.w * num
    );
  }

  this.toMatrix = ()=>{
    return new Matrix([[this.x], [this.y], [this.z], [this.w]]);
  }
}
