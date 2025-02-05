export function WebPushComponents() {
    return (
        <div>
            <button onClick={showNotificationHandler}>Notification Ask</button>
            <button onClick={registerAndSubscribe}>Subscribe on push-notification</button>
        </div>
    )
}

const showNotificationHandler = () => {
    alert(`IsNotification??, ${Notification}`)
    Notification.requestPermission().then((status) => {
        alert(`Notification Status~~ ${status}`);
        console.log('Notification Permissiong status:', status);
    })
}
async function registerAndSubscribe() {
    try {
        await navigator.serviceWorker.register('./sw.js');
        //subscribe to notification
        navigator.serviceWorker.ready
        .then((registration: ServiceWorkerRegistration) => {
            return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            });
        })
        .then((subscription: PushSubscription) => {
            console.info("Created subscription Object: ", subscription.toJSON());
            PostSubscriptionDetails(subscription);
        })
        .catch((error) => {
            alert(error);
        });
    } catch (error) {
        alert(error);
    }
}

// const subscribeOnNotification = () => {
//     alert('eheheh!');
//     const publicVapidKey = "BGNotAAxKxGS33hFvdBXLveK20Gb7K9piatPIQaajucJHLYmtZcGeh7LIKtm0wVeleenEpMrBR57yhRYvKQ7j0Q";
//
//     return navigator.serviceWorker
//         .getRegistration()
//         .then((registration) => {
//             alert(`Got registration!, registration - ${JSON.stringify(registration)}`);
//             alert(`Is PushManager~~ ${registration?.pushManager}`)
//             return registration?.pushManager
//             .subscribe({
//                 userVisibleOnly: true,
//                 applicationServerKey: publicVapidKey,
//             })
//             .then((pushSubscription) => {
//                 alert("Got subscription!!");
//                 PostSubscriptionDetails(pushSubscription);
//             })
//             .catch((error) => {
//                 alert(`Error 1, ${error}`);
//                 throw new Error(error);
//             });
//         })
//         .catch((error) => {
//             alert(`Error 2, ${error}`);
//             throw new Error(error);
//         });
// }

function PostSubscriptionDetails(Subscription: PushSubscription) {
    let sub = JSON.parse(JSON.stringify(Subscription));
    let token = sub.keys.p256dh;
    let auth = sub.keys.auth;
    let payload = {endpoint:sub.endpoint,token:token,auth:auth};

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
