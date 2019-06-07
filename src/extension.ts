'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';


export function activate(context: vscode.ExtensionContext) {
    let root = vscode.workspace.rootPath || "";
    
    let dest = String(vscode.workspace.getConfiguration("synclocal").get("destination")) || "";
    if (dest == "" || dest == null)
        vscode.window.showErrorMessage("The value 'sync local.destination' in setting.json is required");    

    vscode.workspace.onDidSaveTextDocument((e:any)=> {
        let relativepath = e.fileName.replace(root, "");

        copyFileSync(e.fileName, dest + relativepath);
    });   

    
    let disposable = vscode.commands.registerCommand('extension.sync', () => {
        dest = String(vscode.workspace.getConfiguration("synclocal").get("destination")) || "";
        fs.copy(root, dest, function (err:any) {
            if (err)
                vscode.window.showErrorMessage(err.message);    
            vscode.window.showInformationMessage('Copy completed!');    
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function copyFileSync( source:any, target:any) {
    var targetFile = target;
    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}
