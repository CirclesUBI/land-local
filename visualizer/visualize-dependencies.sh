#!/bin/bash

# specify the input file
input_file="../modes/from-source/docker-compose.yml"

# specify the output file
output_file="dependencies.png"

# call the node script
node visualize-dependencies.js $input_file $output_file

