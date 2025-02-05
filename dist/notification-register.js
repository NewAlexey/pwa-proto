(async () => {
    const publicVapidKey = "BGNotAAxKxGS33hFvdBXLveK20Gb7K9piatPIQaajucJHLYmtZcGeh7LIKtm0wVeleenEpMrBR57yhRYvKQ7j0Q";
    
    if (!("Notification" in window)) {
        alert("This browser does not support web push notification. This Demo has failed for you.  :'-( ");
        document.getElementById("welcomemsg").innerHTML = "This browser does not support desktop notification. This Demo has failed :( ";
    } else {
        Notification.requestPermission(function (status) {
            console.log('Notification Permissiong status:', status);
        });

        if (Notification.permission === 'denied') {
            document.getElementById("welcomemsg").innerHTML = "You've denied notification on a notifcation DEMO! I'm sad!";
        } else {
            
            // We are a go. Everything is ready.
            // We've asked for notificaiton permissiongs. And we've been given it.
            // Time to register our service worker to listen for notifications and pop them up when we receive them from the server.
            
            // Register the serviceWorker script at /sw.js from our server if supported
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
            } // end of  - if ('serviceWorker' in navigator) {
        } // end of if (Notification.permission === 'denied' )
    } // end of - if (!("Notification" in window))
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


