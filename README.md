# ops-hops

## Purpose

- Janusgraph UI client.  Angular, Material, D3.js, Gremlin.  Based on significant work by @savantly/ngx-graphexp (huge thanks!).
- POC for a software support team to logically map components, capabilies, signals of a complex system to surface not-obvious relationships and implications of state variations.

## Features

- Differs from forked sourced project via the following:
	- Modifications applied resulting in a working JanusGraph 0.5.2 client.
	- UI overhaul
	- Architectual changes to show all nodes+edges, disable layers.

## Current Issues

- Opportunity for performance tuning, 20-50 returned nodes has 2-4sec lag to render.
- No demo available currently due to need for live JanusGraph backend.

## Default GraphConfig options   

./src/app/modules/graphexp/graphViz/graphConfig.ts

## Default GremlinClientOptions  

./src/gremlin/gremlin.client.options.ts


## Build/Development

To build the library - use yarn or npm  
`yarn build:lib`  

To build the example app -  
`yarn build`  

Files are output to `./dist`  

