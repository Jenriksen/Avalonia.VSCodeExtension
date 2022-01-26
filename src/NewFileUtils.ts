import * as path from 'path';
import * as os from 'os';

const parentfinder = require('find-parent-dir');
const findupglob = require('find-up-glob');

export class NewFileUtils {

    public static correctFileExtension(fileName: string, fileExtension: string) : string {
        if (path.extname(fileName) !== "." + fileExtension) {
            if (fileName.endsWith('.')) {
                fileName = fileName + fileExtension;
            } else {
                fileName = fileName + "." + fileExtension;
            }
        }
        return fileName;
    }

    public static getProjectRootDirectory(filePath: string) : string {
        var projectrootdir = parentfinder.sync(path.dirname(filePath), 'project.json');
        
        if (projectrootdir == null) {
            var csprojfiles = findupglob.sync('*.csproj', { cwd: path.dirname(filePath) });
            if (csprojfiles == null) {
                return null;
            }
            projectrootdir = path.dirname(csprojfiles[0]);
        }

        return projectrootdir;
    }

    public static getProjectNamespace(
            projectRootDirectory: string, 
            fullFilePath: string) : string {

        var newroot = projectRootDirectory.substr(projectRootDirectory.lastIndexOf(path.sep) + 1);

        var filenamechildpath = fullFilePath.substring(fullFilePath.lastIndexOf(newroot));

        var pathSepRegEx = /\//g;
        if (os.platform() === "win32") {
            pathSepRegEx = /\\/g;
        }
        
        var namespace = path.dirname(filenamechildpath);
        namespace = namespace.replace(pathSepRegEx, '.');
        namespace = namespace.replace(/\s+/g, "_");
        namespace = namespace.replace(/-/g, "_");

        return namespace;
    }
}