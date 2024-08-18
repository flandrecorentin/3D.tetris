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