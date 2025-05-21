// @Inject(method = "anonymous", at = @At("TAIL"), ordinal=0)
function onRun(a, b, c) {
    console.log("HYDRA_1");
}

// @Inject(method = "anonymous", at = @At("HEAD"), ordinal=500)
function onRun2() {
    console.log("HYDRA_2");
}

// @ModifyReturnValue(method = "anonymous", at = @At(method="mthd", ordinal=0), ordinal=2)
function onRun3() {
    console.log("HYDRA_2");
}