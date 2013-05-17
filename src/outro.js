// if in nodejs, create a module
// otherwise, assume we are in a browser

if (module.exports) {
    module.exports = Motive;
} else {
    window.Motive = Motive;
}

})();