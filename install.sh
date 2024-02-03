#!/usr/bin/bash

if ! command -v bun &> /dev/null
then
    echo "<the_command> could not be found"
    exit 1
fi
