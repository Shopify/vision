#!/bin/bash
DIR=`dirname $0`
cd "$DIR/../../../"

if [[ -f "vision.rb" ]]; then 
  RUBY=`/usr/bin/env which ruby`
  echo "Vision coming up..."
  echo "=> using $RUBY"
$RUBY vision.rb
else
  echo "=> Could not find vision.rb in same directory as Vision.app" 
  echo "=> Please only use Vision.app when its in the original directory"
fi
