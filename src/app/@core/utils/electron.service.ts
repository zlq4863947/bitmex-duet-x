import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@angular/core';
import { ipcRenderer, remote, webFrame } from 'electron';

import { isElectron } from '../functions';

@Injectable()
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;

  constructor() {
    // Conditional imports
    if (isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');
    }
  }
}
