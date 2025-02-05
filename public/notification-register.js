(async () => {
    const publicVapidKey = "BGNotAAxKxGS33hFvdBXLveK20Gb7K9piatPIQaajucJHLYmtZcGeh7LIKtm0wVeleenEpMrBR57yhRYvKQ7j0Q";
    if ('serviceWorker' in navigator) { // yes this browser has a serviceWorker functionality.
        // // First. Let's de-register any web workers we have for this domain just in case damian was testing things.
        // // 1) Get all registered ServiceWorkers
        // navigator.serviceWorker.getRegistrations().then((registrations) => {
        //     // loop through them and un-register from them.
        //     for (let registration of registrations) {
        //         registration.unregister()
        //     }
        // }).catch(function (err) {
        //     console.log('Service Worker Unregistration failed: ', err);
        // });
        
        
        try {
            const register = await navigator.serviceWorker.register('./sw.js', { scope: '/' });
            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicVapidKey
            });
            PostSubscriptionDetails(subscription);
        } catch (err) {
            console.error(err);
        }
    }
})();

function PostSubscriptionDetails(Subscription) {
    // let's parse the details of the subscription we got back from the creator of this browser
    let sub = JSON.parse(JSON.stringify(Subscription));
    let token = sub.keys.p256dh;
    let  auth = sub.keys.auth;
    let payload = {endpoint:sub.endpoint,token:token,auth:auth};
    // we could also send to the server in the payload other things like the user's id. or something special for it to use later. We don't in this example.
    
    // Let's send this to the backend that will have everything it needs when it needs to notify us.
    fetch('/newbrowser', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(payload)
    })
    .then(res=> res.json())
    .then(function(data) {
        console.log("AAAAA data!!!", data);
        // Todo. Save anything you needed when you "regsitered" with the server and told him how to notify you.
    });
}


