/*!
* alphaTab v1.8.4 (, build 34)
*
* Copyright © 2026, Daniel Kuschny and Contributors, All rights reserved.
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*
* Integrated Libraries:
*
* Library: TinySoundFont
* License: MIT
* Copyright: Copyright (C) 2017, 2018 Bernhard Schelling
* URL: https://github.com/schellingb/TinySoundFont
* Purpose: SoundFont loading and Audio Synthesis
*
* Library: SFZero
* License: MIT
* Copyright: Copyright (C) 2012 Steve Folta ()
* URL: https://github.com/stevefolta/SFZero
* Purpose: TinySoundFont is based on SFZEro
*
* Library: Haxe Standard Library
* License: MIT
* Copyright: Copyright (C)2005-2025 Haxe Foundation
* URL: https://github.com/HaxeFoundation/haxe/tree/development/std
* Purpose: XML Parser & Zip Inflate Algorithm
*
* Library: SharpZipLib
* License: MIT
* Copyright: Copyright © 2000-2018 SharpZipLib Contributors
* URL: https://github.com/icsharpcode/SharpZipLib
* Purpose: Zip Deflate Algorithm for writing compressed Zips
*
* Library: NVorbis
* License: MIT
* Copyright: Copyright (c) 2020 Andrew Ward
* URL: https://github.com/NVorbis/NVorbis
* Purpose: Vorbis Stream Decoding
*
* Library: libvorbis
* License: BSD-3-Clause
* Copyright: Copyright (c) 2002-2020 Xiph.org Foundation
* URL: https://github.com/xiph/vorbis
* Purpose: NVorbis adopted some code from libvorbis.
*
* @preserve
* @license
*/
import*as r from"./alphaTab.core.mjs";export*from"./alphaTab.core.mjs";r.Environment.isRunningInWorker?r.Environment.initializeWorker():r.Environment.isRunningInAudioWorklet?r.Environment.initializeAudioWorklet():r.Environment.initializeMain(e=>{if(r.Environment.webPlatform===r.WebPlatform.NodeJs)throw new r.AlphaTabError(r.AlphaTabErrorType.General,"Workers not yet supported in Node.js");if(r.Environment.webPlatform===r.WebPlatform.BrowserModule||r.Environment.isWebPackBundled||r.Environment.isViteBundled){r.Logger.debug("AlphaTab","Creating webworker");try{return new r.Environment.alphaTabWorker(new r.Environment.alphaTabUrl("./alphaTab.worker.mjs",import.meta.url),{type:"module"})}catch(e){r.Logger.debug("AlphaTab","ESM webworker construction with direct URL failed",e)}let t="";try{t=new r.Environment.alphaTabUrl("./alphaTab.worker.mjs",import.meta.url);const e=`import ${JSON.stringify(t)}`,o=new Blob([e],{type:"application/javascript"});return new Worker(URL.createObjectURL(o),{type:"module"})}catch(e){r.Logger.debug("AlphaTab","ESM webworker construction with blob import failed",t,e)}try{if(!e.core.scriptFile)throw new Error("Could not detect alphaTab script file");t=e.core.scriptFile;const r=`import ${JSON.stringify(e.core.scriptFile)}`,o=new Blob([r],{type:"application/javascript"});return new Worker(URL.createObjectURL(o),{type:"module"})}catch(t){r.Logger.debug("AlphaTab","ESM webworker construction with blob import failed",e.core.scriptFile,t)}}if(!e.core.scriptFile)throw new r.AlphaTabError(r.AlphaTabErrorType.General,"Could not detect alphaTab script file, cannot initialize renderer");try{r.Logger.debug("AlphaTab","Creating Blob worker");const t=`importScripts('${e.core.scriptFile}')`,o=new Blob([t],{type:"application/javascript"});return new Worker(URL.createObjectURL(o))}catch{return r.Logger.warning("Rendering","Could not create inline worker, fallback to normal worker"),new Worker(e.core.scriptFile)}},(e,t)=>{if(r.Environment.webPlatform===r.WebPlatform.NodeJs)throw new r.AlphaTabError(r.AlphaTabErrorType.General,"Audio Worklets not yet supported in Node.js");if(r.Environment.webPlatform===r.WebPlatform.BrowserModule||r.Environment.isWebPackBundled||r.Environment.isViteBundled){r.Logger.debug("AlphaTab","Creating Module worklet");const{audioWorklet:t}=e;return t.addModule(new r.Environment.alphaTabUrl("./alphaTab.worklet.mjs",import.meta.url))}return r.Logger.debug("AlphaTab","Creating Script worklet"),e.audioWorklet.addModule(t.core.scriptFile)});