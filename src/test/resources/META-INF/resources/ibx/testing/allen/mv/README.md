# MV page manager (built in IBX)

## Description
This project is a rebuild of the Angular MV page manager in the IBX framework. 

I've used typescript to develop the scripting for this project because of it's class and typing system, which will ensure that developers in the future will have a clearer understanding of what the shape of necessary javascript objects is. 
the scripts in `src/typescripts` are where development should occur. 

## Building
I'm working on the assumption that all of the javascript must be in line and that we should **not** make ourselves dependent on any javascript loading module. 

to that end, in order to use the functionality, it's important to use `rollup` to take the es5 js modules emitted by the typescript compiler and package them as an iife
to do so, run: 
```bash
tsc src/typescripts/
```