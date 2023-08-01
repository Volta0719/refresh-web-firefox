// importScripts("../utils/tools.js")
console.log('browser bg', browser)
const getTaskList = () => {
    return new Promise((resolve, reject) => {
        browser.storage.local.get('vlotaTaskList', (result) => {
            resolve(result?.vlotaTaskList || [])
        })
    })
}
// browser.power.requestKeepAwake('system');
browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request?.from === 'content') {
        //保留  然后通过存到session
        const { tab } = sender;
        const taskInfoList = await getTaskList();
        if (taskInfoList.hasOwnProperty(tab.id)) {
            if (request?.type === 'update') {
                taskInfoList[tab.id].nexttime = request?.nextTime;
                taskInfoList[tab.id].count = (+taskInfoList[tab.id].count) + 1;
            } else if (request?.type === 'stop') {
                if (taskInfoList[tab.id].refreshType === 'alarms') {
                    await browser.alarms.clear(`${tab.id}`);
                }
                delete taskInfoList[tab.id]
            }
            await browser.storage.local.set({ vlotaTaskList: { ...taskInfoList } })
            sendResponse({
                from: 'bg',
                message: 'ok'
            })
        } else {
            sendResponse({
                from: 'bg',
                message: `[${request?.type}]TaskList Has Not Own Property ${tab.id}`
            })
        }
    }
}
);

browser.alarms.onAlarm.addListener((alarm) => {
    browser.tabs.reload(+alarm.name, { bypassCache: false })
})

browser.tabs.onRemoved.addListener(async (tabId, windowData) => {
    if (!windowData.isWindowClosing) {
        //windowData:{isWindowClosing:false,windowId:11222}
        const taskInfoList = await getTaskList()
        if (taskInfoList.hasOwnProperty(tabId)) {
            if (taskInfoList[tabId].refreshType === 'alarms') {
                await browser.alarms.clear(`${tabId}`);
            }
            delete taskInfoList[tabId]
            await browser.storage.local.set({ vlotaTaskList: { ...taskInfoList } })
        }
    }
})
browser.windows.onRemoved.addListener(async (winid) => {
    const taskInfoList = await getTaskList()
    const tabsIdList = Object.keys(taskInfoList);
    tabsIdList.forEach(async (id) => {
        if (taskInfoList[id].winId == winid) {
            if (taskInfoList[id].refreshType === 'alarms') {
                await browser.alarms.clear(`${id}`);
            }
            delete taskInfoList[id]
        }
    })
    await browser.storage.local.set({ vlotaTaskList: { ...taskInfoList } })
})