
# Start

## Run the compiled app

    cd app
    open index.html

## Develop

    npm install
    bower install
    grunt bowercopy
    make

# State

```
world
  level
    planes (the 6 planes to be rendered)
    stencils
      level: N
      stencils: the stencils
      stencilWidth: M
      appliedStencils: 6xMxM array (of initial false) to be slammed

```

`world.level` can easily be set to null once a level is completed, so a whole
new level is set after
