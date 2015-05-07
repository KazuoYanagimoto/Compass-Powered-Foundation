# Compass-powered Foundation

This is the default template project for creating web-apps, powered by Compass-powered Foundation and Gulp. 
It provides you with a basic template to get started with Foundation, Compass and Gulp build system.

## Requirements

You'll need the following applications installed to get started.

  - [Node.js](http://nodejs.org): Use the installer for your OS.
  - [Git](http://git-scm.com/downloads): Use the installer for your OS.
  - [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): To install Gulp and Bower, run `npm install -g gulp bower`.

## Get Started

1: Clone this repository, where `myapp` is the name of your project.

```bash
git clone https://github.com/KazuoYanagimoto/Compass-Powered-Foundation.git myapp
```

2: Change into the directory, and install the dependencies.

```bash
cd myapp
```

```bash
npm install
```

```bash
bower install
```

3: You are ready to start on your project, run:

```bash
Gulp
```

> This will compile the Sass(by using Compass) and assembles all the necessary files to launch your web-app with localhost:8080. 
When you change files, the appropriate Gulp task will run to build new files for you.

4: To run the compiling process without watching any files, use the `build` command.

```bash
Gulp build
```

> You can also use the 'build' command with option flag(--production) for distribution ready.
