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

## How to **use** the app

### Development environment

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

### Deploy in Production
````{terminal}
npx vite build
````

will create dist/ folder. The contents of that folder are ready to be hosted.