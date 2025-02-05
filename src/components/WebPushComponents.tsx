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

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (!registration) {
                    alert("No registration found!");

                    return;
                }

                alert(JSON.stringify(registration));
                registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: publicVapidKey
                }).then((subscription) => {
                    PostSubscriptionDetails(subscription);
                })
            })
        } catch (err) {
            alert(err);
            console.error(err);
        }
    }
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
