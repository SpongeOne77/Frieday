"use strict";const{app:e,BrowserWindow:i}=require("electron"),{join:s}=require("path");require("node:path");process.env.ELECTRON_DISABLE_SECURITY_WARNINGS="true";const o=()=>{const n=new i({width:800,height:600,webPreferences:{webSecurity:!1},icon:"./public/anbong_logo.ico"});process.env.VITE_DEV_SERVER_URL?(n.loadURL(process.env.VITE_DEV_SERVER_URL),n.webContents.openDevTools()):n.loadFile(s(__dirname,"../dist/index.html"))};e.whenReady().then(()=>{o(),e.on("activate",()=>{i.getAllWindows().length===0&&o()})});e.on("window-all-closed",()=>{process.platform!=="darwin"&&e.quit()});
