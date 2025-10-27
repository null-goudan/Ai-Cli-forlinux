#!/usr/bin/env node
import { cli } from 'cleye';

var version = "1.0.0";

cli(
  {
    version,
    description: "AI CLI for Linux"
  },
  (argv) => {
    console.log("AI CLI for Linux version:", version);
  }
);
