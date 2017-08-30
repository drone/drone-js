export default class DroneClient {
	constructor(server, token, csrf) {
		this.server = server || "";
		this.token = token;
		this.csrf = csrf;
	}

	static fromEnviron() {
		return new DroneClient(
			process && process.env && process.env.DRONE_SERVER,
			process && process.env && process.env.DRONE_TOKEN,
			process && process.env && process.env.DRONE_CSRF,
		);
	}

	static fromWindow() {
		return new DroneClient(
			window && window.DRONE_SERVER,
			window && window.DRONE_TOKEN,
			window && window.DRONE_CSRF,
		);
	}

	/**
	 * Returns the user repository list.
	 */
	getRepoList(opts) {
		var query = this._query(opts);
		var endpoint = ["/api/user/repos", query].join("");
		return this._get(endpoint);
	}

	/**
	 * Returns the repository by owner and name.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 */
	getRepo(owner, repo) {
		var endpoint = ["/api/repos", owner, repo].join("/");
		return this._get(endpoint);
	}

	/**
	 * Activates the repository by owner and name.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 */
	activateRepo(owner, repo) {
		var endpoint = ["/api/repos", owner, repo].join("/");
		return this._post(endpoint);
	}

	/**
	 * Updates the repository.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {Object} repository data.
	 */
	updateRepo(owner, repo, data) {
		var endpoint = ["/api/repos", owner, repo].join("/");
		return this._patch(endpoint, data);
	}

	/**
	 * Deletes the repository by owner and name.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 */
	deleteRepo(owner, repo) {
		var endpoint = ["/api/repos", owner, repo].join("/");
		return this._delete(endpoint);
	}

	/**
	 * Returns the build list for the given repository.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {Object} request options.
	 */
	getBuildList(owner, repo, opts) {
		var endpoint = ["/api/repos", owner, repo, "builds"].join("/");
		return this._get(endpoint);
	}

	/**
	 * Returns the build by number for the given repository.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 */
	getBuild(owner, repo, number) {
		var endpoint = ["/api/repos", owner, repo, "builds", number].join("/");
		return this._get(endpoint);
	}

	/**
	 * returns the build feed for the user account.
	 * @param {Object} request options.
	 */
	getBuildFeed(opts) {
		var query = this._query(opts);
		var endpoint = ["/api/user/feed", query].join("");
		return this._get(endpoint);
	}

	/**
	 * Cancels the build by number for the given repository.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 * @param {number} process number.
	 */
	cancelBuild(owner, repo, number, ppid) {
		var endpoint = ["/api/repos", owner, repo, "builds", number, ppid].join(
			"/",
		);
		return this._delete(endpoint);
	}

	/**
	 * Approves the build.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 */
	approveBuild(owner, repo, number) {
		var endpoint = [
			"/api/repos",
			owner,
			repo,
			"builds",
			number,
			"approve",
		].join("/");
		return this._post(endpoint);
	}

	/**
	 * Approves the build.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 */
	declineBuild(owner, repo, number) {
		var endpoint = [
			"/api/repos",
			owner,
			repo,
			"builds",
			number,
			"decline",
		].join("/");
		return this._post(endpoint);
	}

	/**
	 * Restarts the build by number for the given repository.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 * @param {Object} request options
	 */
	restartBuild(owner, repo, number, opts) {
		var query = this._query(opts);
		var endpoint = ["/api/repos", owner, repo, "builds", number].join("/");
		endpoint = [endpoint, query].join("");
		return this._post(endpoint);
	}

	/**
	 * Returns the build by number for the given repository.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 * @param {number} proc number.
	 */
	getLogs(owner, repo, build, proc) {
		var endpoint = ["/api/repos", owner, repo, "logs", build, proc].join("/");
		return this._get(endpoint);
	}

	/**
	 * Returns the build artifact.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 * @param {number} process number.
	 * @param {String} file name.
	 */
	getArtifact(owner, repo, number, proc, file) {
		var endpoint =
			["/api/repos", owner, repo, "files", number, proc, file].join("/") +
			"?raw=true";
		return this._get(endpoint);
	}

	/**
	 * Returns the build artifact.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} build number.
	 */
	getArtifactList(owner, repo, number) {
		var endpoint = ["/api/repos", owner, repo, "files", number].join("/");
		return this._get(endpoint);
	}

	/**
	 * Returns the repository secret list.
	 */
	getSecretList(owner, repo) {
		var endpoint = ["/api/repos", owner, repo, "secrets"].join("/");
		return this._get(endpoint);
	}

	/**
	 * Create the named registry.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {Object} secret details.
	 */
	createSecret(owner, repo, secret) {
		var endpoint = ["/api/repos", owner, repo, "secrets"].join("/");
		return this._post(endpoint, secret);
	}

	/**
	 * Deletes the named repository secret.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {string} secret name.
	 */
	deleteSecret(owner, repo, secret) {
		var endpoint = ["/api/repos", owner, repo, "secrets", secret].join("/");
		return this._delete(endpoint);
	}

	/**
	 * Returns the repository registry list.
	 */
	getRegistryList(owner, repo) {
		var endpoint = ["/api/repos", owner, repo, "registry"].join("/");
		return this._get(endpoint);
	}

	/**
	 * Create the named registry.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} registry details.
	 */
	createRegistry(owner, repo, registry) {
		var endpoint = ["/api/repos", owner, repo, "registry"].join("/");
		return this._post(endpoint, registry);
	}

	/**
	 * Deletes the named registry.
	 * @param {string} repository owner.
	 * @param {string} repository name.
	 * @param {number} registry address.
	 */
	deleteRegistry(owner, repo, address) {
		var endpoint = ["/api/repos", owner, repo, "registry", address].join("/");
		return this._delete(endpoint);
	}

	/**
	 * Returns the currently authenticated user.
	 */
	getSelf() {
		return this._get("/api/user");
	}

	/**
	 * Returns the user's personal API token.
	 */
	getToken() {
		return this._post("/api/user/token");
	}

	/*
	 * Subscribes to a server-side event feed and emits
	 * events to the callback receiver.
	 *
	 * @param {Function} callback function
	 * @return {Object} websocket
	 */
	on(receiver) {
		var endpoint = [this.server, "/stream/events"].join("");
		endpoint = this.token ? endpoint + "?access_token=" + this.token : endpoint;

		var events = new EventSource(endpoint);
		events.onmessage = function(event) {
			var data = JSON.parse(event.data);
			receiver(data);
		};
		return events;
	}

	/*
	 * Subscribes to an server-side event feed and emits
	 * events to the callback receiver.
	 *
	 * @param {Function} callback function
	 * @return {Object} websocket
	 */
	stream(owner, repo, build, proc, receiver) {
		var endpoint = [this.server, "stream/logs", owner, repo, build, proc].join(
			"/",
		);
		endpoint = this.token ? endpoint + "?access_token=" + this.token : endpoint;

		var events = new EventSource(endpoint);
		events.onerror = function(err) {
			if (err.data === "eof") {
				events.close();
			}
		};
		events.onmessage = function(event) {
			var data = JSON.parse(event.data);
			receiver(data);
		};
		return events;
	}

	/**
	 * Returns a Promise for an XHR GET request.
	 * @private
	 * @param {string} request path.
	*/
	_get(path) {
		return this._request("GET", path, null);
	}

	/**
	 * Returns a Promise for an XHR POST request.
	 * @private
	 * @param {string} request path.
	 * @param {Object} request data.
	*/
	_post(path, data) {
		return this._request("POST", path, data);
	}

	/**
	 * Returns a Promise for an XHR PUT request.
	 * @private
	 * @param {string} request path.
	 * @param {Object} request data.
	*/
	_put(path, data) {
		return this._request("PUT", path, data);
	}

	/**
	 * Returns a Promise for an XHR PATCH request.
	 * @private
	 * @param {string} request path.
	 * @param {Object} request data.
	*/
	_patch(path, data) {
		return this._request("PATCH", path, data);
	}

	/**
	 * Returns a Promise for an XHR DELETE request.
	 * @private
	 * @param {string} request path.
	 */
	_delete(path) {
		return this._request("DELETE", path, null);
	}

	/**
	 * Returns a query string from the given parameters.
	 * @param {Object} query parameters in key value object.
	 * @return {string} query string.
	 */
	_query(opts) {
		if (!opts) return;
		var query = [];
		for (var key in opts) {
			var value = opts[key];
			query.push(
				[encodeURIComponent(key), encodeURIComponent(value)].join("="),
			);
		}
		return query.length === 0 ? "" : "?" + query.join("&");
	}

	/**
	 * Returns true if the XHR response is a JSON document.
	 * @private
	 * @param {Object} XHR response.
	 */
	_isJSON(xhr) {
		return (
			xhr.getResponseHeader("Content-Type").indexOf("json") !== -1 ||
			xhr.response.startsWith("{") || // HACK remove
			xhr.response.startsWith("[")
		); // HACK remove
	}

	/**
	 * Returns a Promise for an XHR request.
	 * @private
	 * @param {string} request method.
	 * @param {string} request path.
	 * @param {Object} request data.
	 */
	_request(method, path, data) {
		var endpoint = [this.server, path].join("");
		var xhr = new XMLHttpRequest();
		xhr.open(method, endpoint, true);
		if (this.token) {
			xhr.setRequestHeader("Authorization", "Bearer " + this.token);
		}
		if (method !== "GET" && this.csrf) {
			xhr.setRequestHeader("X-CSRF-TOKEN", this.csrf);
		}
		return new Promise(
			function(resolve, reject) {
				xhr.onload = function() {
					if (xhr.readyState === 4) {
						if (xhr.status >= 300) {
							const error = {
								status: xhr.status,
								message: xhr.response,
							};
							if (this.onerror) {
								this.onerror(error);
							}
							reject(error);
						} else if (this._isJSON(xhr)) {
							resolve(JSON.parse(xhr.response));
						} else {
							resolve(xhr.response);
						}
					}
				}.bind(this);
				xhr.onerror = function(e) {
					reject(e);
				};
				if (data) {
					xhr.setRequestHeader("Content-Type", "application/json");
					xhr.send(JSON.stringify(data));
				} else {
					xhr.send();
				}
			}.bind(this),
		);
	}
}
