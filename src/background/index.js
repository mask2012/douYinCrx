
// let savedContent=[]

// // 监听来自content-script的消息
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
// 	if(request.order=='setContent'){
//         savedContent=request.content
//         sendResponse(request);
//     }if(request.order=='getContent'){
//         sendResponse(savedContent);
//     }
// });