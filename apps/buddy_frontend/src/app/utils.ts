import { UniqueItem } from "./models";


// used as trackBy function in HTML template to correctly trigger angular templateupdates of ngFor Directives
export function trackById(index, uniqueItem: UniqueItem) {
    return uniqueItem.id || undefined;
}

export function vibrateInfo() {
    vibrate(1);
}

export function vibrateWarning() {
    vibrate(3);
}

function vibrate(amount: number) {
    const vibrationTime = 5;
    const vibrationPattern = new Array(amount).fill(vibrationTime);
    navigator.vibrate(vibrationPattern);
}

const HAS_VISITED_STORAGE_KEY = "buddyHasVisited"
export function hasVisitedBefore() {
    return !!JSON.parse(localStorage.getItem(HAS_VISITED_STORAGE_KEY));
}

export function setHasVisited(state: boolean = true) {
    localStorage.setItem(HAS_VISITED_STORAGE_KEY, state.toString());
}


/**
 * scrolls to bottom of html-element if its children are bigger than their parent
 */
export function scrollToBottomIfChildrenOverflow(parentElement: HTMLElement, startAtTop = true, timeOutMS = 700) {
    // scroll to top without animation to allow showcase through scrollthrough
    if (startAtTop) {
        parentElement.scrollTo({ top: 0 })
    }

    const wrapperHeight = parentElement.clientHeight;

    // iterate through toplevel children, sum their height
    const childrenHeight = Array.from(parentElement.children)
        .map((elem: HTMLElement) => elem.clientHeight)
        .reduce((total, num) => (total + num));

    if (wrapperHeight < childrenHeight) {
        setTimeout(() => {
            parentElement.scrollTo({
                top: childrenHeight,
                left: 0,
                behavior: 'smooth'
            })
        }, timeOutMS)
    }
}