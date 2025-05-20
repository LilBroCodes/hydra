function unrelatedFunction() {
    console.log("This is not an inject function.");
}

// @Inject(method = "onInit", at = "HEAD", ordinal = 0)
function initHook() {
    console.log("Injected at onInit HEAD with ordinal 0");
}

// @Inject(method="onRender", at="TAIL")
const renderHook = () => {
    console.log("Injected at onRender TAIL with no ordinal");
}
const x = 42;

// @Inject(method="onClick", at="HEAD", ordinal=2)
function clickHook() {
    const now = Date.now();
    console.log("Click hook executed at", now);
}

// @Inject(method = "run(args)", at="HEAD")
function runHook(args) {

}
