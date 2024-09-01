# **3D.tetris**

3D.tetris is a remake of the famous tetris but in 3D

## How to **play** 3D.tetris

You can use the buttons to move pieces that are falling on the ground and make a 'tetris' by covering an entire stage with blocks

**Arrows controls** (on the left of the screen by default) allow to move front, back, left, right and down pieces.

**Circles controls** (on the right of the screen by default) allow to rotate pieces on x, y, z axes.

## Score 

Action | #Score
--- | --- 
Speed click | 2 
Tetromino placed | 4
Single | 100 
Double | 300 
Triple | 500 
Tetris | 800 

## How to **start** locally

1. Install Node.js: https://nodejs.org/en

2. Install three.js and Vite

````{terminal}
# three.js
npm install --save three

# vite
npm install --save-dev vite
````

3. Run the development web app
````{terminal}
npx vite
````    

## How to **deploy** 3D.tetris

Deployment is made with the Pages service from Github. For that, use branch gh-pages.

Use the following command :

````{terminal}
npx vite build --outDir="./docs"
````

will create docs/ folder. The contents of that folder are ready to be hosted.

---- 

Due to possible conflicts on other deployments (like for flandrecorentin.github.io), you may need to remove the root '/'


````html
<!-- From -->
<script type="module" crossorigin src="/assets/_______.js"></script>
<link rel="stylesheet" crossorigin href="/assets/_______.css">

<!-- To -->
<script type="module" crossorigin src="assets/_______.js"></script>
<link rel="stylesheet" crossorigin href="assets/_______.css">
````