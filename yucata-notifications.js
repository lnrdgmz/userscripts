// ==UserScript==
// @name     Yucata.de Notifications
// @version  1
// @grant    GM.notification
// @include  https://www.yucata.de/*/Game/*
// ==/UserScript==

const validNotificationPrefixes = [
	"You are on turn",
  "It's your turn"
]

function isNotification (msg) {
	return validNotificationPrefixes
    .some(prefix => msg.startsWith(prefix))
}

const alert = unsafeWindow.alert.bind(unsafeWindow)
const confirm = unsafeWindow.alert.bind(unsafeWindow)

function addNotificationToPrompt (func) {
	return function (...args) {
  	GM.notification(args[0], 'Yucata')
    func(...args)
  }
}

unsafeWindow.alert = exportFunction(
	addNotificationToPrompt(alert),
  unsafeWindow
)

unsafeWindow.confirm = exportFunction(
	addNotificationToPrompt(confirm),
  unsafeWindow
)

function onRemove(element, func) {
  function callback(mutationList, observer) {
    mutationList.forEach(mutation => {
      switch (mutation.type) {
        case 'childList':
          mutation.removedNodes.forEach(node => {
            if (node === element) {
              func()
              observer.disconnect()
            }
          })
      }
    })
  }

  const mObserver = new MutationObserver(callback)

  mObserver.observe(element.parentNode, {childList: true})
}


function checkForPrompt() {
	const popup = document.querySelector('.ui-popup-active')
  if (!popup) return

  clearInterval(interval)

  const msg = popup.textContent

  if (!isNotification(msg)) {
    return
  }

  GM.notification(msg, 'Yucata')
  onRemove(popup,() => {
  	interval = setInterval(checkForPrompt, 500)
  })
}

let interval = setInterval(checkForPrompt, 500)
