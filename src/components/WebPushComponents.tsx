export function WebPushComponents() {
    return (
        <div>
            <button onClick={subscribeOnNotification}>Subscribe on push-notification</button>
        </div>
    )
}

const subscribeOnNotification = () => {
    alert('eheheh!');
    const publicVapidKey = "BGNotAAxKxGS33hFvdBXLveK20Gb7K9piatPIQaajucJHLYmtZcGeh7LIKtm0wVeleenEpMrBR57yhRYvKQ7j0Q";

    return navigator.serviceWorker
        .getRegistration()
        .then((registration) => {
            alert("Got registration!");
            alert(`Is PushManager~~ ${registration?.pushManager}`)
            return registration?.pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicVapidKey,
            })
            .then((pushSubscription) => {
                alert("Got subscription!!");
                PostSubscriptionDetails(pushSubscription);
            })
            .catch((error) => {
                alert(`Error 1, ${error}`);
                throw new Error(error);
            });
        })
        .catch((error) => {
            alert(`Error 2, ${error}`);
            throw new Error(error);
        });
}

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
