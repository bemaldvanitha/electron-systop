const osu = require('node-os-utils');
const path = require('path');
const notifier = require('node-notifier');

const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;
const  {ipcRenderer} = require('electron');

let cpuOverload =5;
let alertFrequency=1;

// get settings
/*ipcRenderer.on('settings:get',(e,settings) => {
    cpuOverload = +settings.cpuOverload;
    alertFrequency = +settings.alertFrequency;
});*/

// set timing notification
setInterval(() => {
    cpu.usage().then(info => {
        if(info> cpuOverload){
            notifier.notify({
                title: 'Cpu overloaded',
                message: `cpu overloaded ${cpuOverload}`,
                icon: path.join(__dirname,'img','icon.png')
            });
        }
    })
},alertFrequency*1000*60);

// Run every 3 second
setInterval(() => {
    // cpu usage
    cpu.usage().then(info => {
        document.getElementById('cpu-usage').innerText = info + '%';

        document.getElementById('cpu-progress').style.width = info+'%';

        // make progress red overload
        if(info>cpuOverload){
            document.getElementById('cpu-progress').style.background = 'red';
        }else{
            document.getElementById('cpu-progress').style.background = '#30c88b';
        }
    });

    cpu.free().then(info => {
        document.getElementById('cpu-free').innerText = info +'%'
    });

    //uptime
    document.getElementById('sys-uptime').innerText = uptime(os.uptime());
},3000);

// set model
document.getElementById('cpu-model').innerText = cpu.model();

// computer name
document.getElementById('comp-name').innerText = os.hostname();

// computer os
document.getElementById('os').innerText =  os.type() + " "+ os.arch();

// total memory
mem.info().then(info => {
    document.getElementById('mem-total').innerText = info.totalMemMb+" Gb";
});

// show days,hours,min,seconds
const uptime = (timeInSec) => {
    timeInSec = +timeInSec;
    const d = Math.floor(timeInSec/(3600*24));
    const h = Math.floor((timeInSec % (3600*24))/3600);
    const m = Math.floor((timeInSec % 3600)/60);
    const s = Math.floor(timeInSec%60);
    return d +" days "+h+" hours "+m+" minutes "+s+" seconds ";
};

// send notification
/*function notifyUser(options) {
    new Notification(options.title,options);
}*/

// check how much time