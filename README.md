# Avalonia VSCode Extension README

## Features

- [x] Create Avalonia .NET Core Projects: App, MVVM, CrossPlatform

- [x] Create Resources, Styles, TemplateControls, UserControl and Window

- [x] XAML auto code completion 

- [ ] XAML Preview window

## How to run

* Extract release archive or clone project into $HOME/.vscode/extensions/Avalonia.VSCodeExtension
* Build Language Server with
```
$ dotnet build Avalonia.AXAML.LanguageServer/Avalonia.AXAML.LanguageServer
```
* Run NPM Install with
```
$ npm install
```

* Compile the Svetle JS code with command
```
$ node_modules/.bin/rollup -c -w
$ npm run compile
```

* Press F5 in VSCode.

* Enjoy

## Videos

https://user-images.githubusercontent.com/1231687/148667916-c8ec3510-4a76-470c-8322-dfd0052fd71c.mp4


