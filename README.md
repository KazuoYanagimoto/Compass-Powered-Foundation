# Compass-powered Foundation

This is the default project template for creating web-apps, powered by Compass-powered Foundation. 

> It provides you with a basic template to get started with Foundation, Compass and Gulp build system.

## Requirements

You'll need the following applications installed to get started.

  - [Git](http://git-scm.com/downloads): Use the installer for your OS.
  - [Node.js](http://nodejs.org): Use the installer for your OS.
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

3: You are ready to go. Start your project, by run:

```bash
gulp
```

> This will compile Sass(by using Compass) and assemble all the necessary files to launch your web-app with localhost:8000. 
When you change files, the appropriate Gulp tasks will run automatically.

4: To run the compiling process without watching any files, use the `build` command.

```bash
gulp build
```

> You can also use the 'build' command with option flag(--production) for distribution ready.
