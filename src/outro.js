// try creating a node module
// on fail, create a global object

try {
	module.exports = Motive;
}
catch (err) {
	window.Motive = Motive;
}

})();