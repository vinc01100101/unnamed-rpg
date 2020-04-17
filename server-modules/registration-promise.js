//we use one array of [data.ref] on the same collection
//to make use of version control system to prevent duplicate [data.value]

module.exports = function registrationPromise(data) {
	return new Promise((resolved, reject) => {
		data.Model.findOne({ set: data.ref }, (err, doc) => {
			if (err) {
				return reject({
					type: "error",
					message: "DOC level: error finding data: " + err,
				});
			} else if (!doc) {
				return reject({
					type: "error",
					message: "DOC level: set: username ref. not yet created",
				});
			} else {
				for (const prop of doc[data.ref]) {
					if (prop == data.value) {
						return reject({
							type: "error",
							message: `Name "${data.value}" already exist.`,
						});
						break;
					}
				}
				doc[data.ref].unshift(data.value);
				doc.markModified(data.ref);
				doc.save((er, saved) => {
					if (er) {
						//possible Version Control error here
						return reject({
							type: "error",
							message: "DOC level: error saving data: " + er,
						});
					} else if (!saved) {
						return reject({
							type: "error",
							message: "DOC level: no returned saved data",
						});
					} else {
						resolved();
					}
				});
			}
		});
	});
};
